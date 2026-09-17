import { useLanguage } from "@/contexts/LanguageContext";
import { howIWorkColumns } from "@/content/howIWork";

const HowIWork = () => {
  const { t } = useLanguage();

  return (
    <section id="how-i-work" className="py-20 md:py-28">
      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider mb-10">
            {t("howIWork.label")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-16">
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
        </div>
      </div>
    </section>
  );
};

export default HowIWork;
