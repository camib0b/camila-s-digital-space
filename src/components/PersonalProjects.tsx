import { Link } from "react-router-dom";
import avaProjectFrame from "@/assets/ava/tagging-640.webp";
import capitalProjectFrame from "@/assets/projects/capital-frame.webp";
import concatProjectFrame from "@/assets/projects/concat-frame.webp";
import CurtainReveal from "@/components/CurtainReveal";
import DestinationHintLink from "@/components/DestinationHintLink";
import PublishingPipelineDiagram from "@/components/PublishingPipelineDiagram";
import SectionEyebrow from "@/components/SectionEyebrow";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  personalProjects,
  type ConnectorPersonalProject,
  type LinkedPersonalProject,
  type PersonalProject,
} from "@/content/personalProjects";

type ProjectFrameSource = {
  src: string;
  width: number;
  height: number;
};

const projectFrames: Partial<Record<string, ProjectFrameSource>> = {
  "video-analysis": { src: avaProjectFrame, width: 640, height: 404 },
  capital: { src: capitalProjectFrame, width: 1008, height: 767 },
  concat: { src: concatProjectFrame, width: 768, height: 857 },
};

function ProjectFrame({ source }: { source: ProjectFrameSource }) {
  return (
    <div className="project-frame" aria-hidden="true">
      <img
        className="project-frame-image"
        src={source.src}
        width={source.width}
        height={source.height}
        alt=""
        decoding="async"
        loading="lazy"
      />
    </div>
  );
}

interface ProjectListProps {
  projects: LinkedPersonalProject[];
  startingNumber?: number;
}

interface SectionEntries {
  projectsBeforeConnector: LinkedPersonalProject[];
  connector: ConnectorPersonalProject | undefined;
  projectsAfterConnector: LinkedPersonalProject[];
}

const ConnectorMotif = () => (
  <span aria-hidden="true" className="flex w-16 items-center text-foreground/40 sm:w-24">
    <span className="h-px flex-1 bg-current" />
    <svg viewBox="0 0 10 10" className="h-2.5 w-2.5 shrink-0" fill="none">
      <path d="M2 1.5L7.5 5L2 8.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  </span>
);

const PublishingPipelineBand = ({ project }: { project: ConnectorPersonalProject }) => {
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
          <span className="text-base font-medium text-foreground">{t(project.titleKey)}</span>
        </div>
        <p className="flex items-center gap-2 text-xs text-foreground">
          <span>{sourceName}</span>
          <span className="sr-only">{t("personalProjects.publishingPipeline.connectsTo")}</span>
          <ConnectorMotif />
          <span>{destinationName}</span>
        </p>
      </div>
      <PublishingPipelineDiagram />
      <p className="mt-5 text-base leading-relaxed text-muted-foreground">{t(project.descriptionKey)}</p>
    </div>
  );
};

const narrativeLineClassName = "min-w-0 text-base leading-relaxed text-muted-foreground";

const ProjectTitle = ({ project }: { project: LinkedPersonalProject }) => {
  const { t } = useLanguage();

  if (project.link.kind === "static" || project.destinationKey === undefined) {
    return <p className="min-w-0 text-base font-medium text-foreground">{t(project.titleKey)}</p>;
  }

  return (
    <DestinationHintLink
      title={t(project.titleKey)}
      destination={t(project.destinationKey)}
      target={project.link}
      className="text-base"
    />
  );
};

const ProjectList = ({ projects, startingNumber = 1 }: ProjectListProps) => {
  const { t } = useLanguage();

  return (
    <CurtainReveal as="ul" className="space-y-8">
      {projects.map((project, index) => {
        const frame = projectFrames[project.id];
        const number = String(startingNumber + index).padStart(2, "0");
        const numberLabel = (
          <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">{number}</span>
        );
        return (
          <li key={project.id} className="min-w-0">
            {frame && project.link.kind !== "static" && project.destinationKey ? (
              <DestinationHintLink
                title={t(project.titleKey)}
                destination={t(project.destinationKey)}
                target={project.link}
                className="text-base"
                media={<ProjectFrame source={frame} />}
                leading={numberLabel}
              />
            ) : (
              <div className="mb-1.5 flex min-w-0 items-baseline gap-2.5">
                {numberLabel}
                <ProjectTitle project={project} />
              </div>
            )}
            {project.narrative ? (
              <div className={frame ? "mt-3 space-y-1" : "space-y-1"}>
                <p className={narrativeLineClassName}>{t(project.narrative.problemKey)}</p>
                <p className={narrativeLineClassName}>{t(project.narrative.builtKey)}</p>
                <p className={narrativeLineClassName}>{t(project.narrative.resultKey)}</p>
              </div>
            ) : project.descriptionKey ? (
              <p className={frame ? "mt-3 text-base leading-relaxed text-muted-foreground" : narrativeLineClassName}>
                {t(project.descriptionKey)}
              </p>
            ) : null}
            {project.waitlist ? (
              <p className={`${narrativeLineClassName} mt-2`}>
                {t(project.waitlist.statusKey)}{" "}
                <Link
                  to={project.waitlist.href}
                  className="inline-flex min-h-11 cursor-pointer items-center text-foreground link-underline focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  {t(project.waitlist.labelKey)}
                </Link>
              </p>
            ) : null}
          </li>
        );
      })}
    </CurtainReveal>
  );
};

function isLinkedPersonalProject(project: PersonalProject): project is LinkedPersonalProject {
  return project.link.kind !== "none";
}

function isConnectorPersonalProject(project: PersonalProject): project is ConnectorPersonalProject {
  return project.category === "connector";
}

function splitSectionEntries(entries: PersonalProject[]): SectionEntries {
  const connectorIndex = entries.findIndex((entry) => entry.category === "connector");
  if (connectorIndex === -1) {
    return {
      projectsBeforeConnector: entries.filter(isLinkedPersonalProject),
      connector: undefined,
      projectsAfterConnector: [],
    };
  }

  const connector = entries[connectorIndex];
  return {
    projectsBeforeConnector: entries.slice(0, connectorIndex).filter(isLinkedPersonalProject),
    connector: isConnectorPersonalProject(connector) ? connector : undefined,
    projectsAfterConnector: entries.slice(connectorIndex + 1).filter(isLinkedPersonalProject),
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
          <SectionEyebrow as="h2" className="mb-8" enterOnView>
            {t("personalProjects.label")}
          </SectionEyebrow>
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
        </div>
      </div>
    </section>
  );
};

export const SmallTools = () => {
  const { t } = useLanguage();
  const smallToolEntries = personalProjects.filter(
    (project): project is LinkedPersonalProject => project.category === "small-tool",
  );

  return (
    <section id="small-tools" className="py-20 md:py-28">
      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          <SectionEyebrow as="h2" className="mb-2" enterOnView>
            {t("personalProjects.smallTools.label")}
          </SectionEyebrow>
          <p className="mb-8 text-base leading-relaxed text-muted-foreground">
            {t("personalProjects.smallTools.description")}
          </p>
          <ProjectList projects={smallToolEntries} />
        </div>
      </div>
    </section>
  );
};

export default PersonalProjects;
