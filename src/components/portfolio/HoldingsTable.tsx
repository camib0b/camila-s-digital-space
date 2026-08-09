import { TrendingDown, TrendingUp } from "lucide-react";
import type { HoldingWithMetrics } from "@/types/portfolio";

interface HoldingsTableProps {
  holdings: HoldingWithMetrics[];
}

const HoldingsTable = ({ holdings }: HoldingsTableProps) => {
  return (
    <div className="bg-card rounded-lg ring-1 ring-border overflow-hidden">
      <div className="grid grid-cols-5 text-[10px] tracking-[0.1em] uppercase text-muted-foreground px-4 py-2.5 border-b border-border bg-muted/30">
        <span>Ticker</span>
        <span className="text-right">Shares</span>
        <span className="text-right">Value</span>
        <span className="text-right">Return %</span>
        <span className="text-right">Trend</span>
      </div>
      {holdings.map((holding, index) => {
        const gainPercent = parseFloat(holding.gainPercent);
        const isPositive = gainPercent >= 0;
        return (
          <div
            key={holding.ticker}
            className={`grid grid-cols-5 items-center px-4 py-3 text-sm ${
              index < holdings.length - 1 ? "border-b border-border/50" : ""
            }`}
          >
            <span className="font-medium text-xs">{holding.ticker}</span>
            <span className="text-right text-xs text-muted-foreground">
              {holding.shares.toFixed(4)}
            </span>
            <span className="text-right text-xs font-medium">
              ${holding.currentValue.toFixed(2)}
            </span>
            <span
              className={`text-right text-xs font-medium ${
                isPositive
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {isPositive ? "+" : ""}
              {holding.gainPercent}%
            </span>
            <span className="flex justify-end">
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default HoldingsTable;
