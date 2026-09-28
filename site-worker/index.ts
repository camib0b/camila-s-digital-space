const INTEREST_PATH = "/api/ava-interest";
const FIELD_CHARACTER_LIMIT = 200;
const USER_AGENT_CHARACTER_LIMIT = 300;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface InterestStatement {
  bind(...values: Array<string | null>): {
    first<Row extends Record<string, unknown>>(): Promise<Row | null>;
  };
}

interface InterestDatabase {
  prepare(query: string): InterestStatement;
}

interface AssetsBinding {
  fetch(request: Request): Promise<Response>;
}

interface SiteEnvironment {
  AVA_INTEREST: InterestDatabase;
  ASSETS: AssetsBinding;
}

function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function readTrimmedString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  return value.trim();
}

function isWithinLimit(value: string): boolean {
  return value.length <= FIELD_CHARACTER_LIMIT;
}

export default {
  async fetch(request: Request, environment: SiteEnvironment): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, "") : url.pathname;

    if (path !== INTEREST_PATH || request.method !== "POST") {
      return environment.ASSETS.fetch(request);
    }

    return saveInterestSignup(request, environment);
  },
};

async function saveInterestSignup(request: Request, environment: SiteEnvironment): Promise<Response> {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > 8000) {
    return jsonResponse({ ok: false, error: "invalid_body" }, 400);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: "invalid_body" }, 400);
  }

  if (payload === null || typeof payload !== "object" || Array.isArray(payload)) {
    return jsonResponse({ ok: false, error: "invalid_body" }, 400);
  }

  const body = payload as Record<string, unknown>;
  const honeypot = body.company_website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return jsonResponse({ ok: true }, 200);
  }

  const name = readTrimmedString(body.name);
  const email = readTrimmedString(body.email);
  const organization = body.org === undefined || body.org === null ? "" : readTrimmedString(body.org);
  const language = readTrimmedString(body.lang);

  if (!name || !isWithinLimit(name)) {
    return jsonResponse({ ok: false, error: "invalid_name" }, 400);
  }
  if (!email || !isWithinLimit(email) || !EMAIL_PATTERN.test(email)) {
    return jsonResponse({ ok: false, error: "invalid_email" }, 400);
  }
  if (organization === null || !isWithinLimit(organization)) {
    return jsonResponse({ ok: false, error: "invalid_org" }, 400);
  }

  const storedLanguage = language === "en" || language === "es" ? language : null;
  const userAgentHeader = request.headers.get("user-agent");
  const userAgent = userAgentHeader ? userAgentHeader.slice(0, USER_AGENT_CHARACTER_LIMIT) : null;

  try {
    const row = await environment.AVA_INTEREST.prepare(
      "INSERT INTO signups (name, email, org, lang, user_agent) VALUES (?, ?, ?, ?, ?) RETURNING id",
    )
      .bind(name, email, organization === "" ? null : organization, storedLanguage, userAgent)
      .first<{ id: number }>();

    if (!row || typeof row.id !== "number") {
      return jsonResponse({ ok: false, error: "unavailable" }, 500);
    }

    return jsonResponse({ ok: true, id: row.id }, 200);
  } catch {
    return jsonResponse({ ok: false, error: "unavailable" }, 500);
  }
}
