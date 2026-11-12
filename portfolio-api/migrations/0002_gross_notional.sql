-- Rename transactions.total_amount to gross_notional and allow every
-- transaction_type the ledger writer already emits.
--
-- Apply this once, and only to a database whose transactions table still
-- has total_amount. Fresh databases created from schema.sql or
-- data/ledger-seed.sql already use gross_notional; do not run this file
-- on those.
--
-- Deploy the portfolio-api worker from this change first. That worker
-- reads gross_notional and, if that column is missing, total_amount.
-- Applying this file while the previous worker is still live will break
-- /api/analytics, because that worker selects total_amount only.
--
-- From portfolio-api/:
--   npx wrangler d1 migrations apply portfolio-holdings --remote
-- or, to run this file alone:
--   npx wrangler d1 execute portfolio-holdings --remote --file=migrations/0002_gross_notional.sql

CREATE TABLE transactions_gross_notional (
  transaction_id INTEGER PRIMARY KEY,
  ticker TEXT NOT NULL,
  trade_date TEXT NOT NULL,
  price REAL NOT NULL,
  quantity REAL NOT NULL,
  transaction_type TEXT NOT NULL CHECK (
    transaction_type IN ('BUY', 'SELL', 'DIVIDEND', 'DEPOSIT', 'WITHDRAWAL', 'FEE')
  ),
  gross_notional REAL NOT NULL
);

INSERT INTO transactions_gross_notional (
  transaction_id,
  ticker,
  trade_date,
  price,
  quantity,
  transaction_type,
  gross_notional
)
SELECT
  transaction_id,
  ticker,
  trade_date,
  price,
  quantity,
  transaction_type,
  total_amount
FROM transactions;

DROP TABLE transactions;

ALTER TABLE transactions_gross_notional RENAME TO transactions;

CREATE INDEX IF NOT EXISTS idx_transactions_trade_date ON transactions(trade_date);
