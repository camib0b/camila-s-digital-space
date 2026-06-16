export function normalizeAiMarkdown(text: string): string {
  let normalized = text.trim();

  normalized = normalized.replace(/\s*\(gpt-4o-mini\)\s*\[OpenAI\]\s*$/i, "");
  normalized = normalized.replace(/\s*\[(Grok|OpenAI)\]\s*$/i, "");
  normalized = normalized.replace(/([^\n])\s+(#{1,6}\s)/g, "$1\n\n$2");
  normalized = normalized.replace(/([.:!?])\s+(-\s)/g, "$1\n\n$2");
  normalized = normalized.replace(/(\*\*)\s+(-\s)/g, "$1\n\n$2");

  return normalized;
}
