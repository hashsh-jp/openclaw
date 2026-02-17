export type SearchResult = {
  title: string;
  url: string;
  snippet: string;
};

export type SearchProvider = {
  name: string;
  search(query: string, maxResults: number): Promise<SearchResult[]>;
};

export type WebsearchConfig = {
  provider: "duckduckgo" | "serpapi";
  serpApiKey?: string;
  timeoutMs: number;
  maxResults: number;
  userAgent: string;
};

export type PageContent = {
  url: string;
  title: string;
  text: string;
  fetchedAt: string;
  error?: string;
};
