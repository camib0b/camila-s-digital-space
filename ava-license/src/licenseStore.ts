import { signClaims, verifyToken, type LicenseClaims } from "./crypto.ts";

export interface StoredLicense {
  keyId: string;
  kind: "trial" | "paid";
  email: string;
  deviceId: string;
  issuedAt: number;
  expiresAt: number;
  token: string;
  revoked: boolean;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function unixNow(): number {
  return Math.floor(Date.now() / 1000);
}

export function signingSecret(env: Env): string | null {
  const secret = (env.LICENSE_SIGNING_SECRET || "").trim();
  return secret.length > 0 ? secret : null;
}

export function newKeyId(prefix: string): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  let hex = "";
  for (const byte of bytes) {
    hex += byte.toString(16).padStart(2, "0");
  }
  return `${prefix}${hex}`;
}

export function publicLicense(record: StoredLicense) {
  return {
    keyId: record.keyId,
    kind: record.kind,
    email: record.email,
    deviceId: record.deviceId,
    issuedAt: record.issuedAt,
    expiresAt: record.expiresAt,
    revoked: record.revoked,
  };
}

export async function putLicense(kv: LicenseKvNamespace, record: StoredLicense): Promise<void> {
  await kv.put(`license:${record.keyId}`, JSON.stringify(record));
  if (record.kind === "trial" && record.deviceId) {
    await kv.put(`trial:${record.deviceId}`, record.keyId);
  }
  if (record.email) {
    await kv.put(`email:${normalizeEmail(record.email)}`, record.keyId);
  }
}

export async function getLicense(kv: LicenseKvNamespace, keyId: string): Promise<StoredLicense | null> {
  if (!keyId) return null;
  const raw = await kv.get(`license:${keyId}`);
  if (!raw) return null;
  return JSON.parse(raw) as StoredLicense;
}

export async function issuePaidLicense(
  env: Env,
  email: string,
  days: number,
): Promise<{ token: string; license: StoredLicense } | null> {
  const secret = signingSecret(env);
  if (!secret) return null;
  const now = unixNow();
  const claims: LicenseClaims = {
    v: 1,
    kind: "paid",
    email: normalizeEmail(email),
    deviceId: "",
    keyId: newKeyId("k_"),
    issuedAt: now,
    expiresAt: now + Math.max(1, days) * 24 * 60 * 60,
  };
  const token = await signClaims(secret, claims);
  const record: StoredLicense = {
    keyId: claims.keyId,
    kind: "paid",
    email: claims.email,
    deviceId: "",
    issuedAt: claims.issuedAt,
    expiresAt: claims.expiresAt,
    token,
    revoked: false,
  };
  await putLicense(env.LICENSES, record);
  return { token, license: record };
}

export type LicenseVerifyFailure = "signing_unconfigured" | "invalid_key" | "unknown" | "revoked" | "expired";

/**
 * Signature check plus the KV record written by issue.
 * Unlike POST /v1/license/check, this does not create a record and does not bind a device.
 */
export async function verifyIssuedLicense(
  env: Env,
  token: string,
): Promise<{ ok: true; license: StoredLicense } | { ok: false; reason: LicenseVerifyFailure }> {
  const secret = signingSecret(env);
  if (!secret) return { ok: false, reason: "signing_unconfigured" };
  const claims = await verifyToken(secret, token);
  if (!claims) return { ok: false, reason: "invalid_key" };
  const record = await getLicense(env.LICENSES, claims.keyId);
  if (!record) return { ok: false, reason: "unknown" };
  if (record.revoked) return { ok: false, reason: "revoked" };
  const now = unixNow();
  if (now >= record.expiresAt || now >= claims.expiresAt) return { ok: false, reason: "expired" };
  if (record.kind !== claims.kind || record.keyId !== claims.keyId) return { ok: false, reason: "invalid_key" };
  return { ok: true, license: record };
}

export function licenseVerifyStatus(reason: LicenseVerifyFailure | "unauthorized"): number {
  if (reason === "signing_unconfigured") return 503;
  if (reason === "revoked") return 403;
  return 401;
}
