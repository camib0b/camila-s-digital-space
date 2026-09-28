import { RefreshCw } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import PatternedBackground from "@/components/PatternedBackground";
import PortfolioAnalytics from "@/components/portfolio/analytics/PortfolioAnalytics";
import AiInsightPanel from "@/components/portfolio/AiInsightPanel";
import HoldingsTable from "@/components/portfolio/HoldingsTable";
import PortfolioLoadingScreen from "@/components/portfolio/PortfolioLoadingScreen";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePortfolioData } from "@/hooks/usePortfolioData";

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
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-red-500">
          {t("portfolio.error.prefix")}: {portfolioError}
        </div>
      </main>
    );
  }

  const totalReturnPercent = parseFloat(portfolio.totalReturnPct);
  const totalReturnLabel = `${totalReturnPercent >= 0 ? "+" : ""}${totalReturnPercent}%`;

  return (
    <main className="min-h-screen bg-background relative">
      <PatternedBackground />

      <PageHeader backLabel="home" />

      <div className="container px-6 md:px-8 max-w-5xl mx-auto py-16 relative z-10">
        <div className="mb-12">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
            {t("portfolio.eyebrow")}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            {t("portfolio.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("portfolio.lastUpdated")}:{" "}
            {new Date(portfolio.lastUpdated).toLocaleTimeString()}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-px bg-border rounded-lg overflow-hidden mb-12 ring-1 ring-border">
          {[
            {
              label: t("portfolio.stats.return"),
              value: totalReturnLabel,
              className:
                totalReturnPercent >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400",
            },
            {
              label: t("portfolio.stats.holdings"),
              value: portfolio.count.toString(),
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-card p-4 text-center">
              <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">
                {stat.label}
              </p>
              <p className={`text-lg font-semibold tracking-tight ${stat.className ?? ""}`}>
                {stat.value}
              </p>
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

        <div className="border-t border-border pt-6 text-center">
          <button
            type="button"
            onClick={refreshLiveData}
            className="mx-auto flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-3 h-3" />
            {t("portfolio.refresh")}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Capital;
