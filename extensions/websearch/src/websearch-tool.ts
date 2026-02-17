import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi } from "../../../src/plugins/types.js";
import { extractText } from "./extract/html-to-text.js";
import { createDuckDuckGoProvider } from "./providers/duckduckgo.js";
import { createSerpApiProvider } from "./providers/serpapi.js";
import type { SearchProvider, SearchResult, WebsearchConfig } from "./types.js";

const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (compatible; OpenClaw-Websearch/1.0; +https://github.com/nicepkg/openclaw)";

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_RESULTS = 10;
const MAX_PER_DOMAIN = 2;
const RETRY_BASE_MS = 300;
const MAX_RETRIES = 2;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

/**
 * Fetch a URL with exponential-backoff retry.
 */
async function fetchWithRetry(
  url: string,
  timeoutMs: number,
  userAgent: string,
): Promise<string> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const delay = RETRY_BASE_MS * Math.pow(2, attempt - 1);
      await sleep(delay);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": userAgent,
          Accept: "text/html,application/xhtml+xml,*/*",
        },
        signal: controller.signal,
        redirect: "follow",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${url}`);
      }

      return await response.text();
    } catch (err) {
      lastError = err as Error;
      if (lastError.name === "AbortError") {
        lastError = new Error(`Fetch timed out after ${timeoutMs}ms: ${url}`);
      }
      // Continue to next retry
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError ?? new Error(`Failed to fetch ${url}`);
}

// ---------------------------------------------------------------------------
// Config resolution
// ---------------------------------------------------------------------------

function resolveConfig(): WebsearchConfig {
  const providerEnv = (process.env.WEBSEARCH_PROVIDER ?? "duckduckgo").toLowerCase();
  const provider = providerEnv === "serpapi" ? "serpapi" : "duckduckgo";

  const timeoutMs = parseInt(process.env.WEBSEARCH_TIMEOUT_MS ?? "", 10);
  const maxResults = parseInt(process.env.WEBSEARCH_MAX_RESULTS ?? "", 10);

  return {
    provider: provider as WebsearchConfig["provider"],
    serpApiKey: process.env.SERPAPI_KEY,
    timeoutMs: isNaN(timeoutMs) || timeoutMs <= 0 ? DEFAULT_TIMEOUT_MS : timeoutMs,
    maxResults: isNaN(maxResults) || maxResults <= 0 ? DEFAULT_MAX_RESULTS : maxResults,
    userAgent: process.env.WEBSEARCH_USER_AGENT ?? DEFAULT_USER_AGENT,
  };
}

function createProvider(config: WebsearchConfig): SearchProvider {
  switch (config.provider) {
    case "serpapi":
      return createSerpApiProvider(config);
    case "duckduckgo":
    default:
      return createDuckDuckGoProvider(config);
  }
}

// ---------------------------------------------------------------------------
// Result type returned to the agent
// ---------------------------------------------------------------------------

type WebsearchResultItem = {
  title: string;
  url: string;
  snippet: string;
  content?: string;
  error?: string;
};

// ---------------------------------------------------------------------------
// Tool factory
// ---------------------------------------------------------------------------

export function createWebsearchTool(api: OpenClawPluginApi) {
  return {
    name: "websearch",
    label: "Web Search",
    description:
      "Search the web, fetch pages, and extract text content. Returns search results with page content for analysis.",
    parameters: Type.Object({
      query: Type.String({ description: "Search query" }),
      maxResults: Type.Optional(
        Type.Number({
          description: "Maximum number of results to return (default 5)",
          default: 5,
        }),
      ),
      fetchPages: Type.Optional(
        Type.Boolean({
          description: "Whether to fetch and extract page content (default true)",
          default: true,
        }),
      ),
    }),

    async execute(_id: string, params: Record<string, unknown>) {
      const query = typeof params.query === "string" ? params.query.trim() : "";
      if (!query) {
        throw new Error("query parameter is required");
      }

      const maxResults =
        typeof params.maxResults === "number" && params.maxResults > 0
          ? Math.min(params.maxResults, 20)
          : 5;
      const fetchPages = params.fetchPages !== false;

      // ── 1. Resolve config & create provider ──
      const config = resolveConfig();
      const provider = createProvider(config);

      console.log(
        `[websearch] Starting search: query="${query}", provider=${provider.name}, maxResults=${maxResults}, fetchPages=${fetchPages}`,
      );

      // ── 2. Run search ──
      let searchResults: SearchResult[];
      try {
        searchResults = await provider.search(query, maxResults);
      } catch (err) {
        console.error(`[websearch] Search failed: ${(err as Error).message}`);
        throw new Error(`Web search failed: ${(err as Error).message}`);
      }

      if (searchResults.length === 0) {
        console.log("[websearch] No search results found");
        return {
          content: [{ type: "text", text: "No search results found." }],
        };
      }

      // ── 3. Enforce domain diversity ──
      const domainCount = new Map<string, number>();
      const diverseResults: SearchResult[] = [];

      for (const result of searchResults) {
        const domain = getDomain(result.url);
        const count = domainCount.get(domain) ?? 0;
        if (count < MAX_PER_DOMAIN) {
          diverseResults.push(result);
          domainCount.set(domain, count + 1);
        }
        if (diverseResults.length >= maxResults) {
          break;
        }
      }

      // ── 4. Optionally fetch page content ──
      const items: WebsearchResultItem[] = [];
      let successCount = 0;
      let failCount = 0;

      for (const result of diverseResults) {
        const item: WebsearchResultItem = {
          title: result.title,
          url: result.url,
          snippet: result.snippet,
        };

        if (fetchPages) {
          try {
            const html = await fetchWithRetry(result.url, config.timeoutMs, config.userAgent);
            item.content = extractText(html);
            successCount++;
          } catch (err) {
            item.error = (err as Error).message;
            failCount++;
            console.error(`[websearch] Failed to fetch ${result.url}: ${item.error}`);
          }
        } else {
          successCount++;
        }

        items.push(item);
      }

      console.log(
        `[websearch] Complete: ${items.length} results, ${successCount} fetched, ${failCount} failed`,
      );

      const text = JSON.stringify(items, null, 2);

      return {
        content: [{ type: "text", text }],
        details: {
          provider: provider.name,
          query,
          totalResults: items.length,
          fetchedPages: successCount,
          failedPages: failCount,
        },
      };
    },
  };
}
