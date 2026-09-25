import dgs3moSnapshot from "../data/dgs3mo.json";
import { listingConsistency } from "./analytics/listingCheck";
import { INSTRUMENT_LISTINGS, listingByTicker } from "./analytics/listings";
import type { PriceBar } from "./analytics/compute";
import type { SplitEvent } from "./analytics/ledger";

const YAHOO_CHART_URL = "https://query1.finance.yahoo.com/v8/finance/chart";
const FRED_DGS3MO_URLS = [
  "https://fred.stlouisfed.org/graph/fredgraph.csv?id=DGS3MO",
  "https://fred.stlouisfed.org/data/DGS3MO.txt",
];
const LOOKBACK_DAYS = 365 * 4 + 14;

export interface StoredPriceBar extends PriceBar {
  source: string;
}

export interface StoredSplit extends SplitEvent {
  source: string;
}

interface YahooChartResult {
  meta?: {
    currency?: string;
    exchangeTimezoneName?: string;
  };
  timestamp?: number[];
  indicators?: {
    quote?: { close?: (number | null)[] }[];
    adjclose?: { adjclose?: (number | null)[] }[];
  };
  events?: {
    splits?: Record<string, { date?: number; numerator?: number; denominator?: number }>;
  };
}

export function tradingDate(unixSeconds: number, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(unixSeconds * 1000));
}

export function requiredHistoryStart(firstTradeDate: string, now = Date.now()): string {
  const lookback = new Date(now - LOOKBACK_DAYS * 86_400_000).toISOString().slice(0, 10);
  return lookback < firstTradeDate ? lookback : firstTradeDate;
}

export async function fetchYahooHistory(
  symbol: string,
  startDate: string,
  endDate: string,
): Promise<{ bars: StoredPriceBar[]; splits: StoredSplit[]; currency: string } | { error: string }> {
  const periodStart = Math.floor(Date.parse(`${startDate}T00:00:00Z`) / 1000);
  const periodEnd = Math.floor(Date.parse(`${endDate}T23:59:59Z`) / 1000);
  const url = `${YAHOO_CHART_URL}/${encodeURIComponent(symbol)}?period1=${periodStart}&period2=${periodEnd}&interval=1d&events=div%7Csplit`;
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { "User-Agent": "portfolio-api/1.0 (camilaescudero.cl)", Accept: "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "network error";
    return { error: `Yahoo request failed for ${symbol}: ${message}` };
  }
  if (!response.ok) {
    return { error: `Yahoo history for ${symbol} returned HTTP ${response.status}.` };
  }
  const payload = (await response.json()) as { chart?: { result?: YahooChartResult[]; error?: { description?: string } } };
  const result = payload.chart?.result?.[0];
  if (result === undefined) {
    return { error: payload.chart?.error?.description ?? `Yahoo history for ${symbol} was empty.` };
  }
  const timeZone = result.meta?.exchangeTimezoneName ?? "America/New_York";
  const currency = result.meta?.currency ?? "";
  const timestamps = result.timestamp ?? [];
  const rawCloses = result.indicators?.quote?.[0]?.close ?? [];
  const adjustedCloses = result.indicators?.adjclose?.[0]?.adjclose ?? [];
  const bars: StoredPriceBar[] = [];
  for (let index = 0; index < timestamps.length; index += 1) {
    const timestamp = timestamps[index];
    const rawClose = rawCloses[index];
    const adjustedClose = adjustedCloses[index];
    if (timestamp === undefined || rawClose === undefined || rawClose === null || !Number.isFinite(rawClose)) {
      continue;
    }
    bars.push({
      ticker: symbol,
      date: tradingDate(timestamp, timeZone),
      rawClose,
      adjustedClose: adjustedClose === undefined || adjustedClose === null || !Number.isFinite(adjustedClose) ? null : adjustedClose,
      currency,
      source: "Yahoo Finance chart API; raw close is split-adjusted, adjusted close reinvests dividends",
    });
  }
  const splits: StoredSplit[] = [];
  for (const split of Object.values(result.events?.splits ?? {})) {
    if (split.date === undefined || split.numerator === undefined || split.denominator === undefined || !(split.denominator > 0)) {
      continue;
    }
    splits.push({
      ticker: symbol,
      exDate: tradingDate(split.date, timeZone),
      shareMultiplier: split.numerator / split.denominator,
      source: "Yahoo Finance chart split events",
    });
  }
  if (bars.length === 0) {
    return { error: `Yahoo history for ${symbol} contained no closes.` };
  }
  return { bars, splits, currency };
}

interface FinnhubCandle {
  s?: string;
  t?: number[];
  c?: number[];
}

interface FinnhubDividend {
  date?: string;
  amount?: number;
}

/**
 * Finnhub daily candles are the existing quote vendor's history endpoint.
 * Returns null when the key is missing, the call fails, or the series does not
 * reach `startDate` — callers then keep the Yahoo series instead of splicing.
 */
export async function fetchFinnhubHistory(
  symbol: string,
  startDate: string,
  endDate: string,
  apiKey: string,
): Promise<{ bars: StoredPriceBar[]; splits: StoredSplit[] } | null> {
  const fromUnix = Math.floor(Date.parse(`${startDate}T00:00:00Z`) / 1000);
  const toUnix = Math.floor(Date.parse(`${endDate}T23:59:59Z`) / 1000);
  const candleUrl = `https://finnhub.io/api/v1/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=D&from=${fromUnix}&to=${toUnix}&token=${encodeURIComponent(apiKey)}`;
  const dividendUrl = `https://finnhub.io/api/v1/stock/dividend?symbol=${encodeURIComponent(symbol)}&from=${startDate}&to=${endDate}&token=${encodeURIComponent(apiKey)}`;
  let candleResponse: Response;
  let dividendResponse: Response;
  try {
    [candleResponse, dividendResponse] = await Promise.all([fetch(candleUrl), fetch(dividendUrl)]);
  } catch {
    return null;
  }
  if (!candleResponse.ok || !dividendResponse.ok) {
    return null;
  }
  const candle = (await candleResponse.json()) as FinnhubCandle;
  if (candle.s !== "ok" || !Array.isArray(candle.t) || !Array.isArray(candle.c) || candle.t.length === 0) {
    return null;
  }
  let dividendPayload: unknown;
  try {
    dividendPayload = await dividendResponse.json();
  } catch {
    return null;
  }
  const dividends = Array.isArray(dividendPayload)
    ? dividendPayload as FinnhubDividend[]
    : Array.isArray((dividendPayload as { data?: unknown }).data)
      ? (dividendPayload as { data: FinnhubDividend[] }).data
      : null;
  if (dividends === null) {
    return null;
  }
  const dividendByDate = new Map<string, number>();
  for (const dividend of dividends) {
    if (dividend.date === undefined || dividend.amount === undefined) {
      continue;
    }
    dividendByDate.set(dividend.date, (dividendByDate.get(dividend.date) ?? 0) + dividend.amount);
  }
  const closes: { date: string; rawClose: number }[] = [];
  for (let index = 0; index < candle.t.length; index += 1) {
    const timestamp = candle.t[index];
    const rawClose = candle.c[index];
    if (timestamp === undefined || rawClose === undefined || !(rawClose > 0)) {
      continue;
    }
    closes.push({ date: new Date(timestamp * 1000).toISOString().slice(0, 10), rawClose });
  }
  closes.sort((left, right) => left.date.localeCompare(right.date));
  const first = closes[0];
  if (first === undefined || first.date > startDate) {
    return null;
  }
  let totalReturn = first.rawClose;
  let previousClose = first.rawClose;
  const bars: StoredPriceBar[] = [{
    ticker: symbol,
    date: first.date,
    rawClose: first.rawClose,
    adjustedClose: totalReturn,
    currency: "USD",
    source: "Finnhub stock/candle; total return rebuilds cash dividends onto the split-adjusted close",
  }];
  for (let index = 1; index < closes.length; index += 1) {
    const point = closes[index];
    if (point === undefined || !(previousClose > 0)) {
      return null;
    }
    const dividend = dividendByDate.get(point.date) ?? 0;
    totalReturn *= (point.rawClose + dividend) / previousClose;
    previousClose = point.rawClose;
    bars.push({
      ticker: symbol,
      date: point.date,
      rawClose: point.rawClose,
      adjustedClose: totalReturn,
      currency: "USD",
      source: "Finnhub stock/candle; total return rebuilds cash dividends onto the split-adjusted close",
    });
  }
  return { bars, splits: [] };
}

export function parseFredDgs3mo(csv: string): { date: string; annualYield: number }[] {
  const rows: { date: string; annualYield: number }[] = [];
  for (const line of csv.split(/\r?\n/).slice(1)) {
    if (line.trim() === "") {
      continue;
    }
    const [date, value] = line.split(",");
    if (date === undefined || value === undefined || value === "." || value.trim() === "") {
      continue;
    }
    const percent = Number(value);
    if (!Number.isFinite(percent)) {
      continue;
    }
    rows.push({ date, annualYield: percent / 100 });
  }
  return rows;
}

export function parseFredDgs3moText(text: string): { date: string; annualYield: number }[] {
  if (text.includes("DATE,DGS3MO") || text.startsWith("DATE,")) {
    return parseFredDgs3mo(text);
  }
  const rows: { date: string; annualYield: number }[] = [];
  for (const line of text.split(/\r?\n/)) {
    const match = line.trim().match(/^(\d{4}-\d{2}-\d{2})\s+(-?\d+(?:\.\d+)?)$/);
    if (match === null) {
      continue;
    }
    const date = match[1];
    const percent = Number(match[2]);
    if (date === undefined || !Number.isFinite(percent)) {
      continue;
    }
    rows.push({ date, annualYield: percent / 100 });
  }
  return rows;
}

export async function fetchFredDgs3mo(): Promise<{ date: string; annualYield: number }[] | { error: string }> {
  const errors: string[] = [];
  for (const url of FRED_DGS3MO_URLS) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "text/csv,text/plain,*/*",
          "User-Agent": "Mozilla/5.0 portfolio-api/1.0",
        },
        signal: AbortSignal.timeout(12_000),
      });
      if (!response.ok) {
        errors.push(`${url} HTTP ${response.status}`);
        continue;
      }
      const rows = parseFredDgs3moText(await response.text());
      if (rows.length > 0) {
        return rows;
      }
      errors.push(`${url} contained no yields`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "network error";
      errors.push(`${url} ${message}`);
    }
  }
  return { error: `FRED request failed: ${errors.join("; ")}` };
}

interface LedgerPrint {
  ticker: string;
  tradeDate: string;
  price: number;
}

export interface SyncedSeries {
  ticker: string;
  bars: StoredPriceBar[];
  splits: StoredSplit[];
  source: string;
  rejectedReason: string | null;
}

export async function seriesForListing(
  ticker: string,
  trades: readonly LedgerPrint[],
  startDate: string,
  endDate: string,
  finnhubApiKey: string | undefined,
): Promise<SyncedSeries | { error: string }> {
  const listing = listingByTicker(ticker);
  if (listing === undefined) {
    return { error: `No listing is configured for ${ticker}, so no price symbol was guessed.` };
  }
  let selected: { bars: StoredPriceBar[]; splits: StoredSplit[] } | null = null;
  if (finnhubApiKey) {
    const finnhub = await fetchFinnhubHistory(listing.ticker, startDate, endDate, finnhubApiKey);
    if (finnhub !== null && finnhub.bars[0]?.currency === listing.currency) {
      selected = finnhub;
    }
  }
  if (selected === null) {
    const yahoo = await fetchYahooHistory(listing.ticker, startDate, endDate);
    if ("error" in yahoo) {
      return { error: yahoo.error };
    }
    if (yahoo.currency !== listing.currency) {
      return {
        error: `Yahoo currency for ${ticker} is ${yahoo.currency || "blank"}, not ${listing.currency}. The series was not stored.`,
      };
    }
    selected = yahoo;
  }
  const closes = new Map<string, number>();
  for (const bar of selected.bars) {
    if (bar.rawClose !== null) {
      closes.set(bar.date, bar.rawClose);
    }
  }
  const tickerTrades = trades.filter((trade) => trade.ticker === ticker);
  const consistency = listingConsistency(
    tickerTrades.map((trade) => ({ tradeDate: trade.tradeDate, price: trade.price })),
    closes,
  );
  if (!consistency.consistent) {
    const gap = consistency.medianAbsoluteGap === null
      ? "no trade date had a close"
      : `${(consistency.medianAbsoluteGap * 100).toFixed(1)}% median gap`;
    return {
      ticker,
      bars: [],
      splits: [],
      source: selected.bars[0]?.source ?? "unavailable",
      rejectedReason: `${listing.name} on ${listing.exchange} was not stored. Ledger trade prices do not match this listing (${gap}).`,
    };
  }
  return {
    ticker,
    bars: selected.bars.map((bar) => ({ ...bar, ticker })),
    splits: selected.splits.map((split) => ({ ...split, ticker })),
    source: selected.bars[0]?.source ?? "unavailable",
    rejectedReason: null,
  };
}

export async function syncMarketData(env: Env): Promise<string> {
  const { results } = await env.DB.prepare(
    "SELECT ticker, trade_date AS tradeDate, price FROM transactions",
  ).all<LedgerPrint>();
  const trades = results ?? [];
  const tickers = new Set<string>([...trades.map((trade) => trade.ticker), "VOO"]);
  const firstTradeDate = trades.map((trade) => trade.tradeDate).sort()[0];
  if (firstTradeDate === undefined) {
    throw new Error("Cannot sync prices because the ledger has no trades.");
  }
  const startDate = requiredHistoryStart(firstTradeDate);
  const endDate = new Date().toISOString().slice(0, 10);
  const notes: string[] = [];
  for (const ticker of [...tickers].sort()) {
    if (!INSTRUMENT_LISTINGS.some((listing) => listing.ticker === ticker)) {
      notes.push(`${ticker}: skipped, no configured listing.`);
      continue;
    }
    const coverage = await env.DB.prepare(
      "SELECT MIN(price_date) AS first_date, MAX(price_date) AS last_date, COUNT(*) AS row_count FROM daily_closes WHERE ticker = ?",
    ).bind(ticker).first<{ first_date: string | null; last_date: string | null; row_count: number }>();
    const recentEnough = new Date(Date.parse(`${endDate}T00:00:00Z`) - 4 * 86_400_000).toISOString().slice(0, 10);
    if (
      coverage !== null &&
      coverage.row_count > 200 &&
      coverage.last_date !== null &&
      coverage.last_date >= recentEnough
    ) {
      notes.push(`${ticker}: ${coverage.row_count} closes already stored through ${coverage.last_date}.`);
      continue;
    }
    const series = await seriesForListing(ticker, trades, startDate, endDate, env.FINNHUB_API_KEY);
    if ("error" in series) {
      notes.push(`${ticker}: ${series.error}`);
      continue;
    }
    await env.DB.prepare("DELETE FROM daily_closes WHERE ticker = ?").bind(ticker).run();
    await env.DB.prepare("DELETE FROM share_splits WHERE ticker = ?").bind(ticker).run();
    if (series.rejectedReason !== null) {
      notes.push(series.rejectedReason);
      continue;
    }
    await insertPrices(env, series.bars);
    await insertSplits(env, series.splits);
    notes.push(`${ticker}: stored ${series.bars.length} closes from ${series.bars[0]?.date ?? "n/a"} (${series.source}).`);
  }

  const yields = await fetchFredDgs3mo();
  if ("error" in yields) {
    const snapshot = dgs3moSnapshot as { date: string; annualYield: number }[];
    await insertYields(env, snapshot, "FRED DGS3MO committed snapshot");
    const last = snapshot[snapshot.length - 1];
    notes.push(`${yields.error} Using the committed DGS3MO snapshot through ${last?.date ?? "n/a"}.`);
  } else {
    await insertYields(env, yields, "FRED DGS3MO");
    const last = yields[yields.length - 1];
    notes.push(`DGS3MO: stored ${yields.length} prints through ${last?.date ?? "n/a"}.`);
  }

  const detail = notes.join(" ");
  const syncedAt = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO market_data_sync (dataset, synced_at, detail)
     VALUES ('market', ?, ?)
     ON CONFLICT(dataset) DO UPDATE SET synced_at = excluded.synced_at, detail = excluded.detail`,
  ).bind(syncedAt, detail).run();
  console.log(JSON.stringify({ event: "market_data_sync", syncedAt, detail }));
  return detail;
}

async function insertPrices(env: Env, bars: readonly StoredPriceBar[]): Promise<void> {
  const chunkSize = 40;
  for (let offset = 0; offset < bars.length; offset += chunkSize) {
    const chunk = bars.slice(offset, offset + chunkSize);
    await env.DB.batch(
      chunk.map((bar) =>
        env.DB.prepare(
          `INSERT INTO daily_closes (ticker, price_date, raw_close, adjusted_close, currency, source)
           VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT(ticker, price_date) DO UPDATE SET
             raw_close = excluded.raw_close,
             adjusted_close = excluded.adjusted_close,
             currency = excluded.currency,
             source = excluded.source`,
        ).bind(bar.ticker, bar.date, bar.rawClose, bar.adjustedClose, bar.currency, bar.source),
      ),
    );
  }
}

async function insertSplits(env: Env, splits: readonly StoredSplit[]): Promise<void> {
  if (splits.length === 0) {
    return;
  }
  await env.DB.batch(
    splits.map((split) =>
      env.DB.prepare(
        `INSERT INTO share_splits (ticker, ex_date, share_multiplier, source)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(ticker, ex_date) DO UPDATE SET
           share_multiplier = excluded.share_multiplier,
           source = excluded.source`,
      ).bind(split.ticker, split.exDate, split.shareMultiplier, split.source),
    ),
  );
}

async function insertYields(
  env: Env,
  yields: readonly { date: string; annualYield: number }[],
  source: string,
): Promise<void> {
  const recent = yields.filter((row) => row.date >= "2022-01-01");
  const chunkSize = 40;
  for (let offset = 0; offset < recent.length; offset += chunkSize) {
    const chunk = recent.slice(offset, offset + chunkSize);
    await env.DB.batch(
      chunk.map((row) =>
        env.DB.prepare(
          `INSERT INTO risk_free_rates (rate_date, annual_yield, series_id, source)
           VALUES (?, ?, 'DGS3MO', ?)
           ON CONFLICT(rate_date) DO UPDATE SET
             annual_yield = excluded.annual_yield,
             series_id = excluded.series_id,
             source = excluded.source`,
        ).bind(row.date, row.annualYield, source),
      ),
    );
  }
}
