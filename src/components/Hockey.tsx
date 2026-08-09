import { useLanguage } from "@/contexts/LanguageContext";
import { coachingMilestones, playerMilestones } from "@/content/hockey";

const Hockey = () => {
  const { t } = useLanguage();

  return (
    <section id="hockey" className="py-20 md:py-28 bg-background">
      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider mb-2">
            {t("hockey.label")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-10">
            {t("hockey.description")}
          </p>

          <div className="mb-10">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
              {t("hockey.playerTrajectory")}
            </p>
            <div className="space-y-4">
              {playerMilestones.map((milestone) => (
                <div key={milestone.year} className="flex gap-4">
                  <span className="text-xs text-muted-foreground font-mono w-10 shrink-0 pt-0.5">
                    {milestone.year}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {milestone.titleKey ? t(milestone.titleKey) : milestone.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t(milestone.descriptionKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
              {t("hockey.coachingTrajectory")}
            </p>
            <div className="space-y-4">
              {coachingMilestones.map((milestone) => (
                <div key={`${milestone.year}-${milestone.title}`} className="flex gap-4">
                  <span className="text-xs text-muted-foreground font-mono w-16 shrink-0 pt-0.5">
                    {milestone.year}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{milestone.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {t(milestone.descriptionKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hockey;
