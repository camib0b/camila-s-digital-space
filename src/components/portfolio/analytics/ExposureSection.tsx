import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPercent, sourceTag } from "@/lib/analyticsFormat";
import { isUnavailable, type AnalyticsReport, type LookThroughRow } from "@/types/portfolioAnalytics";
import { MethodNote, Panel, SourceFooter, UnavailableNote, usePrefersReducedMotion } from "./analyticsUi";

const FUND_COLORS: Record<string, string> = {
  direct: "hsl(var(--series-portfolio))",
  VOO: "hsl(var(--foreground))",
  VXUS: "hsl(var(--series-benchmark))",
  ROBO: "hsl(var(--muted-foreground))",
};

function stackedRow(row: LookThroughRow) {
  const values: Record<string, number | string> = { name: row.name, direct: 0, VOO: 0, VXUS: 0, ROBO: 0 };
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
  const reducedMotion = usePrefersReducedMotion();
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
            exposure.apparentCompany === null
              ? t("portfolio.analytics.unavailable")
              : `${exposure.apparentCompany.ticker} ${formatPercent(exposure.apparentCompany.weight)}`
          }
        />
        <Concentration
          label={t("portfolio.analytics.effective")}
          value={
            exposure.effectiveCompany === null
              ? t("portfolio.analytics.unavailable")
              : `${exposure.effectiveCompany.name} ${formatPercent(exposure.effectiveCompany.weight)}`
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
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `${value.toFixed(0)}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={108}
              tick={{ fill: "hsl(var(--foreground))", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))" }}
              content={({ active, payload, label }) => {
                if (!active || payload === undefined) {
                  return null;
                }
                return (
                  <div className="border border-border bg-background px-2 py-1.5 font-mono text-[11px]">
                    <p>{label}</p>
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
                isAnimationActive={!reducedMotion}
                animationDuration={250}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.14em]">
        <span className="text-series-portfolio">{t("portfolio.analytics.direct")}</span>
        <span>VOO</span>
        <span className="text-series-benchmark">VXUS</span>
        <span className="text-muted-foreground">ROBO</span>
      </p>
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
      <div className="grid grid-cols-4 gap-px border border-border bg-border text-center font-mono text-[11px]">
        <div className="bg-card" />
        {funds.map((fund) => (
          <div key={fund} className="bg-card px-2 py-1 text-muted-foreground">
            {fund}
          </div>
        ))}
        {funds.map((rowFund) => (
          <div key={rowFund} className="contents">
            <div className="bg-card px-2 py-2 text-muted-foreground">{rowFund}</div>
            {funds.map((columnFund) => {
              const overlap = overlapValue(rowFund, columnFund);
              const intensity = overlap === null ? 0 : Math.min(1, overlap / 0.5);
              return (
                <div
                  key={`${rowFund}-${columnFund}`}
                  className="bg-card px-2 py-2 tabular-nums"
                  style={
                    overlap === null
                      ? undefined
                      : { backgroundColor: `hsl(var(--foreground) / ${0.04 + intensity * 0.45})` }
                  }
                >
                  {overlap === null ? "—" : formatPercent(overlap, 1)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
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

function Concentration({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card px-3 py-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-right font-mono text-sm tabular-nums">{value}</p>
    </div>
  );
}
