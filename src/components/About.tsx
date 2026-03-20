import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 md:py-28 bg-background">
      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider mb-6">
            {t("about.label")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-4">
            {t("about.description")}
          </p>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <span className="text-foreground font-medium">{t("about.highlight1.title")}</span> — {t("about.highlight1.description")}
            </p>
            <p>
              <span className="text-foreground font-medium">{t("about.highlight2.title")}</span> — {t("about.highlight2.description")}
            </p>
            <p>
              <span className="text-foreground font-medium">{t("about.highlight3.title")}</span> — {t("about.highlight3.description")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
