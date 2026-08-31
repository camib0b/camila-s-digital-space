import { useEffect } from "react";
import { Link } from "react-router-dom";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import AvaStage, { AvaTimeline } from "@/components/ava/AvaStage";
import "@/components/ava/ava.css";
import {
  AVA_ACCESS_EMAIL,
  AVA_ACCESS_SUBJECT,
  AVA_EVENTS,
  AVA_FOLLOW_UPS,
  AVA_STATS,
} from "@/content/ava";
import { useLanguage } from "@/contexts/LanguageContext";

const accessMailto = `mailto:${AVA_ACCESS_EMAIL}?subject=${encodeURIComponent(AVA_ACCESS_SUBJECT)}`;

const STEPS = [
  {
    index: "01",
    kickerKey: "ava.step1.kicker",
    titleKey: "ava.step1.title",
    bodyKey: "ava.step1.body",
  },
  {
    index: "02",
    kickerKey: "ava.step2.kicker",
    titleKey: "ava.step2.title",
    bodyKey: "ava.step2.body",
  },
  {
    index: "03",
    kickerKey: "ava.step3.kicker",
    titleKey: "ava.step3.title",
    bodyKey: "ava.step3.body",
  },
] as const;

const MODES = [
  { kicker: "01", titleKey: "ava.modes.tagging.title", bodyKey: "ava.modes.tagging.body" },
  { kicker: "02", titleKey: "ava.modes.analyzing.title", bodyKey: "ava.modes.analyzing.body" },
  { kicker: "03", titleKey: "ava.modes.presentation.title", bodyKey: "ava.modes.presentation.body" },
] as const;

const Ava = () => {
  const { language, t } = useLanguage();

  useEffect(() => {
    const previousTitle = document.title;
    const previousBackground = document.body.style.backgroundColor;
    document.title = t("ava.document.title");
    document.body.style.backgroundColor = "#070708";

    return () => {
      document.title = previousTitle;
      document.body.style.backgroundColor = previousBackground;
    };
  }, [t]);

  return (
    <div className="ava-root">
      <header className="ava-chrome">
        <span className="ava-wordmark">AVA</span>
        <div className="ava-chrome-end">
          <ThemeToggle />
          <LanguageToggle />
          <Link to="/" className="ava-site-link">
            {t("ava.nav.home")}
          </Link>
        </div>
      </header>

      <main>
        <section className="ava-hero">
          <div className="ava-hero-copy">
            <p className="ava-kicker">{t("ava.hero.kicker")}</p>
            <h1>{t("ava.headline")}</h1>
            <p className="ava-lede">{t("ava.lede")}</p>
            <p className="ava-hero-body">{t("ava.hero.body")}</p>
            <div className="ava-actions">
              <a className="ava-cta" href={accessMailto}>
                {t("ava.cta.access")}
              </a>
              <a className="ava-text-link" href="#como-funciona">
                {t("ava.cta.how")}
              </a>
            </div>
            <p className="ava-meta">{t("ava.hero.meta")}</p>
          </div>
          <AvaStage caption={t("ava.stage.caption")} />
        </section>

        <AvaTimeline language={language} />

        <section className="ava-section">
          <div className="ava-shell ava-section-head">
            <p className="ava-kicker">{t("ava.events.kicker")}</p>
            <h2>{t("ava.events.headline")}</h2>
            <p className="ava-section-body">{t("ava.events.body")}</p>
          </div>
          <dl className="ava-events">
            {AVA_EVENTS.map((event) => (
              <div className="ava-event" key={event.token}>
                <dt>{event.token}</dt>
                <dd>{language === "es" ? event.es : event.en}</dd>
              </div>
            ))}
          </dl>
          <ul className="ava-follow">
            {AVA_FOLLOW_UPS.map((item) => (
              <li key={item.id}>
                <b>{language === "es" ? item.es : item.en}</b>
                {t(item.bodyKey)}
              </li>
            ))}
          </ul>
        </section>

        <section className="ava-section">
          <div className="ava-shell">
            <div className="ava-section-head">
              <p className="ava-kicker">{t("ava.modes.kicker")}</p>
              <h2>{t("ava.modes.headline")}</h2>
            </div>
            <div className="ava-modes">
              {MODES.map((mode) => (
                <article className="ava-mode" key={mode.titleKey}>
                  <p className="ava-kicker">{mode.kicker}</p>
                  <h3>{t(mode.titleKey)}</h3>
                  <p>{t(mode.bodyKey)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ava-section" id="como-funciona">
          <div className="ava-shell">
            <div className="ava-section-head">
              <p className="ava-kicker">{t("ava.how.kicker")}</p>
              <h2>{t("ava.how.title")}</h2>
              <p className="ava-section-body">{t("ava.how.body")}</p>
            </div>
            <div className="ava-steps">
              {STEPS.map((step) => (
                <article className="ava-step" key={step.index}>
                  <span className="ava-step-index">{step.index}</span>
                  <p className="ava-kicker">{t(step.kickerKey)}</p>
                  <h3>{t(step.titleKey)}</h3>
                  <p>{t(step.bodyKey)}</p>
                </article>
              ))}
            </div>
            <div className="ava-clip">
              <p className="ava-kicker">{t("ava.clip.kicker")}</p>
              <p className="ava-section-body">{t("ava.clip.body")}</p>
              <div className="ava-clip-window" aria-hidden="true">
                <div className="ava-clip-span" />
                <div className="ava-clip-mark" />
                <div className="ava-clip-labels">
                  <span>{t("ava.clip.lead")}</span>
                  <span>{t("ava.clip.lag")}</span>
                </div>
                <div className="ava-clip-center">{t("ava.clip.mark")}</div>
              </div>
              <div className="ava-stats">
                {AVA_STATS.map((stat) => (
                  <span key={stat.id}>{language === "es" ? stat.es : stat.en}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="ava-section">
          <div className="ava-shell ava-origin">
            <p className="ava-kicker">{t("ava.origin.kicker")}</p>
            <div>
              <h2>{t("ava.origin.headline")}</h2>
              <p className="ava-section-body">{t("ava.origin.body")}</p>
            </div>
          </div>
        </section>

        <section className="ava-section ava-access">
          <div className="ava-shell">
            <p className="ava-kicker">{t("ava.access.kicker")}</p>
            <h2>{t("ava.access.headline")}</h2>
            <p className="ava-section-body">{t("ava.access.body")}</p>
            <a className="ava-access-mail" href={accessMailto}>
              {AVA_ACCESS_EMAIL}
            </a>
          </div>
        </section>
      </main>

      <footer className="ava-footer">
        <span>{t("ava.footer.line")}</span>
        <Link to="/">{t("ava.nav.home")}</Link>
      </footer>
    </div>
  );
};

export default Ava;
