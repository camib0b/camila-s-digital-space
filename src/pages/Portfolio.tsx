import { RefreshCw } from "lucide-react";
import PageHeader from "@/components/PageHeader";
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
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23000' fill-opacity='1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
        }}
      />

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
