import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  chartAxisTick,
  chartTooltipClassName,
  formatPercentagePoints,
  formatSignedPercent,
  numberTone,
  sourceTag,
} from "@/lib/analyticsFormat";
import { isUnavailable, type AnalyticsReport, type PerformanceBlock } from "@/types/portfolioAnalytics";
import { MethodNote, Panel, SourceFooter, UnavailableNote, usePrefersReducedMotion } from "./analyticsUi";

function EndLabel({
  cx,
  cy,
  index,
  lastIndex,
  text,
  color,
}: {
  cx?: number;
  cy?: number;
  index?: number;
  lastIndex: number;
  text: string;
  color: string;
}) {
  if (index !== lastIndex || cx === undefined || cy === undefined) {
    return <g />;
  }
  return (
    <text
      x={cx + 8}
      y={cy + (text === "VOO" ? 11 : -8)}
      fill={color}
      fontSize={11}
      fontFamily={chartAxisTick.fontFamily}
      dominantBaseline="middle"
    >
      {text}
    </text>
  );
}

function PerformanceChart({ performance }: { performance: PerformanceBlock }) {
  const reducedMotion = usePrefersReducedMotion();
  const { t } = useLanguage();
  const data = performance.series.map((point) => ({
    date: point.date,
    portfolio: point.cumulativeTimeWeightedReturn * 100,
    benchmark:
      point.cumulativeBenchmarkReturn === null ? null : point.cumulativeBenchmarkReturn * 100,
  }));
  const lastIndex = data.length - 1;
  const drawdown = performance.maxDrawdown;
  const drawdownPoint =
    drawdown === null ? undefined : data.find((point) => point.date === drawdown.troughDate);

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 88, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="date" tick={chartAxisTick} tickLine={false} axisLine={false} minTickGap={28} />
          <YAxis
            tick={chartAxisTick}
            tickLine={false}
            axisLine={false}
            width={64}
            tickFormatter={(value: number) => formatSignedPercent(value / 100, 0)}
          />
          <Tooltip
            cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1 }}
            content={({ active, payload, label }) => {
              if (!active || payload === undefined || payload.length === 0) {
                return null;
              }
              return (
                <div className={chartTooltipClassName}>
                  <p>{label}</p>
                  {payload.map((entry) => (
                    <p key={String(entry.dataKey)}>
                      {entry.dataKey === "portfolio" ? t("portfolio.analytics.portfolio") : "VOO"}
                      {": "}
                      {formatSignedPercent(Number(entry.value) / 100)}
                    </p>
                  ))}
                </div>
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="portfolio"
            stroke="hsl(var(--series-portfolio))"
            strokeWidth={1.25}
            dot={(props) => (
              <EndLabel
                cx={props.cx}
                cy={props.cy}
                index={props.index}
                lastIndex={lastIndex}
                text={t("portfolio.analytics.portfolio")}
                color="hsl(var(--series-portfolio))"
              />
            )}
            isAnimationActive={!reducedMotion}
            animationDuration={250}
          />
          <Line
            type="monotone"
            dataKey="benchmark"
            stroke="hsl(var(--series-benchmark))"
            strokeWidth={1.25}
            strokeDasharray="4 3"
            dot={(props) => (
              <EndLabel
                cx={props.cx}
                cy={props.cy}
                index={props.index}
                lastIndex={lastIndex}
                text="VOO"
                color="hsl(var(--series-benchmark))"
              />
            )}
            isAnimationActive={!reducedMotion}
            animationDuration={250}
            connectNulls={false}
          />
          {drawdownPoint !== undefined && drawdown !== null && (
            <ReferenceDot
              x={drawdown.troughDate}
              y={drawdownPoint.portfolio}
              r={2.5}
              fill="hsl(var(--number-negative))"
              stroke="none"
              label={{
                value: t("portfolio.analytics.drawdown"),
                position: "top",
                fill: "hsl(var(--muted-foreground))",
                fontSize: 10,
                fontFamily: chartAxisTick.fontFamily,
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PerformanceSection({ report }: { report: AnalyticsReport }) {
  const { t } = useLanguage();
  const performance = report.performance;
  if (isUnavailable(performance)) {
    return (
      <Panel title={t("portfolio.analytics.performance")}>
        <UnavailableNote label={t("portfolio.analytics.unavailable")} reason={performance.reason} />
      </Panel>
    );
  }

  const benchmarkText = isUnavailable(performance.benchmark)
    ? performance.benchmark.reason
    : `${formatSignedPercent(performance.benchmark.timeWeightedReturn)} · ${performance.benchmark.annualizationLabel}`;

  return (
    <Panel title={t("portfolio.analytics.performance")}>
      <PerformanceChart performance={performance} />
      <dl className="mt-4 border border-border px-3 py-2">
        <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {t("portfolio.analytics.simple")}
        </dt>
        <dd
          className={`mt-1 text-right font-mono text-sm tabular-nums ${
            performance.simpleReturn === null ? "" : numberTone(performance.simpleReturn)
          }`}
        >
          {performance.simpleReturn === null
            ? t("portfolio.analytics.unavailable")
            : formatSignedPercent(performance.simpleReturn)}
        </dd>
      </dl>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {t("portfolio.analytics.simpleLabel")}
        {" · "}
        {t("portfolio.analytics.excessLabel")}
        {performance.excessReturn === null ? "" : ` ${formatPercentagePoints(performance.excessReturn)}.`}
        {" "}
        {benchmarkText}
      </p>
      {performance.maxDrawdown !== null && (
        <p className="mt-1 text-right font-mono text-xs tabular-nums text-muted-foreground">
          {t("portfolio.analytics.drawdown")}{" "}
          <span className={numberTone(performance.maxDrawdown.drawdown)}>
            {formatSignedPercent(performance.maxDrawdown.drawdown)}
          </span>
          {" · "}
          {performance.maxDrawdown.peakDate} → {performance.maxDrawdown.troughDate}
        </p>
      )}
      {report.ledger.dividendRecordCount === 0 && (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{t("portfolio.analytics.dividend")}</p>
      )}
      {performance.valuationGapNote !== null && (
        <p className="mt-2 text-xs text-muted-foreground">{performance.valuationGapNote}</p>
      )}
      <MethodNote
        title={t("portfolio.analytics.method")}
        formulas={[
          String.raw`r_t=\frac{V_t}{V_{t-1}+F_t}-1`,
          String.raw`\mathrm{TWR}=\prod_t(1+r_t)-1`,
          String.raw`(1+\mathrm{TWR})^{365/\mathrm{days}}-1`,
        ]}
        notes={[
          t("portfolio.analytics.methodPerformance"),
          t("portfolio.analytics.priceSource"),
          t("portfolio.analytics.dividend"),
        ]}
      />
      <SourceFooter
        tag={sourceTag([
          "D1 ledger",
          t("portfolio.analytics.priceSource"),
          `as of ${performance.asOf}`,
          `${performance.lookbackStart} → ${performance.lookbackEnd}`,
          `n=${performance.sampleSize} daily`,
          performance.annualizationLabel,
        ])}
      />
      <p className={`mt-2 text-right font-mono text-sm tabular-nums ${numberTone(performance.timeWeightedReturn)}`}>
        {formatSignedPercent(performance.timeWeightedReturn)} · {performance.annualizationLabel}
      </p>
    </Panel>
  );
}
