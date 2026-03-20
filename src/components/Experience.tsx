import { useLanguage } from "@/contexts/LanguageContext";

const Experience = () => {
  const { t } = useLanguage();

  const experiences = [
    {
      title: t("experience.job1.title"),
      company: t("experience.job1.company"),
      period: t("experience.job1.period"),
      description: t("experience.job1.description"),
    },
    {
      title: t("experience.job2.title"),
      company: t("experience.job2.company"),
      period: t("experience.job2.period"),
      description: t("experience.job2.description"),
    },
    {
      title: t("experience.job3.title"),
      company: t("experience.job3.company"),
      period: t("experience.job3.period"),
      description: t("experience.job3.description"),
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider mb-8">
            {t("experience.label")}
          </h2>

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div key={index} className="group">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                  <div>
                    <p className="font-medium text-foreground">{exp.title}</p>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono shrink-0">{exp.period}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                  {exp.description}
                </p>
                {index < experiences.length - 1 && (
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
