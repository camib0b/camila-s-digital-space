import type { HoldingWithMetrics, PortfolioResponse } from "@/types/portfolio";

export function buildHoldingsWithMetrics(portfolio: PortfolioResponse): HoldingWithMetrics[] {
  const totalValueNumber = parseFloat(portfolio.totalValue);
  return portfolio.stocks.map((holding) => ({
    ...holding,
    allocation:
      totalValueNumber > 0
        ? ((holding.currentValue / totalValueNumber) * 100).toFixed(1)
        : "0.0",
    gainPercent:
      holding.totalCost > 0
        ? (((holding.currentValue - holding.totalCost) / holding.totalCost) * 100).toFixed(2)
        : "0.00",
  }));
}
