import { calendarDaysBetween } from "./dates";
import { computeLookThrough, type ExposurePosition, type FundSnapshot, type LookThroughRow } from "./exposure";
import {
  SHARE_DUST,
  buildLedger,
  externalFlowThroughDate,
  externalFlowsByDate,
  ledgerStateAsOf,
  sharesForSplitAdjustedPrice,
  type DailyLedgerState,
  type LedgerBuild,
  type LedgerTransaction,
  type SplitEvent,
} from "./ledger";
import {
  benchmarkTotalReturn,
  cumulativeBenchmarkPath,
  maximumDrawdown,
  timeWeightedReturn,
  vooCounterfactual,
  type ValuationPoint,
} from "./performance";
import {
  MINIMUM_DAILY_SHARPE_OBSERVATIONS,
  MINIMUM_WEEKLY_OBSERVATIONS,
  fridayToFridayReturns,
  holdingsSharpeRatio,
  matchAnnualYield,
  realizedSharpeRatio,
  riskContributions,
  trailingCommonWeeks,
  weightedReturns,
  type RiskFreeObservation,
} from "./risk";
import { annualizeCumulativeReturn, periodicRiskFreeRate } from "./statistics";

export interface InstrumentListing {
  ticker: string;
  name: string;
  exchange: string;
  currency: string;
  distributionPolicy: "distributing" | "accumulating" | "none";
  isin: string | null;
  kind: "stock" | "equity-fund" | "bond-fund";
  identificationNote: string;
}

export interface PriceBar {
  ticker: string;
  date: string;
  rawClose: number | null;
  adjustedClose: number | null;
  currency: string;
}

export interface FxRate {
  currency: string;
  date: string;
  usdPerUnit: number;
}

export interface AnalyticsInput {
  transactions: readonly LedgerTransaction[];
  listings: readonly InstrumentListing[];
  prices: readonly PriceBar[];
  fxRates: readonly FxRate[];
  riskFreeRates: readonly RiskFreeObservation[];
  splits: readonly SplitEvent[];
  fundSnapshots: readonly FundSnapshot[];
  priceSource: string;
  riskFreeSource: string;
}

export interface UnavailableBlock {
  status: "unavailable";
  reasonCode: string;
  reason: string;
  sampleSize: number | null;
}

export interface AnalyticsReport {
  ledger: {
    dividendRecordCount: number;
    dividendCaveat: string | null;
    externalFlowMethod: LedgerBuild["externalFlowMethod"];
    feeTotal: number;
    warnings: string[];
    listings: InstrumentListing[];
  };
  performance: PerformanceBlock;
  risk: RiskBlock;
  sharpe: SharpeBlock;
  exposure: ExposureBlock;
}

interface PerformanceSeriesPoint {
  date: string;
  portfolioValue: number;
  counterfactualValue: number | null;
  cumulativeTimeWeightedReturn: number;
  cumulativeBenchmarkReturn: number | null;
}

type PerformanceBlock =
  | UnavailableBlock
  | {
      status: "ok";
      asOf: string;
      lookbackStart: string;
      lookbackEnd: string;
      sampleSize: number;
      source: string;
      timeWeightedReturn: number;
      annualized: boolean;
      annualizedTimeWeightedReturn: number | null;
      annualizationLabel: string;
      calendarDayCount: number;
      simpleReturn: number | null;
      simpleReturnLabel: "simple, ignores timing";
      netInvested: number;
      portfolioValue: number;
      benchmark: BenchmarkBlock;
      excessReturn: number | null;
      excessLabel: "arithmetic difference, percentage points";
      counterfactualValue: number | null;
      counterfactualReason: string | null;
      maxDrawdown: { peakDate: string; troughDate: string; drawdown: number } | null;
      skippedValuationDates: number;
      valuationGapNote: string | null;
      dailyReturns: { date: string; dailyReturn: number }[];
      series: PerformanceSeriesPoint[];
    };

type BenchmarkBlock =
  | UnavailableBlock
  | {
      status: "ok";
      timeWeightedReturn: number;
      annualized: boolean;
      annualizedTimeWeightedReturn: number | null;
      annualizationLabel: string;
      asOf: string;
      lookbackStart: string;
      lookbackEnd: string;
      sampleSize: number;
      source: string;
    };

type RiskBlock =
  | UnavailableBlock
  | {
      status: "ok";
      asOf: string;
      lookbackStart: string;
      lookbackEnd: string;
      sampleSize: number;
      source: string;
      requestedWeeks: number;
      portfolioVolatility: number;
      weightsSum: number;
      cashMarketValue: number;
      cashWeightOfPortfolio: number;
      cashTreatment: "excluded from risk weights";
      label: "ex-ante: current weights held fixed, historical covariance, not a forecast";
      contributions: {
        ticker: string;
        weight: number;
        marginalContribution: number;
        componentContribution: number;
        percentContribution: number;
      }[];
    };

interface SharpeWindow {
  asOf: string | null;
  lookbackStart: string | null;
  lookbackEnd: string | null;
  sampleSize: number | null;
  source: string;
}

type SharpeBlock = {
  holdings: UnavailableBlock | {
    status: "ok";
    sharpe: number;
    benchmarkSharpe: number | null;
    benchmarkReason: string | null;
    window: SharpeWindow;
    riskFreeSeries: "DGS3MO";
    method: "current weights on trailing weekly simple returns; arithmetic mean; sample standard deviation; multiplied once by sqrt(52)";
  };
  realized:
    | UnavailableBlock
    | {
        status: "ok";
        sharpe: number;
        window: SharpeWindow;
        riskFreeSeries: "DGS3MO";
        method: "daily time-weighted returns; arithmetic mean; sample standard deviation; multiplied once by sqrt(252)";
      };
};

type ExposureBlock =
  | UnavailableBlock
  | {
      status: "ok";
      asOf: string;
      lookbackStart: string | null;
      lookbackEnd: string | null;
      sampleSize: number;
      source: string;
      topExposures: LookThroughRow[];
      overlap: { fundA: string; fundB: string; overlap: number }[];
      apparentCompany: { ticker: string; name: string; isin: string; weight: number } | null;
      effectiveCompany: { name: string; isin: string; weight: number } | null;
      bondWeight: number;
      cashWeight: number;
      unattributedWeight: number;
      snapshotCoverage: { fundTicker: string; asOf: string; source: string; coverage: number }[];
    };

const DIVIDEND_CAVEAT =
  "The ledger has no dividend records. Sale proceeds are cash, but cash dividends are not. Portfolio return is understated relative to a total-return benchmark. Dividends reinvested inside a fund are not external flows; they affect this portfolio only when they are already in the share price.";

function unavailable(reasonCode: string, reason: string, sampleSize: number | null = null): UnavailableBlock {
  return { status: "unavailable", reasonCode, reason, sampleSize };
}

function priceKey(ticker: string, date: string): string {
  return `${ticker}|${date}`;
}

interface IndexedMarketData {
  rawClose: Map<string, { close: number; currency: string }>;
  adjustedClose: Map<string, number>;
  fx: Map<string, number>;
  dates: string[];
}

function indexMarketData(input: AnalyticsInput): IndexedMarketData {
  const rawClose = new Map<string, { close: number; currency: string }>();
  const adjustedClose = new Map<string, number>();
  const dates = new Set<string>();
  for (const bar of input.prices) {
    dates.add(bar.date);
    if (bar.rawClose !== null && Number.isFinite(bar.rawClose)) {
      rawClose.set(priceKey(bar.ticker, bar.date), { close: bar.rawClose, currency: bar.currency });
    }
    if (bar.adjustedClose !== null && Number.isFinite(bar.adjustedClose)) {
      adjustedClose.set(priceKey(bar.ticker, bar.date), bar.adjustedClose);
    }
  }
  const fx = new Map<string, number>();
  for (const rate of input.fxRates) {
    fx.set(priceKey(rate.currency, rate.date), rate.usdPerUnit);
  }
  return { rawClose, adjustedClose, fx, dates: [...dates].sort() };
}

function listingMap(listings: readonly InstrumentListing[]): Map<string, InstrumentListing> {
  return new Map(listings.map((listing) => [listing.ticker, listing]));
}

interface ValuedDay {
  date: string;
  portfolioValue: number;
  externalFlow: number;
  holdings: { ticker: string; splitAdjustedShares: number; marketValue: number }[];
  cash: number;
}

function valueOnDate(
  date: string,
  state: DailyLedgerState,
  ledger: LedgerBuild,
  input: AnalyticsInput,
  market: IndexedMarketData,
  listings: Map<string, InstrumentListing>,
  previousValuationDate: string | null,
): { ok: true; day: ValuedDay } | { ok: false; reason: string } {
  const holdings: ValuedDay["holdings"] = [];
  let investedValue = 0;
  for (const [ticker, actualShares] of state.actualSharesByTicker) {
    if (Math.abs(actualShares) <= SHARE_DUST) {
      continue;
    }
    if (actualShares < -SHARE_DUST) {
      return { ok: false, reason: `Ledger shares for ${ticker} are negative on ${date}, so the position was not valued.` };
    }
    const listing = listings.get(ticker);
    if (listing === undefined) {
      return { ok: false, reason: `No instrument listing is configured for ${ticker}.` };
    }
    const splitAdjustedShares = sharesForSplitAdjustedPrice(
      actualShares,
      date,
      input.splits.filter((split) => split.ticker === ticker),
    );
    const price = market.rawClose.get(priceKey(ticker, date));
    if (price === undefined) {
      return { ok: false, reason: `Raw close for ${ticker} is missing on ${date}.` };
    }
    if (price.currency !== listing.currency) {
      return {
        ok: false,
        reason: `Price currency for ${ticker} on ${date} is ${price.currency}, not the listing currency ${listing.currency}.`,
      };
    }
    let usdPerUnit = 1;
    if (listing.currency !== "USD") {
      const fxRate = market.fx.get(priceKey(listing.currency, date));
      if (fxRate === undefined) {
        return { ok: false, reason: `USD FX rate for ${listing.currency} is missing on ${date}.` };
      }
      usdPerUnit = fxRate;
    }
    const marketValue = splitAdjustedShares * price.close * usdPerUnit;
    investedValue += marketValue;
    holdings.push({ ticker, splitAdjustedShares, marketValue });
  }

  return {
    ok: true,
    day: {
      date,
      portfolioValue: investedValue + state.cash,
      externalFlow: externalFlowThroughDate(ledger.states, previousValuationDate, date),
      holdings,
      cash: state.cash,
    },
  };
}

function adjustedCloseMap(market: IndexedMarketData, ticker: string): Map<string, number> {
  const closes = new Map<string, number>();
  const prefix = `${ticker}|`;
  for (const [key, close] of market.adjustedClose) {
    if (key.startsWith(prefix)) {
      closes.set(key.slice(prefix.length), close);
    }
  }
  return closes;
}

function totalReturnMap(market: IndexedMarketData, ticker: string): Map<string, number> {
  return adjustedCloseMap(market, ticker);
}

export function computeAnalytics(input: AnalyticsInput): AnalyticsReport {
  const listings = listingMap(input.listings);
  const ledger = buildLedger(input.transactions, input.splits);
  const market = indexMarketData(input);
  const dividendCaveat = ledger.dividendRecordCount === 0 ? DIVIDEND_CAVEAT : null;
  const ledgerSection = {
    dividendRecordCount: ledger.dividendRecordCount,
    dividendCaveat,
    externalFlowMethod: ledger.externalFlowMethod,
    feeTotal: ledger.feeTotal,
    warnings: ledger.warnings,
    listings: [...input.listings],
  };

  if (input.transactions.length === 0) {
    const reason = unavailable("no_transactions", "The ledger has no transactions.", 0);
    return {
      ledger: ledgerSection,
      performance: reason,
      risk: reason,
      sharpe: { holdings: reason, realized: reason },
      exposure: reason,
    };
  }

  const firstTradeDate = [...input.transactions].map((transaction) => transaction.tradeDate).sort()[0];
  if (firstTradeDate === undefined) {
    const reason = unavailable("no_transactions", "The ledger has no transactions.", 0);
    return {
      ledger: ledgerSection,
      performance: reason,
      risk: reason,
      sharpe: { holdings: reason, realized: reason },
      exposure: reason,
    };
  }

  const candidateDates = market.dates.filter((date) => date >= firstTradeDate);
  const valuedDays: ValuedDay[] = [];
  let skippedValuationDates = 0;
  let previousValuationDate: string | null = null;
  let firstSkipReason: string | null = null;
  for (const date of candidateDates) {
    const state = ledgerStateAsOf(ledger.states, date);
    if (state === null) {
      continue;
    }
    const valued = valueOnDate(date, state, ledger, input, market, listings, previousValuationDate);
    if (valued.ok === false) {
      skippedValuationDates += 1;
      if (firstSkipReason === null) {
        firstSkipReason = valued.reason;
      }
      continue;
    }
    valuedDays.push(valued.day);
    previousValuationDate = date;
  }

  const performance = buildPerformance(valuedDays, ledger, market, input.priceSource, skippedValuationDates, firstSkipReason);
  const lastDay = valuedDays[valuedDays.length - 1];
  const risk = lastDay === undefined
    ? unavailable("missing_price", firstSkipReason ?? "No portfolio valuation date had a complete set of raw closes.", 0)
    : buildRisk(lastDay, market, input);
  const sharpe = buildSharpe(performance, risk, input);
  const exposure = lastDay === undefined
    ? unavailable("missing_price", "Exposure needs a complete portfolio valuation.", 0)
    : buildExposure(lastDay, listings, input.fundSnapshots);

  return { ledger: ledgerSection, performance, risk, sharpe, exposure };
}

function buildPerformance(
  valuedDays: readonly ValuedDay[],
  ledger: LedgerBuild,
  market: IndexedMarketData,
  priceSource: string,
  skippedValuationDates: number,
  firstSkipReason: string | null,
): PerformanceBlock {
  if (valuedDays.length === 0) {
    return unavailable(
      "missing_price",
      firstSkipReason ?? "No date had raw closes for every holding.",
      0,
    );
  }
  const points: ValuationPoint[] = valuedDays.map((day) => ({
    date: day.date,
    portfolioValue: day.portfolioValue,
    externalFlow: day.externalFlow,
  }));
  const linked = timeWeightedReturn(points);
  const first = valuedDays[0];
  const last = valuedDays[valuedDays.length - 1];
  if (linked === null || first === undefined || last === undefined) {
    return unavailable(
      "undefined_return",
      "Time-weighted return is undefined because a day's starting value plus external flow was not positive.",
      valuedDays.length,
    );
  }

  const netInvested = externalFlowThroughDate(ledger.states, null, last.date);
  const simpleReturn = netInvested > 0 ? (last.portfolioValue - netInvested) / netInvested : null;
  const totalReturn = totalReturnMap(market, "VOO");
  const firstFlowDate = ledger.states.find((state) => state.externalFlow !== 0)?.date ?? first.date;
  const benchmarkReturn = benchmarkTotalReturn(totalReturn, firstFlowDate, last.date);
  const benchmarkDayCount = calendarDaysBetween(firstFlowDate, last.date);
  let benchmark: BenchmarkBlock;
  if (typeof benchmarkReturn !== "number") {
    benchmark = unavailable("missing_total_return", benchmarkReturn.unavailableReason, null);
  } else {
    const annualizedBenchmark = annualizeCumulativeReturn(benchmarkReturn, benchmarkDayCount);
    benchmark = {
      status: "ok",
      timeWeightedReturn: benchmarkReturn,
      annualized: annualizedBenchmark !== null,
      annualizedTimeWeightedReturn: annualizedBenchmark,
      annualizationLabel: annualizedBenchmark === null ? "not annualized (< 1 yr)" : "annualized, 365-day basis",
      asOf: last.date,
      lookbackStart: firstFlowDate,
      lookbackEnd: last.date,
      sampleSize: totalReturn.size,
      source: `${priceSource}; VOO adjusted close, dividends reinvested`,
    };
  }

  const counterfactual = vooCounterfactual(totalReturn, externalFlowsByDate(ledger.states));
  const counterfactualByDate = new Map<string, number>();
  let counterfactualValue: number | null = null;
  let counterfactualReason: string | null = null;
  if ("unavailableReason" in counterfactual) {
    counterfactualReason = counterfactual.unavailableReason;
  } else {
    counterfactualValue = counterfactual.endValue;
    for (const point of counterfactual.series) {
      counterfactualByDate.set(point.date, point.value);
    }
  }

  const benchmarkPath = typeof benchmarkReturn === "number"
    ? cumulativeBenchmarkPath(totalReturn, firstFlowDate)
    : new Map<string, number>();
  const cumulativeByDate = new Map(linked.cumulativePath.map((point) => [point.date, point.cumulativeReturn]));
  const series: PerformanceSeriesPoint[] = valuedDays.map((day) => ({
    date: day.date,
    portfolioValue: day.portfolioValue,
    counterfactualValue: counterfactualByDate.get(day.date) ?? null,
    cumulativeTimeWeightedReturn: cumulativeByDate.get(day.date) ?? 0,
    cumulativeBenchmarkReturn: benchmarkPath.get(day.date) ?? null,
  }));

  return {
    status: "ok",
    asOf: last.date,
    lookbackStart: first.date,
    lookbackEnd: last.date,
    sampleSize: linked.dailyReturns.length,
    source: priceSource,
    timeWeightedReturn: linked.cumulativeReturn,
    annualized: linked.annualizedReturn !== null,
    annualizedTimeWeightedReturn: linked.annualizedReturn,
    annualizationLabel: linked.annualizationLabel,
    calendarDayCount: linked.calendarDayCount,
    simpleReturn,
    simpleReturnLabel: "simple, ignores timing",
    netInvested,
    portfolioValue: last.portfolioValue,
    benchmark,
    excessReturn: benchmark.status === "ok" ? linked.cumulativeReturn - benchmark.timeWeightedReturn : null,
    excessLabel: "arithmetic difference, percentage points",
    counterfactualValue,
    counterfactualReason,
    maxDrawdown: maximumDrawdown(valuedDays.map((day) => ({ date: day.date, value: day.portfolioValue }))),
    skippedValuationDates,
    valuationGapNote:
      skippedValuationDates > 0
        ? `${skippedValuationDates} sessions were skipped because a raw close or FX rate was missing. Missing prices were not filled.`
        : null,
    dailyReturns: linked.dailyReturns,
    series,
  };
}

function buildRisk(lastDay: ValuedDay, market: IndexedMarketData, input: AnalyticsInput): RiskBlock {
  const risky = lastDay.holdings.filter((holding) => holding.marketValue > 0);
  const invested = risky.reduce((total, holding) => total + holding.marketValue, 0);
  if (!(invested > 0)) {
    return unavailable("no_risky_holdings", "There are no positive-value holdings to weight.", 0);
  }
  const tickers = risky.map((holding) => holding.ticker).sort();
  const weeklyByTicker = new Map(
    tickers.map((ticker) => [ticker, fridayToFridayReturns(adjustedCloseMap(market, ticker))]),
  );
  const common = trailingCommonWeeks(weeklyByTicker, tickers);
  if (common === null) {
    return unavailable("missing_total_return", "Adjusted closes are missing for a current holding.", 0);
  }
  if (common.weekEndingDates.length < MINIMUM_WEEKLY_OBSERVATIONS) {
    return unavailable(
      "insufficient_history",
      `Weekly risk needs at least ${MINIMUM_WEEKLY_OBSERVATIONS} shared Friday-to-Friday returns.`,
      common.weekEndingDates.length,
    );
  }
  const weeklyReturnsByColumn: number[][] = [];
  const weekCount = common.weekEndingDates.length;
  for (let weekIndex = 0; weekIndex < weekCount; weekIndex += 1) {
    const row: number[] = [];
    for (const ticker of tickers) {
      const weeklyReturn = common.returnsByTicker.get(ticker)?.[weekIndex];
      if (weeklyReturn === undefined) {
        return unavailable("missing_total_return", `Weekly return for ${ticker} is missing.`, weekCount);
      }
      row.push(weeklyReturn);
    }
    weeklyReturnsByColumn.push(row);
  }
  const weights = tickers.map((ticker) => {
    const holding = risky.find((candidate) => candidate.ticker === ticker);
    return (holding?.marketValue ?? 0) / invested;
  });
  let contributions;
  try {
    contributions = riskContributions(tickers, weights, weeklyReturnsByColumn);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Risk contribution failed.";
    return unavailable("undefined_return", message, weekCount);
  }
  const start = common.weekEndingDates[0];
  const end = common.weekEndingDates[common.weekEndingDates.length - 1];
  if (start === undefined || end === undefined) {
    return unavailable("insufficient_history", "The weekly sample is empty.", 0);
  }
  const portfolioValue = lastDay.portfolioValue;
  return {
    status: "ok",
    asOf: lastDay.date,
    lookbackStart: start,
    lookbackEnd: end,
    sampleSize: weekCount,
    source: `${input.priceSource}; adjusted closes; sample covariance n-1; annualized × 52`,
    requestedWeeks: 156,
    portfolioVolatility: contributions.annualizedVolatility,
    weightsSum: contributions.weightsSum,
    cashMarketValue: lastDay.cash,
    cashWeightOfPortfolio: portfolioValue > 0 ? lastDay.cash / portfolioValue : 0,
    cashTreatment: "excluded from risk weights",
    label: "ex-ante: current weights held fixed, historical covariance, not a forecast",
    contributions: [...contributions.contributions].sort(
      (left, right) => right.percentContribution - left.percentContribution,
    ),
  };
}

function buildSharpe(
  performance: PerformanceBlock,
  risk: RiskBlock,
  input: AnalyticsInput,
): SharpeBlock {
  const sortedRates = [...input.riskFreeRates].sort((left, right) => left.date.localeCompare(right.date));
  const holdings = buildHoldingsSharpe(risk, input, sortedRates);
  const realized = buildRealizedSharpe(performance, sortedRates, input.riskFreeSource);
  return { holdings, realized };
}

function buildHoldingsSharpe(
  risk: RiskBlock,
  input: AnalyticsInput,
  riskFreeRates: readonly RiskFreeObservation[],
): SharpeBlock["holdings"] {
  if (risk.status !== "ok") {
    return unavailable(risk.reasonCode, `Holdings-based Sharpe uses the weekly risk sample. ${risk.reason}`, risk.sampleSize);
  }
  const market = indexMarketData(input);
  const tickers = risk.contributions.map((contribution) => contribution.ticker);
  const weights = risk.contributions.map((contribution) => contribution.weight);
  const weeklyByTicker = new Map(
    tickers.map((ticker) => [ticker, fridayToFridayReturns(adjustedCloseMap(market, ticker))]),
  );
  const vooWeeks = fridayToFridayReturns(adjustedCloseMap(market, "VOO"));
  weeklyByTicker.set("VOO", vooWeeks);
  const common = trailingCommonWeeks(weeklyByTicker, tickers);
  if (common === null || common.weekEndingDates.length < MINIMUM_WEEKLY_OBSERVATIONS) {
    return unavailable(
      "insufficient_history",
      "Holdings-based Sharpe does not have 52 shared weekly returns.",
      common?.weekEndingDates.length ?? 0,
    );
  }

  const pairedReturns: number[] = [];
  const pairedRiskFree: number[] = [];
  const pairedVoo: number[] = [];
  const pairedDates: string[] = [];
  const vooByDate = new Map(vooWeeks.weekEndingDates.map((date, index) => [date, vooWeeks.returns[index]]));
  for (let index = 0; index < common.weekEndingDates.length; index += 1) {
    const date = common.weekEndingDates[index];
    if (date === undefined) {
      continue;
    }
    const annualYield = matchAnnualYield(riskFreeRates, date);
    if (annualYield === null) {
      continue;
    }
    const week: number[] = [];
    let complete = true;
    for (const ticker of tickers) {
      const weeklyReturn = common.returnsByTicker.get(ticker)?.[index];
      if (weeklyReturn === undefined) {
        complete = false;
        break;
      }
      week.push(weeklyReturn);
    }
    const vooReturn = vooByDate.get(date);
    if (!complete || vooReturn === undefined) {
      continue;
    }
    const portfolioReturn = weightedReturns(weights, [week])[0];
    if (portfolioReturn === undefined) {
      continue;
    }
    pairedReturns.push(portfolioReturn);
    pairedRiskFree.push(periodicRiskFreeRate(annualYield, 52));
    pairedVoo.push(vooReturn);
    pairedDates.push(date);
  }

  if (pairedReturns.length < MINIMUM_WEEKLY_OBSERVATIONS) {
    return unavailable(
      "missing_risk_free",
      "Fewer than 52 weekly returns could be matched to a 3-month T-bill yield.",
      pairedReturns.length,
    );
  }
  const sharpe = holdingsSharpeRatio(pairedReturns, pairedRiskFree);
  const benchmarkSharpe = holdingsSharpeRatio(pairedVoo, pairedRiskFree);
  if (sharpe === null) {
    return unavailable("undefined_return", "Holdings-based excess-return volatility is zero.", pairedReturns.length);
  }
  const start = pairedDates[0];
  const end = pairedDates[pairedDates.length - 1];
  return {
    status: "ok",
    sharpe,
    benchmarkSharpe,
    benchmarkReason: benchmarkSharpe === null ? "VOO excess-return volatility is zero." : null,
    window: {
      asOf: end ?? null,
      lookbackStart: start ?? null,
      lookbackEnd: end ?? null,
      sampleSize: pairedReturns.length,
      source: `${input.priceSource}; ${input.riskFreeSource}`,
    },
    riskFreeSeries: "DGS3MO",
    method: "current weights on trailing weekly simple returns; arithmetic mean; sample standard deviation; multiplied once by sqrt(52)",
  };
}

function buildRealizedSharpe(
  performance: PerformanceBlock,
  riskFreeRates: readonly RiskFreeObservation[],
  riskFreeSource: string,
): SharpeBlock["realized"] {
  if (performance.status !== "ok") {
    return unavailable(performance.reasonCode, performance.reason, performance.sampleSize);
  }
  if (performance.sampleSize < MINIMUM_DAILY_SHARPE_OBSERVATIONS) {
    return unavailable(
      "insufficient_history",
      `insufficient history (n = ${performance.sampleSize})`,
      performance.sampleSize,
    );
  }
  const dailyReturns: number[] = [];
  const dailyRiskFree: number[] = [];
  for (const point of performance.dailyReturns) {
    const annualYield = matchAnnualYield(riskFreeRates, point.date);
    if (annualYield === null) {
      continue;
    }
    dailyReturns.push(point.dailyReturn);
    dailyRiskFree.push(periodicRiskFreeRate(annualYield, 252));
  }
  if (dailyReturns.length < MINIMUM_DAILY_SHARPE_OBSERVATIONS) {
    return unavailable(
      "insufficient_history",
      `insufficient history (n = ${dailyReturns.length})`,
      dailyReturns.length,
    );
  }
  const sharpe = realizedSharpeRatio(dailyReturns, dailyRiskFree);
  if (sharpe === null) {
    return unavailable("undefined_return", "Realized excess-return volatility is zero.", dailyReturns.length);
  }
  return {
    status: "ok",
    sharpe,
    window: {
      asOf: performance.asOf,
      lookbackStart: performance.lookbackStart,
      lookbackEnd: performance.lookbackEnd,
      sampleSize: dailyReturns.length,
      source: `${performance.source}; ${riskFreeSource}`,
    },
    riskFreeSeries: "DGS3MO",
    method: "daily time-weighted returns; arithmetic mean; sample standard deviation; multiplied once by sqrt(252)",
  };
}

function buildExposure(
  lastDay: ValuedDay,
  listings: Map<string, InstrumentListing>,
  snapshots: readonly FundSnapshot[],
): ExposureBlock {
  if (!(lastDay.portfolioValue > 0)) {
    return unavailable("undefined_return", "Portfolio value is not positive, so weights are undefined.", 0);
  }
  const positions: ExposurePosition[] = [];
  for (const holding of lastDay.holdings) {
    const listing = listings.get(holding.ticker);
    if (listing === undefined) {
      return unavailable("missing_listing", `No instrument listing is configured for ${holding.ticker}.`, null);
    }
    positions.push({
      ticker: holding.ticker,
      weight: holding.marketValue / lastDay.portfolioValue,
      isin: listing.isin,
      assetClass: listing.kind,
      name: listing.name,
    });
  }
  const lookThrough = computeLookThrough(positions, snapshots);
  const earliestSnapshot = lookThrough.snapshotCoverage.map((coverage) => coverage.asOf).sort()[0] ?? null;
  const latestSnapshot = lookThrough.snapshotCoverage.map((coverage) => coverage.asOf).sort().at(-1) ?? null;
  return {
    status: "ok",
    asOf: lastDay.date,
    lookbackStart: earliestSnapshot,
    lookbackEnd: latestSnapshot,
    sampleSize: lookThrough.rows.length,
    source: "issuer holdings snapshots matched by ISIN; weights are current market value over total portfolio value",
    topExposures: lookThrough.rows.slice(0, 15),
    overlap: lookThrough.overlap,
    apparentCompany: lookThrough.apparentCompany,
    effectiveCompany: lookThrough.effectiveCompany,
    bondWeight: lookThrough.bondWeight,
    cashWeight: lastDay.cash / lastDay.portfolioValue,
    unattributedWeight: lookThrough.unattributedWeight,
    snapshotCoverage: lookThrough.snapshotCoverage,
  };
}
