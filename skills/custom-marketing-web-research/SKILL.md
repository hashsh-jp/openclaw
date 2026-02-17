---
name: custom-marketing-web-research
description: "Activate when user asks for market research, competitor analysis, trend reports, or pricing benchmarks. Uses websearch tool to gather data, then synthesizes a structured marketing intelligence report with sources."
metadata:
  {
    "openclaw": { "emoji": "📊" },
  }
---

# Marketing Web Research

This skill turns natural language research requests into structured marketing intelligence reports. Given a topic, it generates multiple search queries, gathers data from the web, evaluates source quality, and synthesizes findings into a consistent JSON format with summaries, comparisons, source citations, follow-up questions, and social media hook ideas.

## When to Activate

Trigger this skill when the user asks for any of the following:

- "◯◯の最新トレンド調べて" (research latest trends on X)
- "競合3社の特徴比較して" (compare features of 3 competitors)
- "◯◯業界の料金相場を調査" (investigate pricing in X industry)
- Market research, competitor analysis, trend reports, pricing benchmarks
- Industry landscape overviews
- Feature comparison across products or services
- Pricing and plan breakdowns

## How It Works

1. **Parse user request** -- Identify the core topic, research purpose (comparison, trends, pricing, etc.), target locale (JP/EN/global), and any named entities (companies, products, industries).
2. **Generate search queries** -- Produce 3-5 queries covering topic variations, synonyms, and both Japanese and English terms. Add time-scoping (e.g., "2025 2026") when freshness matters.
3. **Use `websearch` tool** -- Execute each query via the `websearch` tool. Fetch and read the most promising result pages.
4. **Evaluate sources** -- Score each source on reliability. Prefer primary sources; penalize affiliate-heavy or outdated content. Ensure a minimum of 5 diverse domains.
5. **Extract key information** -- Pull out pricing, features, differentiation points, customer segments, case studies, and hard numbers.
6. **Synthesize into structured output** -- Compile everything into the JSON output format defined below.

## Output Format

Always return this JSON structure:

```json
{
  "summary": "概要（3〜7行）",
  "key_points": [
    "重要ポイント1",
    "重要ポイント2",
    "..."
  ],
  "comparisons": [
    {
      "name": "企業A",
      "notes": ["特徴1", "特徴2"]
    },
    {
      "name": "企業B",
      "notes": ["特徴1", "特徴2"]
    }
  ],
  "sources": [
    {
      "title": "記事名",
      "url": "https://...",
      "published_at": "2026-01-15|null",
      "why_reliable": "一次情報 / 公式サイト / 業界レポート"
    }
  ],
  "next_questions": [
    "深掘りすべき問い1",
    "深掘りすべき問い2",
    "深掘りすべき問い3"
  ],
  "hooks": [
    "X/Threads投稿フック案1",
    "X/Threads投稿フック案2",
    "X/Threads投稿フック案3"
  ]
}
```

### Field Descriptions

| Field | Description |
|---|---|
| `summary` | 3-7 line overview of findings in Japanese |
| `key_points` | Array of the most important takeaways |
| `comparisons` | Array of entities with consistent comparison dimensions |
| `sources` | Array of cited sources with URLs, dates, and reliability notes |
| `next_questions` | 3 follow-up questions for deeper investigation |
| `hooks` | 3 short punchy lines suitable for X/Threads posts |

## Query Generation Strategy

- Generate **3-5 search queries** per request
- Include **Japanese AND English** variations of the topic
- Add competitor names, industry-specific terms, and synonyms
- Time-scope when relevance to recency matters (e.g., append "2025 2026")
- Use different angles: product names, feature keywords, pricing keywords, review keywords

**Example for "Notionの競合比較":**

1. `Notion 競合 比較 2026`
2. `Notion alternatives comparison 2026`
3. `Coda vs Clickup vs Asana features pricing`
4. `プロジェクト管理ツール 比較表 最新`
5. `best project management tools review 2026`

## Source Evaluation Criteria

### Prefer (high reliability)
- Official company websites and product pages
- Press releases and IR documents
- Industry reports (Gartner, Forrester, IDC, MM総研, etc.)
- Academic papers and whitepapers
- Government and public institution data

### Acceptable (moderate reliability)
- Reputable news outlets (TechCrunch, 日経, ITmedia, etc.)
- Established tech blogs and review sites
- Verified user reviews on major platforms

### Penalize (low reliability)
- Affiliate-heavy sites with commercial bias
- Ad-saturated pages with thin content
- Content older than 2 years for fast-moving markets
- Anonymous forums without verifiable claims
- AI-generated aggregation sites with no original reporting

### Diversity Requirement
- **Minimum 5 sources** from **different domains**
- Mix of Japanese and English sources when the topic is relevant to Japan
- At least 1 primary/official source when comparing specific companies

## Instructions for the Agent

1. **Always use the `websearch` tool** for searching. Do not rely on prior knowledge alone for factual claims.
2. **Run multiple searches** with different queries to ensure broad coverage. Do not stop after 1-2 queries.
3. **Always include source URLs** -- NEVER fabricate or guess URLs. Every URL must come from actual search results.
4. **If the websearch tool is unavailable**, clearly state: "Web検索を実行できませんでした。ツールが利用できない状態です。" and provide what analysis you can from existing knowledge with a clear disclaimer.
5. **Include published dates** when visible in the page content or search snippet.
6. **Generate 3 "hooks"** -- short, punchy lines suitable for X (Twitter) or Threads posts based on the most interesting findings.
7. **Generate 3 "next_questions"** -- follow-up questions that would deepen the research if pursued.
8. **When comparing competitors**, use **consistent comparison dimensions** across all entities (e.g., if you list "pricing" for Company A, list "pricing" for Company B too).
9. **Locale awareness** -- if the user writes in Japanese, default to Japanese output. If the topic is Japan-specific, prioritize Japanese sources.
10. **Numbers and data** -- always cite the source for any specific number (revenue, market share, pricing). Do not present estimates as facts.

## Constraints

- **Do not hallucinate URLs or data.** If you cannot find reliable information, say so explicitly rather than inventing it.
- **If insufficient data is found**, state what was found and what gaps remain. Never pad the report with speculation.
- **Respect rate limits** -- do not spam searches. 3-5 well-crafted queries are better than 10 vague ones.
- **Output must be valid JSON** -- ensure proper escaping of quotes and special characters in the JSON output.
- **No personally identifiable information** -- do not include PII found during research unless it is publicly available executive/company information.
- **Freshness matters** -- for trend and pricing research, prioritize sources from the last 12 months.
