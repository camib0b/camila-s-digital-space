import { Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { cvJobs, cvLeadership, cvProjects, cvSkills } from "@/content/cv";

const CV = () => {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-background">
      <PageHeader
        backLabel={t("cv.back")}
        stickyClassName="border-b border-border sticky top-0 z-50 bg-background"
        containerClassName="container px-6 py-3 flex items-center justify-between max-w-3xl mx-auto"
        actions={
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            PDF
          </button>
        }
      />

      <div className="container px-6 py-12 max-w-3xl mx-auto">
        <section className="flex flex-col md:flex-row gap-6 items-start mb-12">
          <div className="w-24 h-24 rounded-md bg-muted border border-border flex items-center justify-center shrink-0">
            <span className="text-xs text-muted-foreground">{t("cv.photo")}</span>
          </div>
          <div>
            <h1 className="text-2xl font-medium text-foreground mb-1">Camila Escudero</h1>
            <p className="text-sm text-muted-foreground mb-3">{t("cv.role")}</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-xl">
              {t("cv.summary")}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Santiago, Chile
              </span>
              <a
                href="mailto:hello@camilaescudero.com"
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <Mail className="w-3 h-3" />
                hello@camilaescudero.com
              </a>
              <a href="#" className="flex items-center gap-1 hover:text-foreground transition-colors">
                <Linkedin className="w-3 h-3" />
                LinkedIn
              </a>
              <a href="#" className="flex items-center gap-1 hover:text-foreground transition-colors">
                <Github className="w-3 h-3" />
                GitHub
              </a>
            </div>
          </div>
        </section>

        <div className="border-b border-border mb-10" />

        <section className="mb-10">
          <h2 className="text-xs font-medium text-foreground uppercase tracking-wider mb-5">
            {t("cv.selectedProjects")}
          </h2>
          <div className="space-y-6">
            {cvProjects.map((project) => (
              <div key={project.id}>
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <p className="font-medium text-foreground text-sm">{t(project.titleKey)}</p>
                  <span className="text-xs text-muted-foreground font-mono shrink-0">
                    {t(project.typeKey)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-1">
                  {t(project.descriptionKey)}
                </p>
                <p className="text-sm text-foreground/70 mb-2">↳ {t(project.impactKey)}</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xs font-medium text-foreground uppercase tracking-wider mb-5">
            {t("cv.workExperience")}
          </h2>
          <div className="space-y-6">
            {cvJobs.map((job) => (
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
                <div className="flex flex-wrap gap-1.5">
                  {job.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xs font-medium text-foreground uppercase tracking-wider mb-5">
            {t("cv.education")}
          </h2>
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
            <p className="text-xs text-muted-foreground/70 mt-1">
              Coursework: {t("cv.education.coursework")}
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xs font-medium text-foreground uppercase tracking-wider mb-5">
            {t("cv.skills")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: t("cv.languages"), items: cvSkills.languages },
              { label: t("cv.frameworks"), items: cvSkills.frameworks },
              { label: t("cv.tools"), items: cvSkills.tools },
            ].map((group) => (
              <div key={group.label}>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-medium text-foreground uppercase tracking-wider mb-5">
            {t("cv.leadershipAthletics")}
          </h2>
          <div className="space-y-3">
            {cvLeadership.map((item) => (
              <div key={item.id}>
                <p className="text-sm">
                  <span className="font-medium text-foreground">{t(item.roleKey)}</span>
                  <span className="text-muted-foreground"> — {t(item.organizationKey)}</span>
                </p>
                <p className="text-sm text-muted-foreground">{t(item.descriptionKey)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="border-t border-border py-6">
        <div className="container px-6 text-center text-xs text-muted-foreground max-w-3xl mx-auto">
          Camila Escudero · Santiago, Chile · {t("cv.availableFor")}
        </div>
      </footer>
    </main>
  );
};

export default CV;
