import { Link } from "react-router-dom";
import { CARPETA_CL_LABEL, CARPETA_CL_URL } from "@/components/ava/avaCarpetaLink";
import { useLanguage } from "@/contexts/LanguageContext";

const AvaFooter = () => {
  const { t } = useLanguage();

  return (
    <footer className="ava-footer">
      <p id="ava-footer-name" className="ava-footer-line">
        {t("ava.footer.line")}
      </p>
      <nav className="ava-footer-nav" aria-labelledby="ava-footer-name">
        <a href="#ava-interest">{t("ava.cta.access")}</a>
        <a href="#como-funciona">{t("ava.cta.how")}</a>
        <a href={CARPETA_CL_URL} target="_blank" rel="noopener noreferrer">
          {CARPETA_CL_LABEL}
        </a>
        <Link to="/">{t("ava.nav.home")}</Link>
      </nav>
    </footer>
  );
};

export default AvaFooter;
