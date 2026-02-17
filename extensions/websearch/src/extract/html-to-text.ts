/**
 * Extract readable text from raw HTML.
 *
 * Strategy:
 * 1. Strip script, style, nav, header, footer, aside blocks (tag + content).
 * 2. Remove all remaining HTML tags.
 * 3. Decode common HTML entities.
 * 4. Collapse whitespace.
 * 5. Truncate to a safe length (~5 000 chars) so downstream LLM context stays manageable.
 */

const MAX_TEXT_LENGTH = 5_000;

/** Tags whose *entire content* should be removed (case-insensitive). */
const STRIP_BLOCKS_RE =
  /<(script|style|nav|header|footer|aside|noscript|svg|iframe)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;

/** Any remaining HTML tag. */
const TAG_RE = /<\/?[a-z][^>]*>/gi;

/** Common HTML entities. */
const ENTITY_MAP: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&#x27;": "'",
  "&#x2F;": "/",
};

const ENTITY_RE = /&(?:#x?[0-9a-f]+|[a-z]+);/gi;

function decodeEntities(text: string): string {
  return text.replace(ENTITY_RE, (match) => {
    const lower = match.toLowerCase();
    if (ENTITY_MAP[lower]) {
      return ENTITY_MAP[lower];
    }
    // Numeric entities
    if (lower.startsWith("&#x")) {
      const code = parseInt(lower.slice(3, -1), 16);
      return isNaN(code) ? match : String.fromCharCode(code);
    }
    if (lower.startsWith("&#")) {
      const code = parseInt(lower.slice(2, -1), 10);
      return isNaN(code) ? match : String.fromCharCode(code);
    }
    return match;
  });
}

/**
 * Convert raw HTML into plain text suitable for LLM consumption.
 */
export function extractText(html: string): string {
  let text = html;

  // 1. Remove block-level noise elements and their content
  text = text.replace(STRIP_BLOCKS_RE, " ");

  // 2. Strip remaining tags
  text = text.replace(TAG_RE, " ");

  // 3. Decode entities
  text = decodeEntities(text);

  // 4. Collapse whitespace: convert runs of whitespace (including newlines) to single space,
  //    then collapse multiple blank-line-like patterns to a single newline.
  text = text
    .replace(/[ \t]+/g, " ")
    .replace(/\n /g, "\n")
    .replace(/ \n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // 5. Truncate
  if (text.length > MAX_TEXT_LENGTH) {
    text = text.slice(0, MAX_TEXT_LENGTH) + "\n...[truncated]";
  }

  return text;
}
