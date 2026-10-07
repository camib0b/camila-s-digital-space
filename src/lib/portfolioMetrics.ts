import type { HoldingWithMetrics, PortfolioResponse } from "@/types/portfolio";

function allocationPercent(holding: PortfolioResponse["stocks"][number], totalValue: number | undefined): string {
  if (typeof holding.allocation === "string" && holding.allocation.length > 0) {
    return holding.allocation;
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

function gainPercent(holding: PortfolioResponse["stocks"][number]): string {
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
  return portfolio.stocks.map((holding) => ({
    ticker: holding.ticker,
    currentPrice: holding.currentPrice,
    changePercent: holding.changePercent,
    stale: holding.stale,
    allocation: allocationPercent(holding, portfolio.totalValue),
    gainPercent: gainPercent(holding),
  }));
}
