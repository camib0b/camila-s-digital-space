import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPercent, formatPercentagePoints, formatSignedPercent, numberTone, sourceTag } from "@/lib/analyticsFormat";
import { fetchPortfolioAnalytics } from "@/lib/portfolioApi";
import { isUnavailable, type AnalyticsReport } from "@/types/portfolioAnalytics";
import { useRegisterExposure } from "@/components/portfolio/TickerDetailsContext";
import { ExposureSection } from "./ExposureSection";
import { PerformanceSection } from "./PerformanceSection";
import { RiskSection } from "./RiskSection";
import { PortfolioKpiGrid, type PortfolioKpiCellModel } from "./analyticsUi";

function benchmarkDetail(performance: AnalyticsReport["performance"]): string {
  if (isUnavailable(performance)) {
    return "";
  }
  if (isUnavailable(performance.benchmark)) {
    return performance.benchmark.reason;
  }
  return performance.benchmark.annualizationLabel;
}

function kpiCell(
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

  const [primaryHeadline, secondaryHeadline] = headline;
  const report = analytics.data;
  const analyticsReady = !analytics.isLoading && !analytics.isError && report !== undefined;

  let timeWeightedReturn = kpiCell("twr", t("portfolio.analytics.twr"), "", "", "", true, true);
  let benchmark = kpiCell("benchmark", t("portfolio.analytics.benchmark"), "", "", "", true, true);
  let excess = kpiCell(
    "excess",
    t("portfolio.analytics.excess"),
    "",
    t("portfolio.analytics.excessLabel"),
    "",
    true,
    false,
  );
  let volatility = kpiCell("volatility", t("portfolio.analytics.volatility"), "", "", "", true, true);
  let sharpe = kpiCell(
    "sharpe",
    t("portfolio.analytics.sharpe"),
    "",
    t("portfolio.analytics.holdingsSharpe"),
    "",
    true,
    false,
  );

  if (analyticsReady && report !== undefined) {
    const performance = report.performance;
    const risk = report.risk;
    const holdingsSharpe = report.sharpe.holdings;
    timeWeightedReturn = kpiCell(
      "twr",
      t("portfolio.analytics.twr"),
      isUnavailable(performance) ? t("portfolio.analytics.unavailable") : formatSignedPercent(performance.timeWeightedReturn),
      isUnavailable(performance) ? performance.reason : performance.annualizationLabel,
      isUnavailable(performance) ? "" : numberTone(performance.timeWeightedReturn),
      false,
      false,
    );
    benchmark = kpiCell(
      "benchmark",
      t("portfolio.analytics.benchmark"),
      isUnavailable(performance) || isUnavailable(performance.benchmark)
        ? t("portfolio.analytics.unavailable")
        : formatSignedPercent(performance.benchmark.timeWeightedReturn),
      benchmarkDetail(performance),
      isUnavailable(performance) || isUnavailable(performance.benchmark)
        ? ""
        : numberTone(performance.benchmark.timeWeightedReturn),
      false,
      false,
    );
    excess = kpiCell(
      "excess",
      t("portfolio.analytics.excess"),
      isUnavailable(performance) || performance.excessReturn === null
        ? t("portfolio.analytics.unavailable")
        : formatPercentagePoints(performance.excessReturn),
      t("portfolio.analytics.excessLabel"),
      isUnavailable(performance) || performance.excessReturn === null ? "" : numberTone(performance.excessReturn),
      false,
      false,
    );
    volatility = kpiCell(
      "volatility",
      t("portfolio.analytics.volatility"),
      isUnavailable(risk) ? t("portfolio.analytics.unavailable") : formatPercent(risk.portfolioVolatility),
      isUnavailable(risk) ? risk.reason : sourceTag([`${risk.sampleSize}w`, risk.lookbackEnd]),
      "",
      false,
      false,
    );
    sharpe = kpiCell(
      "sharpe",
      t("portfolio.analytics.sharpe"),
      isUnavailable(holdingsSharpe) ? t("portfolio.analytics.unavailable") : holdingsSharpe.sharpe.toFixed(2),
      isUnavailable(holdingsSharpe) ? holdingsSharpe.reason : t("portfolio.analytics.holdingsSharpe"),
      isUnavailable(holdingsSharpe) ? "" : numberTone(holdingsSharpe.sharpe),
      false,
      false,
    );
  }

  const primary: PortfolioKpiCellModel[] = [
    ...(primaryHeadline === undefined
      ? []
      : [
          kpiCell(
            "return",
            primaryHeadline.label,
            primaryHeadline.value,
            "",
            primaryHeadline.tone,
            false,
            false,
          ),
        ]),
    timeWeightedReturn,
    ...(secondaryHeadline === undefined
      ? []
      : [
          kpiCell(
            "holdings",
            secondaryHeadline.label,
            secondaryHeadline.value,
            "",
            secondaryHeadline.tone,
            false,
            false,
          ),
        ]),
  ];
  const showTechnical = analytics.isLoading || analyticsReady;
  const technical = showTechnical ? [benchmark, excess, volatility, sharpe] : [];
  const errorMessage =
    analytics.error instanceof Error ? analytics.error.message : t("portfolio.analytics.error");

  return (
    <div className={analyticsReady ? "mb-16 space-y-6" : "mb-16"} aria-busy={analytics.isLoading}>
      <PortfolioKpiGrid primary={primary} technical={technical} />
      {analytics.isLoading ? (
        <div className="mt-6 border border-border bg-card px-4 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {t("portfolio.analytics.loading")}
          </p>
          <div
            className="portfolio-sync-track mt-3 h-px w-full max-w-sm overflow-hidden bg-border"
            role="progressbar"
            aria-valuetext={t("portfolio.analytics.loading")}
          >
            <div className="portfolio-sync-bar h-full w-1/3 bg-foreground/70" />
          </div>
        </div>
      ) : null}
      {!analytics.isLoading && !analyticsReady ? (
        <div className="mt-6 border border-border bg-card px-4 py-5 md:px-5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {t("portfolio.analytics.unavailable")}
          </p>
          <p className="mt-2 text-sm text-number-negative">{errorMessage}</p>
        </div>
      ) : null}
      {analyticsReady && report !== undefined ? (
        <>
          <PerformanceSection report={report} />
          <RiskSection report={report} />
          <ExposureSection report={report} />
          <p className="text-[11px] tracking-wide text-muted-foreground">{t("portfolio.analytics.disclaimer")}</p>
        </>
      ) : null}
    </div>
  );
}
