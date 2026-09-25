import { TrendingDown, TrendingUp } from "lucide-react";
import TickerLabel from "@/components/portfolio/TickerLabel";
import { useLanguage } from "@/contexts/LanguageContext";
import type { HoldingWithMetrics } from "@/types/portfolio";

interface HoldingsTableProps {
  holdings: HoldingWithMetrics[];
}

function formatHoldingPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

const HoldingsTable = ({ holdings }: HoldingsTableProps) => {
  const { t } = useLanguage();

  return (
    <div className="bg-card rounded-lg ring-1 ring-border overflow-hidden">
      <div className="grid grid-cols-5 text-[10px] tracking-[0.1em] uppercase text-muted-foreground px-4 py-2.5 border-b border-border bg-muted/30">
        <span>Ticker</span>
        <span className="text-right">Shares</span>
        <span className="text-right">Alloc %</span>
        <span className="text-right">Return %</span>
        <span className="text-right">Trend</span>
      </div>
      {holdings.map((holding, index) => {
        const gainPercent = parseFloat(holding.gainPercent);
        const isPositive = gainPercent >= 0;
        const showLastTradePrice = holding.stale === true && Number.isFinite(holding.currentPrice);
        return (
          <div
            key={holding.ticker}
            className={index < holdings.length - 1 ? "border-b border-border/50" : ""}
          >
            <div className="grid grid-cols-5 items-center px-4 py-3 text-sm">
              <span className="min-w-0">
                <TickerLabel ticker={holding.ticker} />
              </span>
              <span className="text-right text-xs text-muted-foreground">
                {holding.shares.toFixed(4)}
              </span>
              <span className="text-right text-xs font-medium">{holding.allocation}%</span>
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
            {showLastTradePrice ? (
              <p className="flex flex-wrap items-baseline justify-end gap-x-2 gap-y-0.5 px-4 pb-2.5 -mt-1.5 text-right text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                <span>{t("portfolio.holdings.lastTradePrice")}</span>
                <span className="normal-case tracking-normal tabular-nums">
                  {formatHoldingPrice(holding.currentPrice)}
                </span>
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default HoldingsTable;
