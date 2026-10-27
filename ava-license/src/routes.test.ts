import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_DEV_SECRET, KNOWN_VECTOR_CLAIMS, KNOWN_VECTOR_TOKEN, signClaims } from "./crypto.ts";
import { MAX_FRAME_BYTES } from "./gameMetadata.ts";
import worker from "./index.ts";
import { putLicense, unixNow, type StoredLicense } from "./licenseStore.ts";

const ADMIN_SECRET = "test-admin-secret";
const XAI_KEY = "xai-test-key-do-not-log";
const GATEWAY_URL = "https://gateway.ai.cloudflare.com/v1/account/ava/compat/chat/completions";

function memoryKv(): LicenseKvNamespace {
  const store = new Map<string, string>();
  return {
    async get(key: string) {
      return store.get(key) ?? null;
    },
    async put(key: string, value: string) {
      store.set(key, value);
    },
  };
}

function allowingLimiter(): RateLimitBinding {
  return { limit: async () => ({ success: true }) };
}

function blockingLimiter(): RateLimitBinding {
  return { limit: async () => ({ success: false }) };
}

function testEnv(overrides: Partial<Env> = {}): Env {
  return {
    LICENSES: memoryKv(),
    GAME_METADATA_LICENSE_LIMIT: allowingLimiter(),
    GAME_METADATA_GLOBAL_LIMIT: allowingLimiter(),
    LICENSE_SIGNING_SECRET: DEFAULT_DEV_SECRET,
    ADMIN_SECRET,
    XAI_API_KEY: XAI_KEY,
    AI_GATEWAY_BASE_URL: "",
    ...overrides,
  };
}

async function post(env: Env, path: string, body: unknown, token?: string): Promise<Response> {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return worker.fetch(
    new Request(`https://ava-license.example${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    }),
    env,
  );
}

function tinyJpegBase64(): string {
  return btoa(String.fromCharCode(0xff, 0xd8, 0xff, 0xd9));
}

function namesEnvelope(fields: Record<string, unknown>): string {
  return JSON.stringify({ choices: [{ message: { content: JSON.stringify(fields) } }] });
}

const modelNames = {
  home_team_name: "F3 COGS",
  away_team_name: "Old Girls",
  game_date: "2016-05-16",
  home_team_name_confidence: 0.42,
  away_team_name_confidence: 0.64,
  game_date_confidence: 0.2,
};

test("admin issue signs an AVA1 token and verify reads that KV record", async () => {
  const env = testEnv();
  const issued = await post(env, "/v1/admin/issue", { email: "Coach@Example.com", days: 365 }, ADMIN_SECRET);
  assert.equal(issued.status, 200);
  const payload = (await issued.json()) as { ok: boolean; token: string; license: { keyId: string } };
  assert.equal(payload.ok, true);
  assert.ok(payload.token.startsWith("AVA1."));
  assert.ok(payload.license.keyId.startsWith("k_"));

  const verified = await post(env, "/v1/license/verify", {}, payload.token);
  assert.equal(verified.status, 200);
  const license = (await verified.json()) as { ok: boolean; license: { email: string; keyId: string; kind: string } };
  assert.equal(license.ok, true);
  assert.equal(license.license.email, "coach@example.com");
  assert.equal(license.license.keyId, payload.license.keyId);
  assert.equal(license.license.kind, "paid");

  const rejected = await post(env, "/v1/admin/issue", { email: "coach@example.com" }, "wrong");
  assert.equal(rejected.status, 401);
});

test("verify rejects a valid signature that was never stored, while check still records it", async () => {
  const env = testEnv();
  const claims = {
    ...KNOWN_VECTOR_CLAIMS,
    keyId: "k_notstored",
    email: "other@example.com",
  };
  const token = await signClaims(DEFAULT_DEV_SECRET, claims);
  const verified = await post(env, "/v1/license/verify", { token });
  assert.equal(verified.status, 401);
  const body = (await verified.json()) as { reason: string };
  assert.equal(body.reason, "unknown");

  const checked = await post(env, "/v1/license/check", { token, deviceId: "device-1" });
  assert.equal(checked.status, 200);
});

test("the published vector verifies only when the KV record is present and active", async () => {
  const env = testEnv();
  const missing = await post(env, "/v1/license/verify", { token: KNOWN_VECTOR_TOKEN });
  assert.equal(missing.status, 401);

  const record: StoredLicense = {
    keyId: KNOWN_VECTOR_CLAIMS.keyId,
    kind: "paid",
    email: KNOWN_VECTOR_CLAIMS.email,
    deviceId: "",
    issuedAt: KNOWN_VECTOR_CLAIMS.issuedAt,
    expiresAt: KNOWN_VECTOR_CLAIMS.expiresAt,
    token: KNOWN_VECTOR_TOKEN,
    revoked: false,
  };
  await putLicense(env.LICENSES, record);
  const ok = await post(env, "/v1/license/verify", { token: KNOWN_VECTOR_TOKEN });
  assert.equal(ok.status, 200);

  const tampered = KNOWN_VECTOR_TOKEN.replace(".PLj0", ".XLj0");
  const bad = await post(env, "/v1/license/verify", { token: tampered });
  assert.equal(bad.status, 401);
});

test("revoked and expired licenses are rejected", async () => {
  const env = testEnv();
  const issued = await post(env, "/v1/admin/issue", { email: "coach@example.com", days: 30 }, ADMIN_SECRET);
  const payload = (await issued.json()) as { token: string; license: { keyId: string } };
  const revoked = await post(env, "/v1/admin/revoke", { keyId: payload.license.keyId }, ADMIN_SECRET);
  assert.equal(revoked.status, 200);
  const afterRevoke = await post(env, "/v1/license/verify", { token: payload.token });
  assert.equal(afterRevoke.status, 403);

  const expiredToken = await signClaims(DEFAULT_DEV_SECRET, {
    ...KNOWN_VECTOR_CLAIMS,
    keyId: "k_expired",
    expiresAt: unixNow() - 10,
  });
  await putLicense(env.LICENSES, {
    keyId: "k_expired",
    kind: "paid",
    email: KNOWN_VECTOR_CLAIMS.email,
    deviceId: "",
    issuedAt: KNOWN_VECTOR_CLAIMS.issuedAt,
    expiresAt: unixNow() - 10,
    token: expiredToken,
    revoked: false,
  });
  const expired = await post(env, "/v1/license/verify", { token: expiredToken });
  assert.equal(expired.status, 401);
  const expiredBody = (await expired.json()) as { reason: string };
  assert.equal(expiredBody.reason, "expired");
});

test("game metadata uses the tools and does not call xAI when they decide every field", async () => {
  const env = testEnv();
  const issued = await post(env, "/v1/admin/issue", { email: "coach@example.com", days: 30 }, ADMIN_SECRET);
  const token = ((await issued.json()) as { token: string }).token;
  let fetches = 0;
  const original = globalThis.fetch;
  globalThis.fetch = async () => {
    fetches += 1;
    return new Response("unexpected", { status: 500 });
  };
  try {
    const response = await post(
      env,
      "/v1/ai/game-metadata",
      { file_names: ["F13 Cogs vs Old Girls 03.10.26.mp4"] },
      token,
    );
    assert.equal(response.status, 200);
    const body = (await response.json()) as {
      home: { value: string; source: string; confidence: number };
      away: { value: string; source: string };
      date: { value: string; source: string };
      home_color: { value: null; source: null };
    };
    assert.equal(body.home.value, "COGS");
    assert.equal(body.home.source, "tool");
    assert.equal(body.home.confidence, 1);
    assert.equal(body.away.value, "Old Girls");
    assert.equal(body.date.value, "2026-10-03");
    assert.equal(body.date.source, "tool");
    assert.equal(body.home_color.value, null);
    assert.equal(fetches, 0);
  } finally {
    globalThis.fetch = original;
  }
});

test("the model fills only fields the tools abstain on, and a tool date wins", async () => {
  const env = testEnv();
  const issued = await post(env, "/v1/admin/issue", { email: "coach@example.com", days: 30 }, ADMIN_SECRET);
  const token = ((await issued.json()) as { token: string }).token;
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response(namesEnvelope(modelNames), { status: 200 });
  try {
    const response = await post(
      env,
      "/v1/ai/game-metadata",
      { file_names: ["Mystery Club vs Also Unknown.mp4"] },
      token,
    );
    assert.equal(response.status, 200);
    const body = (await response.json()) as {
      home: { value: string; source: string; confidence: number };
      away: { value: string; source: string };
      date: { value: null; source: string };
    };
    assert.equal(body.home.value, "COGS");
    assert.equal(body.home.source, "llm");
    assert.equal(body.home.confidence, 0.42);
    assert.equal(body.away.value, "Old Girls");
    assert.equal(body.away.source, "llm");
    assert.equal(body.date.value, null);
    assert.equal(body.date.source, "tool");
  } finally {
    globalThis.fetch = original;
  }
});

test("a frame is refused unless AI Gateway is configured, and then it is sent with no-log headers", async () => {
  const env = testEnv();
  const issued = await post(env, "/v1/admin/issue", { email: "coach@example.com", days: 30 }, ADMIN_SECRET);
  const token = ((await issued.json()) as { token: string }).token;
  const frame = tinyJpegBase64();
  const logs: string[] = [];
  const originalLog = console.log;
  console.log = (...parts: unknown[]) => {
    logs.push(parts.map((part) => String(part)).join(" "));
  };
  const originalFetch = globalThis.fetch;
  const calls: Array<{ url: string; headers: Headers; body: string }> = [];
  globalThis.fetch = async (input, init) => {
    calls.push({
      url: String(input),
      headers: new Headers(init?.headers),
      body: String(init?.body),
    });
    return new Response(
      namesEnvelope({
        home_color_hex: "#c8102e",
        away_color_hex: "#0033a0",
        home_color_hex_confidence: 0.7,
        away_color_hex_confidence: 0.8,
      }),
      { status: 200 },
    );
  };
  try {
    const blocked = await post(
      env,
      "/v1/ai/game-metadata",
      { file_names: ["Old reds - UC B.MP4"], frame_jpeg_base64: frame },
      token,
    );
    assert.equal(blocked.status, 200);
    const blockedBody = (await blocked.json()) as { warnings?: string[]; home: { value: string }; home_color: { value: null } };
    assert.equal(blockedBody.home.value, "Old Reds");
    assert.equal(blockedBody.home_color.value, null);
    assert.ok(blockedBody.warnings?.includes("colors_gateway_required"));
    assert.equal(calls.length, 0);

    env.AI_GATEWAY_BASE_URL = GATEWAY_URL;
    const allowed = await post(
      env,
      "/v1/ai/game-metadata",
      { file_names: ["Old reds - UC B.MP4"], frame_jpeg_base64: frame },
      token,
    );
    assert.equal(allowed.status, 200);
    const allowedBody = (await allowed.json()) as {
      home_color: { value: string; source: string; confidence: number };
      away_color: { value: string; source: string };
    };
    assert.equal(allowedBody.home_color.value, "#C8102E");
    assert.equal(allowedBody.home_color.source, "llm");
    assert.equal(allowedBody.home_color.confidence, 0.7);
    assert.equal(allowedBody.away_color.value, "#0033A0");
    assert.equal(calls.length, 1);
    const call = calls[0];
    assert.ok(call);
    assert.equal(call.url, GATEWAY_URL);
    assert.equal(call.headers.get("cf-aig-collect-log"), "false");
    assert.equal(call.headers.get("cf-aig-collect-log-payload"), "false");
    assert.equal(call.headers.get("cf-aig-skip-cache"), "true");
    assert.equal(call.headers.get("Authorization"), `Bearer ${XAI_KEY}`);
    assert.ok(call.body.includes("data:image/jpeg;base64,"));
    const logged = logs.join("\n");
    assert.equal(logged.includes(XAI_KEY), false);
    assert.equal(logged.includes(frame), false);
    assert.equal(logged.includes("frame_jpeg"), false);
  } finally {
    console.log = originalLog;
    globalThis.fetch = originalFetch;
  }
});

test("oversized frames and missing licenses are rejected before xAI", async () => {
  const env = testEnv();
  const issued = await post(env, "/v1/admin/issue", { email: "coach@example.com", days: 30 }, ADMIN_SECRET);
  const token = ((await issued.json()) as { token: string }).token;
  let fetches = 0;
  const original = globalThis.fetch;
  globalThis.fetch = async () => {
    fetches += 1;
    return new Response("unexpected", { status: 500 });
  };
  try {
    const missing = await post(env, "/v1/ai/game-metadata", { file_names: ["OG vs UCB.mp4"] });
    assert.equal(missing.status, 401);
    const oversized = "A".repeat(Math.ceil((MAX_FRAME_BYTES + 3) / 3) * 4);
    const tooBig = await post(
      env,
      "/v1/ai/game-metadata",
      { file_names: ["OG vs UCB.mp4"], frame_jpeg_base64: oversized },
      token,
    );
    assert.equal(tooBig.status, 413);
    const invalid = await post(
      env,
      "/v1/ai/game-metadata",
      { file_names: ["OG vs UCB.mp4"], frame_jpeg_base64: btoa("hello!") },
      token,
    );
    assert.equal(invalid.status, 400);
    assert.equal(fetches, 0);
  } finally {
    globalThis.fetch = original;
  }
});

test("per-license and global rate limits return 429", async () => {
  const licenseEnv = testEnv({ GAME_METADATA_LICENSE_LIMIT: blockingLimiter() });
  const issued = await post(licenseEnv, "/v1/admin/issue", { email: "coach@example.com", days: 30 }, ADMIN_SECRET);
  const token = ((await issued.json()) as { token: string }).token;
  const licenseLimited = await post(licenseEnv, "/v1/ai/game-metadata", { file_names: ["OG vs UCB.mp4"] }, token);
  assert.equal(licenseLimited.status, 429);
  const licenseBody = (await licenseLimited.json()) as { scope: string };
  assert.equal(licenseBody.scope, "license");

  const globalEnv = testEnv({ GAME_METADATA_GLOBAL_LIMIT: blockingLimiter() });
  const globalIssued = await post(globalEnv, "/v1/admin/issue", { email: "coach@example.com", days: 30 }, ADMIN_SECRET);
  const globalToken = ((await globalIssued.json()) as { token: string }).token;
  const globalLimited = await post(globalEnv, "/v1/ai/game-metadata", { file_names: ["OG vs UCB.mp4"] }, globalToken);
  assert.equal(globalLimited.status, 429);
  const globalBody = (await globalLimited.json()) as { scope: string };
  assert.equal(globalBody.scope, "global");
});
