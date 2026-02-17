import type { SearchProvider, SearchResult, WebsearchConfig } from "../types.js";

const DDG_HTML_URL = "https://html.duckduckgo.com/html/";

/**
 * Minimal delay between requests to avoid hammering DuckDuckGo.
 */
const POLITE_DELAY_MS = 300;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Parse DuckDuckGo HTML search results.
 *
 * The HTML page contains result blocks with:
 *   <a class="result__a" href="...">Title</a>
 *   <a class="result__snippet">Snippet text</a>
 *
 * We use simple regex extraction rather than a full DOM parser to keep
 * dependencies minimal.
 */
function parseResults(html: string, maxResults: number): SearchResult[] {
  const results: SearchResult[] = [];

  // Each result lives inside a div.result or similar block.
  // We look for result__a anchors followed by result__snippet anchors.
  const linkRe = /<a\s[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  const snippetRe = /<a\s[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/gi;

  const links: Array<{ url: string; title: string }> = [];
  let match: RegExpExecArray | null;

  while ((match = linkRe.exec(html)) !== null) {
    const rawUrl = match[1] ?? "";
    const rawTitle = (match[2] ?? "").replace(/<[^>]*>/g, "").trim();

    // DuckDuckGo wraps URLs in a redirect; extract the actual URL from uddg= param
    let url = rawUrl;
    try {
      const parsed = new URL(rawUrl, "https://duckduckgo.com");
      const uddg = parsed.searchParams.get("uddg");
      if (uddg) {
        url = decodeURIComponent(uddg);
      }
    } catch {
      // use rawUrl as-is
    }

    if (url && rawTitle) {
      links.push({ url, title: rawTitle });
    }
  }

  const snippets: string[] = [];
  while ((match = snippetRe.exec(html)) !== null) {
    const raw = (match[1] ?? "").replace(/<[^>]*>/g, "").trim();
    snippets.push(raw);
  }

  const count = Math.min(links.length, maxResults);
  for (let i = 0; i < count; i++) {
    results.push({
      title: links[i].title,
      url: links[i].url,
      snippet: snippets[i] ?? "",
    });
  }

  return results;
}

/**
 * Create a DuckDuckGo search provider (no API key required).
 */
export function createDuckDuckGoProvider(config: WebsearchConfig): SearchProvider {
  let lastRequestTime = 0;

  return {
    name: "duckduckgo",

    async search(query: string, maxResults: number): Promise<SearchResult[]> {
      // Polite delay
      const elapsed = Date.now() - lastRequestTime;
      if (elapsed < POLITE_DELAY_MS) {
        await sleep(POLITE_DELAY_MS - elapsed);
      }

      const params = new URLSearchParams({ q: query });
      const url = `${DDG_HTML_URL}?${params.toString()}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

      try {
        console.log(`[websearch] DuckDuckGo search: "${query}"`);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "User-Agent": config.userAgent,
            Accept: "text/html",
          },
          signal: controller.signal,
        });

        lastRequestTime = Date.now();

        if (!response.ok) {
          throw new Error(`DuckDuckGo returned HTTP ${response.status}`);
        }

        const html = await response.text();
        const results = parseResults(html, maxResults);

        console.log(`[websearch] DuckDuckGo returned ${results.length} results`);
        return results;
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          throw new Error(`DuckDuckGo search timed out after ${config.timeoutMs}ms`);
        }
        throw err;
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}
