import type {
  AllocationChartPoint,
  HoldingWithMetrics,
  PortfolioResponse,
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

export function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function buildHoldingsWithMetrics(
  portfolio: PortfolioResponse
): HoldingWithMetrics[] {
  const totalValueNumber = parseFloat(portfolio.totalValue);
  return portfolio.stocks.map((stock) => ({
    ...stock,
    allocation:
      totalValueNumber > 0
        ? ((stock.currentValue / totalValueNumber) * 100).toFixed(1)
        : "0.0",
    gainPercent:
      stock.totalCost > 0
        ? (((stock.currentValue - stock.totalCost) / stock.totalCost) * 100).toFixed(2)
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
