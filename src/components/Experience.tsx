import { useLanguage } from "@/contexts/LanguageContext";
import { experienceRoles } from "@/content/experience";

const Experience = () => {
  const { t } = useLanguage();

  return (
    <section id="experience" className="py-20 md:py-28 bg-background">
      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider mb-8">
            {t("experience.label")}
          </h2>

          <div className="space-y-8">
            {experienceRoles.map((role, index) => (
              <div key={role.id} className="group">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                  <div>
                    <p className="font-medium text-foreground">{t(role.titleKey)}</p>
                    <p className="text-sm text-muted-foreground">{t(role.companyKey)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono shrink-0">
                    {t(role.periodKey)}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                  {t(role.descriptionKey)}
                </p>
                {index < experienceRoles.length - 1 && (
                  <div className="border-b border-border/60 mt-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
