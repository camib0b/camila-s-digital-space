import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  personalProjects,
  type PersonalProject,
} from "@/content/personalProjects";
import GitHubContributions from "@/components/GitHubContributions";

interface ProjectListProps {
  projects: PersonalProject[];
}

const ProjectList = ({ projects }: ProjectListProps) => {
  const { t } = useLanguage();
  const projectLinkClassName =
    "ml-3 inline-flex items-center rounded-md border border-border px-2.5 py-1 text-xs text-foreground hover:bg-muted/60 transition-colors duration-200";

  return (
    <ul className="space-y-6">
      {projects.map((project) => (
        <li key={project.id} className="text-sm text-muted-foreground leading-relaxed">
          <span>{t(project.textKey)}</span>
          {project.link.kind === "internal" ? (
            <Link to={project.link.path} className={projectLinkClassName}>
              {t("personalProjects.view")}
            </Link>
          ) : null}
          {project.link.kind === "external" ? (
            <a
              href={project.link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={projectLinkClassName}
            >
              {t("personalProjects.view")}
            </a>
          ) : null}
        </li>
      ))}
    </ul>
  );
};

const PersonalProjects = () => {
  const { t } = useLanguage();
  const projectEntries = personalProjects.filter(
    (project) => project.category === "project"
  );
  const learningLabEntries = personalProjects.filter(
    (project) => project.category === "learning-lab"
  );

  return (
    <section id="personal-projects" className="py-20 md:py-28 bg-background">
      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider mb-8">
            {t("personalProjects.label")}
          </h2>
          <ProjectList projects={projectEntries} />

          <div className="mt-12">
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("personalProjects.learningLab.label")}
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              {t("personalProjects.learningLab.description")}
            </p>
            <ProjectList projects={learningLabEntries} />
          </div>

          <GitHubContributions />
        </div>
      </div>
    </section>
  );
};

export default PersonalProjects;
