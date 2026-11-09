import katex from "katex";
import { useMemo, type ReactNode } from "react";
import "katex/dist/katex.min.css";
import type { TranslationKey } from "@/i18n/types";
import { cn } from "@/lib/utils";

export function Formula({ tex }: { tex: string }) {
  const html = useMemo(
    () => katex.renderToString(tex, { throwOnError: false, displayMode: true }),
    [tex],
  );
  return (
    <div
      className="overflow-x-auto text-foreground [&_.katex]:text-[0.95em] [&_.katex-display]:my-1"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function MethodNote({
  title,
  formulas,
  notes,
}: {
  title: string;
  formulas: readonly string[];
  notes: readonly string[];
}) {
  return (
    <details className="mt-4 border-t border-border">
      <summary className="cursor-pointer list-none py-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-hover ease-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
        {title}
      </summary>
      <div className="space-y-3 pb-2">
        {formulas.map((tex) => (
          <Formula key={tex} tex={tex} />
        ))}
        {notes.map((note) => (
          <p key={note} className="text-xs leading-relaxed text-muted-foreground">
            {note}
          </p>
        ))}
      </div>
    </details>
  );
}

export function SourceFooter({ tag }: { tag: string }) {
  return <p className="mt-3 font-mono text-[10px] leading-relaxed tracking-wide text-muted-foreground">{tag}</p>;
}

export function UnavailableNote({ label, reason }: { label: string; reason: string }) {
  return (
    <div className="border border-border px-3 py-4">
      <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm text-foreground">{reason}</p>
    </div>
  );
}

export function SeriesLegend({
  items,
}: {
  items: readonly { itemKey: string; label: ReactNode; swatchClassName: string; labelClassName: string }[];
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
      {items.map((item) => (
        <span key={item.itemKey} className="inline-flex items-center gap-2">
          <span className={cn("inline-block h-px w-3", item.swatchClassName)} aria-hidden="true" />
          <span className={`text-[10px] uppercase tracking-[0.14em] ${item.labelClassName}`}>{item.label}</span>
        </span>
      ))}
    </div>
  );
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border border-border bg-card px-4 py-5 md:px-5">
      <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}

export interface PortfolioKpiCellModel {
  key: string;
  label: string;
  value: string;
  detail: string;
  tone: string;
  valuePending: boolean;
  detailPending: boolean;
}

type Translate = (key: TranslationKey) => string;

function portfolioKpiCell(
  key: string,
  label: string,
  value: string,
  detail: string,
  tone: string,
  valuePending: boolean,
  detailPending: boolean,
): PortfolioKpiCellModel {
  return { key, label, value, detail, tone, valuePending, detailPending };
}

/** Seven KPI slots with labels only. Values and API details stay pending. */
export function loadingPortfolioKpis(translate: Translate): {
  primary: PortfolioKpiCellModel[];
  technical: PortfolioKpiCellModel[];
} {
  return {
    primary: [
      portfolioKpiCell("return", translate("portfolio.stats.return"), "", "", "", true, false),
      portfolioKpiCell("twr", translate("portfolio.analytics.twr"), "", "", "", true, true),
      portfolioKpiCell("holdings", translate("portfolio.stats.holdings"), "", "", "", true, false),
    ],
    technical: [
      portfolioKpiCell("benchmark", translate("portfolio.analytics.benchmark"), "", "", "", true, true),
      portfolioKpiCell(
        "excess",
        translate("portfolio.analytics.excess"),
        "",
        translate("portfolio.analytics.excessLabel"),
        "",
        true,
        false,
      ),
      portfolioKpiCell("volatility", translate("portfolio.analytics.volatility"), "", "", "", true, true),
      portfolioKpiCell(
        "sharpe",
        translate("portfolio.analytics.sharpe"),
        "",
        translate("portfolio.analytics.holdingsSharpe"),
        "",
        true,
        false,
      ),
    ],
  };
}

export function PortfolioKpiCell({ cell }: { cell: PortfolioKpiCellModel }) {
  const showDetail = cell.detailPending || cell.detail.length > 0;
  return (
    <div
      className="min-w-0 border border-border bg-card px-2.5 py-2"
      aria-busy={cell.valuePending || cell.detailPending}
    >
      <p className="break-words text-[10px] uppercase leading-4 tracking-[0.14em] text-muted-foreground">{cell.label}</p>
      <div className="mt-1 flex h-5 min-w-0 items-center justify-end overflow-x-auto">
        {cell.valuePending ? (
          <span className="portfolio-skeleton-block h-5 w-16 shrink-0 bg-foreground/10" aria-hidden="true" />
        ) : (
          <span
            className={cn(
              "portfolio-kpi-value whitespace-nowrap font-mono text-sm leading-5 tabular-nums",
              cell.tone,
            )}
            title={cell.value}
          >
            {cell.value}
          </span>
        )}
      </div>
      {showDetail ? (
        <p className="mt-1 min-h-4 break-words text-right text-[10px] leading-4 text-muted-foreground" title={cell.detail}>
          {cell.detailPending ? (
            <span className="portfolio-skeleton-block ml-auto block h-4 w-full max-w-40 bg-foreground/10" aria-hidden="true" />
          ) : (
            <span className="portfolio-kpi-value">{cell.detail}</span>
          )}
        </p>
      ) : null}
    </div>
  );
}

export function PortfolioKpiGrid({
  primary,
  technical,
}: {
  primary: readonly PortfolioKpiCellModel[];
  technical: readonly PortfolioKpiCellModel[];
}) {
  return (
    <div>
      <div className="grid grid-cols-1 items-start gap-px sm:grid-cols-3">
        {primary.map((cell) => (
          <PortfolioKpiCell key={cell.key} cell={cell} />
        ))}
      </div>
      {technical.length > 0 ? (
        <div className="mt-px grid grid-cols-2 items-start gap-px md:grid-cols-4">
          {technical.map((cell) => (
            <PortfolioKpiCell key={cell.key} cell={cell} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
