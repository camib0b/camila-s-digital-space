import { Link } from "react-router-dom";
import SectionEyebrow from "@/components/SectionEyebrow";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  cvHockeyCertificationKeys,
  cvHockeyRoles,
  cvHockeySkillKeys,
  cvHockeyTools,
} from "@/content/cvHockey";

const toolLinkClassName =
  "font-medium text-foreground text-sm hover:text-muted-foreground transition-colors link-underline focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ring";

const CvHockey = () => {
  const { t } = useLanguage();

  return (
    <>
      <section className="mb-10">
        <SectionEyebrow as="h2" className="mb-5">
          {t("cv.hockey.record")}
        </SectionEyebrow>
        <div className="space-y-6">
          {cvHockeyRoles.map((role) => (
            <div key={role.id}>
              <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{t(role.titleKey)}</p>
                  <p className="text-sm text-muted-foreground">{t(role.organizationKey)}</p>
                </div>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">{t(role.periodKey)}</span>
              </div>
              {role.bulletKeys.length > 0 ? (
                <ul className="mt-2 space-y-0.5 text-sm leading-relaxed text-muted-foreground">
                  {role.bulletKeys.map((bulletKey) => (
                    <li key={bulletKey} className="flex items-start gap-2">
                      <span className="mt-1 text-foreground/40">·</span>
                      {t(bulletKey)}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <SectionEyebrow as="h2" className="mb-5">
          {t("cv.hockey.tools")}
        </SectionEyebrow>
        <div className="space-y-6">
          {cvHockeyTools.map((tool) => (
            <div key={tool.id}>
              {tool.external ? (
                <a href={tool.href} target="_blank" rel="noopener noreferrer" className={toolLinkClassName}>
                  {tool.title}
                </a>
              ) : (
                <Link to={tool.href} className={toolLinkClassName}>
                  {tool.title}
                </Link>
              )}
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t(tool.descriptionKey)}</p>
            </div>
          ))}
          <p className="text-sm leading-relaxed text-muted-foreground">{t("cv.hockey.camera")}</p>
        </div>
      </section>

      <section className="mb-10">
        <SectionEyebrow as="h2" className="mb-5">
          {t("cv.education")}
        </SectionEyebrow>
        <div className="space-y-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t("cv.hockey.education.degree")}</p>
              <p className="text-sm text-muted-foreground">{t("cv.education.institution")}</p>
            </div>
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
              {t("cv.hockey.education.period")}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{t("cv.hockey.school")}</p>
            <p className="text-sm text-muted-foreground">{t("cv.hockey.school.detail")}</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <SectionEyebrow as="h2" className="mb-5">
          {t("cv.hockey.certifications")}
        </SectionEyebrow>
        <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
          {cvHockeyCertificationKeys.map((key) => (
            <li key={key} className="flex items-start gap-2">
              <span className="mt-1 text-foreground/40">·</span>
              {t(key)}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionEyebrow as="h2" className="mb-5">
          {t("cv.hockey.skills")}
        </SectionEyebrow>
        <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
          {cvHockeySkillKeys.map((key) => (
            <li key={key} className="flex items-start gap-2">
              <span className="mt-1 text-foreground/40">·</span>
              {t(key)}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default CvHockey;
