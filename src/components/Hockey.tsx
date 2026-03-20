import { useLanguage } from "@/contexts/LanguageContext";

const Hockey = () => {
  const { t } = useLanguage();

  const playerMilestones = [
    { year: "2009", title: t("hockey.player1.title"), description: t("hockey.player1.description") },
    { year: "2018", title: t("hockey.player2.title"), description: t("hockey.player2.description") },
    { year: "2022", title: t("hockey.player3.title"), description: t("hockey.player3.description") },
    { year: "2025", title: t("hockey.player4.title"), description: t("hockey.player4.description") },
  ];

  const coachingMilestones = [
    { year: "2023–25", title: "Club Deportivo Universidad Católica", description: t("hockey.coaching1.description") },
    { year: "2024–", title: "Selección Nacional", description: t("hockey.coaching2.description") },
    { year: "Dec 2025", title: "Video Analyst", description: t("hockey.coaching3.description") },
  ];

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

          {/* Player */}
          <div className="mb-10">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">{t("hockey.playerTrajectory")}</p>
            <div className="space-y-4">
              {playerMilestones.map((m, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-xs text-muted-foreground font-mono w-10 shrink-0 pt-0.5">{m.year}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{m.title}</p>
                    <p className="text-sm text-muted-foreground">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coaching */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">{t("hockey.coachingTrajectory")}</p>
            <div className="space-y-4">
              {coachingMilestones.map((m, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-xs text-muted-foreground font-mono w-16 shrink-0 pt-0.5">{m.year}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{m.title}</p>
                    <p className="text-sm text-muted-foreground">{m.description}</p>
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
