import { describe, expect, it } from "vitest";
import type { AnalyticsReport } from "./analytics/compute";
import type { QuotedHolding } from "./holdings";
import {
  toPublicAnalyticsReport,
  toPublicHistoryResponse,
  toPublicPortfolioResponse,
} from "./publicPortfolio";

const quotedHoldings: QuotedHolding[] = [
  {
    ticker: "VOO",
    shares: 1,
    totalCost: 100,
    currentPrice: 110,
    previousCloseChangePercent: -1.25,
    currentValue: 110,
    stale: false,
  },
  {
    ticker: "SHOP",
    shares: 1,
    totalCost: 40,
    currentPrice: 109.42,
    previousCloseChangePercent: null,
    currentValue: 109.42,
    stale: true,
  },
];

function expectAlias(payload: Record<string, unknown>, currentKey: string, deprecatedKey: string) {
  expect(payload).toHaveProperty(currentKey);
  expect(payload).toHaveProperty(deprecatedKey);
  expect(payload[deprecatedKey]).toEqual(payload[currentKey]);
}

describe("public portfolio keys", () => {
  it("serves the new portfolio keys and the deprecated aliases", () => {
    const response = toPublicPortfolioResponse(
      {
        totalValue: 219.42,
        openCostBasisGainPercent: 4.2,
        holdings: quotedHoldings,
        holdingsCount: quotedHoldings.length,
      },
      "2026-11-12T00:00:00.000Z",
    );
    const payload = response as unknown as Record<string, unknown>;
    expectAlias(payload, "openCostBasisGainPercent", "totalReturnPct");
    expectAlias(payload, "holdings", "stocks");
    expectAlias(payload, "holdingsCount", "count");
    expect(response.openCostBasisGainPercent).toBe("4.20");
    expect(response.holdingsCount).toBe(2);

    const live = response.holdings[0] as unknown as Record<string, unknown>;
    const stale = response.holdings[1] as unknown as Record<string, unknown>;
    expectAlias(live, "weightPercent", "allocation");
    expectAlias(live, "previousCloseChangePercent", "changePercent");
    expect(live.previousCloseChangePercent).toBe(-1.25);
    expect(live.weightPercent).toBe("50.1");
    expectAlias(stale, "previousCloseChangePercent", "changePercent");
    expect(stale.previousCloseChangePercent).toBeNull();
    expect(stale.changePercent).not.toBe(0);
    expect(stale.stale).toBe(true);
  });

  it("serves both history keys, with different math under different names", () => {
    const response = toPublicHistoryResponse({
      portfolioHistory: [{ date: "2026-06-15", value: 1000, costBasisGainPercent: 4.2 }],
      monthlyReturns: [{ month: "2026-06", valueChangePercent: -1.5 }],
    });
    const historyPoint = response.portfolioHistory[0] as unknown as Record<string, unknown>;
    const monthPoint = response.monthlyReturns[0] as unknown as Record<string, unknown>;
    expectAlias(historyPoint, "costBasisGainPercent", "returnPct");
    expectAlias(monthPoint, "valueChangePercent", "returnPct");
    expect(historyPoint.costBasisGainPercent).toBe(4.2);
    expect(monthPoint.valueChangePercent).toBe(-1.5);
    expect(historyPoint).not.toHaveProperty("value");
  });

  it("serves both analytics keys and keeps dollar amounts off the payload", () => {
    const report = {
      ledger: {
        dividendRecordCount: 0,
        dividendCaveat: null,
        externalFlowMethod: "inferred_buy_shortfall",
        feeTotal: 3,
        warnings: [],
        listings: [
          {
            ticker: "NET",
            name: "Cloudflare, Inc.",
            exchange: "NYSE",
            currency: "USD",
            distributionPolicy: "none",
            isin: "US18915M1071",
            instrumentKind: "stock",
            identificationNote: "NYSE common stock.",
          },
        ],
      },
      performance: {
        status: "ok",
        asOf: "2026-11-12",
        lookbackStart: "2026-01-13",
        lookbackEnd: "2026-11-12",
        sampleSize: 10,
        source: "test",
        timeWeightedReturn: 0.042,
        annualized: false,
        annualizedTimeWeightedReturn: null,
        annualizationLabel: "not annualized (< 1 yr)",
        calendarDayCount: 200,
        netInvestedReturn: 0.042,
        simpleReturnLabel: "simple, ignores timing",
        netInvested: 1000,
        portfolioValue: 1042,
        benchmark: { status: "unavailable", reasonCode: "missing", reason: "missing", sampleSize: null },
        excessReturn: null,
        excessLabel: "arithmetic difference, percentage points",
        counterfactualValue: 1100,
        counterfactualReason: null,
        maxDrawdown: null,
        skippedValuationDates: 0,
        valuationGapNote: null,
        dailyReturns: [],
        series: [],
      },
      risk: {
        status: "ok",
        asOf: "2026-11-12",
        lookbackStart: "2026-01-16",
        lookbackEnd: "2026-11-07",
        sampleSize: 52,
        source: "test",
        requestedWeeks: 156,
        portfolioVolatility: 0.12,
        weightsSum: 1,
        cashMarketValue: 50,
        cashWeight: 0.05,
        cashTreatment: "excluded from risk weights",
        label: "ex-ante",
        contributions: [
          {
            ticker: "NET",
            weight: 0.5,
            marginalContribution: 0.1,
            componentContribution: 0.05,
            varianceShare: 1.056,
          },
        ],
      },
      sharpe: {
        holdings: { status: "unavailable", reasonCode: "missing", reason: "missing", sampleSize: null },
        realized: { status: "unavailable", reasonCode: "missing", reason: "missing", sampleSize: null },
      },
      exposure: {
        status: "ok",
        asOf: "2026-11-12",
        lookbackStart: null,
        lookbackEnd: null,
        sampleSize: 1,
        source: "test",
        topExposures: [],
        overlap: [],
        largestDirectStock: { ticker: "NET", name: "Cloudflare, Inc.", isin: "US18915M1071", weight: 0.2 },
        largestLookThroughCompany: { name: "Apple Inc.", isin: "US0378331005", weight: 0.15 },
        bondWeight: 0,
        cashWeight: 0.05,
        unattributedWeight: 0,
        snapshotCoverage: [],
      },
    } as unknown as AnalyticsReport;

    const payload = toPublicAnalyticsReport(report) as {
      ledger: { listings: Record<string, unknown>[]; feeTotal?: number };
      performance: Record<string, unknown>;
      risk: Record<string, unknown> & { contributions: Record<string, unknown>[] };
      exposure: Record<string, unknown>;
    };

    expectAlias(payload.performance, "netInvestedReturn", "simpleReturn");
    expect(payload.performance.netInvestedReturn).toBe(0.042);
    expect(payload.performance).not.toHaveProperty("portfolioValue");
    expect(payload.performance).not.toHaveProperty("netInvested");
    expect(payload.performance).not.toHaveProperty("counterfactualValue");

    expectAlias(payload.risk, "cashWeight", "cashWeightOfPortfolio");
    expect(payload.risk).not.toHaveProperty("cashMarketValue");
    expectAlias(payload.risk.contributions[0], "varianceShare", "percentContribution");
    expect(payload.risk.contributions[0].varianceShare).toBe(1.056);

    expectAlias(payload.exposure, "largestDirectStock", "apparentCompany");
    expectAlias(payload.exposure, "largestLookThroughCompany", "effectiveCompany");
    expect(payload.exposure.cashWeight).toBe(0.05);

    expectAlias(payload.ledger.listings[0], "instrumentKind", "kind");
    expect(payload.ledger.listings[0].instrumentKind).toBe("stock");
    expect(payload.ledger).not.toHaveProperty("feeTotal");
  });
});
