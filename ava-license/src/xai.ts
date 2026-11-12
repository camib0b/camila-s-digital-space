import { isIsoDate, normalizeHexColor } from "./preprocess.ts";

export const CHAT_MODEL = "grok-4.20-0309-non-reasoning";
export const CHAT_TIMEOUT_MS = 60_000;
export const DIRECT_CHAT_COMPLETIONS_URL = "https://api.x.ai/v1/chat/completions";

export const NAME_DATE_SYSTEM_PROMPT = [
  "You extract sports game metadata from video file names.",
  'The first team in patterns like "X vs Y" or "X v Y" is home; the second is away.',
  "Infer a calendar date when the file name contains one, as yyyy-MM-dd.",
  "Use null for any field you cannot infer with reasonable confidence.",
  "Do not invent teams that are not suggested by the file name.",
  "Also return home_team_name_confidence, away_team_name_confidence, and game_date_confidence as numbers from 0 to 1.",
  "Use 0 when the value is null.",
].join(" ");

export const COLOR_SYSTEM_PROMPT = [
  "You identify the two teams' primary jersey/kit colors from a sports video frame.",
  "Ignore the field, crowd, referee, and goalkeeper if they use a clearly different kit.",
  "Map colors onto the given home and away team names when those names are provided.",
  "Return each color as #RRGGBB. Use null when you cannot tell.",
  "Also return home_color_hex_confidence and away_color_hex_confidence as numbers from 0 to 1.",
  "Use 0 when the value is null.",
].join(" ");

const NAME_KEYS = [
  "home_team_name",
  "away_team_name",
  "game_date",
  "home_team_name_confidence",
  "away_team_name_confidence",
  "game_date_confidence",
] as const;

const COLOR_KEYS = [
  "home_color_hex",
  "away_color_hex",
  "home_color_hex_confidence",
  "away_color_hex_confidence",
] as const;

export interface ChatTarget {
  url: string;
  model: string;
  gateway: boolean;
}

export function resolveChatTarget(env: Env): ChatTarget {
  const configuredModel = (env.XAI_CHAT_MODEL || CHAT_MODEL).trim() || CHAT_MODEL;
  const configuredUrl = (env.AI_GATEWAY_BASE_URL || "").trim().replace(/\/+$/, "");
  if (!configuredUrl) {
    return { url: DIRECT_CHAT_COMPLETIONS_URL, model: configuredModel, gateway: false };
  }
  const model =
    configuredUrl.includes("/compat/") && !configuredModel.includes("/") ? `xai/${configuredModel}` : configuredModel;
  return { url: configuredUrl, model, gateway: true };
}

export function gatewayConfigured(env: Env): boolean {
  return resolveChatTarget(env).gateway;
}

export interface NamesPromptInput {
  fileNames: readonly string[];
}

export interface ColorsPromptInput {
  homeName: string | null;
  awayName: string | null;
  frameJpegBase64: string;
}

export type ChatCall =
  | { kind: "names"; input: NamesPromptInput }
  | { kind: "colors"; input: ColorsPromptInput };

export type ChatFailureReason = "timeout" | "invalid_json" | "http" | "unconfigured";

export type ChatResult =
  | { ok: true; fields: Record<string, string | number | null>; attempts: number }
  | { ok: false; reason: ChatFailureReason; status?: number };

export async function completeStructuredChat(
  env: Env,
  call: ChatCall,
  fetchImpl: typeof fetch = fetch,
): Promise<ChatResult> {
  const apiKey = (env.XAI_API_KEY || "").trim();
  if (!apiKey) return { ok: false, reason: "unconfigured" };
  const target = resolveChatTarget(env);
  const containsImage = call.kind === "colors";
  let lastFailure: ChatResult = { ok: false, reason: "invalid_json" };
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await fetchImpl(target.url, {
        method: "POST",
        headers: chatHeaders(env, apiKey, target.gateway, containsImage),
        body: JSON.stringify(chatBody(target.model, call)),
        signal: AbortSignal.timeout(CHAT_TIMEOUT_MS),
      });
      const text = await response.text();
      if (!response.ok) {
        return { ok: false, reason: "http", status: response.status };
      }
      const fields = parseCompletionFields(text, call.kind);
      if (!fields) {
        lastFailure = { ok: false, reason: "invalid_json" };
        continue;
      }
      return { ok: true, fields, attempts: attempt };
    } catch (error) {
      if (isTimeoutError(error)) {
        lastFailure = { ok: false, reason: "timeout" };
        continue;
      }
      return { ok: false, reason: "http" };
    }
  }
  return lastFailure;
}

export function chatHeaders(env: Env, apiKey: string, gateway: boolean, containsImage: boolean): Headers {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Authorization", `Bearer ${apiKey}`);
  if (!gateway) return headers;
  headers.set("cf-aig-collect-log-payload", "false");
  if (containsImage) {
    headers.set("cf-aig-collect-log", "false");
    headers.set("cf-aig-skip-cache", "true");
  }
  const gatewayToken = (env.AI_GATEWAY_TOKEN || "").trim();
  if (gatewayToken) headers.set("cf-aig-authorization", `Bearer ${gatewayToken}`);
  return headers;
}

function chatBody(model: string, call: ChatCall): Record<string, unknown> {
  if (call.kind === "names") {
    return {
      model,
      temperature: 0,
      max_completion_tokens: 256,
      messages: [
        { role: "system", content: NAME_DATE_SYSTEM_PROMPT },
        { role: "user", content: `Video file name(s):\n${call.input.fileNames.join("\n")}` },
      ],
      response_format: responseFormat("game_filename_metadata", NAME_KEYS, {
        home_team_name: nullableStringSchema(),
        away_team_name: nullableStringSchema(),
        game_date: nullableStringSchema(),
        home_team_name_confidence: confidenceSchema(),
        away_team_name_confidence: confidenceSchema(),
        game_date_confidence: confidenceSchema(),
      }),
    };
  }
  return {
    model,
    temperature: 0,
    max_completion_tokens: 256,
    messages: [
      { role: "system", content: COLOR_SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${call.input.frameJpegBase64}`,
              detail: "low",
            },
          },
          { type: "text", text: colorUserText(call.input.homeName, call.input.awayName) },
        ],
      },
    ],
    response_format: responseFormat("game_kit_colors", COLOR_KEYS, {
      home_color_hex: nullableStringSchema(),
      away_color_hex: nullableStringSchema(),
      home_color_hex_confidence: confidenceSchema(),
      away_color_hex_confidence: confidenceSchema(),
    }),
  };
}

export function colorUserText(homeName: string | null, awayName: string | null): string {
  if (!homeName && !awayName) {
    return [
      "Identify the two distinct outfield jersey colors.",
      "Assign the first distinct kit color to home_color_hex and the other to away_color_hex.",
    ].join(" ");
  }
  const home = homeName || "(unknown)";
  const away = awayName || "(unknown)";
  return `Home team: ${home}\nAway team: ${away}\nWhat are the primary outfield jersey colors for each team?`;
}

function nullableStringSchema(): { type: ["string", "null"] } {
  return { type: ["string", "null"] };
}

/** Bounds are enforced after the response arrives, so the schema stays a plain number. */
function confidenceSchema(): { type: "number" } {
  return { type: "number" };
}

function responseFormat(
  name: string,
  required: readonly string[],
  properties: Record<string, unknown>,
): Record<string, unknown> {
  return {
    type: "json_schema",
    json_schema: {
      name,
      strict: true,
      schema: {
        type: "object",
        additionalProperties: false,
        properties,
        required: [...required],
      },
    },
  };
}

function parseCompletionFields(body: string, kind: ChatCall["kind"]): Record<string, string | number | null> | null {
  const object = parseStructuredObject(body);
  if (!object) return null;
  return kind === "names" ? validateNames(object) : validateColors(object);
}

function parseStructuredObject(body: string): Record<string, unknown> | null {
  let root: unknown;
  try {
    root = JSON.parse(body);
  } catch {
    return null;
  }
  if (!root || typeof root !== "object" || Array.isArray(root)) return null;
  const envelope = root as Record<string, unknown>;
  if ("error" in envelope) return null;
  const choices = envelope.choices;
  if (!Array.isArray(choices) || choices.length === 0) return null;
  const first = choices[0];
  if (!first || typeof first !== "object") return null;
  const message = (first as Record<string, unknown>).message;
  if (!message || typeof message !== "object") return null;
  const content = (message as Record<string, unknown>).content;
  if (content && typeof content === "object" && !Array.isArray(content)) {
    return content as Record<string, unknown>;
  }
  let text = "";
  if (typeof content === "string") text = content;
  else if (Array.isArray(content)) {
    text = content
      .map((part) => {
        if (!part || typeof part !== "object") return "";
        const partText = (part as Record<string, unknown>).text;
        return typeof partText === "string" ? partText : "";
      })
      .join("");
  }
  if (!text.trim()) return null;
  const fenced = text.replace(/^\s*```(?:json)?\s*|\s*```\s*$/g, "");
  for (const candidate of [text, fenced]) {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      // try the fence-stripped candidate next
    }
  }
  return null;
}

function validateNames(object: Record<string, unknown>): Record<string, string | number | null> | null {
  if (!exactKeys(object, NAME_KEYS)) return null;
  const home = optionalJsonString(object.home_team_name);
  const away = optionalJsonString(object.away_team_name);
  const date = optionalJsonString(object.game_date);
  if (home === undefined || away === undefined || date === undefined) return null;
  if (date !== null && !isIsoDate(date)) return null;
  const homeConfidence = confidenceValue(object.home_team_name_confidence);
  const awayConfidence = confidenceValue(object.away_team_name_confidence);
  const dateConfidence = confidenceValue(object.game_date_confidence);
  if (homeConfidence === null || awayConfidence === null || dateConfidence === null) return null;
  return {
    home_team_name: home,
    away_team_name: away,
    game_date: date,
    home_team_name_confidence: homeConfidence,
    away_team_name_confidence: awayConfidence,
    game_date_confidence: dateConfidence,
  };
}

function validateColors(object: Record<string, unknown>): Record<string, string | number | null> | null {
  if (!exactKeys(object, COLOR_KEYS)) return null;
  const homeRaw = optionalJsonString(object.home_color_hex);
  const awayRaw = optionalJsonString(object.away_color_hex);
  if (homeRaw === undefined || awayRaw === undefined) return null;
  const home = homeRaw === null ? null : normalizeHexColor(homeRaw);
  const away = awayRaw === null ? null : normalizeHexColor(awayRaw);
  if (homeRaw !== null && home === null) return null;
  if (awayRaw !== null && away === null) return null;
  const homeConfidence = confidenceValue(object.home_color_hex_confidence);
  const awayConfidence = confidenceValue(object.away_color_hex_confidence);
  if (homeConfidence === null || awayConfidence === null) return null;
  return {
    home_color_hex: home,
    away_color_hex: away,
    home_color_hex_confidence: homeConfidence,
    away_color_hex_confidence: awayConfidence,
  };
}

function exactKeys(object: Record<string, unknown>, keys: readonly string[]): boolean {
  const present = Object.keys(object);
  if (present.length !== keys.length) return false;
  return keys.every((key) => Object.prototype.hasOwnProperty.call(object, key));
}

function optionalJsonString(value: unknown): string | null | undefined {
  if (value === null) return null;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLocaleLowerCase("en") === "null") return null;
  return trimmed;
}

function confidenceValue(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  if (value < 0 || value > 1) return null;
  return value;
}

function isTimeoutError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const name = (error as { name?: string }).name;
  return name === "TimeoutError" || name === "AbortError";
}
