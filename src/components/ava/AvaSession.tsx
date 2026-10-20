import { useLanguage } from "@/contexts/LanguageContext";
import "./ava-session.css";

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
      </div>
    </section>
  );
};

export default AvaSession;
