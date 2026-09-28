export interface AvaCheckoutConfig {
  priceClp: number;
  currency: string;
  licenseDays: number;
}

export interface AvaCheckoutStartResponse {
  ok: boolean;
  initPoint?: string;
  error?: string;
}

const AVA_CHECKOUT_API_BASE = (import.meta.env.VITE_AVA_CHECKOUT_URL || "/api/ava").replace(
  /\/+$/,
  "",
);

export const AVA_TRIAL_DMG_URL = (import.meta.env.VITE_AVA_DMG_URL || "").trim();

async function parseJsonObjectOrEmpty(response: Response): Promise<Record<string, unknown>> {
  try {
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function fetchAvaCheckoutConfig(): Promise<AvaCheckoutConfig> {
  const response = await fetch(`${AVA_CHECKOUT_API_BASE}/config`);
  const payload = await parseJsonObjectOrEmpty(response);
  if (!response.ok) {
    throw new Error("ava.checkout.error.generic");
  }
  const priceClp = Number(payload.priceClp);
  return {
    priceClp: Number.isFinite(priceClp) ? priceClp : 0,
    currency: typeof payload.currency === "string" ? payload.currency : "CLP",
    licenseDays: typeof payload.licenseDays === "number" ? payload.licenseDays : 365,
  };
}

export async function startAvaCheckout(params: {
  email: string;
  language: string;
}): Promise<string> {
  const response = await fetch(`${AVA_CHECKOUT_API_BASE}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: params.email, language: params.language }),
  });
  const payload = (await parseJsonObjectOrEmpty(response)) as AvaCheckoutStartResponse;
  if (!response.ok || !payload.initPoint) {
    if (payload.error === "invalid_email") {
      throw new Error("ava.checkout.error.email");
    }
    throw new Error("ava.checkout.error.generic");
  }
  return payload.initPoint;
}
