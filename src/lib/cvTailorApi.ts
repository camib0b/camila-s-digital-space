import type { CvChangeLogEntry, CvGenerateResult, CvWarning, PostingAnalysis, RenderedCv } from "@/lib/cv-tailor/types";

export interface CvGenerateResponse extends CvGenerateResult {
  ok: true;
}

export interface CvHistoryItem {
  id: number;
  company: string;
  role_title: string;
  language: string;
  posting_url: string | null;
  created_at: string;
}

async function parseJson<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T;
  return payload;
}

export async function extractPostingFromUrl(url: string): Promise<string> {
  const response = await fetch("/api/cv/extract-url", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url }),
  });
  const payload = await parseJson<{ ok: boolean; text?: string; error?: string }>(response);
  if (!response.ok || !payload.ok || !payload.text) {
    throw new Error(payload.error ?? "extract_failed");
  }
  return payload.text;
}

export async function generateTailoredCvApi(params: {
  text: string;
  postingUrl?: string;
  save?: boolean;
}): Promise<{
  postingAnalysis: PostingAnalysis;
  baseCv: RenderedCv;
  tailoredCv: RenderedCv;
  changeLog: CvChangeLogEntry[];
  warnings: CvWarning[];
  plainText: string;
}> {
  const response = await fetch("/api/cv/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(params),
  });
  const payload = await parseJson<CvGenerateResponse | { ok: false; error: string; details?: string[] }>(
    response,
  );
  if (!response.ok || !payload.ok) {
    const details = "details" in payload && payload.details ? `: ${payload.details.join("; ")}` : "";
    throw new Error(`${"error" in payload ? payload.error : "generate_failed"}${details}`);
  }
  return {
    postingAnalysis: payload.postingAnalysis,
    baseCv: payload.baseCv,
    tailoredCv: payload.tailoredCv,
    changeLog: payload.changeLog,
    warnings: payload.warnings,
    plainText: payload.tailoredCv.plainText,
  };
}

export async function fetchCvHistory(): Promise<CvHistoryItem[]> {
  const response = await fetch("/api/cv/history");
  const payload = await parseJson<{ ok: boolean; items: CvHistoryItem[] }>(response);
  if (!response.ok || !payload.ok) {
    return [];
  }
  return payload.items;
}
