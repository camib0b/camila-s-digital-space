export type CheckoutSessionStatus =
  | "created"
  | "finished"
  | "expired"
  | "succeeded"
  | "failed"
  | "pending";

export interface CheckoutSessionRecord {
  id: string;
  amount: number;
  currency: string;
  customerEmail: string;
  status: CheckoutSessionStatus;
  paymentIntentId?: string | null;
  redirectUrl?: string | null;
}

export interface PaymentEventRecord {
  eventId: string;
  eventType: string;
  paymentIntentId: string | null;
  checkoutSessionId: string | null;
  amount: number | null;
  currency: string | null;
  status: string;
  payload: string;
}

export async function insertCheckoutSession(
  database: D1Database,
  record: CheckoutSessionRecord
): Promise<void> {
  await database
    .prepare(
      `
      INSERT INTO checkout_sessions (
        id, amount, currency, customer_email, status, payment_intent_id, redirect_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    )
    .bind(
      record.id,
      record.amount,
      record.currency,
      record.customerEmail,
      record.status,
      record.paymentIntentId ?? null,
      record.redirectUrl ?? null
    )
    .run();
}

export async function insertPaymentEventIfNew(
  database: D1Database,
  record: PaymentEventRecord
): Promise<boolean> {
  const result = await database
    .prepare(
      `
      INSERT INTO payment_events (
        event_id, event_type, payment_intent_id, checkout_session_id,
        amount, currency, status, payload
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(event_id) DO NOTHING
    `
    )
    .bind(
      record.eventId,
      record.eventType,
      record.paymentIntentId,
      record.checkoutSessionId,
      record.amount,
      record.currency,
      record.status,
      record.payload
    )
    .run();

  return (result.meta.changes ?? 0) > 0;
}

export async function updateCheckoutSessionFromWebhook(
  database: D1Database,
  input: {
    checkoutSessionId: string | null;
    paymentIntentId: string | null;
    status: CheckoutSessionStatus;
  }
): Promise<void> {
  if (input.checkoutSessionId) {
    await database
      .prepare(
        `
        UPDATE checkout_sessions
        SET status = ?, payment_intent_id = COALESCE(?, payment_intent_id), updated_at = datetime('now')
        WHERE id = ?
      `
      )
      .bind(input.status, input.paymentIntentId, input.checkoutSessionId)
      .run();
    return;
  }

  if (input.paymentIntentId) {
    await database
      .prepare(
        `
        UPDATE checkout_sessions
        SET status = ?, updated_at = datetime('now')
        WHERE payment_intent_id = ?
      `
      )
      .bind(input.status, input.paymentIntentId)
      .run();
  }
}
