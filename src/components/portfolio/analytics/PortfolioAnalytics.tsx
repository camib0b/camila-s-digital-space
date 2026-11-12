import { lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPercent, formatPercentagePoints, formatSignedPercent, numberTone, sourceTag } from "@/lib/analyticsFormat";
import { fetchPortfolioAnalytics } from "@/lib/portfolioApi";
import { isUnavailable, type AnalyticsReport } from "@/types/portfolioAnalytics";
import { useRegisterExposure } from "@/components/portfolio/TickerDetailsContext";
import { EditorialStatRow } from "@/components/portfolio/EditorialStats";
import { PortfolioKpiGrid, type PortfolioKpiCellModel } from "./analyticsUi";

const AnalyticsReportSections = lazy(() => import("./AnalyticsReportSections"));

function AnalyticsSectionsSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-6" aria-hidden="true">
      {["performance", "risk", "exposure"].map((sectionId) => (
        <section
          key={sectionId}
          className="flex min-h-[8rem] flex-1 flex-col border border-border bg-card px-4 py-5 md:px-5"
        >
          <div className="portfolio-skeleton-block mb-4 h-3 w-36 bg-foreground/10" />
          <div className="portfolio-skeleton-block min-h-[6rem] w-full flex-1 bg-foreground/10" />
        </section>
      ))}
    </div>
  );
}

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

  const editorialStats = [primaryHeadline, secondaryHeadline].flatMap((stat, index) => {
    if (stat === undefined) {
      return [];
    }
    return [
      {
        key: index === 0 ? "return" : "holdings",
        label: stat.label,
        value: stat.value,
        tone: stat.tone,
        pending: false,
      },
    ];
  });
  const showTechnical = analytics.isLoading || analyticsReady;
  const technical = showTechnical
    ? [timeWeightedReturn, benchmark, excess, volatility, sharpe]
    : [timeWeightedReturn];
  const errorMessage =
    analytics.error instanceof Error ? analytics.error.message : t("portfolio.analytics.error");

  const reserveAnalyticsSections = analytics.isLoading || (analyticsReady && report !== undefined);

  return (
    <div className="mb-16" aria-busy={analytics.isLoading}>
      <EditorialStatRow stats={editorialStats} />
      <PortfolioKpiGrid primary={[]} technical={technical} />
      {analytics.isLoading ? (
        <p className="sr-only" role="status">
          {t("portfolio.analytics.loading")}
        </p>
      ) : null}
      {reserveAnalyticsSections ? (
        <div className="capital-analytics-sections relative mt-6">
          {analytics.isLoading ? (
            <div className="absolute inset-0">
              <AnalyticsSectionsSkeleton />
            </div>
          ) : null}
          {analyticsReady && report !== undefined ? (
            <Suspense
              fallback={
                <div className="absolute inset-0">
                  <AnalyticsSectionsSkeleton />
                </div>
              }
            >
              <AnalyticsReportSections report={report} />
            </Suspense>
          ) : null}
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
    </div>
  );
}
