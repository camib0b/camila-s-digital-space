import { describe, expect, it } from "vitest";
import { buildHoldingsWithMetrics } from "./portfolioMetrics";
import type { PortfolioResponse } from "@/types/portfolio";

function portfolio(holdings: PortfolioResponse["holdings"]): PortfolioResponse {
  return {
    openCostBasisGainPercent: "4.20",
    holdings,
    aiInsight: null,
    lastUpdated: "2026-11-12T00:00:00.000Z",
    holdingsCount: holdings.length,
  };
}

describe("buildHoldingsWithMetrics", () => {
  it("reads the renamed holding fields", () => {
    const rows = buildHoldingsWithMetrics(
      portfolio([
        {
          ticker: "VOO",
          currentPrice: 690.32,
          previousCloseChangePercent: 1.25,
          stale: false,
          weightPercent: "40.0",
          gainPercent: "4.20",
        },
        {
          ticker: "SHOP",
          currentPrice: 109.42,
          previousCloseChangePercent: null,
          stale: true,
          weightPercent: "8.2",
          gainPercent: "-1.50",
        },
      ]),
    );

    expect(rows[0]).toMatchObject({
      ticker: "VOO",
      weightPercent: "40.0",
      gainPercent: "4.20",
      previousCloseChangePercent: 1.25,
      stale: false,
    });
    expect(rows[1].previousCloseChangePercent).toBeNull();
    expect(rows[1].stale).toBe(true);
    expect(rows[0]).not.toHaveProperty("allocation");
    expect(rows[0]).not.toHaveProperty("changePercent");
  });
});
