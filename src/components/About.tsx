import { Card } from "@/components/ui/card";
import { Code2, Users, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  const highlights = [
    {
      icon: Code2,
      title: t("about.highlight1.title"),
      description: t("about.highlight1.description"),
    },
    {
      icon: Users,
      title: t("about.highlight2.title"),
      description: t("about.highlight2.description"),
    },
    {
      icon: Zap,
      title: t("about.highlight3.title"),
      description: t("about.highlight3.description"),
    },
  ];

  return (
    <section id="about" className="py-24 md:py-32 bg-background">
      <div className="container px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="mb-16">
            <p className="text-primary text-sm tracking-widest uppercase mb-4 font-body">
              {t("about.label")}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-foreground mb-6">
              {t("about.title")}
            </h2>
            <p className="text-lg text-muted-foreground font-body leading-relaxed max-w-2xl">
              {t("about.description")}
            </p>
          </div>

          {/* Highlight cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((item, index) => (
              <Card 
                key={index}
                className="bg-card border-border p-6 hover:border-primary/30 transition-colors duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors duration-300">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-display font-medium text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
