import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPercent, formatPercentagePoints, formatSignedPercent, numberTone, sourceTag } from "@/lib/analyticsFormat";
import { fetchPortfolioAnalytics } from "@/lib/portfolioApi";
import { isUnavailable, type AnalyticsReport } from "@/types/portfolioAnalytics";
import { ExposureSection } from "./ExposureSection";
import { PerformanceSection } from "./PerformanceSection";
import { RiskSection } from "./RiskSection";

function benchmarkDetail(performance: AnalyticsReport["performance"]): string {
  if (isUnavailable(performance)) {
    return "";
  }
  if (isUnavailable(performance.benchmark)) {
    return performance.benchmark.reason;
  }
  return performance.benchmark.annualizationLabel;
}

export default function PortfolioAnalytics() {
  const { t } = useLanguage();
  const analytics = useQuery({
    queryKey: ["portfolio-analytics"],
    queryFn: fetchPortfolioAnalytics,
    staleTime: 5 * 60 * 1000,
  });

  if (analytics.isLoading) {
    return <p className="mb-12 text-sm text-muted-foreground">{t("portfolio.analytics.loading")}</p>;
  }

  if (analytics.isError || analytics.data === undefined) {
    const message = analytics.error instanceof Error ? analytics.error.message : t("portfolio.analytics.error");
    return <p className="mb-12 text-sm text-number-negative">{message}</p>;
  }

  const report = analytics.data;
  const performance = report.performance;
  const risk = report.risk;
  const sharpe = report.sharpe.holdings;
  const kpis = [
    {
      label: t("portfolio.analytics.twr"),
      value: isUnavailable(performance) ? t("portfolio.analytics.unavailable") : formatSignedPercent(performance.timeWeightedReturn),
      detail: isUnavailable(performance) ? performance.reason : performance.annualizationLabel,
      tone: isUnavailable(performance) ? "" : numberTone(performance.timeWeightedReturn),
    },
    {
      label: t("portfolio.analytics.benchmark"),
      value:
        isUnavailable(performance) || isUnavailable(performance.benchmark)
          ? t("portfolio.analytics.unavailable")
          : formatSignedPercent(performance.benchmark.timeWeightedReturn),
      detail: benchmarkDetail(performance),
      tone:
        isUnavailable(performance) || isUnavailable(performance.benchmark)
          ? ""
          : numberTone(performance.benchmark.timeWeightedReturn),
    },
    {
      label: t("portfolio.analytics.excess"),
      value:
        isUnavailable(performance) || performance.excessReturn === null
          ? t("portfolio.analytics.unavailable")
          : formatPercentagePoints(performance.excessReturn),
      detail: t("portfolio.analytics.excessLabel"),
      tone:
        isUnavailable(performance) || performance.excessReturn === null ? "" : numberTone(performance.excessReturn),
    },
    {
      label: t("portfolio.analytics.sharpe"),
      value: isUnavailable(sharpe) ? t("portfolio.analytics.unavailable") : sharpe.sharpe.toFixed(2),
      detail: isUnavailable(sharpe) ? sharpe.reason : t("portfolio.analytics.holdingsSharpe"),
      tone: isUnavailable(sharpe) ? "" : numberTone(sharpe.sharpe),
    },
    {
      label: t("portfolio.analytics.volatility"),
      value: isUnavailable(risk) ? t("portfolio.analytics.unavailable") : formatPercent(risk.portfolioVolatility),
      detail: isUnavailable(risk) ? risk.reason : sourceTag([`${risk.sampleSize}w`, risk.lookbackEnd]),
      tone: "",
    },
  ];

  return (
    <div className="mb-16 space-y-6">
      <div className="-mx-6 flex gap-px overflow-x-auto px-6 pb-1 md:mx-0 md:px-0">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="min-w-[10.5rem] flex-1 border border-border bg-card px-3 py-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{kpi.label}</p>
            <p className={`mt-2 text-right font-mono text-lg tabular-nums ${kpi.tone}`}>{kpi.value}</p>
            <p className="mt-1 text-right text-[10px] leading-snug text-muted-foreground">{kpi.detail}</p>
          </div>
        ))}
      </div>
      <PerformanceSection report={report} />
      <RiskSection report={report} />
      <ExposureSection report={report} />
      <p className="text-center text-[11px] tracking-wide text-muted-foreground">{t("portfolio.analytics.disclaimer")}</p>
    </div>
  );
}
