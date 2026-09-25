import { computeAnalytics, type AnalyticsReport, type PriceBar } from "./compute";
import type { LedgerTransaction, SplitEvent, TransactionType } from "./ledger";
import { INSTRUMENT_LISTINGS } from "./listings";
import type { RiskFreeObservation } from "./risk";
import { FUND_SNAPSHOTS } from "./snapshots";

const LEDGER_TYPES = new Set<TransactionType>(["BUY", "SELL", "DIVIDEND", "DEPOSIT", "WITHDRAWAL", "FEE"]);

interface TransactionRow {
  transaction_id: number;
  ticker: string;
  trade_date: string;
  price: number;
  quantity: number;
  transaction_type: string;
  total_amount: number;
}

interface PriceRow {
  ticker: string;
  price_date: string;
  raw_close: number | null;
  adjusted_close: number | null;
  currency: string;
  source: string;
}

interface SplitRow {
  ticker: string;
  ex_date: string;
  share_multiplier: number;
}

interface YieldRow {
  rate_date: string;
  annual_yield: number;
}

async function readPages<T>(env: Env, sql: string): Promise<T[]> {
  const rows: T[] = [];
  const pageSize = 2000;
  for (let offset = 0; offset < 100_000; offset += pageSize) {
    const page = await env.DB.prepare(`${sql} LIMIT ${pageSize} OFFSET ${offset}`).all<T>();
    const batch = page.results ?? [];
    rows.push(...batch);
    if (batch.length < pageSize) {
      break;
    }
  }
  return rows;
}

function ledgerTransaction(row: TransactionRow): LedgerTransaction | null {
  if (!LEDGER_TYPES.has(row.transaction_type as TransactionType)) {
    return null;
  }
  return {
    transactionId: row.transaction_id,
    ticker: row.ticker,
    tradeDate: row.trade_date,
    price: Number(row.price),
    quantity: Number(row.quantity),
    transactionType: row.transaction_type as TransactionType,
    totalAmount: Number(row.total_amount),
  };
}

export async function buildAnalyticsReport(env: Env): Promise<AnalyticsReport> {
  const transactions = (await readPages<TransactionRow>(
    env,
    `SELECT transaction_id, ticker, trade_date, price, quantity, transaction_type, total_amount
     FROM transactions
     ORDER BY trade_date, transaction_id`,
  )).map(ledgerTransaction).filter((transaction): transaction is LedgerTransaction => transaction !== null);

  const priceRows = await readPages<PriceRow>(
    env,
    `SELECT ticker, price_date, raw_close, adjusted_close, currency, source
     FROM daily_closes
     ORDER BY ticker, price_date`,
  );
  const splitRows = await readPages<SplitRow>(
    env,
    `SELECT ticker, ex_date, share_multiplier FROM share_splits ORDER BY ticker, ex_date`,
  );
  const yieldRows = await readPages<YieldRow & { source: string }>(
    env,
    `SELECT rate_date, annual_yield, source FROM risk_free_rates ORDER BY rate_date`,
  );

  const prices: PriceBar[] = priceRows.map((row) => ({
    ticker: row.ticker,
    date: row.price_date,
    rawClose: row.raw_close,
    adjustedClose: row.adjusted_close,
    currency: row.currency,
  }));
  const splits: SplitEvent[] = splitRows.map((row) => ({
    ticker: row.ticker,
    exDate: row.ex_date,
    shareMultiplier: row.share_multiplier,
  }));
  const riskFreeRates: RiskFreeObservation[] = yieldRows.map((row) => ({
    date: row.rate_date,
    annualYield: row.annual_yield,
  }));
  const sources = [...new Set(priceRows.map((row) => row.source))];
  const priceSource = sources.length > 0 ? sources.join(" | ") : "D1 daily_closes is empty";

  return computeAnalytics({
    transactions,
    listings: INSTRUMENT_LISTINGS,
    prices,
    fxRates: [],
    riskFreeRates,
    splits,
    fundSnapshots: FUND_SNAPSHOTS,
    priceSource,
    riskFreeSource: yieldRows.length > 0 ? [...new Set(yieldRows.map((row) => row.source))].join(" | ") : "FRED DGS3MO is not loaded",
  });
}
