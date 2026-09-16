import { useLanguage } from "@/contexts/LanguageContext";
import { bigFiveTraits, howIWorkColumns } from "@/content/howIWork";

const HowIWork = () => {
  const { t } = useLanguage();

  return (
    <section id="how-i-work" className="py-20 md:py-28 bg-background">
      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider mb-10">
            {t("howIWork.label")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-16 mb-16">
            {howIWorkColumns.map((column) => (
              <div key={column.id}>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                  {t(column.headingKey)}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(column.bodyKey)}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-6 mb-10">
            {bigFiveTraits.map((trait) => (
              <div key={trait.id}>
                <div className="flex items-baseline justify-between gap-4 mb-2">
                  <span className="text-sm text-foreground">{t(trait.labelKey)}</span>
                  <span className="text-xs text-muted-foreground font-mono shrink-0">
                    {trait.percentile}
                  </span>
                </div>
                <div className="h-[2px] w-full bg-border">
                  <div
                    className="h-full bg-foreground"
                    style={{ width: `${trait.percentile}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground/70 leading-relaxed">
            {t("howIWork.footnote")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowIWork;
