import { useEffect, useId, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPercent } from "@/lib/analyticsFormat";
import {
  KIND_LABEL_KEY,
  ROLE_LABEL_KEY,
  canonicalCompanyLabel,
  instrumentByTicker,
  showHoldingWeightInDetails,
} from "@/lib/tickerCatalog";
import type { ExposureContribution, LookThroughRow } from "@/types/portfolioAnalytics";
import { useTickerDetails } from "@/components/portfolio/TickerDetailsContext";

function stockContributions(isin: string, rows: readonly LookThroughRow[]): ExposureContribution[] {
  return rows.find((row) => row.isin === isin)?.contributions ?? [];
}

function fundConstituents(ticker: string, rows: readonly LookThroughRow[]): { label: string; weight: number }[] {
  return rows
    .map((row) => {
      const contribution = row.contributions.find((item) => item.source === ticker);
      if (contribution === undefined || contribution.weight <= 0) {
        return null;
      }
      return { label: canonicalCompanyLabel(row.isin, row.name), weight: contribution.weight };
    })
    .filter((row): row is { label: string; weight: number } => row !== null)
    .sort((left, right) => right.weight - left.weight)
    .slice(0, 8);
}

const TickerDetailsPanel = () => {
  const { t } = useLanguage();
  const details = useTickerDetails();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const ticker = details?.openTicker ?? null;
  const instrument = ticker ? instrumentByTicker(ticker) : undefined;

  useEffect(() => {
    if (ticker === null) {
      return;
    }
    closeRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        details?.closeDetails();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [ticker, details]);

  if (details === null || ticker === null || instrument === undefined) {
    return null;
  }

  const weight = details.weightsByTicker[ticker] ?? "";
  const rows = details.exposure?.topExposures ?? [];
  const contributions = instrument.kind === "stock" ? stockContributions(instrument.isin, rows) : [];
  const constituents = instrument.kind === "stock" ? [] : fundConstituents(ticker, rows);
  const fields = [
    { label: t("portfolio.ticker.role"), value: t(ROLE_LABEL_KEY[instrument.role]) },
    { label: t("portfolio.ticker.type"), value: t(KIND_LABEL_KEY[instrument.kind]) },
    { label: t("portfolio.ticker.exchange"), value: instrument.exchange },
    { label: t("portfolio.ticker.issuer"), value: instrument.issuer },
    { label: t("portfolio.ticker.isin"), value: instrument.isin },
    instrument.tracks ? { label: t("portfolio.ticker.tracks"), value: instrument.tracks } : null,
    instrument.sectorKey ? { label: t("portfolio.ticker.sector"), value: t(instrument.sectorKey) } : null,
    showHoldingWeightInDetails && weight.length > 0
      ? { label: t("portfolio.ticker.weight"), value: `${weight}%` }
      : null,
  ].filter((field): field is { label: string; value: string } => field !== null);

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-background/40"
        aria-label={t("portfolio.ticker.close")}
        onClick={details.closeDetails}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-x-0 bottom-0 max-h-[75vh] overflow-y-auto border-t border-border bg-background px-4 py-4 md:inset-y-0 md:left-auto md:right-0 md:w-80 md:max-h-none md:border-l md:border-t-0 md:px-5"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{ticker}</p>
            <h2 id={titleId} className="mt-1 text-sm font-medium tracking-tight text-foreground">
              {instrument.name}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={details.closeDetails}
            className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {t("portfolio.ticker.close")}
          </button>
        </div>
        <dl className="grid grid-cols-1 gap-px border border-border bg-border">
          {fields.map((field) => (
            <div key={field.label} className="bg-background px-3 py-2">
              <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{field.label}</dt>
              <dd className="mt-1 text-right font-mono text-xs tabular-nums text-foreground">{field.value}</dd>
            </div>
          ))}
        </dl>
        {contributions.length > 0 ? (
          <div className="mt-4">
            <h3 className="mb-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {t("portfolio.ticker.lookThrough")}
            </h3>
            <ul className="border border-border">
              {contributions.map((contribution) => (
                <li
                  key={contribution.source}
                  className="flex items-baseline justify-between gap-3 border-b border-border px-3 py-2 last:border-b-0"
                >
                  <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {contribution.source === "direct" ? t("portfolio.analytics.direct") : contribution.source}
                  </span>
                  <span className="font-mono text-xs tabular-nums">{formatPercent(contribution.weight)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {constituents.length > 0 ? (
          <div className="mt-4">
            <h3 className="mb-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {t("portfolio.ticker.lookThrough")}
            </h3>
            <ul className="border border-border">
              {constituents.map((constituent) => (
                <li
                  key={constituent.label}
                  className="flex items-baseline justify-between gap-3 border-b border-border px-3 py-2 last:border-b-0"
                >
                  <span className="font-mono text-xs">{constituent.label}</span>
                  <span className="font-mono text-xs tabular-nums">{formatPercent(constituent.weight)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default TickerDetailsPanel;
