import { bearerToken, jsonResponse, readBodyLimited } from "./http.ts";
import { licenseVerifyStatus, verifyIssuedLicense } from "./licenseStore.ts";
import {
  cleanModelTeamName,
  isIsoDate,
  normalizeHexColor,
  suggestNamesFromFileNames,
  type SuggestedField,
} from "./preprocess.ts";
import { canonicalTeamName } from "./teams.ts";
import { consumeGameMetadataQuota } from "./rateLimit.ts";
import { completeStructuredChat, gatewayConfigured, type ChatCall } from "./xai.ts";

export const MAX_FILE_NAMES = 8;
export const MAX_FILE_NAME_CHARACTERS = 300;
export const MAX_FRAME_BYTES = 256 * 1024;
export const MAX_REQUEST_BYTES = 400 * 1024;

export interface GameMetadataResponse {
  ok: true;
  home: SuggestedField;
  away: SuggestedField;
  date: SuggestedField;
  home_color: SuggestedField;
  away_color: SuggestedField;
  warnings?: string[];
}

export async function handleGameMetadata(request: Request, env: Env, fetchImpl: typeof fetch = fetch): Promise<Response> {
  const presented = bearerToken(request);
  if (!presented) return jsonResponse({ ok: false, reason: "unauthorized" }, 401);
  const verified = await verifyIssuedLicense(env, presented);
  if (!verified.ok) {
    return jsonResponse({ ok: false, reason: verified.reason }, licenseVerifyStatus(verified.reason));
  }

  const quota = await consumeGameMetadataQuota(env, verified.license.keyId);
  if (quota === "unconfigured") return jsonResponse({ ok: false, reason: "rate_limit_unconfigured" }, 503);
  if (quota !== "ok") {
    return jsonResponse({ ok: false, reason: "rate_limited", scope: quota }, 429, { "Retry-After": "60" });
  }

  const bodyBytes = await readBodyLimited(request, MAX_REQUEST_BYTES);
  if (bodyBytes === "too_large") return jsonResponse({ ok: false, reason: "body_too_large" }, 413);
  if (bodyBytes === "empty") return jsonResponse({ ok: false, reason: "invalid_body" }, 400);
  let payload: unknown;
  try {
    payload = JSON.parse(new TextDecoder().decode(bodyBytes));
  } catch {
    return jsonResponse({ ok: false, reason: "invalid_body" }, 400);
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return jsonResponse({ ok: false, reason: "invalid_body" }, 400);
  }
  const record = payload as Record<string, unknown>;
  const fileNames = prepareFileNames(record.file_names ?? record.fileNames);
  if (fileNames === "invalid") return jsonResponse({ ok: false, reason: "invalid_file_names" }, 400);

  const frameField = record.frame_jpeg_base64 ?? record.frameJpegBase64;
  let frameBase64: string | null = null;
  if (frameField !== undefined && frameField !== null && frameField !== "") {
    if (typeof frameField !== "string") return jsonResponse({ ok: false, reason: "invalid_frame" }, 400);
    const decoded = decodeJpegFrame(frameField);
    if (decoded === "too_large") return jsonResponse({ ok: false, reason: "frame_too_large" }, 413);
    if (decoded === "invalid") return jsonResponse({ ok: false, reason: "invalid_frame" }, 400);
    frameBase64 = frameField.replace(/\s+/g, "");
  }

  const warnings: string[] = [];
  const tools = suggestNamesFromFileNames(fileNames);
  let home = tools.home;
  let away = tools.away;
  let date = tools.date;

  const namesNeedModel = home.source !== "tool" || away.source !== "tool" || date.source !== "tool";
  if (namesNeedModel) {
    const namesCall: ChatCall = { kind: "names", input: { fileNames } };
    const namesResult = await completeStructuredChat(env, namesCall, fetchImpl);
    if (!namesResult.ok) {
      warnings.push(namesResult.reason === "unconfigured" ? "names_ai_unconfigured" : "names_ai_failed");
    } else {
      home = keepToolOrAdopt(home, modelTeam(namesResult.fields.home_team_name), numberOrNull(namesResult.fields.home_team_name_confidence));
      away = keepToolOrAdopt(away, modelTeam(namesResult.fields.away_team_name), numberOrNull(namesResult.fields.away_team_name_confidence));
      date = keepToolOrAdopt(date, modelDate(namesResult.fields.game_date), numberOrNull(namesResult.fields.game_date_confidence));
    }
  }

  let homeColor: SuggestedField = { value: null, confidence: null, source: null };
  let awayColor: SuggestedField = { value: null, confidence: null, source: null };
  if (frameBase64) {
    if (!gatewayConfigured(env)) {
      warnings.push("colors_gateway_required");
    } else {
      const colorsResult = await completeStructuredChat(
        env,
        {
          kind: "colors",
          input: {
            homeName: home.value,
            awayName: away.value,
            frameJpegBase64: frameBase64,
          },
        },
        fetchImpl,
      );
      if (!colorsResult.ok) {
        warnings.push(colorsResult.reason === "unconfigured" ? "colors_ai_unconfigured" : "colors_ai_failed");
      } else {
        homeColor = colorField(colorsResult.fields.home_color_hex, colorsResult.fields.home_color_hex_confidence);
        awayColor = colorField(colorsResult.fields.away_color_hex, colorsResult.fields.away_color_hex_confidence);
      }
    }
  }

  console.log(
    JSON.stringify({
      event: "ava.game_metadata.ok",
      keyId: verified.license.keyId,
      homeSource: home.source,
      awaySource: away.source,
      dateSource: date.source,
      colorSource: homeColor.source,
      warningCount: warnings.length,
    }),
  );

  const response: GameMetadataResponse = {
    ok: true,
    home,
    away,
    date,
    home_color: homeColor,
    away_color: awayColor,
  };
  if (warnings.length > 0) response.warnings = warnings;
  return jsonResponse(response);
}

export function prepareFileNames(value: unknown): string[] | "invalid" {
  if (!Array.isArray(value)) return "invalid";
  const seen = new Set<string>();
  const names: string[] = [];
  for (const entry of value) {
    if (typeof entry !== "string") return "invalid";
    const trimmed = entry.trim();
    if (!trimmed) continue;
    if (trimmed.length > MAX_FILE_NAME_CHARACTERS) return "invalid";
    if (seen.has(trimmed)) continue;
    seen.add(trimmed);
    names.push(trimmed);
  }
  if (names.length === 0 || names.length > MAX_FILE_NAMES) return "invalid";
  return names;
}

export function decodeJpegFrame(base64: string): Uint8Array | "too_large" | "invalid" {
  const trimmed = base64.replace(/\s+/g, "");
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(trimmed) || trimmed.length % 4 !== 0) return "invalid";
  const estimated = Math.floor((trimmed.length * 3) / 4);
  if (estimated > MAX_FRAME_BYTES) return "too_large";
  let binary: string;
  try {
    binary = atob(trimmed);
  } catch {
    return "invalid";
  }
  if (binary.length > MAX_FRAME_BYTES) return "too_large";
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) return "invalid";
  return bytes;
}

function keepToolOrAdopt(tool: SuggestedField, modelValue: string | null, modelConfidence: number | null): SuggestedField {
  if (tool.source === "tool") return tool;
  if (modelValue === null) {
    return { value: null, confidence: modelConfidence, source: modelConfidence === null ? null : "llm" };
  }
  return { value: modelValue, confidence: modelConfidence, source: "llm" };
}

function modelTeam(value: string | number | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const cleaned = cleanModelTeamName(value);
  if (!cleaned) return null;
  return canonicalTeamName(cleaned) ?? cleaned;
}

function modelDate(value: string | number | null | undefined): string | null {
  if (typeof value !== "string") return null;
  return isIsoDate(value) ? value : null;
}

function numberOrNull(value: string | number | null | undefined): number | null {
  return typeof value === "number" ? value : null;
}

function colorField(value: string | number | null | undefined, confidence: string | number | null | undefined): SuggestedField {
  const hex = typeof value === "string" ? normalizeHexColor(value) : null;
  const confidenceNumber = typeof confidence === "number" ? confidence : null;
  if (!hex) return { value: null, confidence: confidenceNumber, source: "llm" };
  return { value: hex, confidence: confidenceNumber, source: "llm" };
}
