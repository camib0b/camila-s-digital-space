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

const openLinkClassName =
  "shrink-0 text-sm text-foreground transition-colors duration-200 link-underline hover:text-muted-foreground";

const ProjectOpenLink = ({ project }: { project: PersonalProject }) => {
  const { t } = useLanguage();
  const label = t("personalProjects.open");

  if (project.link.kind === "internal" && project.link.fullPage) {
    return (
      <a href={project.link.path} className={openLinkClassName}>
        {label}
      </a>
    );
  }

  if (project.link.kind === "internal") {
    return (
      <Link to={project.link.path} className={openLinkClassName}>
        {label}
      </Link>
    );
  }

  if (project.link.kind === "external") {
    return (
      <a
        href={project.link.url}
        target="_blank"
        rel="noopener noreferrer"
        className={openLinkClassName}
      >
        {label}
      </a>
    );
  }

  return null;
};

const ProjectList = ({ projects }: ProjectListProps) => {
  const { t } = useLanguage();

  return (
    <ul className="space-y-8">
      {projects.map((project, index) => (
        <li key={project.id}>
          <div className="mb-1.5 flex items-baseline justify-between gap-4">
            <div className="flex min-w-0 items-baseline gap-2.5">
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-medium text-foreground">{t(project.titleKey)}</span>
            </div>
            <ProjectOpenLink project={project} />
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{t(project.descriptionKey)}</p>
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

  return (
    <section id="personal-projects" className="py-20 md:py-28">
      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider mb-8">
            {t("personalProjects.label")}
          </h2>
          <ProjectList projects={projectEntries} />
          <GitHubContributions />
        </div>
      </div>
    </section>
  );
};

export const SmallTools = () => {
  const { t } = useLanguage();
  const smallToolEntries = personalProjects.filter(
    (project) => project.category === "small-tool"
  );

  return (
    <section id="small-tools" className="py-20 md:py-28">
      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wider text-foreground">
            {t("personalProjects.smallTools.label")}
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
            {t("personalProjects.smallTools.description")}
          </p>
          <ProjectList projects={smallToolEntries} />
        </div>
      </div>
    </section>
  );
};

export default PersonalProjects;
