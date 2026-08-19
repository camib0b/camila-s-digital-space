import { useState } from "react";
import { BarChart3, Keyboard, Layers, Play, Share2, Timer, Video } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/i18n/types";

const EARLY_ACCESS_EMAIL = "camilaescuderob@gmail.com";

const differentiators: {
  icon: typeof Keyboard;
  titleKey: TranslationKey;
  bodyKey: TranslationKey;
}[] = [
  {
    icon: Keyboard,
    titleKey: "ava.diff.callout1.title",
    bodyKey: "ava.diff.callout1.body",
  },
  {
    icon: Layers,
    titleKey: "ava.diff.callout2.title",
    bodyKey: "ava.diff.callout2.body",
  },
  {
    icon: Timer,
    titleKey: "ava.diff.callout3.title",
    bodyKey: "ava.diff.callout3.body",
  },
];

const features: {
  icon: typeof Video;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
}[] = [
  {
    icon: Video,
    titleKey: "ava.feature1.title",
    descriptionKey: "ava.feature1.description",
  },
  {
    icon: Keyboard,
    titleKey: "ava.feature2.title",
    descriptionKey: "ava.feature2.description",
  },
  {
    icon: BarChart3,
    titleKey: "ava.feature3.title",
    descriptionKey: "ava.feature3.description",
  },
  {
    icon: Share2,
    titleKey: "ava.feature4.title",
    descriptionKey: "ava.feature4.description",
  },
];

const steps: { titleKey: TranslationKey; descriptionKey: TranslationKey }[] = [
  { titleKey: "ava.step1.title", descriptionKey: "ava.step1.description" },
  { titleKey: "ava.step2.title", descriptionKey: "ava.step2.description" },
  { titleKey: "ava.step3.title", descriptionKey: "ava.step3.description" },
];

type AudienceId = "coaches" | "players" | "analysts" | "clubs";

const audienceTabs: {
  id: AudienceId;
  labelKey: TranslationKey;
  bodyKey: TranslationKey;
}[] = [
  {
    id: "coaches",
    labelKey: "ava.audience.coaches",
    bodyKey: "ava.audience.coaches.body",
  },
  {
    id: "players",
    labelKey: "ava.audience.players",
    bodyKey: "ava.audience.players.body",
  },
  {
    id: "analysts",
    labelKey: "ava.audience.analysts",
    bodyKey: "ava.audience.analysts.body",
  },
  {
    id: "clubs",
    labelKey: "ava.audience.clubs",
    bodyKey: "ava.audience.clubs.body",
  },
];

const Ava = () => {
  const { language, t } = useLanguage();
  const [activeAudience, setActiveAudience] = useState<AudienceId>("coaches");
  const activeAudienceTab =
    audienceTabs.find((tab) => tab.id === activeAudience) ?? audienceTabs[0];

  const earlyAccessSubject =
    language === "es" ? "AVA – Acceso anticipado" : "AVA – Early access";
  const earlyAccessMailto = `mailto:${EARLY_ACCESS_EMAIL}?subject=${encodeURIComponent(earlyAccessSubject)}`;

  return (
    <main className="min-h-screen bg-background">
      <PageHeader
        backLabel={t("ava.back")}
        stickyClassName="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border"
        containerClassName="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between"
      />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4 animate-fade-up">
            ava
          </p>
          <h1 className="mb-4 animate-fade-up-delay-1">{t("ava.headline")}</h1>
          <p className="text-lg text-foreground/80 mb-8 animate-fade-up-delay-2 leading-relaxed max-w-xl">
            {t("ava.subheadline")}
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-6 animate-fade-up-delay-3">
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors duration-200"
            >
              <Play className="w-3.5 h-3.5" />
              {t("ava.cta.primary")}
            </a>
            <a
              href={earlyAccessMailto}
              className="text-sm text-foreground hover:text-muted-foreground transition-colors duration-200 link-underline"
            >
              {t("ava.cta.secondary")}
            </a>
          </div>

          <p className="text-xs text-muted-foreground animate-fade-up-delay-3">
            {t("ava.hero.meta")}
          </p>
        </div>
      </section>

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

      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
            {t("ava.diff.label")}
          </p>
          <h2 className="mb-4">{t("ava.diff.headline")}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-10 max-w-2xl">
            {t("ava.diff.body")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {differentiators.map(({ icon: Icon, titleKey, bodyKey }) => (
              <div key={titleKey} className="group">
                <div className="w-9 h-9 rounded-md border border-border flex items-center justify-center mb-3 group-hover:border-foreground/20 transition-colors duration-200">
                  <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
                </div>
                <h3 className="text-sm font-medium mb-1">{t(titleKey)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(bodyKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="mb-10">{t("ava.features.title")}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {features.map(({ icon: Icon, titleKey, descriptionKey }) => (
              <div key={titleKey} className="group">
                <div className="w-9 h-9 rounded-md border border-border flex items-center justify-center mb-3 group-hover:border-foreground/20 transition-colors duration-200">
                  <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
                </div>
                <h3 className="text-sm font-medium mb-1">{t(titleKey)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(descriptionKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="mb-10">{t("ava.how.title")}</h2>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.titleKey} className="flex gap-4 items-start">
                <span className="text-xs font-medium text-muted-foreground border border-border rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium mb-0.5">{t(step.titleKey)}</p>
                  <p className="text-sm text-muted-foreground">{t(step.descriptionKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="border border-border rounded-lg p-8">
            <h2 className="text-lg font-medium mb-4">{t("ava.audience.title")}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
              {t("ava.audience.description")}
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div
            className="flex flex-wrap gap-2 mb-6"
            role="tablist"
            aria-label={language === "es" ? "Audiencia" : "Audience"}
          >
            {audienceTabs.map((tab) => {
              const isActive = tab.id === activeAudience;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`audience-tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`audience-panel-${tab.id}`}
                  onClick={() => setActiveAudience(tab.id)}
                  className={[
                    "text-xs px-3 py-1 rounded-full border transition-colors duration-200",
                    isActive
                      ? "border-foreground/30 bg-secondary text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20",
                  ].join(" ")}
                >
                  {t(tab.labelKey)}
                </button>
              );
            })}
          </div>
          <div
            role="tabpanel"
            id={`audience-panel-${activeAudienceTab.id}`}
            aria-labelledby={`audience-tab-${activeAudienceTab.id}`}
          >
            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
              {t(activeAudienceTab.bodyKey)}
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-3">{t("ava.cta.title")}</h2>
          <p className="text-sm text-muted-foreground mb-6">{t("ava.cta.description")}</p>
          <a
            href={earlyAccessMailto}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors duration-200"
          >
            {t("ava.cta.final")}
          </a>
        </div>
      </section>

      <footer className="border-t border-border py-6 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{t("ava.footer")}</p>
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            camila escudero
          </Link>
        </div>
      </footer>
    </main>
  );
};

export default Ava;
