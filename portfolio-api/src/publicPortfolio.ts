import type { AnalyticsReport } from "./analytics/compute";
import type { MonthlyReturnPoint, PortfolioHistoryPoint } from "./history";
import type { QuotedHolding } from "./holdings";

/**
 * Transition payloads include each new key and the key it replaces.
 * The deprecated key carries the same value. Remove it after clients switch.
 *
 * totalReturnPct → openCostBasisGainPercent
 * stocks → holdings
 * count → holdingsCount
 * changePercent → previousCloseChangePercent
 * allocation → weightPercent
 * portfolioHistory.returnPct → costBasisGainPercent
 * monthlyReturns.returnPct → valueChangePercent
 * percentContribution → varianceShare
 * apparentCompany → largestDirectStock
 * effectiveCompany → largestLookThroughCompany
 * simpleReturn → netInvestedReturn
 * cashWeightOfPortfolio → cashWeight
 * listings.kind → instrumentKind
 */

/** Public holding row: weights and returns only — no shares or dollar amounts. */
export interface PublicHolding {
  ticker: string;
  currentPrice: number;
  previousCloseChangePercent: number | null;
  /** @deprecated Use previousCloseChangePercent. Null means the day change is unavailable, not 0. */
  changePercent: number | null;
  stale: boolean;
  /** Percent points of portfolio value. "12.3" means 12.3%. */
  weightPercent: string;
  /** @deprecated Use weightPercent. Same percent-point string. */
  allocation: string;
  gainPercent: string;
}

export interface PublicPortfolioResponse {
  openCostBasisGainPercent: string;
  /** @deprecated Use openCostBasisGainPercent. Open-lot gain versus remaining cost, in percent points. */
  totalReturnPct: string;
  holdings: PublicHolding[];
  /** @deprecated Use holdings. */
  stocks: PublicHolding[];
  aiInsight: null;
  lastUpdated: string;
  holdingsCount: number;
  /** @deprecated Use holdingsCount. */
  count: number;
  aiModels: { id: string; label: string }[];
}

export function toPublicHoldings(
  holdings: readonly QuotedHolding[],
  totalValue: number,
): PublicHolding[] {
  return holdings.map((holding) => {
    const weightPercent =
      totalValue > 0 ? ((holding.currentValue / totalValue) * 100).toFixed(1) : "0.0";
    const gainPercent =
      holding.totalCost > 0
        ? (((holding.currentValue - holding.totalCost) / holding.totalCost) * 100).toFixed(2)
        : "0.00";
    return {
      ticker: holding.ticker,
      currentPrice: holding.currentPrice,
      previousCloseChangePercent: holding.previousCloseChangePercent,
      /** @deprecated Use previousCloseChangePercent. */
      changePercent: holding.previousCloseChangePercent,
      stale: holding.stale,
      weightPercent,
      /** @deprecated Use weightPercent. */
      allocation: weightPercent,
      gainPercent,
    };
  });
}

export function toPublicPortfolioResponse(
  snapshot: {
    totalValue: number;
    openCostBasisGainPercent: number;
    holdings: QuotedHolding[];
    holdingsCount: number;
  },
  lastUpdated: string,
): PublicPortfolioResponse {
  const openCostBasisGainPercent = snapshot.openCostBasisGainPercent.toFixed(2);
  const holdings = toPublicHoldings(snapshot.holdings, snapshot.totalValue);
  return {
    openCostBasisGainPercent,
    /** @deprecated Use openCostBasisGainPercent. */
    totalReturnPct: openCostBasisGainPercent,
    holdings,
    /** @deprecated Use holdings. */
    stocks: holdings,
    aiInsight: null,
    lastUpdated,
    holdingsCount: snapshot.holdingsCount,
    /** @deprecated Use holdingsCount. */
    count: snapshot.holdingsCount,
    aiModels: [{ id: "grok", label: "Grok (xAI)" }],
  };
}

/**
 * Strip absolute dollar amounts and anything that reconstructs invested capital
 * from the public analytics JSON. Math stays in compute(); this is response-only.
 * Deprecated keys are duplicates of the keys above them.
 */
export function toPublicAnalyticsReport(report: AnalyticsReport): unknown {
  const performance =
    report.performance.status === "ok"
      ? {
          status: report.performance.status,
          asOf: report.performance.asOf,
          lookbackStart: report.performance.lookbackStart,
          lookbackEnd: report.performance.lookbackEnd,
          sampleSize: report.performance.sampleSize,
          source: report.performance.source,
          timeWeightedReturn: report.performance.timeWeightedReturn,
          annualized: report.performance.annualized,
          annualizedTimeWeightedReturn: report.performance.annualizedTimeWeightedReturn,
          annualizationLabel: report.performance.annualizationLabel,
          calendarDayCount: report.performance.calendarDayCount,
          netInvestedReturn: report.performance.netInvestedReturn,
          /** @deprecated Use netInvestedReturn. Same decimal. */
          simpleReturn: report.performance.netInvestedReturn,
          simpleReturnLabel: report.performance.simpleReturnLabel,
          benchmark: report.performance.benchmark,
          excessReturn: report.performance.excessReturn,
          excessLabel: report.performance.excessLabel,
          maxDrawdown: report.performance.maxDrawdown,
          skippedValuationDates: report.performance.skippedValuationDates,
          valuationGapNote: report.performance.valuationGapNote,
          dailyReturns: report.performance.dailyReturns,
          series: report.performance.series.map((point) => ({
            date: point.date,
            cumulativeTimeWeightedReturn: point.cumulativeTimeWeightedReturn,
            cumulativeBenchmarkReturn: point.cumulativeBenchmarkReturn,
          })),
        }
      : report.performance;

  const risk =
    report.risk.status === "ok"
      ? {
          status: report.risk.status,
          asOf: report.risk.asOf,
          lookbackStart: report.risk.lookbackStart,
          lookbackEnd: report.risk.lookbackEnd,
          sampleSize: report.risk.sampleSize,
          source: report.risk.source,
          requestedWeeks: report.risk.requestedWeeks,
          portfolioVolatility: report.risk.portfolioVolatility,
          weightsSum: report.risk.weightsSum,
          cashWeight: report.risk.cashWeight,
          /** @deprecated Use cashWeight. Same cash / portfolio-value fraction. */
          cashWeightOfPortfolio: report.risk.cashWeight,
          cashTreatment: report.risk.cashTreatment,
          label: report.risk.label,
          contributions: report.risk.contributions.map((row) => ({
            ticker: row.ticker,
            weight: row.weight,
            marginalContribution: row.marginalContribution,
            componentContribution: row.componentContribution,
            varianceShare: row.varianceShare,
            /** @deprecated Use varianceShare. Not bounded to [0, 1]. */
            percentContribution: row.varianceShare,
          })),
        }
      : report.risk;

  const exposure =
    report.exposure.status === "ok"
      ? {
          ...report.exposure,
          /** @deprecated Use largestDirectStock. */
          apparentCompany: report.exposure.largestDirectStock,
          /** @deprecated Use largestLookThroughCompany. */
          effectiveCompany: report.exposure.largestLookThroughCompany,
        }
      : report.exposure;

  return {
    ledger: {
      dividendRecordCount: report.ledger.dividendRecordCount,
      dividendCaveat: report.ledger.dividendCaveat,
      externalFlowMethod: report.ledger.externalFlowMethod,
      warnings: report.ledger.warnings,
      listings: report.ledger.listings.map((listing) => ({
        ...listing,
        /** @deprecated Use instrumentKind. */
        kind: listing.instrumentKind,
      })),
    },
    performance,
    risk,
    sharpe: report.sharpe,
    exposure,
  };
}

export function toPublicHistoryResponse(history: {
  portfolioHistory: PortfolioHistoryPoint[];
  monthlyReturns: MonthlyReturnPoint[];
}): {
  portfolioHistory: { date: string; costBasisGainPercent: number; returnPct: number }[];
  monthlyReturns: { month: string; valueChangePercent: number; returnPct: number }[];
  lastUpdated: string;
} {
  return {
    portfolioHistory: history.portfolioHistory.map((point) => ({
      date: point.date,
      costBasisGainPercent: point.costBasisGainPercent,
      /** @deprecated Use costBasisGainPercent. Marked value versus remaining cost, in percent points. */
      returnPct: point.costBasisGainPercent,
    })),
    monthlyReturns: history.monthlyReturns.map((point) => ({
      month: point.month,
      valueChangePercent: point.valueChangePercent,
      /** @deprecated Use valueChangePercent. First marked value in the month to the last, in percent points. */
      returnPct: point.valueChangePercent,
    })),
    lastUpdated: new Date().toISOString(),
  };
}
