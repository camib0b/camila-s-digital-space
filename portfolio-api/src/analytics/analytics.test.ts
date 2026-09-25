import { describe, expect, it } from "vitest";
import { computeAnalytics, type AnalyticsInput, type InstrumentListing, type PriceBar } from "./compute";
import { cusipToIsin } from "./identifiers";
import { buildLedger, type LedgerTransaction } from "./ledger";
import { pairwiseOverlap } from "./exposure";
import { listingConsistency } from "./listingCheck";
import { parseFredDgs3moText } from "../marketData";
import { holdingsSharpeRatio, riskContributions } from "./risk";
import { periodicRiskFreeRate } from "./statistics";

function listing(ticker: string, kind: InstrumentListing["kind"] = "stock"): InstrumentListing {
  return {
    ticker,
    name: ticker,
    exchange: "TEST",
    currency: "USD",
    distributionPolicy: kind === "stock" ? "none" : "distributing",
    isin: null,
    kind,
    identificationNote: "Synthetic listing for tests.",
  };
}

function trade(partial: LedgerTransaction): LedgerTransaction {
  return partial;
}

function closes(ticker: string, points: readonly { date: string; close: number }[]): PriceBar[] {
  return points.map((point) => ({
    ticker,
    date: point.date,
    rawClose: point.close,
    adjustedClose: point.close,
    currency: "USD",
  }));
}

function analyze(overrides: Partial<AnalyticsInput> & Pick<AnalyticsInput, "transactions" | "prices">): ReturnType<typeof computeAnalytics> {
  return computeAnalytics({
    listings: overrides.listings ?? [listing("TEST"), listing("VOO", "equity-fund")],
    fxRates: [],
    riskFreeRates: [],
    splits: [],
    fundSnapshots: [],
    priceSource: "test",
    riskFreeSource: "test",
    ...overrides,
  });
}

describe("time-weighted return", () => {
  it("is unchanged by a later deposit when prices do not move", () => {
    const prices = closes("TEST", [
      { date: "2024-06-03", close: 10 },
      { date: "2024-06-04", close: 11 },
      { date: "2024-06-05", close: 11 },
    ]);
    const withoutDeposit = analyze({
      transactions: [
        trade({
          transactionId: 1,
          ticker: "TEST",
          tradeDate: "2024-06-03",
          price: 10,
          quantity: 10,
          transactionType: "BUY",
          totalAmount: 100,
        }),
      ],
      prices,
      listings: [listing("TEST")],
    });
    const withDeposit = analyze({
      transactions: [
        trade({
          transactionId: 1,
          ticker: "TEST",
          tradeDate: "2024-06-03",
          price: 10,
          quantity: 10,
          transactionType: "BUY",
          totalAmount: 100,
        }),
        trade({
          transactionId: 2,
          ticker: "TEST",
          tradeDate: "2024-06-05",
          price: 11,
          quantity: 5,
          transactionType: "BUY",
          totalAmount: 55,
        }),
      ],
      prices,
      listings: [listing("TEST")],
    });
    expect(withoutDeposit.performance.status).toBe("ok");
    expect(withDeposit.performance.status).toBe("ok");
    if (withoutDeposit.performance.status !== "ok" || withDeposit.performance.status !== "ok") {
      return;
    }
    expect(withDeposit.performance.timeWeightedReturn).toBeCloseTo(withoutDeposit.performance.timeWeightedReturn, 12);
    expect(withDeposit.performance.timeWeightedReturn).toBeCloseTo(0.1, 12);
    expect(withDeposit.performance.annualizationLabel).toBe("not annualized (< 1 yr)");
    expect(withDeposit.performance.annualizedTimeWeightedReturn).toBeNull();
  });

  it("does not depend on the size of the external flow", () => {
    const prices = closes("TEST", [
      { date: "2024-06-03", close: 10 },
      { date: "2024-06-04", close: 12 },
    ]);
    const small = analyze({
      transactions: [
        trade({
          transactionId: 1,
          ticker: "TEST",
          tradeDate: "2024-06-03",
          price: 10,
          quantity: 4,
          transactionType: "BUY",
          totalAmount: 40,
        }),
      ],
      prices,
      listings: [listing("TEST")],
    });
    const large = analyze({
      transactions: [
        trade({
          transactionId: 1,
          ticker: "TEST",
          tradeDate: "2024-06-03",
          price: 10,
          quantity: 40,
          transactionType: "BUY",
          totalAmount: 400,
        }),
      ],
      prices,
      listings: [listing("TEST")],
    });
    expect(small.performance.status).toBe("ok");
    expect(large.performance.status).toBe("ok");
    if (small.performance.status !== "ok" || large.performance.status !== "ok") {
      return;
    }
    expect(large.performance.timeWeightedReturn).toBeCloseTo(small.performance.timeWeightedReturn, 12);
    expect(large.performance.portfolioValue).toBeCloseTo(small.performance.portfolioValue * 10, 8);
  });

  it("treats a fee as a value reduction and not as an external flow", () => {
    const report = analyze({
      transactions: [
        trade({
          transactionId: 1,
          ticker: "TEST",
          tradeDate: "2024-06-03",
          price: 10,
          quantity: 10,
          transactionType: "BUY",
          totalAmount: 100,
        }),
        trade({
          transactionId: 2,
          ticker: "TEST",
          tradeDate: "2024-06-04",
          price: 0,
          quantity: 0,
          transactionType: "FEE",
          totalAmount: 10,
        }),
      ],
      prices: closes("TEST", [
        { date: "2024-06-03", close: 10 },
        { date: "2024-06-04", close: 10 },
      ]),
      listings: [listing("TEST")],
    });
    expect(report.performance.status).toBe("ok");
    if (report.performance.status !== "ok") {
      return;
    }
    expect(report.performance.timeWeightedReturn).toBeCloseTo(-0.1, 12);
    expect(report.performance.netInvested).toBeCloseTo(100, 8);
    expect(report.ledger.feeTotal).toBe(10);
  });

  it("lets same-day sale proceeds fund same-day buys", () => {
    const ledger = buildLedger(
      [
        trade({
          transactionId: 1,
          ticker: "VOO",
          tradeDate: "2024-06-03",
          price: 100,
          quantity: 1,
          transactionType: "BUY",
          totalAmount: 100,
        }),
        trade({
          transactionId: 2,
          ticker: "VOO",
          tradeDate: "2024-06-04",
          price: 195,
          quantity: 1,
          transactionType: "SELL",
          totalAmount: 195,
        }),
        trade({
          transactionId: 3,
          ticker: "NET",
          tradeDate: "2024-06-04",
          price: 11,
          quantity: 1,
          transactionType: "BUY",
          totalAmount: 11,
        }),
      ],
      [],
    );
    const rebalanceDay = ledger.states.find((state) => state.date === "2024-06-04");
    expect(rebalanceDay?.externalFlow).toBeCloseTo(0, 8);
    expect(rebalanceDay?.cash).toBeCloseTo(184, 8);
  });
});

describe("VOO benchmark and counterfactual", () => {
  const dates = [
    { date: "2024-01-05", close: 100 },
    { date: "2024-01-08", close: 110 },
    { date: "2024-01-09", close: 121 },
  ];

  it("matches benchmark TWR and counterfactual value for a 100% VOO portfolio", () => {
    const report = analyze({
      transactions: [
        trade({
          transactionId: 1,
          ticker: "VOO",
          tradeDate: "2024-01-05",
          price: 100,
          quantity: 1,
          transactionType: "BUY",
          totalAmount: 100,
        }),
      ],
      prices: closes("VOO", dates),
      listings: [listing("VOO", "equity-fund")],
    });
    expect(report.performance.status).toBe("ok");
    if (report.performance.status !== "ok" || report.performance.benchmark.status !== "ok") {
      throw new Error("expected a complete VOO performance block");
    }
    expect(report.performance.timeWeightedReturn).toBeCloseTo(report.performance.benchmark.timeWeightedReturn, 12);
    expect(report.performance.timeWeightedReturn).toBeCloseTo(0.21, 12);
    expect(report.performance.counterfactualValue).toBeCloseTo(report.performance.portfolioValue, 8);
    expect(report.performance.excessReturn).toBeCloseTo(0, 12);
  });

  it("grows a single deposit with the total-return index", () => {
    const report = analyze({
      transactions: [
        trade({
          transactionId: 1,
          ticker: "VOO",
          tradeDate: "2024-01-05",
          price: 100,
          quantity: 2,
          transactionType: "BUY",
          totalAmount: 200,
        }),
      ],
      prices: closes("VOO", dates),
      listings: [listing("VOO", "equity-fund")],
    });
    if (report.performance.status !== "ok") {
      throw new Error("expected performance");
    }
    const deposit = 200;
    const totalReturnNow = 121;
    const totalReturnAtDeposit = 100;
    expect(report.performance.counterfactualValue).toBeCloseTo(deposit * totalReturnNow / totalReturnAtDeposit, 8);
  });
});

describe("splits", () => {
  it("values split-adjusted closes with split-adjusted share counts", () => {
    const report = analyze({
      transactions: [
        trade({
          transactionId: 1,
          ticker: "SPLIT",
          tradeDate: "2024-01-02",
          price: 100,
          quantity: 10,
          transactionType: "BUY",
          totalAmount: 1000,
        }),
      ],
      splits: [{ ticker: "SPLIT", exDate: "2024-01-08", shareMultiplier: 2 }],
      prices: closes("SPLIT", [
        { date: "2024-01-02", close: 50 },
        { date: "2024-01-03", close: 50 },
        { date: "2024-01-08", close: 55 },
      ]),
      listings: [listing("SPLIT")],
    });
    if (report.performance.status !== "ok") {
      throw new Error("expected performance");
    }
    expect(report.performance.series[0]?.portfolioValue).toBeCloseTo(1000, 8);
    expect(report.performance.portfolioValue).toBeCloseTo(1100, 8);
    expect(report.performance.timeWeightedReturn).toBeCloseTo(0.1, 12);
  });
});

describe("missing data", () => {
  it("does not replace a missing close with zero", () => {
    const report = analyze({
      transactions: [
        trade({
          transactionId: 1,
          ticker: "TEST",
          tradeDate: "2024-06-03",
          price: 10,
          quantity: 1,
          transactionType: "BUY",
          totalAmount: 10,
        }),
      ],
      prices: [
        {
          ticker: "TEST",
          date: "2024-06-03",
          rawClose: null,
          adjustedClose: null,
          currency: "USD",
        },
      ],
      listings: [listing("TEST")],
    });
    expect(report.performance.status).toBe("unavailable");
    if (report.performance.status === "unavailable") {
      expect(report.performance.reason.toLowerCase()).not.toContain("zero");
      expect(report.performance.reason).toMatch(/missing/i);
    }
  });
});

describe("risk contribution and Sharpe", () => {
  /**
   * Spreadsheet oracle, 5 weekly simple returns, weights 50/30/20, sample covariance n-1.
   * Asset A: 0.01, 0.02, -0.01, 0.03, 0.00
   * Asset B: 0.00, 0.01, 0.02, -0.01, 0.015
   * Asset C: -0.02, 0.00, 0.01, 0.01, -0.005
   * Risk-free annual yield 4% flat, converted with (1.04)^(1/52)-1.
   */
  const weeklyReturns = [
    [0.01, 0.0, -0.02],
    [0.02, 0.01, 0.0],
    [-0.01, 0.02, 0.01],
    [0.03, -0.01, 0.01],
    [0.0, 0.015, -0.005],
  ];
  const weights = [0.5, 0.3, 0.2];

  it("matches a hand-checked three-asset covariance and Sharpe", () => {
    const result = riskContributions(["A", "B", "C"], weights, weeklyReturns);
    expect(result.weightsSum).toBeCloseTo(1, 12);
    expect(Math.abs(result.componentContributionSum - result.annualizedVolatility)).toBeLessThan(1e-9);
    expect(Math.abs(result.percentContributionSum - 1)).toBeLessThan(1e-9);
    expect(result.annualizedVolatility).toBeCloseTo(0.04404089009091, 8);
    expect(result.contributions[0]?.componentContribution).toBeCloseTo(0.04649088598739, 8);
    expect(result.contributions[1]?.componentContribution).toBeCloseTo(-0.01230901552809, 8);
    expect(result.contributions[2]?.componentContribution).toBeCloseTo(0.00985901963161, 8);
    expect(result.contributions[0]?.percentContribution).toBeCloseTo(1.05563002681, 8);
    expect(result.contributions[1]?.percentContribution).toBeCloseTo(-0.279490616622, 8);
    expect(result.contributions[2]?.percentContribution).toBeCloseTo(0.223860589812, 8);

    const weeklyRiskFree = weeklyReturns.map(() => periodicRiskFreeRate(0.04, 52));
    const portfolioReturns = weeklyReturns.map(
      (week) => (week[0] ?? 0) * 0.5 + (week[1] ?? 0) * 0.3 + (week[2] ?? 0) * 0.2,
    );
    const sharpe = holdingsSharpeRatio(portfolioReturns, weeklyRiskFree);
    expect(sharpe).toBeCloseTo(7.256086138686, 8);
  });
});

describe("look-through overlap", () => {
  it("sums the minimum weight of each shared security", () => {
    const overlap = pairwiseOverlap(
      [
        { isin: "US0000000001", name: "Shared", weight: 0.5 },
        { isin: "US0000000002", name: "Only A", weight: 0.5 },
      ],
      [
        { isin: "US0000000001", name: "Shared", weight: 0.2 },
        { isin: "US0000000003", name: "Only B", weight: 0.8 },
      ],
    );
    expect(overlap).toBeCloseTo(0.2, 12);
  });
});

describe("listing identity", () => {
  it("accepts closes near the ledger and rejects a different listing", () => {
    const trades = [
      { tradeDate: "2026-09-25", price: 80.73 },
      { tradeDate: "2026-09-25", price: 80.9 },
      { tradeDate: "2026-09-25", price: 80.57 },
    ];
    const usListing = listingConsistency(trades, new Map([["2026-09-25", 81.19]]));
    const ucitsListing = listingConsistency(trades, new Map([["2026-09-25", 32.74]]));
    expect(usListing.consistent).toBe(true);
    expect(ucitsListing.consistent).toBe(false);
  });
});

describe("FRED parser", () => {
  it("reads the csv and the plain-text series", () => {
    expect(parseFredDgs3moText("DATE,DGS3MO\n2026-09-24,4.25\n2026-09-25,.\n")).toEqual([
      { date: "2026-09-24", annualYield: 0.0425 },
    ]);
    const textRows = parseFredDgs3moText("DATE VALUE\n2026-09-24    4.10\n");
    expect(textRows[0]?.date).toBe("2026-09-24");
    expect(textRows[0]?.annualYield).toBeCloseTo(0.041, 10);
  });
});

describe("identifiers", () => {
  it("converts a CUSIP to the ISIN used in Vanguard's N-PORT", () => {
    expect(cusipToIsin("US", "910047109")).toBe("US9100471096");
  });
});
