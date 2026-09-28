import { hmacSha256Hex, timingSafeEqualString } from "./crypto";

const PREFERENCES_URL = "https://api.mercadopago.com/checkout/preferences";
const PAYMENTS_URL = "https://api.mercadopago.com/v1/payments";

export interface MercadoPagoPreference {
  init_point?: string;
  sandbox_init_point?: string;
}

export interface MercadoPagoPayment {
  id?: number | string;
  status?: string;
  transaction_amount?: number;
  currency_id?: string;
  external_reference?: string;
  metadata?: {
    language?: string;
  };
  payer?: {
    email?: string;
  };
}

export function isMercadoPagoTestToken(accessToken: string): boolean {
  return accessToken.startsWith("TEST-");
}

export async function createCheckoutPreference(
  env: Env,
  params: {
    email: string;
    language: "es" | "en";
    priceClp: number;
    successUrl: string;
    failureUrl: string;
    pendingUrl: string;
    notificationUrl: string;
  },
): Promise<MercadoPagoPreference> {
  const title = params.language === "en" ? "AVA — 1 year, 1 Mac" : "AVA — 1 año, 1 Mac";
  const response = await fetch(PREFERENCES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.MP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        {
          title,
          quantity: 1,
          currency_id: "CLP",
          unit_price: params.priceClp,
        },
      ],
      payer: { email: params.email },
      external_reference: params.email,
      metadata: { language: params.language },
      back_urls: {
        success: params.successUrl,
        failure: params.failureUrl,
        pending: params.pendingUrl,
      },
      auto_return: "approved",
      notification_url: params.notificationUrl,
      statement_descriptor: "AVA",
    }),
  });

  const payload = (await response.json()) as MercadoPagoPreference & { message?: string };
  if (!response.ok) {
    console.error(
      JSON.stringify({
        event: "ava.mp.preference_failed",
        status: response.status,
        message: payload.message || "preference_error",
      }),
    );
    throw new Error("preference_failed");
  }
  return payload;
}

export async function fetchMercadoPagoPayment(env: Env, paymentId: string): Promise<MercadoPagoPayment | null> {
  const response = await fetch(`${PAYMENTS_URL}/${encodeURIComponent(paymentId)}`, {
    headers: {
      Authorization: `Bearer ${env.MP_ACCESS_TOKEN}`,
    },
  });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    console.error(JSON.stringify({ event: "ava.mp.payment_fetch_failed", status: response.status, paymentId }));
    throw new Error("payment_fetch_failed");
  }
  return (await response.json()) as MercadoPagoPayment;
}

export function paymentIdFromWebhook(request: Request, body: Record<string, unknown>): string {
  const url = new URL(request.url);
  const queryDataId = url.searchParams.get("data.id") || url.searchParams.get("id") || "";
  if (queryDataId) {
    return queryDataId.trim();
  }
  const data = body.data;
  if (data && typeof data === "object" && "id" in data) {
    const nestedId = (data as { id?: unknown }).id;
    if (typeof nestedId === "string" || typeof nestedId === "number") {
      return String(nestedId).trim();
    }
  }
  if (typeof body.id === "string" || typeof body.id === "number") {
    return String(body.id).trim();
  }
  return "";
}

export async function verifyMercadoPagoSignature(
  request: Request,
  env: Env,
  paymentId: string,
): Promise<boolean> {
  const signatureHeader = request.headers.get("x-signature") || "";
  const requestId = request.headers.get("x-request-id") || "";
  const parsed = parseSignatureHeader(signatureHeader);
  if (!parsed || !requestId || !paymentId || !env.MP_WEBHOOK_SECRET) {
    return false;
  }
  const manifest = `id:${paymentId};request-id:${requestId};ts:${parsed.timestamp};`;
  const expected = await hmacSha256Hex(env.MP_WEBHOOK_SECRET, manifest);
  return timingSafeEqualString(expected, parsed.hash.toLowerCase());
}

function parseSignatureHeader(header: string): { timestamp: string; hash: string } | null {
  let timestamp = "";
  let hash = "";
  for (const part of header.split(",")) {
    const separatorIndex = part.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }
    const key = part.slice(0, separatorIndex).trim();
    const value = part.slice(separatorIndex + 1).trim();
    if (key === "ts") {
      timestamp = value;
    }
    if (key === "v1") {
      hash = value;
    }
  }
  if (!timestamp || !hash) {
    return null;
  }
  return { timestamp, hash };
}
