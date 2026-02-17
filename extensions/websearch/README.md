# @openclaw/websearch

Web search extension for OpenClaw. Searches the web, fetches pages, and extracts text content for LLM analysis.

## Providers

| Provider | API Key Required | Default |
|---|---|---|
| DuckDuckGo | No | Yes |
| SerpAPI (Google) | Yes | No |

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `WEBSEARCH_PROVIDER` | `duckduckgo` | Search provider (`duckduckgo` or `serpapi`) |
| `SERPAPI_KEY` | — | SerpAPI key (required when provider is `serpapi`) |
| `WEBSEARCH_TIMEOUT_MS` | `10000` | HTTP timeout per request in milliseconds |
| `WEBSEARCH_MAX_RESULTS` | `10` | Maximum search results to return |
| `WEBSEARCH_USER_AGENT` | (built-in) | Custom User-Agent header |

## Usage

The extension registers a `websearch` tool that accepts:

- **query** (string, required) — Search query.
- **maxResults** (number, optional, default 5) — How many results to return.
- **fetchPages** (boolean, optional, default true) — Whether to fetch and extract page text.

Results are returned as a JSON array with `title`, `url`, `snippet`, and optionally `content` (extracted page text) or `error` (if page fetch failed).

### Domain diversity

To keep results varied, no more than 2 results from the same domain are included.

### Retry & timeout

Page fetches use exponential backoff (300 ms base, max 2 retries) and respect the configured timeout.
