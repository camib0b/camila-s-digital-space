import { fetchLinkedInPostingText } from "../src/lib/cv-tailor/linkedin";
import { generateTailoredCv } from "../src/lib/cv-tailor/pipeline";
import { createJevClient } from "../src/lib/cv-tailor/jev";
import { createXaiClient } from "../src/lib/cv-tailor/xai";
import type { CvAuthEnvironment, CvWorkerContext } from "./cv-auth";
import { requireCvOwner } from "./cv-auth";

interface CvHistoryDatabase {
  prepare(query: string): {
    bind(...values: unknown[]): {
      all<T>(): Promise<{ results: T[] }>;
      first<T>(): Promise<T | null>;
      run(): Promise<unknown>;
    };
  };
}

export interface CvHandlerEnvironment extends CvAuthEnvironment {
  XAI_API_KEY?: string;
  JEV_API_KEY?: string;
  CV_HISTORY?: CvHistoryDatabase;
}

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export async function handleCvApi(
  request: Request,
  environment: CvHandlerEnvironment,
  context: CvWorkerContext,
  path: string,
): Promise<Response> {
  const auth = await requireCvOwner(request, environment, context);
  if (auth instanceof Response) {
    return auth;
  }

  if (path === "/api/cv/extract-url" && request.method === "POST") {
    return extractUrl(request);
  }
  if (path === "/api/cv/generate" && request.method === "POST") {
    return generate(request, environment, auth.email);
  }
  if (path === "/api/cv/history" && request.method === "GET") {
    return listHistory(environment);
  }

  return json({ ok: false, error: "not_found" }, 404);
}

async function extractUrl(request: Request): Promise<Response> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_body" }, 400);
  }
  const url = typeof (payload as { url?: unknown }).url === "string" ? (payload as { url: string }).url.trim() : "";
  if (!url) {
    return json({ ok: false, error: "missing_url" }, 400);
  }
  try {
    const text = await fetchLinkedInPostingText(url);
    return json({ ok: true, text, url });
  } catch (error) {
    const code = error instanceof Error ? error.message : "extract_failed";
    return json({ ok: false, error: code }, 422);
  }
}

async function generate(
  request: Request,
  environment: CvHandlerEnvironment,
  ownerEmail: string,
): Promise<Response> {
  if (!environment.XAI_API_KEY || !environment.JEV_API_KEY) {
    return json({ ok: false, error: "missing_api_keys" }, 503);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_body" }, 400);
  }
  const body = payload as { text?: string; postingUrl?: string; save?: boolean };
  let postingText = typeof body.text === "string" ? body.text.trim() : "";
  const postingUrl = typeof body.postingUrl === "string" ? body.postingUrl.trim() : "";

  if (!postingText && postingUrl) {
    try {
      postingText = await fetchLinkedInPostingText(postingUrl);
    } catch {
      return json({ ok: false, error: "extract_failed" }, 422);
    }
  }

  if (postingText.length < 80) {
    return json({ ok: false, error: "posting_too_short" }, 400);
  }

  const result = await generateTailoredCv(
    {
      xai: createXaiClient(environment.XAI_API_KEY),
      jev: createJevClient(environment.JEV_API_KEY),
    },
    postingText,
  );

  if (!result.ok) {
    return json({ ok: false, error: result.error, details: result.details ?? [] }, 422);
  }

  if (body.save && environment.CV_HISTORY) {
    const company = result.postingAnalysis.companyName ?? "Unknown";
    const roleTitle = result.postingAnalysis.roleTitle ?? "Role";
    await environment.CV_HISTORY.prepare(
      "INSERT INTO cv_generations (company, role_title, language, posting_url, cv_json) VALUES (?, ?, ?, ?, ?)",
    )
      .bind(company, roleTitle, result.document.language, postingUrl || null, JSON.stringify(result))
      .run();
  }

  return json({
    ok: true,
    owner: ownerEmail,
    ...result,
  });
}

async function listHistory(environment: CvHandlerEnvironment): Promise<Response> {
  if (!environment.CV_HISTORY) {
    return json({ ok: true, items: [] });
  }
  const rows = await environment.CV_HISTORY.prepare(
    "SELECT id, company, role_title, language, posting_url, created_at FROM cv_generations ORDER BY created_at DESC LIMIT 30",
  ).all<{
    id: number;
    company: string;
    role_title: string;
    language: string;
    posting_url: string | null;
    created_at: string;
  }>();
  return json({ ok: true, items: rows.results ?? [] });
}
