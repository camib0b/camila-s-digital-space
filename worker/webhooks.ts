import { jsonResponse } from "./json";
import { verifyFintocSignature } from "./fintocSignature";
import {
  insertPaymentEventIfNew,
  updateCheckoutSessionFromWebhook,
  type CheckoutSessionStatus,
} from "./paymentsDb";

interface FintocEvent {
  id?: string;
  type?: string;
  data?: Record<string, unknown>;
}

export async function handleFintocWebhook(
  request: Request,
  env: Env
): Promise<Response> {
  if (!env.FINTOC_WEBHOOK_SECRET) {
    return jsonResponse({ error: "Webhook secret is not configured" }, 500);
  }

  const rawBody = await request.text();
  const signatureHeader = request.headers.get("Fintoc-Signature");
  const verification = await verifyFintocSignature(
    rawBody,
    signatureHeader,
    env.FINTOC_WEBHOOK_SECRET
  );

  if (!verification.ok) {
    console.error(
      JSON.stringify({
        event: "webhook.invalid_signature",
        error: verification.error,
      })
    );
    return jsonResponse({ error: verification.error }, 400);
  }

  let fintocEvent: FintocEvent;
  try {
    fintocEvent = JSON.parse(rawBody) as FintocEvent;
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const eventId = typeof fintocEvent.id === "string" ? fintocEvent.id : "";
  const eventType = typeof fintocEvent.type === "string" ? fintocEvent.type : "";
  if (!eventId || !eventType) {
    return jsonResponse({ error: "Event is missing id or type" }, 400);
  }

  const eventData = isRecord(fintocEvent.data) ? fintocEvent.data : {};
  const extracted = extractPaymentIdentifiers(eventType, eventData);
  const nextStatus = statusForEventType(eventType);

  let isNewEvent = true;
  try {
    isNewEvent = await insertPaymentEventIfNew(env.portfolio_holdings, {
      eventId,
      eventType,
      paymentIntentId: extracted.paymentIntentId,
      checkoutSessionId: extracted.checkoutSessionId,
      amount: extracted.amount,
      currency: extracted.currency,
      status: nextStatus ?? "received",
      payload: rawBody,
    });
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "webhook.persist_failed",
        eventId,
        eventType,
        message: error instanceof Error ? error.message : "Unknown error",
      })
    );
    return jsonResponse({ error: "Failed to persist webhook event" }, 500);
  }

  if (!isNewEvent) {
    return jsonResponse({ received: true, duplicate: true }, 200);
  }

  if (nextStatus) {
    try {
      await updateCheckoutSessionFromWebhook(env.portfolio_holdings, {
        checkoutSessionId: extracted.checkoutSessionId,
        paymentIntentId: extracted.paymentIntentId,
        status: nextStatus,
      });
    } catch (error) {
      console.error(
        JSON.stringify({
          event: "webhook.session_update_failed",
          eventId,
          eventType,
          message: error instanceof Error ? error.message : "Unknown error",
        })
      );
    }
  }

  console.log(
    JSON.stringify({
      event: "webhook.processed",
      eventId,
      eventType,
      checkoutSessionId: extracted.checkoutSessionId,
      paymentIntentId: extracted.paymentIntentId,
      status: nextStatus,
    })
  );

  return jsonResponse({ received: true }, 200);
}

function statusForEventType(eventType: string): CheckoutSessionStatus | null {
  switch (eventType) {
    case "checkout_session.finished":
      return "finished";
    case "checkout_session.expired":
      return "expired";
    case "payment_intent.succeeded":
      return "succeeded";
    case "payment_intent.failed":
      return "failed";
    case "payment_intent.pending":
      return "pending";
    default:
      return null;
  }
}

function extractPaymentIdentifiers(
  eventType: string,
  eventData: Record<string, unknown>
): {
  checkoutSessionId: string | null;
  paymentIntentId: string | null;
  amount: number | null;
  currency: string | null;
} {
  const amount = typeof eventData.amount === "number" ? eventData.amount : null;
  const currency = typeof eventData.currency === "string" ? eventData.currency : null;

  if (eventType.startsWith("checkout_session.")) {
    const paymentResource = isRecord(eventData.payment_resource)
      ? eventData.payment_resource
      : null;
    const paymentIntent = paymentResource && isRecord(paymentResource.payment_intent)
      ? paymentResource.payment_intent
      : null;

    return {
      checkoutSessionId: typeof eventData.id === "string" ? eventData.id : null,
      paymentIntentId:
        paymentIntent && typeof paymentIntent.id === "string" ? paymentIntent.id : null,
      amount:
        paymentIntent && typeof paymentIntent.amount === "number"
          ? paymentIntent.amount
          : amount,
      currency:
        paymentIntent && typeof paymentIntent.currency === "string"
          ? paymentIntent.currency
          : currency,
    };
  }

  return {
    checkoutSessionId: null,
    paymentIntentId: typeof eventData.id === "string" ? eventData.id : null,
    amount,
    currency,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
