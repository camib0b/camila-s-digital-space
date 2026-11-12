import { signClaims, timingSafeEqualString, verifyToken, type LicenseClaims } from "./crypto.ts";
import { bearerToken, jsonResponse, numberField, readJsonObject, stringField } from "./http.ts";
import {
  getLicense,
  issuePaidLicense,
  licenseVerifyStatus,
  newKeyId,
  normalizeEmail,
  publicLicense,
  putLicense,
  signingSecret,
  unixNow,
  verifyIssuedLicense,
  type StoredLicense,
} from "./licenseStore.ts";

const TRIAL_DAYS = 14;

export async function handleLicenseVerify(request: Request, env: Env): Promise<Response> {
  const body = await readJsonObject(request);
  const token = bearerToken(request) || (body ? stringField(body, "token") : "");
  if (!token) return jsonResponse({ ok: false, reason: "unauthorized" }, 401);
  const verified = await verifyIssuedLicense(env, token);
  if (!verified.ok) return jsonResponse({ ok: false, reason: verified.reason }, licenseVerifyStatus(verified.reason));
  return jsonResponse({ ok: true, license: publicLicense(verified.license) });
}

export async function handleTrialStart(env: Env, body: Record<string, unknown>): Promise<Response> {
  const deviceId = stringField(body, "deviceId");
  const offeredToken = stringField(body, "token");
  if (!deviceId) return jsonResponse({ ok: false, reason: "missing_device" }, 400);
  const secret = signingSecret(env);
  if (!secret) return jsonResponse({ ok: false, reason: "signing_unconfigured" }, 503);

  const existingId = await env.LICENSES.get(`trial:${deviceId}`);
  if (existingId) {
    const existing = await getLicense(env.LICENSES, existingId);
    if (existing) return jsonResponse({ ok: true, token: existing.token, license: publicLicense(existing) });
  }

  let claims = offeredToken ? await verifyToken(secret, offeredToken) : null;
  const now = unixNow();
  if (!claims || claims.kind !== "trial" || (claims.deviceId && claims.deviceId !== deviceId)) {
    claims = {
      v: 1,
      kind: "trial",
      email: "",
      deviceId,
      keyId: newKeyId("t_"),
      issuedAt: now,
      expiresAt: now + TRIAL_DAYS * 24 * 60 * 60,
    };
  } else {
    claims = { ...claims, deviceId };
  }

  const token = await signClaims(secret, claims);
  const record = trialRecord(claims, token);
  await putLicense(env.LICENSES, record);
  return jsonResponse({ ok: true, token, license: publicLicense(record) });
}

function trialRecord(claims: LicenseClaims, token: string): StoredLicense {
  return {
    keyId: claims.keyId,
    kind: "trial",
    email: "",
    deviceId: claims.deviceId,
    issuedAt: claims.issuedAt,
    expiresAt: claims.expiresAt,
    token,
    revoked: false,
  };
}

export async function handleActivate(env: Env, body: Record<string, unknown>): Promise<Response> {
  const email = stringField(body, "email");
  const token = stringField(body, "token");
  const deviceId = stringField(body, "deviceId");
  const secret = signingSecret(env);
  if (!secret) return jsonResponse({ ok: false, reason: "signing_unconfigured" }, 503);
  const claims = await verifyToken(secret, token);
  if (!claims || claims.kind !== "paid") return jsonResponse({ ok: false, reason: "invalid_key" }, 400);
  if (normalizeEmail(claims.email) !== normalizeEmail(email)) {
    return jsonResponse({ ok: false, reason: "email_mismatch" }, 400);
  }
  const now = unixNow();
  if (now >= claims.expiresAt) return jsonResponse({ ok: false, reason: "expired" }, 400);

  let record = await getLicense(env.LICENSES, claims.keyId);
  if (!record) {
    record = {
      keyId: claims.keyId,
      kind: "paid",
      email: normalizeEmail(claims.email),
      deviceId: "",
      issuedAt: claims.issuedAt,
      expiresAt: claims.expiresAt,
      token,
      revoked: false,
    };
  }
  if (record.revoked) return jsonResponse({ ok: false, reason: "revoked" }, 403);
  if (record.deviceId && record.deviceId !== deviceId) {
    return jsonResponse({ ok: false, reason: "other_device" }, 409);
  }
  record.deviceId = deviceId;
  record.token = token;
  await putLicense(env.LICENSES, record);
  return jsonResponse({ ok: true, token: record.token, license: publicLicense(record) });
}

export async function handleCheck(env: Env, body: Record<string, unknown>): Promise<Response> {
  const token = stringField(body, "token");
  const deviceId = stringField(body, "deviceId");
  const secret = signingSecret(env);
  if (!secret) return jsonResponse({ ok: false, reason: "signing_unconfigured" }, 503);
  const claims = await verifyToken(secret, token);
  if (!claims) return jsonResponse({ ok: false, reason: "invalid_key" }, 400);
  const now = unixNow();
  let record = await getLicense(env.LICENSES, claims.keyId);
  if (!record) {
    record = {
      keyId: claims.keyId,
      kind: claims.kind,
      email: claims.email,
      deviceId: claims.deviceId || deviceId,
      issuedAt: claims.issuedAt,
      expiresAt: claims.expiresAt,
      token,
      revoked: false,
    };
    await putLicense(env.LICENSES, record);
  }
  if (record.revoked) return jsonResponse({ ok: false, reason: "revoked", license: publicLicense(record) }, 403);
  if (now >= record.expiresAt) return jsonResponse({ ok: false, reason: "expired", license: publicLicense(record) }, 400);
  if (record.deviceId && record.deviceId !== deviceId) {
    return jsonResponse({ ok: false, reason: "other_device", license: publicLicense(record) }, 409);
  }
  if (!record.deviceId) {
    record.deviceId = deviceId;
    await putLicense(env.LICENSES, record);
  }
  return jsonResponse({ ok: true, token: record.token, license: publicLicense(record) });
}

export async function handleAdminIssue(request: Request, env: Env, body: Record<string, unknown>): Promise<Response> {
  if (!(await requireAdmin(request, env))) return jsonResponse({ ok: false, reason: "unauthorized" }, 401);
  const email = stringField(body, "email");
  const days = numberField(body, "days", 365);
  if (!email) return jsonResponse({ ok: false, reason: "missing_email" }, 400);
  const issued = await issuePaidLicense(env, email, days);
  if (!issued) return jsonResponse({ ok: false, reason: "signing_unconfigured" }, 503);
  return jsonResponse({ ok: true, token: issued.token, license: publicLicense(issued.license) });
}

export async function handleAdminRevoke(request: Request, env: Env, body: Record<string, unknown>): Promise<Response> {
  if (!(await requireAdmin(request, env))) return jsonResponse({ ok: false, reason: "unauthorized" }, 401);
  const keyId = stringField(body, "keyId");
  const record = await getLicense(env.LICENSES, keyId);
  if (!record) return jsonResponse({ ok: false, reason: "not_found" }, 404);
  record.revoked = true;
  await putLicense(env.LICENSES, record);
  return jsonResponse({ ok: true, license: publicLicense(record) });
}

export async function handleAdminIntrospect(request: Request, env: Env, url: URL): Promise<Response> {
  if (!(await requireAdmin(request, env))) return jsonResponse({ ok: false, reason: "unauthorized" }, 401);
  const keyId = url.searchParams.get("keyId") || "";
  const email = url.searchParams.get("email") || "";
  let resolvedId = keyId;
  if (!resolvedId && email) {
    resolvedId = (await env.LICENSES.get(`email:${normalizeEmail(email)}`)) || "";
  }
  if (!resolvedId) return jsonResponse({ ok: false, reason: "not_found" }, 404);
  const record = await getLicense(env.LICENSES, resolvedId);
  if (!record) return jsonResponse({ ok: false, reason: "not_found" }, 404);
  return jsonResponse({ ok: true, license: publicLicense(record) });
}

async function requireAdmin(request: Request, env: Env): Promise<boolean> {
  const expected = (env.ADMIN_SECRET || "").trim();
  if (!expected) return false;
  const presented = bearerToken(request);
  if (!presented) return false;
  return timingSafeEqualString(presented, expected);
}
