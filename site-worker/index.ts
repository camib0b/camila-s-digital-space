import { EmailMessage } from "cloudflare:email";

const INTEREST_PATH = "/api/ava-interest";
const CONCAT_EVENT_PATH = "/api/concat-event";
const XML_EVENT_PATH = "/api/xml-event";
const MAX_XML_EVENT_BYTES = 2048;
const MAX_XML_COUNT = 10_000_000;
const XML_ACTIONS: ReadonlySet<string> = new Set(["parse", "sample", "export"]);
const XML_OUTCOMES: ReadonlySet<string> = new Set(["success", "error"]);
const MAX_CONCAT_EVENT_BYTES = 2048;
const MAX_PART_COUNT = 10_000;
const MAX_BYTE_COUNT = 1024 * 1024 * 1024 * 1024;
const MAX_DURATION_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;
const BROWSER_FAMILIES: ReadonlySet<string> = new Set(["chrome", "edge", "firefox", "safari", "ios", "other"]);
const JOIN_PATHS: ReadonlySet<string> = new Set(["stream", "memory"]);
const JOIN_OUTCOMES: ReadonlySet<string> = new Set(["success", "error", "cancelled"]);
const ERROR_CODE_PATTERN = /^[a-z0-9-]{1,32}$/;
const FIELD_CHARACTER_LIMIT = 200;
const USER_AGENT_CHARACTER_LIMIT = 300;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALERT_FROM = "ava@camilaescudero.cl";

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

interface SignupAlertEmail {
  send(message: EmailMessage): Promise<unknown>;
}

interface AnalyticsEngineDataPoint {
  indexes?: string[];
  blobs?: string[];
  doubles?: number[];
}

interface AnalyticsEngineDataset {
  writeDataPoint(event: AnalyticsEngineDataPoint): void;
}

interface SiteEnvironment {
  AVA_INTEREST: InterestDatabase;
  ASSETS: AssetsBinding;
  AVA_ALERT?: SignupAlertEmail;
  AVA_ALERT_TO?: string;
  CONCAT_EVENTS?: AnalyticsEngineDataset;
  XML_EVENTS?: AnalyticsEngineDataset;
}

interface WorkerContext {
  waitUntil(promise: Promise<unknown>): void;
}

async function wasmAsset(request: Request, environment: SiteEnvironment): Promise<Response> {
  const assetResponse = await environment.ASSETS.fetch(request);
  const contentType = assetResponse.headers.get("content-type") ?? "";
  if (contentType.startsWith("text/html")) {
    return assetResponse;
  }
  const headers = new Headers(assetResponse.headers);
  headers.set("content-type", "application/wasm");
  return new Response(assetResponse.body, {
    status: assetResponse.status,
    statusText: assetResponse.statusText,
    headers,
  });
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

function noContentResponse(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      "cache-control": "no-store",
    },
  });
}

function clampInteger(value: unknown, maximum: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }
  const rounded = Math.round(value);
  if (rounded <= 0) {
    return 0;
  }
  if (rounded > maximum) {
    return maximum;
  }
  return rounded;
}

async function readLimitedText(request: Request, maximumBytes: number): Promise<string | null> {
  const declaredLength = request.headers.get("content-length");
  if (declaredLength !== null) {
    const parsedLength = Number(declaredLength);
    if (!Number.isFinite(parsedLength) || parsedLength < 0 || parsedLength > maximumBytes) {
      return null;
    }
  }
  if (!request.body) {
    return null;
  }
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      if (!value) {
        continue;
      }
      total += value.byteLength;
      if (total > maximumBytes) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } catch {
    return null;
  }
  const combined = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(combined);
}

/**
 * Anonymous join count. Cookies, the user agent, and the client address are
 * not read. blobs: browser, path, outcome, error code. doubles: matched,
 * converted, part count, input bytes, output bytes, duration ms. index: browser.
 */
async function recordConcatEvent(request: Request, environment: SiteEnvironment): Promise<Response> {
  const text = await readLimitedText(request, MAX_CONCAT_EVENT_BYTES);
  if (text === null) {
    return noContentResponse();
  }
  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    return noContentResponse();
  }
  if (payload === null || typeof payload !== "object" || Array.isArray(payload)) {
    return noContentResponse();
  }
  const body = payload as Record<string, unknown>;
  const path = body.path;
  const outcome = body.outcome;
  if (typeof path !== "string" || !JOIN_PATHS.has(path)) {
    return noContentResponse();
  }
  if (typeof outcome !== "string" || !JOIN_OUTCOMES.has(outcome)) {
    return noContentResponse();
  }
  const browser =
    typeof body.browser === "string" && BROWSER_FAMILIES.has(body.browser) ? body.browser : "other";
  let errorCode = "";
  if (outcome === "error") {
    errorCode =
      typeof body.errorCode === "string" && ERROR_CODE_PATTERN.test(body.errorCode) ? body.errorCode : "unknown";
  }
  const dataset = environment.CONCAT_EVENTS;
  if (dataset === undefined || typeof dataset.writeDataPoint !== "function") {
    console.error("concat event skipped: CONCAT_EVENTS binding is missing");
    return noContentResponse();
  }
  try {
    dataset.writeDataPoint({
      indexes: [browser],
      blobs: [browser, path, outcome, errorCode],
      doubles: [
        body.matched === true ? 1 : 0,
        body.converted === true ? 1 : 0,
        clampInteger(body.partCount, MAX_PART_COUNT),
        clampInteger(body.inputBytes, MAX_BYTE_COUNT),
        clampInteger(body.outputBytes, MAX_BYTE_COUNT),
        clampInteger(body.durationMs, MAX_DURATION_MILLISECONDS),
      ],
    });
  } catch (error) {
    console.error("concat event write failed", error instanceof Error ? error.name : "unknown");
  }
  return noContentResponse();
}

/**
 * Anonymous XML-tool count. Cookies, the user agent, and the client address
 * are not read. blobs: browser, action, outcome, error code. doubles: file
 * bytes, tag count, instance count, exported count, duration ms. index: browser.
 */
async function recordXmlEvent(request: Request, environment: SiteEnvironment): Promise<Response> {
  const text = await readLimitedText(request, MAX_XML_EVENT_BYTES);
  if (text === null) {
    return noContentResponse();
  }
  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    return noContentResponse();
  }
  if (payload === null || typeof payload !== "object" || Array.isArray(payload)) {
    return noContentResponse();
  }
  const body = payload as Record<string, unknown>;
  const action = body.action;
  const outcome = body.outcome;
  if (typeof action !== "string" || !XML_ACTIONS.has(action)) {
    return noContentResponse();
  }
  if (typeof outcome !== "string" || !XML_OUTCOMES.has(outcome)) {
    return noContentResponse();
  }
  const browser =
    typeof body.browser === "string" && BROWSER_FAMILIES.has(body.browser) ? body.browser : "other";
  let errorCode = "";
  if (outcome === "error") {
    errorCode =
      typeof body.errorCode === "string" && ERROR_CODE_PATTERN.test(body.errorCode) ? body.errorCode : "unknown";
  }
  const dataset = environment.XML_EVENTS;
  if (dataset === undefined || typeof dataset.writeDataPoint !== "function") {
    console.error("xml event skipped: XML_EVENTS binding is missing");
    return noContentResponse();
  }
  try {
    dataset.writeDataPoint({
      indexes: [browser],
      blobs: [browser, action, outcome, errorCode],
      doubles: [
        clampInteger(body.fileBytes, MAX_BYTE_COUNT),
        clampInteger(body.tagCount, MAX_XML_COUNT),
        clampInteger(body.instanceCount, MAX_XML_COUNT),
        clampInteger(body.exportedCount, MAX_XML_COUNT),
        clampInteger(body.durationMs, MAX_DURATION_MILLISECONDS),
      ],
    });
  } catch (error) {
    console.error("xml event write failed", error instanceof Error ? error.name : "unknown");
  }
  return noContentResponse();
}

export default {
  async fetch(request: Request, environment: SiteEnvironment, context: WorkerContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, "") : url.pathname;

    if (path === INTEREST_PATH && request.method === "POST") {
      return saveInterestSignup(request, environment, context);
    }

    if (path === CONCAT_EVENT_PATH && request.method === "POST") {
      return recordConcatEvent(request, environment);
    }

    if (path === XML_EVENT_PATH && request.method === "POST") {
      return recordXmlEvent(request, environment);
    }

    if (url.pathname.endsWith(".wasm")) {
      return wasmAsset(request, environment);
    }

    return environment.ASSETS.fetch(request);
  },
};

async function saveInterestSignup(
  request: Request,
  environment: SiteEnvironment,
  context: WorkerContext,
): Promise<Response> {
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
      "INSERT INTO signups (name, email, org, lang, user_agent) VALUES (?, ?, ?, ?, ?) RETURNING id, created_at",
    )
      .bind(name, email, organization === "" ? null : organization, storedLanguage, userAgent)
      .first<{ id: number; created_at: string | null }>();

    if (!row || typeof row.id !== "number") {
      return jsonResponse({ ok: false, error: "unavailable" }, 500);
    }

    const timestamp =
      typeof row.created_at === "string" && row.created_at.trim() !== ""
        ? row.created_at
        : new Date().toISOString();

    context.waitUntil(
      sendSignupAlert(environment, {
        name,
        email,
        organization,
        language: storedLanguage,
        timestamp,
      }),
    );

    return jsonResponse({ ok: true, id: row.id }, 200);
  } catch {
    return jsonResponse({ ok: false, error: "unavailable" }, 500);
  }
}

async function sendSignupAlert(
  environment: SiteEnvironment,
  signup: {
    name: string;
    email: string;
    organization: string;
    language: string | null;
    timestamp: string;
  },
): Promise<void> {
  try {
    if (environment.AVA_ALERT === undefined || typeof environment.AVA_ALERT.send !== "function") {
      console.error("AVA interest alert skipped: AVA_ALERT binding is missing");
      return;
    }

    const recipient = typeof environment.AVA_ALERT_TO === "string" ? environment.AVA_ALERT_TO.trim() : "";
    if (recipient === "") {
      console.error("AVA interest alert skipped: AVA_ALERT_TO is empty");
      return;
    }

    const message = new EmailMessage(ALERT_FROM, recipient, buildAlertMime(signup, recipient));
    await environment.AVA_ALERT.send(message);
  } catch (error) {
    console.error("AVA interest alert failed", error);
  }
}

function buildAlertMime(
  signup: {
    name: string;
    email: string;
    organization: string;
    language: string | null;
    timestamp: string;
  },
  recipient: string,
): string {
  return [
    `From: AVA <${ALERT_FROM}>`,
    `To: ${recipient}`,
    "Subject: AVA interest signup",
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    `Name: ${signup.name}`,
    `Email: ${signup.email}`,
    `Club / institution / country: ${signup.organization}`,
    `Language: ${signup.language ?? ""}`,
    `Timestamp: ${signup.timestamp}`,
  ].join("\r\n");
}
