import { useLanguage } from "@/contexts/LanguageContext";
import "./ava-session.css";

const BEFORE_PROGRAMS = [
  {
    titleKey: "ava.session.before.concat.title",
    noteKey: "ava.session.before.concat.note",
  },
  {
    titleKey: "ava.session.before.tag.title",
    noteKey: "ava.session.before.tag.note",
  },
  {
    titleKey: "ava.session.before.present.title",
    noteKey: "ava.session.before.present.note",
  },
] as const;

const SESSION_FLOW = [
  "ava.session.flow.import",
  "ava.session.flow.tag",
  "ava.session.flow.analyze",
  "ava.session.flow.present",
  "ava.session.flow.export",
] as const;

const AvaSession = () => {
  const { t } = useLanguage();

  return (
    <section className="ava-section" id="una-sesion" aria-labelledby="ava-session-title">
      <div className="ava-shell">
        <div className="ava-section-head ava-session-head">
          <p className="ava-kicker">{t("ava.session.kicker")}</p>
          <h2 id="ava-session-title">{t("ava.session.headline")}</h2>
          <p className="ava-section-body">{t("ava.session.lede")}</p>
        </div>

        <div className="ava-session">
          <div className="ava-session-block">
            <p className="ava-kicker" id="ava-session-before-title">
              {t("ava.session.before.kicker")}
            </p>
            <ol className="ava-session-chain" aria-labelledby="ava-session-before-title">
              {BEFORE_PROGRAMS.map((program, index) => (
                <li className="ava-session-program" key={program.titleKey}>
                  <span className="ava-session-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="ava-session-program-title">{t(program.titleKey)}</p>
                  <p className="ava-session-program-note">{t(program.noteKey)}</p>
                </li>
              ))}
            </ol>
            <p className="ava-session-aside">{t("ava.session.before.aside")}</p>
          </div>

          <div className="ava-session-block">
            <p className="ava-kicker" id="ava-session-with-title">
              {t("ava.session.with.kicker")}
            </p>
            <ol className="ava-session-flow" aria-labelledby="ava-session-with-title">
              {SESSION_FLOW.map((stepKey) => (
                <li key={stepKey}>{t(stepKey)}</li>
              ))}
            </ol>
            <p className="ava-session-aside ava-session-aside-ava">{t("ava.session.with.body")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvaSession;
