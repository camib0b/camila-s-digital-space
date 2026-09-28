#!/usr/bin/env node
/**
 * Sync portfolio-api/data/ledger.json and ledger-seed.sql from camila-stock-portfolio.csv.
 * Reuses transaction_id when a row matches ticker, date, price, quantity, and type.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dataDir = join(dirname(fileURLToPath(import.meta.url)), "..", "data");
const csvPath = join(dataDir, "camila-stock-portfolio.csv");
const ledgerPath = join(dataDir, "ledger.json");
const seedPath = join(dataDir, "ledger-seed.sql");

function parseCsvDate(yyyymmdd) {
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
}

function rowKey({ ticker, tradeDate, price, quantity, transactionType }) {
  return [ticker, tradeDate, price, quantity, transactionType].join("|");
}

function parseCsv() {
  const lines = readFileSync(csvPath, "utf8").trim().split("\n").slice(1);
  return lines.map((line) => {
    const [ticker, tradeDateRaw, priceRaw, quantityRaw, transactionType] = line.split(";");
    const price = parseFloat(priceRaw);
    const quantity = parseFloat(quantityRaw);
    const tradeDate = parseCsvDate(tradeDateRaw);
    const totalAmount = price * quantity;
    return { ticker, tradeDate, price, quantity, transactionType, totalAmount };
  });
}

const existing = JSON.parse(readFileSync(ledgerPath, "utf8"));
const existingByKey = new Map(
  existing.map((row) => [
    rowKey({
      ticker: row.ticker,
      tradeDate: row.tradeDate,
      price: row.price,
      quantity: row.quantity,
      transactionType: row.transactionType,
    }),
    row,
  ]),
);
let nextId =
  existing.reduce((max, row) => Math.max(max, row.transactionId), 0) + 1;

const csvRows = parseCsv();
const ledger = csvRows.map((row) => {
  const key = rowKey({
    ticker: row.ticker,
    tradeDate: row.tradeDate,
    price: row.price,
    quantity: row.quantity,
    transactionType: row.transactionType,
  });
  const prior = existingByKey.get(key);
  let transactionId = prior?.transactionId;
  if (transactionId === undefined) {
    transactionId = nextId;
    nextId += 1;
  }
  return {
    transactionId,
    ticker: row.ticker,
    tradeDate: row.tradeDate,
    price: row.price,
    quantity: row.quantity,
    transactionType: row.transactionType,
    totalAmount: prior?.totalAmount ?? row.totalAmount,
  };
});

ledger.sort(
  (a, b) =>
    a.tradeDate.localeCompare(b.tradeDate) || a.transactionId - b.transactionId,
);

writeFileSync(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`);

const seedLines = [
  `CREATE TABLE IF NOT EXISTS transactions (
  transaction_id INTEGER PRIMARY KEY,
  ticker TEXT NOT NULL,
  trade_date TEXT NOT NULL,
  price REAL NOT NULL,
  quantity REAL NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('BUY', 'SELL', 'DIVIDEND', 'DEPOSIT', 'WITHDRAWAL', 'FEE')),
  total_amount REAL NOT NULL
);`,
  "DELETE FROM transactions;",
  "",
  ...ledger.map(
    (row) =>
      `INSERT INTO transactions (transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount) VALUES (${row.transactionId}, '${row.ticker}', '${row.tradeDate}', ${row.price}, ${row.quantity}, '${row.transactionType}', ${row.totalAmount});`,
  ),
  "",
];

writeFileSync(seedPath, seedLines.join("\n"));
console.log(`Wrote ${ledgerPath} and ${seedPath} (${ledger.length} rows).`);
