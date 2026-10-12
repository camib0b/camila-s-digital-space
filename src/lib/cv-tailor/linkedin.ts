const LINKEDIN_VIEW_PATTERN = /linkedin\.com\/jobs\/view\/(\d+)/i;

export function linkedInJobIdFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/\/jobs\/view\/(\d+)/);
    return match?.[1] ?? null;
  } catch {
    const loose = url.match(LINKEDIN_VIEW_PATTERN);
    return loose?.[1] ?? null;
  }
}

export function extractPostingTextFromHtml(html: string): string {
  const markupMatch = html.match(
    /<div class="show-more-less-html__markup[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<button[^>]*show-more-less-html__button/,
  );
  const richMatch = html.match(
    /<div class="description__text description__text--rich"[^>]*>([\s\S]*?)<\/div>/,
  );
  const raw = markupMatch?.[1] ?? richMatch?.[1] ?? "";
  if (!raw) {
    return "";
  }
  return htmlToPlainText(raw);
}

function htmlToPlainText(fragment: string): string {
  let text = fragment;
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>/gi, "\n\n");
  text = text.replace(/<\/li>/gi, "\n");
  text = text.replace(/<li[^>]*>/gi, "· ");
  text = text.replace(/<[^>]+>/g, "");
  text = text.replace(/&nbsp;/g, " ");
  text = text.replace(/&amp;/g, "&");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  text = text.replace(/\n{3,}/g, "\n\n");
  return text.trim();
}

export async function fetchLinkedInPostingText(jobUrl: string): Promise<string> {
  const jobId = linkedInJobIdFromUrl(jobUrl);
  if (!jobId) {
    throw new Error("unsupported_url");
  }
  const guestUrl = `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`;
  const response = await fetch(guestUrl, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; CamilaCVTailor/1.0)",
      accept: "text/html,application/xhtml+xml",
    },
  });
  if (!response.ok) {
    throw new Error("fetch_failed");
  }
  const html = await response.text();
  const text = extractPostingTextFromHtml(html);
  if (text.length < 80) {
    throw new Error("extract_failed");
  }
  return text;
}
