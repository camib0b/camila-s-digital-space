import type { Holding } from "./aiInsight";
import type { AnalyticsReport } from "./analytics/compute";
import type { MonthlyReturnPoint, PortfolioHistoryPoint } from "./history";

/** Public holding row: weights and returns only — no shares or dollar amounts. */
export interface PublicHolding {
  ticker: string;
  currentPrice: number;
  changePercent: number;
  stale: boolean;
  allocation: string;
  gainPercent: string;
}

export interface PublicPortfolioResponse {
  totalReturnPct: string;
  stocks: PublicHolding[];
  aiInsight: null;
  lastUpdated: string;
  count: number;
  aiModels: { id: string; label: string }[];
}

export function toPublicHoldings(holdings: readonly Holding[], totalValue: number): PublicHolding[] {
  return holdings.map((holding) => ({
    ticker: holding.ticker,
    currentPrice: holding.currentPrice,
    changePercent: holding.changePercent,
    stale: holding.stale,
    allocation:
      totalValue > 0 ? ((holding.currentValue / totalValue) * 100).toFixed(1) : "0.0",
    gainPercent:
      holding.totalCost > 0
        ? (((holding.currentValue - holding.totalCost) / holding.totalCost) * 100).toFixed(2)
        : "0.00",
  }));
}

export function toPublicPortfolioResponse(
  snapshot: {
    totalValue: number;
    totalReturnPct: number;
    holdings: Holding[];
    holdingsCount: number;
  },
  lastUpdated: string,
): PublicPortfolioResponse {
  return {
    totalReturnPct: snapshot.totalReturnPct.toFixed(2),
    stocks: toPublicHoldings(snapshot.holdings, snapshot.totalValue),
    aiInsight: null,
    lastUpdated,
    count: snapshot.holdingsCount,
    aiModels: [{ id: "grok", label: "Grok (xAI)" }],
  };
}

/**
 * Strip absolute dollar amounts and anything that reconstructs invested capital
 * from the public analytics JSON. Math stays in compute(); this is response-only.
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
          simpleReturn: report.performance.simpleReturn,
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
          cashWeightOfPortfolio: report.risk.cashWeightOfPortfolio,
          cashTreatment: report.risk.cashTreatment,
          label: report.risk.label,
          contributions: report.risk.contributions,
        }
      : report.risk;

  return {
    ledger: {
      dividendRecordCount: report.ledger.dividendRecordCount,
      dividendCaveat: report.ledger.dividendCaveat,
      externalFlowMethod: report.ledger.externalFlowMethod,
      warnings: report.ledger.warnings,
      listings: report.ledger.listings,
    },
    performance,
    risk,
    sharpe: report.sharpe,
    exposure: report.exposure,
  };
}

export function toPublicHistoryResponse(history: {
  portfolioHistory: PortfolioHistoryPoint[];
  monthlyReturns: MonthlyReturnPoint[];
}): {
  portfolioHistory: { date: string; returnPct: number }[];
  monthlyReturns: MonthlyReturnPoint[];
  lastUpdated: string;
} {
  return {
    portfolioHistory: history.portfolioHistory.map((point) => ({
      date: point.date,
      returnPct: point.returnPct,
    })),
    monthlyReturns: history.monthlyReturns,
    lastUpdated: new Date().toISOString(),
  };
}
