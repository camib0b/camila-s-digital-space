import {
  isValidCustomerEmail,
  parseCheckoutAmount,
  PAYMENT_CURRENCY,
} from "../shared/payments";
import { jsonResponse } from "./json";
import { insertCheckoutSession } from "./paymentsDb";

const FINTOC_CHECKOUT_SESSIONS_URL = "https://api.fintoc.com/v2/checkout_sessions";

interface CheckoutRequestBody {
  amount?: unknown;
  currency?: unknown;
  customerEmail?: unknown;
}

interface FintocCheckoutSession {
  id?: string;
  redirect_url?: string;
  error?: {
    message?: string;
    type?: string;
  };
}

export async function handleCreateCheckoutSession(
  request: Request,
  env: Env
): Promise<Response> {
  if (!env.FINTOC_SECRET_KEY) {
    return jsonResponse({ error: "Payments are not configured" }, 500);
  }

  let body: CheckoutRequestBody;
  try {
    body = (await request.json()) as CheckoutRequestBody;
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const customerEmail =
    typeof body.customerEmail === "string" ? body.customerEmail.trim() : "";
  if (!isValidCustomerEmail(customerEmail)) {
    return jsonResponse({ error: "Enter a valid email address." }, 400);
  }

  const amount = parseCheckoutAmount(body.amount);
  if (amount === null) {
    return jsonResponse(
      { error: "Enter a whole-peso CLP amount between 100 and 10000000." },
      400
    );
  }

  const siteUrl = getSiteUrl(request, env);
  const idempotencyKey = crypto.randomUUID();

  const fintocResponse = await fetch(FINTOC_CHECKOUT_SESSIONS_URL, {
    method: "POST",
    headers: {
      Authorization: env.FINTOC_SECRET_KEY,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      amount,
      currency: PAYMENT_CURRENCY,
      customer_email: customerEmail,
      flow: "payment",
      success_url: `${siteUrl}/payment/success`,
      cancel_url: `${siteUrl}/payment/cancel`,
      metadata: {
        source: "camilaescudero-site",
      },
    }),
  });

  const fintocPayload = (await parseJsonOrEmpty(fintocResponse)) as FintocCheckoutSession;

  if (!fintocResponse.ok) {
    console.error(
      JSON.stringify({
        event: "checkout.fintoc_error",
        status: fintocResponse.status,
        message: fintocPayload.error?.message ?? "Fintoc checkout session failed",
      })
    );
    return jsonResponse(
      {
        error: fintocPayload.error?.message ?? "Checkout failed",
      },
      fintocResponse.status
    );
  }

  if (!fintocPayload.id || !fintocPayload.redirect_url) {
    return jsonResponse({ error: "Fintoc did not return a redirect URL" }, 502);
  }

  try {
    await insertCheckoutSession(env.portfolio_holdings, {
      id: fintocPayload.id,
      amount,
      currency: PAYMENT_CURRENCY,
      customerEmail,
      status: "created",
      redirectUrl: fintocPayload.redirect_url,
    });
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "checkout.persist_failed",
        checkoutSessionId: fintocPayload.id,
        message: error instanceof Error ? error.message : "Unknown error",
      })
    );
  }

  console.log(
    JSON.stringify({
      event: "checkout.created",
      checkoutSessionId: fintocPayload.id,
      amount,
      currency: PAYMENT_CURRENCY,
    })
  );

  return jsonResponse({
    id: fintocPayload.id,
    redirect_url: fintocPayload.redirect_url,
  });
}

function getSiteUrl(request: Request, env: Env): string {
  const configuredSiteUrl = env.SITE_URL?.replace(/\/$/, "");
  if (configuredSiteUrl) {
    return configuredSiteUrl;
  }

  return new URL(request.url).origin;
}

async function parseJsonOrEmpty(response: Response): Promise<Record<string, unknown>> {
  try {
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}
