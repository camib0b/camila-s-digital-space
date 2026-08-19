-- Fintoc checkout sessions and webhook events (same D1 as portfolio-holdings).

CREATE TABLE IF NOT EXISTS checkout_sessions (
  id TEXT PRIMARY KEY,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  status TEXT NOT NULL,
  payment_intent_id TEXT,
  redirect_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS payment_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  payment_intent_id TEXT,
  checkout_session_id TEXT,
  amount INTEGER,
  currency TEXT,
  status TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_checkout_sessions_status
  ON checkout_sessions (status);

CREATE INDEX IF NOT EXISTS idx_checkout_sessions_payment_intent_id
  ON checkout_sessions (payment_intent_id);

CREATE INDEX IF NOT EXISTS idx_payment_events_checkout_session_id
  ON payment_events (checkout_session_id);

CREATE INDEX IF NOT EXISTS idx_payment_events_event_type
  ON payment_events (event_type);
