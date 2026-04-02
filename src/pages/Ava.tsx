import { Link } from "react-router-dom";
import { ArrowLeft, Play, BarChart3, Scissors, Clock, Users, Video } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";

const features = [
  { icon: Video, titleKey: "ava.feature1.title", descKey: "ava.feature1.desc" },
  { icon: Scissors, titleKey: "ava.feature2.title", descKey: "ava.feature2.desc" },
  { icon: BarChart3, titleKey: "ava.feature3.title", descKey: "ava.feature3.desc" },
  { icon: Clock, titleKey: "ava.feature4.title", descKey: "ava.feature4.desc" },
];

const Ava = () => {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t("ava.back")}
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4 animate-fade-up">
            {t("ava.label")}
          </p>
          <h1 className="mb-4 animate-fade-up-delay-1">ava</h1>
          <p className="text-lg text-foreground/80 mb-3 animate-fade-up-delay-2 leading-relaxed max-w-xl">
            {t("ava.headline")}
          </p>
          <p className="text-sm text-muted-foreground mb-10 animate-fade-up-delay-2 max-w-lg leading-relaxed">
            {t("ava.subheadline")}
          </p>

          <div className="flex items-center gap-4 animate-fade-up-delay-3">
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors duration-200"
            >
              <Play className="w-3.5 h-3.5" />
              {t("ava.cta.primary")}
            </a>
            <a
              href="mailto:camilaescuderob@gmail.com"
              className="text-sm text-foreground hover:text-muted-foreground transition-colors duration-200 link-underline"
            >
              {t("ava.cta.secondary")}
            </a>
          </div>
        </div>
      </section>

      {/* Demo placeholder */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="w-full aspect-video rounded-lg border border-border bg-muted/30 flex items-center justify-center animate-fade-up">
            <div className="text-center">
              <Video className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">{t("ava.demo.placeholder")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="mb-2">{t("ava.features.title")}</h2>
          <p className="text-sm text-muted-foreground mb-10">{t("ava.features.subtitle")}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {features.map(({ icon: Icon, titleKey, descKey }) => (
              <div key={titleKey} className="group">
                <div className="w-9 h-9 rounded-md border border-border flex items-center justify-center mb-3 group-hover:border-foreground/20 transition-colors duration-200">
                  <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
                </div>
                <h3 className="text-sm font-medium mb-1">{t(titleKey)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="mb-2">{t("ava.how.title")}</h2>
          <p className="text-sm text-muted-foreground mb-10">{t("ava.how.subtitle")}</p>

          <div className="space-y-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex gap-4 items-start">
                <span className="text-xs font-medium text-muted-foreground border border-border rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {step}
                </span>
                <div>
                  <p className="text-sm font-medium mb-0.5">{t(`ava.step${step}.title`)}</p>
                  <p className="text-sm text-muted-foreground">{t(`ava.step${step}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for coaches */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="border border-border rounded-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-medium">{t("ava.audience.title")}</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-lg">
              {t("ava.audience.description")}
            </p>
            <div className="flex flex-wrap gap-2">
              {["ava.audience.tag1", "ava.audience.tag2", "ava.audience.tag3", "ava.audience.tag4"].map((key) => (
                <span
                  key={key}
                  className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground"
                >
                  {t(key)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-3">{t("ava.cta.title")}</h2>
          <p className="text-sm text-muted-foreground mb-6">{t("ava.cta.description")}</p>
          <a
            href="mailto:camilaescuderob@gmail.com?subject=AVA – Interested"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors duration-200"
          >
            {t("ava.cta.final")}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <p className="text-xs text-muted-foreground">ava · {t("ava.footer")}</p>
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200">
            camila escudero
          </Link>
        </div>
      </footer>
    </main>
  );
};

export default Ava;
