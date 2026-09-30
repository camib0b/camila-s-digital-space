import type { HoldingWithMetrics, PortfolioResponse } from "@/types/portfolio";

export function buildHoldingsWithMetrics(portfolio: PortfolioResponse): HoldingWithMetrics[] {
  return portfolio.stocks.map((holding) => ({
    ...holding,
    allocation: holding.allocation,
    gainPercent: holding.gainPercent,
  }));
}
