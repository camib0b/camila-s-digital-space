import PageHeader from "@/components/PageHeader";
import PatternedBackground from "@/components/PatternedBackground";
import PortfolioAnalytics from "@/components/portfolio/analytics/PortfolioAnalytics";
import AiInsightPanel from "@/components/portfolio/AiInsightPanel";
import HoldingsTable from "@/components/portfolio/HoldingsTable";
import PortfolioLoadingScreen from "@/components/portfolio/PortfolioLoadingScreen";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { numberTone } from "@/lib/analyticsFormat";

const capitalHeaderClassName =
  "container px-6 md:px-8 max-w-5xl mx-auto flex items-center justify-between h-12";

/** Public route: `/capital` — live investment portfolio dashboard. */
const Capital = () => {
  const { t } = useLanguage();
  const {
    portfolio,
    portfolioLoading,
    portfolioError,
    holdingsWithMetrics,
    availableAiModels,
    showModelSelector,
    selectedAiModel,
    setSelectedAiModel,
    insightProvider,
    aiInsightLoading,
    aiInsightError,
    generateAiInsight,
    refreshLiveData,
  } = usePortfolioData();

  if (portfolioLoading) {
    return <PortfolioLoadingScreen />;
  }

  if (portfolioError || !portfolio) {
    return (
      <main className="relative min-h-screen bg-background">
        <PatternedBackground />
        <PageHeader backLabel="home" containerClassName={capitalHeaderClassName} />
        <div className="container relative z-10 mx-auto max-w-5xl px-6 py-16 md:px-8">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {t("portfolio.eyebrow")}
          </p>
          <h1 className="mb-8 text-2xl font-medium tracking-tight">{t("portfolio.title")}</h1>
          <section className="border border-border bg-card px-4 py-5 md:px-5">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {t("portfolio.error.prefix")}
            </p>
            {portfolioError ? <p className="mt-2 text-sm text-number-negative">{portfolioError}</p> : null}
          </section>
        </div>
      </main>
    );
  }

  const totalReturnPercent = parseFloat(portfolio.totalReturnPct);
  const totalReturnLabel = `${totalReturnPercent >= 0 ? "+" : ""}${totalReturnPercent}%`;
  const summaryStats = [
    {
      label: t("portfolio.stats.return"),
      value: totalReturnLabel,
      className: numberTone(totalReturnPercent),
    },
    {
      label: t("portfolio.stats.holdings"),
      value: portfolio.count.toString(),
      className: "text-foreground",
    },
  ];

  return (
    <main className="min-h-screen bg-background relative">
      <PatternedBackground />

      <PageHeader backLabel="home" containerClassName={capitalHeaderClassName} />

      <div className="container px-6 md:px-8 max-w-5xl mx-auto py-16 relative z-10">
        <div className="mb-12">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
            {t("portfolio.eyebrow")}
          </p>
          <h1 className="text-2xl font-medium tracking-tight mb-2">{t("portfolio.title")}</h1>
          <p className="text-xs text-muted-foreground">
            {t("portfolio.lastUpdated")}:{" "}
            {new Date(portfolio.lastUpdated).toLocaleTimeString()}
          </p>
        </div>

        <div className="mb-12 grid grid-cols-2 gap-px">
          {summaryStats.map((stat) => (
            <div key={stat.label} className="border border-border bg-card px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{stat.label}</p>
              <p className={`mt-2 text-right font-mono text-lg tabular-nums ${stat.className}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <PortfolioAnalytics />

        <HoldingsTable holdings={holdingsWithMetrics} />

        <AiInsightPanel
          label={t("portfolio.aiInsight.label")}
          modelLabel={t("portfolio.aiInsight.model")}
          generateLabel={t("portfolio.aiInsight.generate")}
          generatingLabel={t("portfolio.aiInsight.generating")}
          placeholder={t("portfolio.aiInsight.placeholder")}
          viaLabel={t("portfolio.aiInsight.via")}
          showModelSelector={showModelSelector}
          availableAiModels={availableAiModels}
          selectedAiModel={selectedAiModel}
          onSelectedAiModelChange={setSelectedAiModel}
          onGenerate={generateAiInsight}
          loading={aiInsightLoading}
          error={aiInsightError}
          aiInsight={portfolio.aiInsight}
          provider={insightProvider}
        />

        <div className="border-t border-border pt-6">
          <button
            type="button"
            onClick={refreshLiveData}
            className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {t("portfolio.refresh")}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Capital;
