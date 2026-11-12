import type { ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { chartAxisTick, chartTooltipClassName, formatPercent, sourceTag } from "@/lib/analyticsFormat";
import { isUnavailable, type AnalyticsReport, type LookThroughRow } from "@/types/portfolioAnalytics";
import TickerLabel, { TickerAxisTick } from "@/components/portfolio/TickerLabel";
import { canonicalCompanyLabel } from "@/lib/tickerCatalog";
import { cn } from "@/lib/utils";
import { MethodNote, Panel, SeriesLegend, SourceFooter, UnavailableNote } from "./analyticsUi";

const OVERLAP_SCALE = [
  { id: "none", max: 0, mix: "0%", label: "0%" },
  { id: "band-5", max: 0.05, mix: "25%", label: "≤5%" },
  { id: "band-15", max: 0.15, mix: "50%", label: "≤15%" },
  { id: "band-30", max: 0.3, mix: "75%", label: "≤30%" },
  { id: "band-rest", max: Number.POSITIVE_INFINITY, mix: "100%", label: ">30%" },
] as const;

function overlapStepIndex(value: number): number {
  const index = OVERLAP_SCALE.findIndex((step) => value <= step.max);
  return index === -1 ? OVERLAP_SCALE.length - 1 : index;
}

function overlapFill(mix: string): string {
  return `color-mix(in oklab, hsl(var(--contrib-q4)) ${mix}, hsl(var(--contrib-empty)))`;
}

function overlapTextClass(stepIndex: number): string {
  return stepIndex >= 3 ? "text-foreground dark:text-background" : "text-foreground";
}

const FUND_COLORS: Record<string, string> = {
  direct: "hsl(var(--foreground))",
  VOO: "hsl(var(--series-portfolio))",
  VXUS: "hsl(var(--foreground) / 0.42)",
  ROBO: "hsl(var(--foreground) / 0.16)",
};

function stackedRow(row: LookThroughRow) {
  const values: Record<string, number | string> = {
    name: canonicalCompanyLabel(row.isin, row.name),
    companyName: row.name,
    isin: row.isin,
    direct: 0,
    VOO: 0,
    VXUS: 0,
    ROBO: 0,
  };
  for (const contribution of row.contributions) {
    const key = contribution.source === "direct" ? "direct" : contribution.source;
    if (key in values) {
      values[key] = Number(values[key]) + contribution.weight * 100;
    }
  }
  return values;
}

export function ExposureSection({ report }: { report: AnalyticsReport }) {
  const { t } = useLanguage();
  const exposure = report.exposure;
  if (isUnavailable(exposure)) {
    return (
      <Panel title={t("portfolio.analytics.exposure")}>
        <UnavailableNote label={t("portfolio.analytics.unavailable")} reason={exposure.reason} />
      </Panel>
    );
  }

  const funds = ["VOO", "VXUS", "ROBO"];
  const overlapValue = (left: string, right: string) => {
    if (left === right) {
      return null;
    }
    const pair = exposure.overlap.find(
      (item) =>
        (item.fundA === left && item.fundB === right) || (item.fundA === right && item.fundB === left),
    );
    return pair?.overlap ?? null;
  };
  const roboListing = report.ledger.listings.find((listing) => listing.ticker === "ROBO");

  return (
    <Panel title={t("portfolio.analytics.exposure")}>
      <div className="mb-4 grid gap-px border border-border bg-border md:grid-cols-2">
        <Concentration
          label={t("portfolio.analytics.apparent")}
          value={
            exposure.largestDirectStock === null ? (
              t("portfolio.analytics.unavailable")
            ) : (
              <span className="inline-flex items-baseline justify-end gap-2">
                <TickerLabel ticker={exposure.largestDirectStock.ticker} className="font-mono text-sm" />
                <span>{formatPercent(exposure.largestDirectStock.weight)}</span>
              </span>
            )
          }
        />
        <Concentration
          label={t("portfolio.analytics.effective")}
          value={
            exposure.largestLookThroughCompany === null ? (
              t("portfolio.analytics.unavailable")
            ) : (
              <span className="inline-flex items-baseline justify-end gap-2">
                <TickerLabel
                  isin={exposure.largestLookThroughCompany.isin}
                  name={exposure.largestLookThroughCompany.name}
                  className="font-mono text-sm"
                />
                <span>{formatPercent(exposure.largestLookThroughCompany.weight)}</span>
              </span>
            )
          }
        />
      </div>
      <div className="h-[420px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={exposure.topExposures.map(stackedRow)}
            margin={{ top: 4, right: 12, left: 8, bottom: 0 }}
          >
            <CartesianGrid stroke="hsl(var(--border))" horizontal={false} />
            <XAxis
              type="number"
              tick={chartAxisTick}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `${value.toFixed(0)}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={108}
              tick={<TickerAxisTick labelWidth={104} />}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--foreground) / 0.04)" }}
              content={({ active, payload }) => {
                if (!active || payload === undefined || payload.length === 0) {
                  return null;
                }
                const row = payload[0]?.payload as { name?: string; companyName?: string; isin?: string } | undefined;
                const label = row?.name ?? "";
                const companyName = row?.companyName ?? label;
                return (
                  <div className={chartTooltipClassName}>
                    <p>
                      <TickerLabel isin={row?.isin} name={companyName} className="font-mono text-[11px]" />
                    </p>
                    {companyName !== label ? <p className="text-muted-foreground">{companyName}</p> : null}
                    {payload.map((entry) => (
                      <p key={String(entry.dataKey)}>
                        {String(entry.dataKey)}: {Number(entry.value).toFixed(2)}%
                      </p>
                    ))}
                  </div>
                );
              }}
            />
            {(["direct", "VOO", "VXUS", "ROBO"] as const).map((key) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="exposure"
                fill={FUND_COLORS[key]}
                barSize={8}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <SeriesLegend
        items={[
          {
            itemKey: "direct",
            label: t("portfolio.analytics.direct"),
            swatchClassName: "h-2 w-3 bg-foreground",
            labelClassName: "text-foreground",
          },
          {
            itemKey: "VOO",
            label: <TickerLabel ticker="VOO" className="font-mono text-[10px]" />,
            swatchClassName: "h-2 w-3 bg-series-portfolio",
            labelClassName: "text-foreground",
          },
          {
            itemKey: "VXUS",
            label: <TickerLabel ticker="VXUS" className="font-mono text-[10px]" />,
            swatchClassName: "h-2 w-3 bg-foreground/40",
            labelClassName: "text-foreground",
          },
          {
            itemKey: "ROBO",
            label: <TickerLabel ticker="ROBO" className="font-mono text-[10px]" />,
            swatchClassName: "h-2 w-3 bg-foreground/15",
            labelClassName: "text-foreground",
          },
        ]}
      />
      <dl className="mt-4 grid grid-cols-3 gap-px border border-border bg-border">
        {[
          [t("portfolio.analytics.bonds"), formatPercent(exposure.bondWeight)],
          [t("portfolio.analytics.cash"), formatPercent(exposure.cashWeight)],
          [t("portfolio.analytics.unattributed"), formatPercent(exposure.unattributedWeight)],
        ].map(([label, value]) => (
          <div key={label} className="bg-card px-3 py-2">
            <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-right font-mono text-sm tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <h3 className="mb-2 mt-5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {t("portfolio.analytics.overlap")}
      </h3>
      <div className="overflow-x-auto">
        <div className="grid min-w-[16rem] grid-cols-4 gap-px border border-border bg-border text-center font-mono text-[11px]">
        <div className="bg-card" />
        {funds.map((fund) => (
          <div key={fund} className="min-w-0 bg-card px-2 py-1 text-muted-foreground">
            <TickerLabel ticker={fund} className="font-mono text-[11px]" />
          </div>
        ))}
        {funds.map((rowFund) => (
          <div key={rowFund} className="contents">
            <div className="min-w-0 bg-card px-2 py-2 text-muted-foreground">
              <TickerLabel ticker={rowFund} className="font-mono text-[11px]" />
            </div>
            {funds.map((columnFund) => {
              const overlap = overlapValue(rowFund, columnFund);
              if (overlap === null) {
                return (
                  <div key={`${rowFund}-${columnFund}`} className="bg-card px-2 py-2 tabular-nums text-foreground">
                    —
                  </div>
                );
              }
              const stepIndex = overlapStepIndex(Math.max(0, overlap));
              const step = OVERLAP_SCALE[stepIndex];
              return (
                <div
                  key={`${rowFund}-${columnFund}`}
                  data-overlap-step={step.id}
                  className={cn("min-w-0 whitespace-nowrap px-2 py-2 tabular-nums", overlapTextClass(stepIndex))}
                  style={{ backgroundColor: overlapFill(step.mix) }}
                >
                  {formatPercent(overlap, 1)}
                </div>
              );
            })}
          </div>
        ))}
        </div>
      </div>
      <ul
        data-overlap-legend
        aria-label={t("portfolio.analytics.overlap")}
        className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1"
      >
        {OVERLAP_SCALE.map((step) => (
          <li key={step.id} className="inline-flex items-center gap-1.5">
            <span
              data-overlap-swatch={step.id}
              aria-hidden="true"
              className="inline-block h-3 w-3 border border-muted-foreground"
              style={{ backgroundColor: overlapFill(step.mix) }}
            />
            <span className="font-mono text-[10px] tabular-nums text-foreground">{step.label}</span>
          </li>
        ))}
      </ul>
      {roboListing !== undefined && (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{roboListing.identificationNote}</p>
      )}
      <MethodNote
        title={t("portfolio.analytics.method")}
        formulas={[
          String.raw`E_s=\sum_i w_i h_{i,s}`,
          String.raw`\mathrm{Overlap}(A,B)=\sum_s\min(h_{A,s},h_{B,s})`,
        ]}
        notes={[t("portfolio.analytics.methodExposure")]}
      />
      <SourceFooter
        tag={sourceTag([
          "issuer N-PORT snapshots",
          exposure.source,
          `portfolio as of ${exposure.asOf}`,
          ...exposure.snapshotCoverage.map((coverage) => `${coverage.fundTicker} ${coverage.asOf}`),
          `n=${exposure.sampleSize}`,
        ])}
      />
    </Panel>
  );
}

function Concentration({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="bg-card px-3 py-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-right font-mono text-sm tabular-nums">{value}</p>
    </div>
  );
}
