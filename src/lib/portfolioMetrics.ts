import type {
  AllocationChartPoint,
  HoldingWithMetrics,
  PortfolioHistoryPoint,
  PortfolioResponse,
  RelativePerformancePoint,
} from "@/types/portfolio";

export function formatChartDate(date: string): string {
  const [, month, day] = date.split("-");
  return `${month}/${day}`;
}

export function formatMonthLabel(month: string): string {
  const [year, monthNumber] = month.split("-");
  const date = new Date(Number(year), Number(monthNumber) - 1, 1);
  return date.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
}

export function formatSignedPercent(value: number, fractionDigits = 1): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(fractionDigits)}%`;
}

export function buildRelativePerformanceHistory(
  history: PortfolioHistoryPoint[]
): RelativePerformancePoint[] {
  const hasCostBasisReturn = history.every(
    (point) => typeof point.returnPct === "number" && Number.isFinite(point.returnPct)
  );
  if (!hasCostBasisReturn || history.length === 0) {
    return [];
  }

  return history.map((point) => ({
    date: point.date,
    changePercent: point.returnPct as number,
  }));
}

export function buildHoldingsWithMetrics(
  portfolio: PortfolioResponse
): HoldingWithMetrics[] {
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

export function buildAllocationChartData(
  holdings: HoldingWithMetrics[]
): AllocationChartPoint[] {
  return holdings.map((holding) => ({
    ticker: holding.ticker,
    allocation: parseFloat(holding.allocation),
  }));
}
