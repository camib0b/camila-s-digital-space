import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Trophy, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Hockey = () => {
  const { t } = useLanguage();

  // Hockey player trajectory milestones (since 2009)
  const playerMilestones = [
    {
      year: "2009",
      title: t("hockey.player1.title"),
      description: t("hockey.player1.description"),
    },
    {
      year: "2018",
      title: t("hockey.player2.title"),
      description: t("hockey.player2.description"),
    },
    {
      year: "2022",
      title: t("hockey.player3.title"),
      description: t("hockey.player3.description"),
    },
    {
      year: "2025",
      title: t("hockey.player4.title"),
      description: t("hockey.player4.description"),
    },
  ];

  // Hockey coaching trajectory
  const coachingMilestones = [
    {
      year: "2023",
      title: "Club Deportivo Universidad Católica",
      description: t("hockey.coaching1.description"),
      period: "2023-2025",
    },
    {
      year: "2024",
      title: "Selección Nacional",
      description: t("hockey.coaching2.description"),
      period: "2024 - Present",
    },
    {
      year: "2025",
      title: "Video Analyst",
      description: t("hockey.coaching3.description"),
      period: "December 2025",
    },
  ];

  return (
    <section id="hockey" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-2xl mb-16 animate-fade-in">
          <span className="text-primary text-sm tracking-widest uppercase mb-4 block">
            {t("hockey.label")}
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
            {t("hockey.title")}
          </h2>
          <p className="text-muted-foreground">
            {t("hockey.description")}
          </p>
        </div>

        {/* Two-column timeline layout */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
          {/* Left Timeline - Player Trajectory */}
          <div className="relative">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-xl text-foreground">{t("hockey.playerTrajectory")}</h3>
            </div>

            {/* Vertical timeline line */}
            <div className="absolute left-6 top-20 bottom-0 w-px bg-border" />

            <div className="space-y-8 pl-14">
              {playerMilestones.map((milestone, index) => (
                <div key={index} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-8 w-3 h-3 rounded-full bg-primary border-2 border-background" />

                  <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover:border-primary/30 transition-colors duration-300">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 text-primary text-sm mb-2 font-body">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">{milestone.year}</span>
                      </div>
                      <h4 className="text-lg font-display font-medium text-foreground mb-2">
                        {milestone.title}
                      </h4>
                      <p className="text-muted-foreground text-sm font-body leading-relaxed">
                        {milestone.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Right Timeline - Coaching Trajectory */}
          <div className="relative">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-display text-xl text-foreground">{t("hockey.coachingTrajectory")}</h3>
            </div>

            {/* Vertical timeline line */}
            <div className="absolute left-6 top-20 bottom-0 w-px bg-border" />

            <div className="space-y-8 pl-14">
              {coachingMilestones.map((milestone, index) => (
                <div key={index} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-8 w-3 h-3 rounded-full bg-accent border-2 border-background" />

                  <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover:border-accent/30 transition-colors duration-300">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 text-accent text-sm mb-2 font-body">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">{milestone.year}</span>
                      </div>
                      <h4 className="text-lg font-display font-medium text-foreground mb-1">
                        {milestone.title}
                      </h4>
                      {milestone.period && (
                        <p className="text-primary text-xs mb-2 font-body">
                          {milestone.period}
                        </p>
                      )}
                      <p className="text-muted-foreground text-sm font-body leading-relaxed">
                        {milestone.description}
                      </p>
                    </CardContent>
                  </Card>
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
