#!/usr/bin/env node
/**
 * Regenerate repo-root schema.sql from portfolio-api/data/ledger.json.
 * Preserves ai_usage DDL and indexes; replaces transactions with all ledger rows.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const ledgerPath = join(root, "portfolio-api", "data", "ledger.json");
const schemaPath = join(root, "schema.sql");

const ledger = JSON.parse(readFileSync(ledgerPath, "utf8"));
const rows = [...ledger].sort((a, b) => a.transactionId - b.transactionId);

const valueLines = rows.map((row) => {
  const grossNotionalLiteral = String(row.grossNotional ?? row.totalAmount);
  return `(${row.transactionId}, '${row.ticker}', '${row.tradeDate}', ${row.price}, ${row.quantity}, '${row.transactionType}', ${grossNotionalLiteral})`;
});

const sql = `-- Synced from portfolio-api/data/portfolio-transactions.csv (single source of truth)
-- purchases was a frozen pre-ledger snapshot. Drop it. Do not recreate it.

DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS transactions;

CREATE TABLE transactions (
  transaction_id   INTEGER PRIMARY KEY,
  ticker           TEXT NOT NULL,
  trade_date       TEXT NOT NULL,
  price            REAL NOT NULL,
  quantity         REAL NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('BUY', 'SELL', 'DIVIDEND', 'DEPOSIT', 'WITHDRAWAL', 'FEE')),
  gross_notional   REAL NOT NULL
);

INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, gross_notional) VALUES
${valueLines.join(",\n")};

CREATE TABLE IF NOT EXISTS ai_usage (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp           TEXT DEFAULT CURRENT_TIMESTAMP,
  provider            TEXT NOT NULL,
  model               TEXT NOT NULL,
  prompt_tokens       INTEGER NOT NULL,
  completion_tokens   INTEGER NOT NULL,
  total_tokens        INTEGER NOT NULL,
  estimated_cost_usd  REAL
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_timestamp ON ai_usage(timestamp);
CREATE INDEX IF NOT EXISTS idx_transactions_trade_date ON transactions(trade_date);
`;

writeFileSync(schemaPath, sql);
console.log(`Wrote ${schemaPath} (${rows.length} transactions).`);
