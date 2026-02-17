import type { SearchProvider, SearchResult, WebsearchConfig } from "../types.js";

const SERPAPI_URL = "https://serpapi.com/search.json";

type SerpApiOrganicResult = {
  title?: string;
  link?: string;
  snippet?: string;
};

type SerpApiResponse = {
  organic_results?: SerpApiOrganicResult[];
  error?: string;
};

/**
 * Create a SerpAPI-backed search provider (requires API key).
 */
export function createSerpApiProvider(config: WebsearchConfig): SearchProvider {
  return {
    name: "serpapi",

    async search(query: string, maxResults: number): Promise<SearchResult[]> {
      if (!config.serpApiKey) {
        throw new Error(
          "SerpAPI key is not configured. Set the SERPAPI_KEY environment variable.",
        );
      }

      const params = new URLSearchParams({
        q: query,
        api_key: config.serpApiKey,
        engine: "google",
        num: String(maxResults),
      });

      const url = `${SERPAPI_URL}?${params.toString()}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

      try {
        console.log(`[websearch] SerpAPI search: "${query}"`);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "User-Agent": config.userAgent,
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`SerpAPI returned HTTP ${response.status}`);
        }

        const data = (await response.json()) as SerpApiResponse;

        if (data.error) {
          throw new Error(`SerpAPI error: ${data.error}`);
        }

        const organic = data.organic_results ?? [];
        const results: SearchResult[] = [];

        const count = Math.min(organic.length, maxResults);
        for (let i = 0; i < count; i++) {
          const item = organic[i];
          if (item.link && item.title) {
            results.push({
              title: item.title,
              url: item.link,
              snippet: item.snippet ?? "",
            });
          }
        }

        console.log(`[websearch] SerpAPI returned ${results.length} results`);
        return results;
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          throw new Error(`SerpAPI search timed out after ${config.timeoutMs}ms`);
        }
        throw err;
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}
