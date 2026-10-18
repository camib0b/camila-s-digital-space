import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  personalProjects,
  type PersonalProject,
} from "@/content/personalProjects";
import GitHubContributions from "@/components/GitHubContributions";
import PublishingPipelineDiagram from "@/components/PublishingPipelineDiagram";

interface ProjectListProps {
  projects: PersonalProject[];
  startingNumber?: number;
}

interface SectionEntries {
  projectsBeforeConnector: PersonalProject[];
  connector: PersonalProject | undefined;
  projectsAfterConnector: PersonalProject[];
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

const ConnectorMotif = () => (
  <span aria-hidden="true" className="flex w-16 items-center text-foreground/40 sm:w-24">
    <span className="h-px flex-1 bg-current" />
    <svg viewBox="0 0 10 10" className="h-2.5 w-2.5 shrink-0" fill="none">
      <path d="M2 1.5L7.5 5L2 8.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  </span>
);

const PublishingPipelineBand = ({ project }: { project: PersonalProject }) => {
  const { t } = useLanguage();
  const sourceName = t("personalProjects.videoAnalysis.title");
  const destinationName = t("personalProjects.publishingPipeline.diagram.deploy");

  return (
    <div className="mt-8 border-y border-border py-4">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {t("personalProjects.publishingPipeline.connectLabel")}
          </span>
          <span className="text-sm font-medium text-foreground">{t(project.titleKey)}</span>
        </div>
        <p className="flex items-center gap-2 text-xs text-foreground">
          <span>{sourceName}</span>
          <span className="sr-only">{t("personalProjects.publishingPipeline.connectsTo")}</span>
          <ConnectorMotif />
          <span>{destinationName}</span>
        </p>
      </div>
      <PublishingPipelineDiagram />
      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{t(project.descriptionKey)}</p>
    </div>
  );
};

const ProjectList = ({ projects, startingNumber = 1 }: ProjectListProps) => {
  const { t } = useLanguage();

  return (
    <ul className="space-y-8">
      {projects.map((project, index) => (
        <li key={project.id}>
          <div className="mb-1.5 flex items-baseline justify-between gap-4">
            <div className="flex min-w-0 items-baseline gap-2.5">
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                {String(startingNumber + index).padStart(2, "0")}
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

function splitSectionEntries(entries: PersonalProject[]): SectionEntries {
  const connectorIndex = entries.findIndex((entry) => entry.category === "connector");
  if (connectorIndex === -1) {
    return {
      projectsBeforeConnector: entries,
      connector: undefined,
      projectsAfterConnector: [],
    };
  }

  return {
    projectsBeforeConnector: entries.slice(0, connectorIndex),
    connector: entries[connectorIndex],
    projectsAfterConnector: entries.slice(connectorIndex + 1),
  };
}

const PersonalProjects = () => {
  const { t } = useLanguage();
  const sectionEntries = personalProjects.filter(
    (project) => project.category === "project" || project.category === "connector",
  );
  const { projectsBeforeConnector, connector, projectsAfterConnector } =
    splitSectionEntries(sectionEntries);

  return (
    <section id="personal-projects" className="py-20 md:py-28">
      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider mb-8">
            {t("personalProjects.label")}
          </h2>
          {projectsBeforeConnector.length > 0 ? (
            <ProjectList projects={projectsBeforeConnector} />
          ) : null}
          {connector ? <PublishingPipelineBand project={connector} /> : null}
          {projectsAfterConnector.length > 0 ? (
            <div className="mt-8">
              <ProjectList
                projects={projectsAfterConnector}
                startingNumber={projectsBeforeConnector.length + 1}
              />
            </div>
          ) : null}
          <GitHubContributions />
        </div>
      </div>
    </section>
  );
};

export const SmallTools = () => {
  const { t } = useLanguage();
  const smallToolEntries = personalProjects.filter(
    (project) => project.category === "small-tool",
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
