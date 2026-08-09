import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { personalProjects } from "@/content/personalProjects";

const PersonalProjects = () => {
  const { t } = useLanguage();

  return (
    <section id="personal-projects" className="py-20 md:py-28 bg-background">
      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider mb-8">
            {t("personalProjects.label")}
          </h2>
          <ul className="space-y-6">
            {personalProjects.map((project) => (
              <li key={project.id} className="text-sm text-muted-foreground leading-relaxed">
                <span>{t(project.textKey)}</span>
                {project.link.kind === "internal" ? (
                  <Link
                    to={project.link.path}
                    className="ml-3 inline-flex items-center rounded-md border border-border px-2.5 py-1 text-xs text-foreground hover:bg-muted/60 transition-colors duration-200"
                  >
                    {t("personalProjects.view")}
                  </Link>
                ) : null}
                {project.link.kind === "external" ? (
                  <a
                    href={project.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3 inline-flex items-center rounded-md border border-border px-2.5 py-1 text-xs text-foreground hover:bg-muted/60 transition-colors duration-200"
                  >
                    {t("personalProjects.view")}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PersonalProjects;
