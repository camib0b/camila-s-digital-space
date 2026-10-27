import assert from "node:assert/strict";
import test from "node:test";

import { CHAT_MODEL, DIRECT_CHAT_COMPLETIONS_URL, chatHeaders, completeStructuredChat, resolveChatTarget } from "./xai.ts";

const GATEWAY_URL = "https://gateway.ai.cloudflare.com/v1/account/ava/compat/chat/completions";

function namesEnvelope(content: unknown): string {
  return JSON.stringify({
    choices: [{ message: { content: typeof content === "string" ? content : JSON.stringify(content) } }],
  });
}

const validNames = {
  home_team_name: "COGS",
  away_team_name: "Old Girls",
  game_date: "2026-10-03",
  home_team_name_confidence: 0.4,
  away_team_name_confidence: 0.5,
  game_date_confidence: 0.2,
};

test("direct xAI is the default target and the compat gateway prefixes the model", () => {
  const direct = resolveChatTarget({} as Env);
  assert.equal(direct.gateway, false);
  assert.equal(direct.url, DIRECT_CHAT_COMPLETIONS_URL);
  assert.equal(direct.model, CHAT_MODEL);

  const gateway = resolveChatTarget({ AI_GATEWAY_BASE_URL: GATEWAY_URL } as Env);
  assert.equal(gateway.gateway, true);
  assert.equal(gateway.model, `xai/${CHAT_MODEL}`);
});

test("image calls through the gateway disable payload storage and the whole log", () => {
  const headers = chatHeaders({ AI_GATEWAY_TOKEN: "gateway-token" } as Env, "xai-test-key", true, true);
  assert.equal(headers.get("cf-aig-collect-log-payload"), "false");
  assert.equal(headers.get("cf-aig-collect-log"), "false");
  assert.equal(headers.get("cf-aig-skip-cache"), "true");
  assert.equal(headers.get("cf-aig-authorization"), "Bearer gateway-token");
  assert.equal(headers.get("Authorization"), "Bearer xai-test-key");
});

test("text calls through the gateway keep metadata logs but skip payload storage", () => {
  const headers = chatHeaders({} as Env, "xai-test-key", true, false);
  assert.equal(headers.get("cf-aig-collect-log-payload"), "false");
  assert.equal(headers.get("cf-aig-collect-log"), null);
  assert.equal(headers.get("cf-aig-skip-cache"), null);
});

test("a direct call does not send gateway headers", () => {
  const headers = chatHeaders({} as Env, "xai-test-key", false, true);
  assert.equal(headers.get("cf-aig-collect-log"), null);
  assert.equal(headers.get("cf-aig-collect-log-payload"), null);
});

test("invalid JSON is retried once and the second body is accepted", async () => {
  const bodies: string[] = [];
  const fetchImpl: typeof fetch = async (_input, init) => {
    bodies.push(String(init?.body));
    if (bodies.length === 1) {
      return new Response(namesEnvelope("not-json"), { status: 200 });
    }
    return new Response(namesEnvelope(validNames), { status: 200 });
  };
  const result = await completeStructuredChat(
    { XAI_API_KEY: "xai-test-key" } as Env,
    { kind: "names", input: { fileNames: ["a.mp4"] } },
    fetchImpl,
  );
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.attempts, 2);
  assert.equal(bodies.length, 2);
  const body = JSON.parse(bodies[0] ?? "{}") as { temperature: number; max_completion_tokens: number; model: string };
  assert.equal(body.temperature, 0);
  assert.equal(body.max_completion_tokens, 256);
  assert.equal(body.model, CHAT_MODEL);
});

test("a timeout is retried once", async () => {
  let calls = 0;
  const fetchImpl: typeof fetch = async () => {
    calls += 1;
    if (calls === 1) {
      throw new DOMException("timed out", "TimeoutError");
    }
    return new Response(namesEnvelope(validNames), { status: 200 });
  };
  const result = await completeStructuredChat(
    { XAI_API_KEY: "xai-test-key" } as Env,
    { kind: "names", input: { fileNames: ["a.mp4"] } },
    fetchImpl,
  );
  assert.equal(result.ok, true);
  assert.equal(calls, 2);
});

test("an HTTP error is not retried", async () => {
  let calls = 0;
  const fetchImpl: typeof fetch = async () => {
    calls += 1;
    return new Response("nope", { status: 500 });
  };
  const result = await completeStructuredChat(
    { XAI_API_KEY: "xai-test-key" } as Env,
    { kind: "names", input: { fileNames: ["a.mp4"] } },
    fetchImpl,
  );
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.reason, "http");
  assert.equal(calls, 1);
});

test("a missing key does not call fetch", async () => {
  let calls = 0;
  const fetchImpl: typeof fetch = async () => {
    calls += 1;
    return new Response("nope", { status: 500 });
  };
  const result = await completeStructuredChat({} as Env, { kind: "names", input: { fileNames: ["a.mp4"] } }, fetchImpl);
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.reason, "unconfigured");
  assert.equal(calls, 0);
});
