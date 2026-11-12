import type { HoldingWithMetrics, PortfolioResponse } from "@/types/portfolio";

function weightPercent(
  holding: PortfolioResponse["holdings"][number],
  totalValue: number | undefined,
): string {
  if (typeof holding.weightPercent === "string" && holding.weightPercent.length > 0) {
    return holding.weightPercent;
  }
  if (
    totalValue !== undefined &&
    totalValue > 0 &&
    holding.currentValue !== undefined &&
    Number.isFinite(holding.currentValue)
  ) {
    return ((holding.currentValue / totalValue) * 100).toFixed(1);
  }
  return "";
}

function gainPercent(holding: PortfolioResponse["holdings"][number]): string {
  if (typeof holding.gainPercent === "string" && holding.gainPercent.length > 0) {
    return holding.gainPercent;
  }
  if (
    holding.totalCost !== undefined &&
    holding.totalCost > 0 &&
    holding.currentValue !== undefined &&
    Number.isFinite(holding.currentValue)
  ) {
    return (((holding.currentValue - holding.totalCost) / holding.totalCost) * 100).toFixed(2);
  }
  return "";
}

/**
 * View model for the table and Details panel.
 * Dollar fields on the quote payload are used only to derive percents, then dropped.
 */
export function buildHoldingsWithMetrics(portfolio: PortfolioResponse): HoldingWithMetrics[] {
  return portfolio.holdings.map((holding) => ({
    ticker: holding.ticker,
    currentPrice: holding.currentPrice,
    previousCloseChangePercent: holding.previousCloseChangePercent,
    stale: holding.stale,
    weightPercent: weightPercent(holding, portfolio.totalValue),
    gainPercent: gainPercent(holding),
  }));
}
