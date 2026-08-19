const SIGNATURE_TOLERANCE_SECONDS = 5 * 60;

export type SignatureVerificationResult = { ok: true } | { ok: false; error: string };

export async function verifyFintocSignature(
  payload: string,
  signatureHeader: string | null,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000)
): Promise<SignatureVerificationResult> {
  if (!signatureHeader) {
    return { ok: false, error: "Missing Fintoc-Signature header" };
  }

  if (!secret) {
    return { ok: false, error: "Webhook secret is not configured" };
  }

  const parsedHeader = parseSignatureHeader(signatureHeader);
  if (!parsedHeader) {
    return { ok: false, error: "Invalid Fintoc-Signature header" };
  }

  if (Math.abs(nowSeconds - parsedHeader.timestamp) > SIGNATURE_TOLERANCE_SECONDS) {
    return { ok: false, error: "Fintoc-Signature timestamp is outside the allowed window" };
  }

  const expectedSignature = await hmacSha256Hex(
    secret,
    `${parsedHeader.timestamp}.${payload}`
  );

  if (!timingSafeEqualHex(expectedSignature, parsedHeader.signature)) {
    return { ok: false, error: "Invalid Fintoc-Signature" };
  }

  return { ok: true };
}

function parseSignatureHeader(
  header: string
): { timestamp: number; signature: string } | null {
  const values = new Map<string, string>();

  for (const part of header.split(",")) {
    const separatorIndex = part.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }

    const key = part.slice(0, separatorIndex).trim();
    const value = part.slice(separatorIndex + 1).trim();
    values.set(key, value);
  }

  const timestampRaw = values.get("t");
  const signature = values.get("v1");
  if (!timestampRaw || !signature) {
    return null;
  }

  const timestamp = Number(timestampRaw);
  if (!Number.isFinite(timestamp)) {
    return null;
  }

  return { timestamp, signature };
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return bytesToHex(new Uint8Array(signature));
}

function timingSafeEqualHex(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false;
  }

  const leftBytes = hexToBytes(left);
  const rightBytes = hexToBytes(right);
  if (!leftBytes || !rightBytes || leftBytes.length !== rightBytes.length) {
    return false;
  }

  let difference = 0;
  for (let index = 0; index < leftBytes.length; index += 1) {
    difference |= leftBytes[index] ^ rightBytes[index];
  }

  return difference === 0;
}

function bytesToHex(bytes: Uint8Array): string {
  let hex = "";
  for (const byte of bytes) {
    hex += byte.toString(16).padStart(2, "0");
  }
  return hex;
}

function hexToBytes(hex: string): Uint8Array | null {
  if (hex.length % 2 !== 0) {
    return null;
  }

  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    const byte = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
    if (Number.isNaN(byte)) {
      return null;
    }
    bytes[index] = byte;
  }

  return bytes;
}
