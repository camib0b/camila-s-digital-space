import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPercent, formatPercentagePoints, formatSignedPercent, numberTone, sourceTag } from "@/lib/analyticsFormat";
import { fetchPortfolioAnalytics } from "@/lib/portfolioApi";
import { isUnavailable, type AnalyticsReport } from "@/types/portfolioAnalytics";
import { useRegisterExposure } from "@/components/portfolio/TickerDetailsContext";
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

interface MetricCellModel {
  label: string;
  value: string;
  detail: string;
  tone: string;
}

function MetricCell({ cell }: { cell: MetricCellModel }) {
  return (
    <div className="border border-border bg-card px-3 py-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{cell.label}</p>
      <p className={`mt-2 text-right font-mono text-lg tabular-nums ${cell.tone}`}>{cell.value}</p>
      <p className="mt-1 min-h-4 text-right text-[10px] leading-snug text-muted-foreground">{cell.detail}</p>
    </div>
  );
}

function MetricSkeleton() {
  return (
    <div className="border border-border bg-card px-3 py-3" aria-hidden="true">
      <div className="portfolio-skeleton-block mb-3 h-2 w-16 bg-muted/40" />
      <div className="portfolio-skeleton-block ml-auto h-5 w-14 bg-muted/40" />
      <div className="portfolio-skeleton-block ml-auto mt-2 h-2 w-20 bg-muted/40" />
    </div>
  );
}

export default function PortfolioAnalytics({
  headline,
}: {
  headline: readonly { label: string; value: string; tone: string }[];
}) {
  const { t } = useLanguage();
  const analytics = useQuery({
    queryKey: ["portfolio-analytics"],
    queryFn: fetchPortfolioAnalytics,
    staleTime: 5 * 60 * 1000,
  });
  const exposureBlock =
    analytics.data !== undefined && !isUnavailable(analytics.data.exposure) ? analytics.data.exposure : null;
  useRegisterExposure(exposureBlock);

  if (analytics.isLoading) {
    return (
      <div className="mb-16" aria-busy="true">
        <div className="grid grid-cols-1 gap-px sm:grid-cols-3">
          {headline[0] !== undefined ? (
            <MetricCell cell={{ ...headline[0], detail: "" }} />
          ) : null}
          <MetricSkeleton />
          {headline.slice(1).map((cell) => (
            <MetricCell key={cell.label} cell={{ ...cell, detail: "" }} />
          ))}
        </div>
        <div className="mt-px grid grid-cols-2 gap-px md:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <MetricSkeleton key={index} />
          ))}
        </div>
        <div className="mt-6 border border-border bg-card px-4 py-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {t("portfolio.analytics.loading")}
          </p>
          <div className="portfolio-sync-track mt-4 h-px w-full max-w-sm overflow-hidden bg-border">
            <div className="portfolio-sync-bar h-full w-1/3 bg-foreground/70" />
          </div>
        </div>
      </div>
    );
  }

  if (analytics.isError || analytics.data === undefined) {
    const message = analytics.error instanceof Error ? analytics.error.message : t("portfolio.analytics.error");
    return (
      <div className="mb-16">
        <div className="grid grid-cols-2 gap-px">
          {headline.map((cell) => (
            <MetricCell key={cell.label} cell={{ ...cell, detail: "" }} />
          ))}
        </div>
        <div className="mt-6 border border-border bg-card px-4 py-5 md:px-5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {t("portfolio.analytics.unavailable")}
          </p>
          <p className="mt-2 text-sm text-number-negative">{message}</p>
        </div>
      </div>
    );
  }

  const report = analytics.data;
  const performance = report.performance;
  const risk = report.risk;
  const sharpe = report.sharpe.holdings;
  const timeWeightedReturn: MetricCellModel = {
    label: t("portfolio.analytics.twr"),
    value: isUnavailable(performance) ? t("portfolio.analytics.unavailable") : formatSignedPercent(performance.timeWeightedReturn),
    detail: isUnavailable(performance) ? performance.reason : performance.annualizationLabel,
    tone: isUnavailable(performance) ? "" : numberTone(performance.timeWeightedReturn),
  };
  const technical: MetricCellModel[] = [
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
      label: t("portfolio.analytics.volatility"),
      value: isUnavailable(risk) ? t("portfolio.analytics.unavailable") : formatPercent(risk.portfolioVolatility),
      detail: isUnavailable(risk) ? risk.reason : sourceTag([`${risk.sampleSize}w`, risk.lookbackEnd]),
      tone: "",
    },
    {
      label: t("portfolio.analytics.sharpe"),
      value: isUnavailable(sharpe) ? t("portfolio.analytics.unavailable") : sharpe.sharpe.toFixed(2),
      detail: isUnavailable(sharpe) ? sharpe.reason : t("portfolio.analytics.holdingsSharpe"),
      tone: isUnavailable(sharpe) ? "" : numberTone(sharpe.sharpe),
    },
  ];

  const [primaryHeadline, ...remainingHeadline] = headline;
  const headlineCells: MetricCellModel[] = [
    ...(primaryHeadline === undefined ? [] : [{ ...primaryHeadline, detail: "" }]),
    timeWeightedReturn,
    ...remainingHeadline.map((cell) => ({ ...cell, detail: "" })),
  ];

  return (
    <div className="mb-16 space-y-6">
      <div>
        <div className="grid grid-cols-1 gap-px sm:grid-cols-3">
          {headlineCells.map((cell) => (
            <MetricCell key={cell.label} cell={cell} />
          ))}
        </div>
        <div className="mt-px grid grid-cols-2 gap-px md:grid-cols-4">
          {technical.map((cell) => (
            <MetricCell key={cell.label} cell={cell} />
          ))}
        </div>
      </div>
      <PerformanceSection report={report} />
      <RiskSection report={report} />
      <ExposureSection report={report} />
      <p className="text-[11px] tracking-wide text-muted-foreground">{t("portfolio.analytics.disclaimer")}</p>
    </div>
  );
}
