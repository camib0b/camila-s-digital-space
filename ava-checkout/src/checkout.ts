import { checkoutLanguage, checkoutReturnOrigin, isValidEmail, normalizeEmail, parsePriceClp } from "./config";
import { jsonResponse } from "./cors";
import { createCheckoutPreference, isMercadoPagoTestToken } from "./mercadopago";

export async function handleCheckout(request: Request, env: Env): Promise<Response> {
  if (!env.MP_ACCESS_TOKEN) {
    return jsonResponse({ ok: false, error: "checkout_unavailable" }, 503);
  }

  const priceClp = parsePriceClp(env);
  if (priceClp <= 0) {
    return jsonResponse({ ok: false, error: "price_unconfigured" }, 503);
  }

  let body: Record<string, unknown> = {};
  try {
    const parsed = await request.json();
    if (parsed && typeof parsed === "object") {
      body = parsed as Record<string, unknown>;
    }
  } catch {
    return jsonResponse({ ok: false, error: "invalid_json" }, 400);
  }

  const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
  if (!isValidEmail(email)) {
    return jsonResponse({ ok: false, error: "invalid_email" }, 400);
  }

  const language = checkoutLanguage(body.language);
  const siteOrigin = checkoutReturnOrigin(request, env);
  const encodedEmail = encodeURIComponent(email);
  const workerOrigin = new URL(request.url).origin;

  try {
    const preference = await createCheckoutPreference(env, {
      email,
      language,
      priceClp,
      successUrl: `${siteOrigin}/ava?paid=1&email=${encodedEmail}`,
      failureUrl: `${siteOrigin}/ava?paid=0`,
      pendingUrl: `${siteOrigin}/ava?paid=pending`,
      notificationUrl: `${workerOrigin}/api/ava/webhook`,
    });

    const initPoint = isMercadoPagoTestToken(env.MP_ACCESS_TOKEN)
      ? preference.sandbox_init_point || preference.init_point
      : preference.init_point || preference.sandbox_init_point;

    if (!initPoint) {
      return jsonResponse({ ok: false, error: "checkout_unavailable" }, 502);
    }

    return jsonResponse({ ok: true, initPoint }, 200);
  } catch {
    return jsonResponse({ ok: false, error: "checkout_unavailable" }, 502);
  }
}
