import { LICENSE_CURRENCY, checkoutLanguage, isValidEmail, normalizeEmail, parsePriceClp } from "./config";
import { jsonResponse } from "./cors";
import { sendLicenseKeyEmail } from "./email";
import { issuePaidLicense } from "./license";
import {
  fetchMercadoPagoPayment,
  paymentIdFromWebhook,
  verifyMercadoPagoSignature,
} from "./mercadopago";

interface PaymentFulfillment {
  email: string;
  keyId: string;
  emailed: boolean;
  language: "es" | "en";
  token?: string;
}

function fulfillmentKey(paymentId: string): string {
  return `payment:${paymentId}`;
}

async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  if (request.method === "GET") {
    return {};
  }
  try {
    const parsed = await request.json();
    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // MercadoPago can send empty or form bodies; query params still carry the id.
  }
  return {};
}

async function loadFulfillment(env: Env, paymentId: string): Promise<PaymentFulfillment | null> {
  const raw = await env.PAYMENTS.get(fulfillmentKey(paymentId));
  if (!raw) {
    return null;
  }
  return JSON.parse(raw) as PaymentFulfillment;
}

async function saveFulfillment(env: Env, paymentId: string, record: PaymentFulfillment): Promise<void> {
  await env.PAYMENTS.put(fulfillmentKey(paymentId), JSON.stringify(record));
}

export async function handleWebhook(request: Request, env: Env): Promise<Response> {
  const body = await readJsonBody(request);
  const topic = String(
    new URL(request.url).searchParams.get("type") ||
      new URL(request.url).searchParams.get("topic") ||
      body.type ||
      body.topic ||
      "",
  ).toLowerCase();

  if (topic && topic !== "payment" && topic !== "payment.updated" && topic !== "payment.created") {
    return jsonResponse({ ok: true, ignored: true }, 200);
  }

  const paymentId = paymentIdFromWebhook(request, body);
  if (!paymentId) {
    if (request.method === "GET" && topic === "") {
      return jsonResponse({ ok: true }, 200);
    }
    return jsonResponse({ ok: false, error: "missing_payment_id" }, 400);
  }

  const signatureOk = await verifyMercadoPagoSignature(request, env, paymentId);
  if (!signatureOk) {
    console.error(JSON.stringify({ event: "ava.mp.signature_rejected", paymentId }));
    return jsonResponse({ ok: false, error: "invalid_signature" }, 401);
  }

  const existing = await loadFulfillment(env, paymentId);
  if (existing?.emailed) {
    console.log(JSON.stringify({ event: "ava.fulfillment.duplicate", paymentId, email: existing.email, keyId: existing.keyId }));
    return jsonResponse({ ok: true, duplicate: true }, 200);
  }

  if (existing?.token && !existing.emailed) {
    try {
      await sendLicenseKeyEmail(env, {
        to: existing.email,
        token: existing.token,
        language: existing.language,
      });
    } catch (error) {
      console.error(JSON.stringify({ event: "ava.email.failed", paymentId, email: existing.email, keyId: existing.keyId, error: String(error) }));
      return jsonResponse({ ok: false, error: "email_failed" }, 500);
    }
    await saveFulfillment(env, paymentId, {
      email: existing.email,
      keyId: existing.keyId,
      emailed: true,
      language: existing.language,
    });
    console.log(JSON.stringify({ event: "ava.email.sent", paymentId, email: existing.email, keyId: existing.keyId }));
    return jsonResponse({ ok: true }, 200);
  }

  const payment = await fetchMercadoPagoPayment(env, paymentId);
  if (!payment) {
    return jsonResponse({ ok: false, error: "payment_not_found" }, 500);
  }

  const status = (payment.status || "").toLowerCase();
  if (status !== "approved") {
    return jsonResponse({ ok: true, ignored: true, status }, 200);
  }

  const priceClp = parsePriceClp(env);
  const paidAmount = Math.round(Number(payment.transaction_amount));
  if (payment.currency_id !== LICENSE_CURRENCY || paidAmount !== priceClp || priceClp <= 0) {
    console.error(
      JSON.stringify({
        event: "ava.mp.amount_mismatch",
        paymentId,
        currency: payment.currency_id,
        paidAmount,
        expectedAmount: priceClp,
      }),
    );
    return jsonResponse({ ok: false, error: "amount_mismatch" }, 400);
  }

  const email = normalizeEmail(payment.external_reference || payment.payer?.email || "");
  if (!isValidEmail(email)) {
    console.error(JSON.stringify({ event: "ava.mp.missing_email", paymentId }));
    return jsonResponse({ ok: false, error: "missing_email" }, 400);
  }

  const language = checkoutLanguage(payment.metadata?.language);
  const issued = await issuePaidLicense(env, email);
  await saveFulfillment(env, paymentId, {
    email,
    keyId: issued.keyId,
    emailed: false,
    language,
    token: issued.token,
  });
  console.log(JSON.stringify({ event: "ava.license.issued", paymentId, email, keyId: issued.keyId }));

  try {
    await sendLicenseKeyEmail(env, { to: email, token: issued.token, language });
  } catch (error) {
    console.error(JSON.stringify({ event: "ava.email.failed", paymentId, email, keyId: issued.keyId, error: String(error) }));
    return jsonResponse({ ok: false, error: "email_failed" }, 500);
  }

  await saveFulfillment(env, paymentId, {
    email,
    keyId: issued.keyId,
    emailed: true,
    language,
  });
  console.log(JSON.stringify({ event: "ava.email.sent", paymentId, email, keyId: issued.keyId }));
  return jsonResponse({ ok: true }, 200);
}
