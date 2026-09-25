import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPercent, formatSignedPercent, numberTone, sourceTag } from "@/lib/analyticsFormat";
import { isUnavailable, type AnalyticsReport } from "@/types/portfolioAnalytics";
import { MethodNote, Panel, SourceFooter, UnavailableNote, usePrefersReducedMotion } from "./analyticsUi";

export function RiskSection({ report }: { report: AnalyticsReport }) {
  const { t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const risk = report.risk;
  const holdingsSharpe = report.sharpe.holdings;
  const realizedSharpe = report.sharpe.realized;

  return (
    <Panel title={t("portfolio.analytics.risk")}>
      {isUnavailable(risk) ? (
        <UnavailableNote label={t("portfolio.analytics.unavailable")} reason={risk.reason} />
      ) : (
        <>
          <p className="mb-3 text-xs text-muted-foreground">{t("portfolio.analytics.exAnte")}</p>
          <p className="mb-3 text-xs text-muted-foreground">
            {t("portfolio.analytics.cashExcluded")}{" "}
            {formatSignedPercent(risk.cashWeightOfPortfolio)} · {risk.cashMarketValue.toLocaleString("en-US", { style: "currency", currency: "USD" })}
          </p>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={risk.contributions.map((row) => ({
                  ticker: row.ticker,
                  capital: row.weight * 100,
                  risk: row.percentContribution * 100,
                }))}
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
                  dataKey="ticker"
                  width={52}
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
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
                            {entry.dataKey === "capital" ? t("portfolio.analytics.capital") : t("portfolio.analytics.riskShare")}
                            {": "}
                            {Number(entry.value).toFixed(2)}%
                          </p>
                        ))}
                      </div>
                    );
                  }}
                />
                <Bar dataKey="capital" fill="hsl(var(--series-portfolio))" barSize={6} isAnimationActive={!reducedMotion} animationDuration={250} />
                <Bar dataKey="risk" fill="hsl(var(--series-benchmark))" barSize={6} isAnimationActive={!reducedMotion} animationDuration={250} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <span className="text-series-portfolio">{t("portfolio.analytics.capital")}</span>
            {" · "}
            <span className="text-series-benchmark">{t("portfolio.analytics.riskShare")}</span>
          </p>
          <p className="mt-3 text-right font-mono text-sm tabular-nums">
            σ {formatPercent(risk.portfolioVolatility)} · Σw {risk.weightsSum.toFixed(4)}
          </p>
          <SourceFooter
            tag={sourceTag([
              "D1 ledger",
              risk.source,
              `as of ${risk.asOf}`,
              `${risk.lookbackStart} → ${risk.lookbackEnd}`,
              `${risk.sampleSize}w weekly`,
              `n=${risk.sampleSize}`,
              `requested ${risk.requestedWeeks}w`,
            ])}
          />
        </>
      )}

      <div className="mt-4 grid gap-px border border-border bg-border md:grid-cols-2">
        <SharpeCell
          label={t("portfolio.analytics.holdingsSharpe")}
          block={holdingsSharpe}
          extra={
            !isUnavailable(holdingsSharpe) && holdingsSharpe.benchmarkSharpe !== null
              ? `${t("portfolio.analytics.vooSharpe")} ${holdingsSharpe.benchmarkSharpe.toFixed(2)}`
              : !isUnavailable(holdingsSharpe)
                ? holdingsSharpe.benchmarkReason
                : null
          }
        />
        <SharpeCell label={t("portfolio.analytics.realizedSharpe")} block={realizedSharpe} extra={null} />
      </div>
      <MethodNote
        title={t("portfolio.analytics.method")}
        formulas={[
          String.raw`\sigma_p=\sqrt{w^{\top}\Sigma w}`,
          String.raw`RC_i=\frac{w_i(\Sigma w)_i}{\sigma_p}`,
          String.raw`PRC_i=\frac{w_i(\Sigma w)_i}{w^{\top}\Sigma w}`,
          String.raw`\mathrm{Sharpe}=\frac{\overline{r-r_f}}{s_{r-r_f}}\sqrt{N}`,
        ]}
        notes={[t("portfolio.analytics.methodRisk"), t("portfolio.analytics.exAnte"), t("portfolio.analytics.cashExcluded")]}
      />
    </Panel>
  );
}

function SharpeCell({
  label,
  block,
  extra,
}: {
  label: string;
  block: AnalyticsReport["sharpe"]["holdings"] | AnalyticsReport["sharpe"]["realized"];
  extra: string | null;
}) {
  const { t } = useLanguage();
  if (isUnavailable(block)) {
    return (
      <div className="bg-card px-3 py-3">
        <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm text-foreground">{block.reason}</p>
      </div>
    );
  }
  const sample = "window" in block ? block.window.sampleSize : null;
  return (
    <div className="bg-card px-3 py-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className={`mt-1 text-right font-mono text-lg tabular-nums ${numberTone(block.sharpe)}`}>{block.sharpe.toFixed(2)}</p>
      {extra !== null && <p className="mt-1 text-right font-mono text-xs text-muted-foreground">{extra}</p>}
      <p className="mt-1 font-mono text-[10px] text-muted-foreground">
        {t("portfolio.analytics.riskFree")} {block.riskFreeSeries}
        {sample !== null ? ` · n=${sample}` : ""}
        {block.window.lookbackStart !== null ? ` · ${block.window.lookbackStart} → ${block.window.lookbackEnd}` : ""}
      </p>
    </div>
  );
}
