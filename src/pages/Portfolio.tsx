import { RefreshCw } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import PatternedBackground from "@/components/PatternedBackground";
import AllocationChart from "@/components/portfolio/AllocationChart";
import AiInsightPanel from "@/components/portfolio/AiInsightPanel";
import HoldingsTable from "@/components/portfolio/HoldingsTable";
import MonthlyReturnsChart from "@/components/portfolio/MonthlyReturnsChart";
import PortfolioValueChart from "@/components/portfolio/PortfolioValueChart";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePortfolioData } from "@/hooks/usePortfolioData";

/** Public route: `/capital` — live investment portfolio dashboard. */
const Portfolio = () => {
  const { t } = useLanguage();
  const {
    portfolio,
    history,
    loading,
    historyLoading,
    error,
    historyError,
    holdingsWithAllocation,
    allocationChartData,
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

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>{t("portfolio.loading")}</span>
        </div>
      </main>
    );
  }

  if (error || !portfolio) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-red-500">
          {t("portfolio.error.prefix")}: {error}
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

      <div className="container px-6 md:px-8 max-w-3xl mx-auto py-16 relative z-10">
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden mb-12 ring-1 ring-border">
          {[
            {
              label: t("portfolio.stats.value"),
              value: `$${parseFloat(portfolio.totalValue).toLocaleString()}`,
            },
            {
              label: t("portfolio.stats.return"),
              value: totalReturnLabel,
              className:
                totalReturnPercent >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400",
            },
            {
              label: t("portfolio.stats.invested"),
              value: `$${parseFloat(portfolio.totalInvested).toLocaleString()}`,
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

        <section className="mb-12">
          <h2 className="text-sm font-medium mb-1">{t("portfolio.holdings.title")}</h2>
          <p className="text-xs text-muted-foreground mb-4">
            {t("portfolio.holdings.description")}
          </p>
          <HoldingsTable holdings={holdingsWithAllocation} />
        </section>

        <section className="mb-12 space-y-6">
          <div className="bg-card rounded-lg ring-1 ring-border p-6">
            <h2 className="text-sm font-medium mb-1">{t("portfolio.charts.value.title")}</h2>
            <p className="text-xs text-muted-foreground mb-4">
              {t("portfolio.charts.value.description")}
            </p>
            <PortfolioValueChart
              history={history?.portfolioHistory}
              loading={historyLoading}
              error={historyError}
              loadingLabel={t("portfolio.charts.historyLoading")}
              emptyLabel={t("portfolio.charts.historyEmpty")}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg ring-1 ring-border p-6">
              <h2 className="text-sm font-medium mb-1">
                {t("portfolio.charts.monthly.title")}
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                {t("portfolio.charts.monthly.description")}
              </p>
              <MonthlyReturnsChart
                monthlyReturns={history?.monthlyReturns}
                loading={historyLoading}
                loadingLabel={t("portfolio.loadingShort")}
                emptyLabel={t("portfolio.charts.monthly.empty")}
              />
            </div>

            <div className="bg-card rounded-lg ring-1 ring-border p-6">
              <h2 className="text-sm font-medium mb-1">
                {t("portfolio.charts.allocation.title")}
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                {t("portfolio.charts.allocation.description")}
              </p>
              <AllocationChart
                data={allocationChartData}
                emptyLabel={t("portfolio.charts.allocation.empty")}
              />
            </div>
          </div>
        </section>

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
          insight={portfolio.aiInsight}
          provider={insightProvider}
        />

        <div className="border-t border-border pt-6 text-center">
          <button
            type="button"
            onClick={refreshLiveData}
            className="text-xs flex items-center gap-1 mx-auto text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-3 h-3" />
            {t("portfolio.refresh")}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Portfolio;
