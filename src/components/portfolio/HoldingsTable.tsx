import TickerLabel from "@/components/portfolio/TickerLabel";
import { useLanguage } from "@/contexts/LanguageContext";
import { numberTone } from "@/lib/analyticsFormat";
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
    <section className="analytics-rise mb-16 border border-border bg-card px-4 py-5 md:px-5">
      <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
        {t("portfolio.holdings.title")}
      </h2>
      <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="border-b border-border text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              <th className="w-[22%] pb-2 pr-2 text-left font-medium">{t("portfolio.holdings.ticker")}</th>
              <th className="w-[26%] px-2 pb-2 text-right font-medium">{t("portfolio.holdings.shares")}</th>
              <th className="w-[24%] px-2 pb-2 text-right font-medium">{t("portfolio.holdings.weight")}</th>
              <th className="w-[28%] pb-2 pl-2 text-right font-medium">{t("portfolio.holdings.return")}</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => {
              const gainPercent = parseFloat(holding.gainPercent);
              const showLastTradePrice = holding.stale === true && Number.isFinite(holding.currentPrice);
              return (
                <tr key={holding.ticker} className="border-b border-border last:border-b-0">
                  <td className="py-2.5 pr-2 align-top">
                    <TickerLabel ticker={holding.ticker} className="font-mono text-xs" />
                    {showLastTradePrice ? (
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                        {t("portfolio.holdings.lastTradePrice")}{" "}
                        <span className="normal-case tracking-normal tabular-nums">
                          {formatHoldingPrice(holding.currentPrice)}
                        </span>
                      </p>
                    ) : null}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-right align-top font-mono text-xs tabular-nums text-muted-foreground">
                    {holding.shares.toFixed(4)}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-right align-top font-mono text-xs tabular-nums">
                    {holding.allocation}%
                  </td>
                  <td
                    className={`whitespace-nowrap py-2.5 pl-2 text-right align-top font-mono text-xs tabular-nums ${numberTone(gainPercent)}`}
                  >
                    {gainPercent > 0 ? "+" : ""}
                    {holding.gainPercent}%
                  </td>
                </tr>
              );
            })}
          </tbody>
      </table>
    </section>
  );
};

export default HoldingsTable;
