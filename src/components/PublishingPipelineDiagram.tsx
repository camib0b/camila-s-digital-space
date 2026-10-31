import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { startAttentionPulse } from "@camib0b/ui/attention-pulse";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/i18n/types";
import { cn } from "@/lib/utils";

const PIPELINE_FLOW_ORDER = {
  receive: 0,
  connectorIntoAva: 1,
  avaGroup: 2,
  importStep: 2,
  clipStep: 3,
  leadLagStep: 4,
  exportStep: 5,
  connectorIntoAgent: 6,
  agentGroup: 7,
  grokStep: 7,
  videoUpload: 8,
  fallbackConnector: 9,
  youtubeFallback: 10,
  databaseUpload: 11,
  xmlUpload: 12,
  verifyUpload: 13,
  deploy: 14,
} as const;

const DIAGRAM_STEP_KEYS = [
  "personalProjects.publishingPipeline.diagram.list.1",
  "personalProjects.publishingPipeline.diagram.list.2",
  "personalProjects.publishingPipeline.diagram.list.3",
  "personalProjects.publishingPipeline.diagram.list.4",
  "personalProjects.publishingPipeline.diagram.list.5",
  "personalProjects.publishingPipeline.diagram.list.6",
  "personalProjects.publishingPipeline.diagram.list.7",
] as const satisfies readonly TranslationKey[];

const AVA_STEPS = [
  {
    index: "02",
    order: PIPELINE_FLOW_ORDER.importStep,
    titleKey: "personalProjects.publishingPipeline.diagram.step2.title",
    detailKey: "personalProjects.publishingPipeline.diagram.step2.detail",
  },
  {
    index: "03",
    order: PIPELINE_FLOW_ORDER.clipStep,
    titleKey: "personalProjects.publishingPipeline.diagram.step3.title",
    detailKey: "personalProjects.publishingPipeline.diagram.step3.detail",
  },
  {
    index: "04",
    order: PIPELINE_FLOW_ORDER.leadLagStep,
    titleKey: "personalProjects.publishingPipeline.diagram.step4.title",
    detailKey: "personalProjects.publishingPipeline.diagram.step4.detail",
  },
  {
    index: "05",
    order: PIPELINE_FLOW_ORDER.exportStep,
    titleKey: "personalProjects.publishingPipeline.diagram.step5.title",
    detailKey: "personalProjects.publishingPipeline.diagram.step5.detail",
  },
] as const satisfies readonly {
  index: string;
  order: number;
  titleKey: TranslationKey;
  detailKey: TranslationKey;
}[];

const CLOUD_UPLOADS = [
  {
    order: PIPELINE_FLOW_ORDER.databaseUpload,
    titleKey: "personalProjects.publishingPipeline.diagram.database.title",
    detailKey: "personalProjects.publishingPipeline.diagram.database.detail",
  },
  {
    order: PIPELINE_FLOW_ORDER.xmlUpload,
    titleKey: "personalProjects.publishingPipeline.diagram.xml.title",
    detailKey: "personalProjects.publishingPipeline.diagram.xml.detail",
  },
  {
    order: PIPELINE_FLOW_ORDER.verifyUpload,
    titleKey: "personalProjects.publishingPipeline.diagram.verify.title",
    detailKey: "personalProjects.publishingPipeline.diagram.verify.detail",
  },
] as const satisfies readonly {
  order: number;
  titleKey: TranslationKey;
  detailKey: TranslationKey;
}[];

const PUBLISHING_PIPELINE_ANIMATION_CSS = `
.publishing-pipeline .pipeline-step {
  opacity: 0;
  animation: publishing-pipeline-step-main var(--duration-enter) var(--ease-out-strong) both;
  animation-delay: calc(var(--pipeline-order) * var(--duration-pipeline-stagger));
}

.publishing-pipeline .pipeline-step[data-flow="down"] {
  animation-name: publishing-pipeline-step-down;
}

.publishing-pipeline .pipeline-frame {
  opacity: 0;
  animation: publishing-pipeline-fade var(--duration-enter) var(--ease-out-strong) both;
  animation-delay: calc(var(--pipeline-order) * var(--duration-pipeline-stagger));
}

.publishing-pipeline .pipeline-draw {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: publishing-pipeline-draw var(--duration-enter) var(--ease-out-strong) forwards;
  animation-delay: calc(var(--pipeline-order) * var(--duration-pipeline-stagger));
}

.publishing-pipeline .pipeline-draw-y {
  transform: scaleY(0);
  transform-origin: top center;
  animation: publishing-pipeline-draw-y var(--duration-enter) var(--ease-out-strong) forwards;
  animation-delay: calc(var(--pipeline-order) * var(--duration-pipeline-stagger));
}

@keyframes publishing-pipeline-step-main {
  from {
    opacity: 0;
    transform: translate3d(-0.35rem, 0, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes publishing-pipeline-step-down {
  from {
    opacity: 0;
    transform: translate3d(0, -0.3rem, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes publishing-pipeline-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes publishing-pipeline-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes publishing-pipeline-draw-y {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

.publishing-pipeline .pipeline-toggle-chevron {
  display: inline-flex;
  flex: none;
  transform-origin: center;
  transition: transform var(--duration-base) var(--ease-out-strong);
}

.publishing-pipeline .pipeline-toggle-chevron.is-open {
  transform: rotate(90deg);
}

.publishing-pipeline .pipeline-toggle-chevron-glyph {
  display: block;
}

.publishing-pipeline .pipeline-toggle:hover .pipeline-toggle-chevron:not(.is-open) .pipeline-toggle-chevron-glyph,
.publishing-pipeline .pipeline-toggle:focus-visible .pipeline-toggle-chevron:not(.is-open) .pipeline-toggle-chevron-glyph {
  transform: translate3d(2px, 0, 0);
  transition: transform var(--duration-open) var(--ease-hover);
}

@media (max-width: 767px) {
  .publishing-pipeline .pipeline-step[data-flow="main"] {
    animation-name: publishing-pipeline-step-down;
  }
}

@media (prefers-reduced-motion: reduce) {
  .publishing-pipeline .pipeline-step,
  .publishing-pipeline .pipeline-frame,
  .publishing-pipeline .pipeline-draw,
  .publishing-pipeline .pipeline-draw-y {
    animation: none;
    opacity: 1;
    transform: none;
    stroke-dashoffset: 0;
  }

  .publishing-pipeline .pipeline-toggle-chevron,
  .publishing-pipeline .pipeline-toggle-chevron:not(.is-open) .pipeline-toggle-chevron-glyph,
  .publishing-pipeline .pipeline-toggle:hover .pipeline-toggle-chevron:not(.is-open) .pipeline-toggle-chevron-glyph,
  .publishing-pipeline .pipeline-toggle:focus-visible .pipeline-toggle-chevron:not(.is-open) .pipeline-toggle-chevron-glyph {
    animation: none;
    transition: none;
    transform: none;
  }

  .publishing-pipeline .pipeline-toggle-chevron.is-open {
    transform: rotate(90deg);
  }
}
`;

function pipelineOrder(order: number): CSSProperties {
  return { "--pipeline-order": order } as CSSProperties;
}

function publishingPipelineAccessibleName(translate: (key: TranslationKey) => string): string {
  const orderedSteps = DIAGRAM_STEP_KEYS.map(
    (stepKey, stepIndex) => `${stepIndex + 1}. ${translate(stepKey)}`,
  );

  return `${translate("personalProjects.publishingPipeline.diagram.intro")} ${orderedSteps.join(" ")}`;
}

const FlowConnector = ({ order }: { order: number }) => (
  <div className="flex h-5 shrink-0 items-center justify-center text-foreground/40 md:h-auto md:w-5">
    <svg
      viewBox="0 0 20 10"
      className="h-2.5 w-4 rotate-90 md:rotate-0"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 5H14 M11 1.5L16.5 5L11 8.5"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        pathLength="1"
        className="pipeline-draw"
        style={pipelineOrder(order)}
      />
    </svg>
  </div>
);

const DiagramGroup = ({
  label,
  order,
  className,
  children,
}: {
  label: string;
  order: number;
  className?: string;
  children: ReactNode;
}) => (
  <div className={cn("relative min-w-0", className)}>
    <div className="pipeline-frame pointer-events-none absolute inset-0 border border-border" style={pipelineOrder(order)}>
      <span className="absolute left-2.5 top-0 -translate-y-1/2 whitespace-nowrap bg-background px-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
    <div className="relative px-3 pb-3 pt-4">{children}</div>
  </div>
);

const StepCopy = ({
  index,
  title,
  detail,
}: {
  index: string;
  title: string;
  detail: string;
}) => (
  <div className="flex gap-2.5">
    <span className="w-5 shrink-0 pt-0.5 font-mono text-[10px] tabular-nums leading-none text-muted-foreground">
      {index}
    </span>
    <span className="min-w-0">
      <span className="block text-xs leading-tight text-foreground">{title}</span>
      <span className="mt-0.5 block text-[11px] leading-tight text-muted-foreground">{detail}</span>
    </span>
  </div>
);

const CloudUploadCell = ({
  title,
  detail,
  order,
  className,
}: {
  title: string;
  detail: string;
  order: number;
  className?: string;
}) => (
  <div
    className={cn(
      "pipeline-step flex flex-1 flex-col justify-center bg-background px-2 py-1.5",
      className,
    )}
    data-flow="down"
    style={pipelineOrder(order)}
  >
    <span className="block text-xs leading-tight text-foreground">{title}</span>
    <span className="mt-0.5 block text-[11px] leading-tight text-muted-foreground">{detail}</span>
  </div>
);

const VideoUploadBranch = ({
  videoTitle,
  videoDetail,
  fallbackLabel,
  backupTitle,
  backupDetail,
  videoOrder,
  connectorOrder,
  fallbackOrder,
}: {
  videoTitle: string;
  videoDetail: string;
  fallbackLabel: string;
  backupTitle: string;
  backupDetail: string;
  videoOrder: number;
  connectorOrder: number;
  fallbackOrder: number;
}) => (
  <div className="relative flex h-full flex-col">
    <div className="pipeline-frame pointer-events-none absolute inset-0 border border-border" style={pipelineOrder(videoOrder)} />
    <div className="relative flex h-full flex-col px-2 py-1.5">
      <div className="pipeline-step" data-flow="down" style={pipelineOrder(videoOrder)}>
        <span className="block text-xs leading-tight text-foreground">{videoTitle}</span>
        <span className="mt-0.5 block text-[11px] leading-tight text-muted-foreground">{videoDetail}</span>
      </div>
      <div className="mt-2 flex min-h-3 flex-1 justify-center">
        <div
          className="pipeline-draw-y box-content h-full w-0 border-l border-dashed border-foreground/40"
          style={pipelineOrder(connectorOrder)}
        />
      </div>
      <div
        className="pipeline-step border border-dashed border-foreground/40 px-1.5 py-1.5"
        data-flow="down"
        style={pipelineOrder(fallbackOrder)}
      >
        <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {`07 · ${fallbackLabel}`}
        </span>
        <span className="mt-1 block text-xs leading-tight text-foreground">{backupTitle}</span>
        <span className="mt-0.5 block text-[11px] leading-tight text-muted-foreground">{backupDetail}</span>
      </div>
    </div>
  </div>
);

const DisclosureChevron = ({ expanded }: { expanded: boolean }) => (
  <span className={cn("pipeline-toggle-chevron", expanded && "is-open")} aria-hidden="true">
    <svg viewBox="0 0 10 10" className="pipeline-toggle-chevron-glyph h-2.5 w-2.5" fill="none">
      <path d="M2 1.5L7.5 5L2 8.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  </span>
);

const PublishingPipelineStages = () => {
  const { t } = useLanguage();
  const accessibleName = publishingPipelineAccessibleName(t);

  return (
    <div role="img" aria-label={accessibleName} className="relative">
      <ol className="sr-only">
        {DIAGRAM_STEP_KEYS.map((stepKey, stepIndex) => (
          <li key={stepKey}>{`${stepIndex + 1}. ${t(stepKey)}`}</li>
        ))}
      </ol>
      <div aria-hidden="true" className="flex flex-col gap-1 md:flex-row md:items-stretch md:gap-1.5">
        <div className="md:flex md:w-[7.5rem] md:shrink-0 md:items-center">
          <div
            className="pipeline-step w-full border border-border px-3 py-2.5"
            data-flow="main"
            style={pipelineOrder(PIPELINE_FLOW_ORDER.receive)}
          >
            <span className="font-mono text-[10px] tabular-nums leading-none text-muted-foreground">01</span>
            <span className="mt-1.5 block text-xs leading-tight text-foreground">
              {t("personalProjects.publishingPipeline.diagram.step1.title")}
            </span>
            <span className="mt-0.5 block text-[11px] leading-tight text-muted-foreground">
              {t("personalProjects.publishingPipeline.diagram.step1.detail")}
            </span>
          </div>
        </div>

        <FlowConnector order={PIPELINE_FLOW_ORDER.connectorIntoAva} />

        <DiagramGroup
          label={t("personalProjects.publishingPipeline.diagram.group.ava")}
          order={PIPELINE_FLOW_ORDER.avaGroup}
          className="md:flex-[1.05]"
        >
          <ol className="divide-y divide-border">
            {AVA_STEPS.map((step) => (
              <li
                key={step.index}
                className="pipeline-step py-2 first:pt-0 last:pb-0"
                data-flow="down"
                style={pipelineOrder(step.order)}
              >
                <StepCopy index={step.index} title={t(step.titleKey)} detail={t(step.detailKey)} />
              </li>
            ))}
          </ol>
        </DiagramGroup>

        <FlowConnector order={PIPELINE_FLOW_ORDER.connectorIntoAgent} />

        <DiagramGroup
          label={t("personalProjects.publishingPipeline.diagram.group.agent")}
          order={PIPELINE_FLOW_ORDER.agentGroup}
          className="md:flex-[1.25]"
        >
          <div className="pipeline-step" data-flow="down" style={pipelineOrder(PIPELINE_FLOW_ORDER.grokStep)}>
            <StepCopy
              index="06"
              title={t("personalProjects.publishingPipeline.diagram.step6.title")}
              detail={t("personalProjects.publishingPipeline.diagram.step6.detail")}
            />
          </div>
          <div className="mt-2.5 grid grid-cols-2 items-stretch gap-2">
            <VideoUploadBranch
              videoTitle={t("personalProjects.publishingPipeline.diagram.r2.title")}
              videoDetail={t("personalProjects.publishingPipeline.diagram.r2.detail")}
              fallbackLabel={t("personalProjects.publishingPipeline.diagram.fallback")}
              backupTitle={t("personalProjects.publishingPipeline.diagram.youtube.title")}
              backupDetail={t("personalProjects.publishingPipeline.diagram.youtube.detail")}
              videoOrder={PIPELINE_FLOW_ORDER.videoUpload}
              connectorOrder={PIPELINE_FLOW_ORDER.fallbackConnector}
              fallbackOrder={PIPELINE_FLOW_ORDER.youtubeFallback}
            />
            <div className="relative flex h-full flex-col">
              <div
                className="pipeline-frame pointer-events-none absolute inset-0 border border-border"
                style={pipelineOrder(PIPELINE_FLOW_ORDER.databaseUpload)}
              />
              <div className="relative flex h-full flex-col">
                {CLOUD_UPLOADS.map((upload, uploadIndex) => (
                  <CloudUploadCell
                    key={upload.titleKey}
                    title={t(upload.titleKey)}
                    detail={t(upload.detailKey)}
                    order={upload.order}
                    className={uploadIndex > 0 ? "border-t border-border" : undefined}
                  />
                ))}
              </div>
            </div>
          </div>
          <div
            className="pipeline-step mt-2.5 flex items-center gap-2 border-t border-border pt-2"
            data-flow="down"
            style={pipelineOrder(PIPELINE_FLOW_ORDER.deploy)}
          >
            <span className="h-1.5 w-1.5 shrink-0 bg-accent-teal" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {t("personalProjects.publishingPipeline.diagram.deploys")}
            </span>
            <span className="font-mono text-xs leading-none text-foreground">
              {t("personalProjects.publishingPipeline.diagram.deploy")}
            </span>
          </div>
        </DiagramGroup>
      </div>
    </div>
  );
};

const PublishingPipelineDiagram = () => {
  const { t } = useLanguage();
  const diagramId = useId();
  const toggleLabelRef = useRef<HTMLSpanElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    const toggleLabel = toggleLabelRef.current;
    if (toggleLabel === null) {
      return;
    }

    const intersectionObserver = new IntersectionObserver((entries) => {
      const isLabelInView = entries.some((entry) => entry.isIntersecting);
      if (!isLabelInView) {
        return;
      }

      startAttentionPulse(toggleLabel);
      intersectionObserver.disconnect();
    });

    intersectionObserver.observe(toggleLabel);
    return () => {
      intersectionObserver.disconnect();
    };
  }, []);

  const toggleDiagram = () => {
    setIsOpen((open) => {
      if (!open) {
        setReplayKey((key) => key + 1);
      }
      return !open;
    });
  };

  return (
    <div className="publishing-pipeline mt-4">
      <style>{PUBLISHING_PIPELINE_ANIMATION_CSS}</style>
      <button
        type="button"
        className="pipeline-toggle inline-flex appearance-none items-center gap-1.5 border-0 bg-transparent p-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-foreground"
        aria-expanded={isOpen}
        aria-controls={diagramId}
        onClick={toggleDiagram}
      >
        <span ref={toggleLabelRef}>{t("personalProjects.publishingPipeline.diagram.toggle")}</span>
        <DisclosureChevron expanded={isOpen} />
      </button>
      <figure id={diagramId} hidden={!isOpen} className="mt-4">
        {isOpen ? <PublishingPipelineStages key={replayKey} /> : null}
      </figure>
    </div>
  );
};

export default PublishingPipelineDiagram;
