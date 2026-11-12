import { Github, Languages, Linkedin, Mail, MapPin } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import AffiliationRail from "@/components/AffiliationRail";
import PageHeader from "@/components/PageHeader";
import SectionEyebrow from "@/components/SectionEyebrow";
import { useLanguage } from "@/contexts/LanguageContext";
import { CONTACT_EMAIL } from "@/content/contact";
import { SOCIAL_LINKS } from "@/content/social";
import { cvJobs, cvLeadership, cvProjects, cvTechnologyLabel, type CvProject } from "@/content/cv";
import { cvGrowthJobs, cvGrowthLeadership, cvGrowthProjects, cvVariantFromPath } from "@/content/cvGrowth";
import type { TranslationKey } from "@/i18n/types";

const variantLinkClassName =
  "inline-flex min-h-11 min-w-11 cursor-pointer items-center px-1 text-sm focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ring";

const waitlistLinkClassName =
  "inline-flex min-h-11 cursor-pointer items-center font-medium text-foreground link-underline hover:text-muted-foreground focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ring";

const pairedLinkClassName = `${waitlistLinkClassName} min-w-11 px-1 text-sm`;

function CvProjectEntry({ project }: { project: CvProject }) {
  const { t } = useLanguage();
  const titleClassName =
    "font-medium text-foreground text-sm hover:text-muted-foreground transition-colors link-underline";

  return (
    <div>
      <div className="mb-1 flex w-full flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
        {project.href && project.externalHref ? (
          <p className="flex min-w-0 flex-wrap items-center gap-x-2 text-sm font-medium text-foreground">
            <Link to={project.href} className={pairedLinkClassName}>
              AVA
            </Link>
            <span className="text-muted-foreground">{t("cv.growth.pipeline.join")}</span>
            <a href={project.externalHref} target="_blank" rel="noopener noreferrer" className={pairedLinkClassName}>
              carpeta.cl
            </a>
          </p>
        ) : project.href ? (
          <Link to={project.href} className={titleClassName}>
            {t(project.titleKey)}
          </Link>
        ) : project.externalHref ? (
          <a href={project.externalHref} target="_blank" rel="noopener noreferrer" className={titleClassName}>
            {t(project.titleKey)}
          </a>
        ) : (
          <p className="w-full text-sm font-medium leading-relaxed text-foreground sm:min-w-0 sm:flex-1">
            {t(project.titleKey)}
          </p>
        )}
        <span className="font-mono text-xs text-muted-foreground sm:max-w-[40%] sm:shrink-0 sm:text-right">
          {t(project.typeKey)}
        </span>
      </div>
      <p
        className={
          project.impactKey
            ? "mb-1 text-sm leading-relaxed text-muted-foreground"
            : "mb-2 text-sm leading-relaxed text-muted-foreground"
        }
      >
        {t(project.descriptionKey)}
      </p>
      {project.impactKey ? <p className="mb-2 text-sm text-foreground/70">↳ {t(project.impactKey)}</p> : null}
      {project.bulletKeys && project.bulletKeys.length > 0 ? (
        <ul className="mb-2 mt-2 space-y-0.5 text-sm leading-relaxed text-muted-foreground">
          {project.bulletKeys.map((bulletKey) => (
            <li key={bulletKey} className="flex items-start gap-2">
              <span className="mt-1 text-foreground/40">·</span>
              {t(bulletKey)}
            </li>
          ))}
        </ul>
      ) : null}
      {project.waitlistKey && project.waitlistHref ? (
        <p className="mb-2 text-sm leading-relaxed text-muted-foreground">
          {t("personalProjects.videoAnalysis.waitlistStatus")}{" "}
          <Link to={project.waitlistHref} className={waitlistLinkClassName}>
            {t(project.waitlistKey)}
          </Link>
        </p>
      ) : null}
      {project.technologies.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.map((technology) => {
            const label = cvTechnologyLabel(technology, t);
            return (
              <span key={label} className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                {label}
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

const CV = () => {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const variant = cvVariantFromPath(pathname);
  const jobs = variant === "growth" ? cvGrowthJobs : cvJobs;
  const projects = variant === "growth" ? cvGrowthProjects : cvProjects;
  const closingProject =
    variant === "growth" ? projects.find((project) => project.id === "fleetOptimizer") : undefined;
  const listedProjects = closingProject
    ? projects.filter((project) => project.id !== closingProject.id)
    : projects;
  const leadership = variant === "growth" ? cvGrowthLeadership : cvLeadership;
  const roleKey: TranslationKey = variant === "growth" ? "cv.growth.role" : "cv.role";
  const summaryKey: TranslationKey = variant === "growth" ? "cv.growth.summary" : "cv.summary";
  const footerKey: TranslationKey = variant === "growth" ? "cv.growth.footerNote" : "cv.footerNote";

  return (
    <main className="min-h-screen bg-background">
      <PageHeader
        backLabel={t("cv.back")}
        stickyClassName="border-b border-border sticky top-0 z-50 bg-background"
        containerClassName="container px-6 py-3 flex items-center justify-between max-w-3xl mx-auto"
      />

      <div className="container px-6 py-12 max-w-3xl mx-auto">
        <nav aria-label={t("cv.variant.group")} className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-1">
          <p className="text-sm text-muted-foreground">{t("cv.variant.group")}</p>
          <Link
            to="/cv"
            aria-current={variant === "analytics" ? "page" : undefined}
            className={`${variantLinkClassName} ${variant === "analytics" ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t("cv.variant.analytics")}
          </Link>
          <Link
            to="/cv/growth"
            aria-current={variant === "growth" ? "page" : undefined}
            className={`${variantLinkClassName} ${variant === "growth" ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t("cv.variant.growth")}
          </Link>
        </nav>
        <section className="mb-12">
          <h1 className="text-2xl font-medium text-foreground mb-1">Camila Escudero</h1>
          <p className="text-sm text-muted-foreground mb-3">{t(roleKey)}</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-xl">
            {t(summaryKey)}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Santiago, Chile
            </span>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Mail className="w-3 h-3" />
              {CONTACT_EMAIL}
            </a>
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Linkedin className="w-3 h-3" />
              LinkedIn
            </a>
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Github className="w-3 h-3" />
              GitHub
            </a>
          </div>
          <p className="mt-3 flex max-w-xl items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
            <Languages className="mt-0.5 h-3 w-3 shrink-0" />
            <span className="font-medium text-foreground">{t("cv.languages.pair")}</span>
          </p>
          <div className="mt-8">
            <SectionEyebrow as="h2" className="mb-4">
              {t("cv.affiliations")}
            </SectionEyebrow>
            <AffiliationRail />
          </div>
        </section>

        <div className="border-b border-border mb-10" />

        <section className="mb-10">
          <SectionEyebrow as="h2" className="mb-5">
            {t("cv.workExperience")}
          </SectionEyebrow>
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job.id}>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                  <div>
                    <p className="font-medium text-foreground text-sm">{t(job.titleKey)}</p>
                    <p className="text-sm text-muted-foreground">{t(job.companyKey)}</p>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono shrink-0">
                    {t(job.periodKey)}
                  </span>
                </div>
                <ul className="text-sm text-muted-foreground leading-relaxed space-y-0.5 mt-2 mb-2">
                  {job.bulletKeys.map((bulletKey) => (
                    <li key={bulletKey} className="flex items-start gap-2">
                      <span className="text-foreground/40 mt-1">·</span>
                      {t(bulletKey)}
                    </li>
                  ))}
                </ul>
                {job.technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {job.technologies.map((technology) => {
                      const label = cvTechnologyLabel(technology, t);
                      return (
                        <span
                          key={label}
                          className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground"
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <SectionEyebrow as="h2" className="mb-5">
            {t("cv.selectedProjects")}
          </SectionEyebrow>
          <div className="space-y-6">
            {listedProjects.map((project) => (
              <CvProjectEntry key={project.id} project={project} />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <SectionEyebrow as="h2" className="mb-5">
            {t("cv.education")}
          </SectionEyebrow>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
              <div>
                <p className="font-medium text-foreground text-sm">{t("cv.education.degree")}</p>
                <p className="text-sm text-muted-foreground">{t("cv.education.institution")}</p>
              </div>
              <span className="text-xs text-muted-foreground font-mono shrink-0">
                {t("cv.education.period")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{t("cv.education.details")}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("cv.education.courseworkLabel")}: {t("cv.education.coursework")}
            </p>
          </div>
        </section>

        <section>
          <SectionEyebrow as="h2" className="mb-5">
            {t("cv.leadershipAthletics")}
          </SectionEyebrow>
          <div className="space-y-3">
            {leadership.map((item) => (
              <div key={item.id}>
                <p className="text-sm">
                  <span className="font-medium text-foreground">{t(item.roleKey)}</span>
                  <span className="text-muted-foreground"> — {t(item.organizationKey)}</span>
                </p>
                {item.descriptionKey ? (
                  <p className="text-sm text-muted-foreground">{t(item.descriptionKey)}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {variant === "growth" ? (
          <section className="mt-10">
            <h2 className="text-xs font-medium text-foreground uppercase tracking-wider mb-5">
              {t("cv.growth.skillsLabel")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{t("cv.growth.skills")}</p>
          </section>
        ) : null}
        {closingProject ? (
          <section className="mt-10">
            <CvProjectEntry project={closingProject} />
          </section>
        ) : null}
      </div>

      <footer className="border-t border-border py-6">
        <div className="container px-6 text-center text-xs text-muted-foreground max-w-3xl mx-auto">
          Camila Escudero · Santiago, Chile · {t(footerKey)}
        </div>
      </footer>
    </main>
  );
};

export default CV;
