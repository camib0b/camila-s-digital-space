import PageHeader from "@/components/PageHeader";
import PatternedBackground from "@/components/PatternedBackground";
import { useLanguage } from "@/contexts/LanguageContext";

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`portfolio-skeleton-block bg-muted/40 ${className ?? ""}`} aria-hidden="true" />;
}

/** Full-page load state for `/capital` — quiet ops-console skeleton, not a spinner. */
const PortfolioLoadingScreen = () => {
  const { t } = useLanguage();

  return (
    <main className="relative min-h-screen bg-background" aria-busy="true" aria-live="polite">
      <PatternedBackground />
      <PageHeader backLabel="home" />

      <div className="container relative z-10 mx-auto max-w-5xl px-6 py-16 md:px-8">
        <div className="mb-10">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {t("portfolio.eyebrow")}
          </p>
          <h1 className="mb-3 text-2xl font-semibold tracking-tight">{t("portfolio.title")}</h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {t("portfolio.loading.status")}
            </span>
            <span className="hidden h-3 w-px bg-border sm:block" aria-hidden="true" />
            <span className="font-mono text-[10px] tracking-wide text-muted-foreground/80">
              {t("portfolio.loading")}
            </span>
          </div>
          <div
            className="portfolio-sync-track mt-5 h-px w-full max-w-md overflow-hidden bg-border"
            role="progressbar"
            aria-valuetext={t("portfolio.loading")}
          >
            <div className="portfolio-sync-bar h-full w-1/3 bg-foreground/70" />
          </div>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-border ring-1 ring-border md:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="bg-card px-4 py-5">
              <SkeletonBlock className="mb-3 h-2 w-16" />
              <SkeletonBlock className="h-7 w-24" />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <section className="border border-border bg-card px-4 py-5 md:px-5">
            <SkeletonBlock className="mb-5 h-2.5 w-36" />
            <SkeletonBlock className="mb-3 h-40 w-full" />
            <div className="flex gap-3">
              <SkeletonBlock className="h-2 w-20" />
              <SkeletonBlock className="h-2 w-16" />
            </div>
          </section>
          <div className="grid gap-4 md:grid-cols-2">
            <section className="border border-border bg-card px-4 py-5 md:px-5">
              <SkeletonBlock className="mb-5 h-2.5 w-28" />
              <SkeletonBlock className="h-32 w-full" />
            </section>
            <section className="border border-border bg-card px-4 py-5 md:px-5">
              <SkeletonBlock className="mb-5 h-2.5 w-24" />
              <div className="space-y-3">
                <SkeletonBlock className="h-3 w-full" />
                <SkeletonBlock className="h-3 w-[88%]" />
                <SkeletonBlock className="h-3 w-[72%]" />
                <SkeletonBlock className="h-3 w-[80%]" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PortfolioLoadingScreen;
