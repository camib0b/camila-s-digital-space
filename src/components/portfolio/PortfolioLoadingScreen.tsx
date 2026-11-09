import PageHeader from "@/components/PageHeader";
import PatternedBackground from "@/components/PatternedBackground";
import { loadingPortfolioKpis, PortfolioKpiGrid } from "@/components/portfolio/analytics/analyticsUi";
import { useLanguage } from "@/contexts/LanguageContext";

const capitalHeaderClassName =
  "container px-6 md:px-8 max-w-5xl mx-auto flex items-center justify-between h-12";

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`portfolio-skeleton-block bg-foreground/10 ${className ?? ""}`} aria-hidden="true" />;
}

/** Full-page load state for `/capital` — quiet ops-console skeleton, not a spinner. */
const PortfolioLoadingScreen = () => {
  const { t } = useLanguage();
  const kpis = loadingPortfolioKpis(t);

  return (
    <main className="relative min-h-screen bg-background" aria-busy="true" aria-live="polite">
      <PatternedBackground />
      <PageHeader backLabel="home" containerClassName={capitalHeaderClassName} />

      <div className="container relative z-10 mx-auto max-w-5xl px-6 py-16 md:px-8">
        <div className="mb-12">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {t("portfolio.eyebrow")}
          </p>
          <h1 className="mb-2 text-2xl font-medium tracking-tight">{t("portfolio.title")}</h1>
          <p className="text-xs text-muted-foreground">
            {t("portfolio.loading.status")}
            {" · "}
            {t("portfolio.loading")}
          </p>
          <div
            className="portfolio-sync-track mt-2 h-px w-full max-w-md overflow-hidden bg-border"
            role="progressbar"
            aria-valuetext={t("portfolio.loading")}
          >
            <div className="portfolio-sync-bar h-full w-1/3 bg-foreground/70" />
          </div>
        </div>

        <PortfolioKpiGrid primary={kpis.primary} technical={kpis.technical} />

        <div className="mt-6 space-y-6">
          <section className="border border-border bg-card px-4 py-5 md:px-5">
            <SkeletonBlock className="mb-5 h-2.5 w-36" />
            <SkeletonBlock className="mb-3 h-40 w-full" />
            <div className="flex gap-4">
              <SkeletonBlock className="h-px w-3" />
              <SkeletonBlock className="h-2 w-16" />
              <SkeletonBlock className="h-px w-3" />
              <SkeletonBlock className="h-2 w-12" />
            </div>
          </section>
          <section className="border border-border bg-card px-4 py-5 md:px-5">
            <SkeletonBlock className="mb-5 h-2.5 w-28" />
            <div className="space-y-3">
              <SkeletonBlock className="h-3 w-full" />
              <SkeletonBlock className="h-3 w-[88%]" />
              <SkeletonBlock className="h-3 w-[72%]" />
              <SkeletonBlock className="h-3 w-[80%]" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PortfolioLoadingScreen;
