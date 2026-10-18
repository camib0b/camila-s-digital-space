import type { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/i18n/types";
import { cn } from "@/lib/utils";

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
    titleKey: "personalProjects.publishingPipeline.diagram.step2.title",
    detailKey: "personalProjects.publishingPipeline.diagram.step2.detail",
  },
  {
    index: "03",
    titleKey: "personalProjects.publishingPipeline.diagram.step3.title",
    detailKey: "personalProjects.publishingPipeline.diagram.step3.detail",
  },
  {
    index: "04",
    titleKey: "personalProjects.publishingPipeline.diagram.step4.title",
    detailKey: "personalProjects.publishingPipeline.diagram.step4.detail",
  },
  {
    index: "05",
    titleKey: "personalProjects.publishingPipeline.diagram.step5.title",
    detailKey: "personalProjects.publishingPipeline.diagram.step5.detail",
  },
] as const satisfies readonly {
  index: string;
  titleKey: TranslationKey;
  detailKey: TranslationKey;
}[];

const CLOUD_UPLOADS = [
  {
    titleKey: "personalProjects.publishingPipeline.diagram.database.title",
    detailKey: "personalProjects.publishingPipeline.diagram.database.detail",
  },
  {
    titleKey: "personalProjects.publishingPipeline.diagram.xml.title",
    detailKey: "personalProjects.publishingPipeline.diagram.xml.detail",
  },
  {
    titleKey: "personalProjects.publishingPipeline.diagram.verify.title",
    detailKey: "personalProjects.publishingPipeline.diagram.verify.detail",
  },
] as const satisfies readonly { titleKey: TranslationKey; detailKey: TranslationKey }[];

function publishingPipelineAccessibleName(translate: (key: TranslationKey) => string): string {
  const orderedSteps = DIAGRAM_STEP_KEYS.map(
    (stepKey, stepIndex) => `${stepIndex + 1}. ${translate(stepKey)}`,
  );

  return `${translate("personalProjects.publishingPipeline.diagram.intro")} ${orderedSteps.join(" ")}`;
}

const FlowConnector = () => (
  <div className="flex h-5 shrink-0 items-center justify-center text-foreground/40 md:h-auto md:w-5">
    <svg
      viewBox="0 0 20 10"
      className="h-2.5 w-4 rotate-90 md:rotate-0"
      fill="none"
      aria-hidden="true"
    >
      <path d="M1 5H14" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <path
        d="M11 1.5L16.5 5L11 8.5"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  </div>
);

const DiagramGroup = ({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) => (
  <div className={cn("relative min-w-0 border border-border px-3 pb-3 pt-4", className)}>
    <span className="absolute left-2.5 top-0 -translate-y-1/2 whitespace-nowrap bg-background px-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
      {label}
    </span>
    {children}
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

const CloudUploadCell = ({ title, detail }: { title: string; detail: string }) => (
  <div className="flex flex-1 flex-col justify-center bg-background px-2 py-1.5">
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
}: {
  videoTitle: string;
  videoDetail: string;
  fallbackLabel: string;
  backupTitle: string;
  backupDetail: string;
}) => (
  <div className="flex h-full flex-col border border-border px-2 py-1.5">
    <span className="block text-xs leading-tight text-foreground">{videoTitle}</span>
    <span className="mt-0.5 block text-[11px] leading-tight text-muted-foreground">{videoDetail}</span>
    <div className="mt-2 flex min-h-3 flex-1 justify-center">
      <div className="box-content h-full w-0 border-l border-dashed border-foreground/40" />
    </div>
    <div className="border border-dashed border-foreground/40 px-1.5 py-1.5">
      <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {`07 · ${fallbackLabel}`}
      </span>
      <span className="mt-1 block text-xs leading-tight text-foreground">{backupTitle}</span>
      <span className="mt-0.5 block text-[11px] leading-tight text-muted-foreground">{backupDetail}</span>
    </div>
  </div>
);

const PublishingPipelineDiagram = () => {
  const { t } = useLanguage();
  const accessibleName = publishingPipelineAccessibleName(t);

  return (
    <figure className="mt-4">
      <div role="img" aria-label={accessibleName} className="relative">
        <ol className="sr-only">
          {DIAGRAM_STEP_KEYS.map((stepKey, stepIndex) => (
            <li key={stepKey}>{`${stepIndex + 1}. ${t(stepKey)}`}</li>
          ))}
        </ol>
        <div aria-hidden="true" className="flex flex-col gap-1 md:flex-row md:items-stretch md:gap-1.5">
          <div className="md:flex md:w-[7.5rem] md:shrink-0 md:items-center">
            <div className="w-full border border-border px-3 py-2.5">
              <span className="font-mono text-[10px] tabular-nums leading-none text-muted-foreground">01</span>
              <span className="mt-1.5 block text-xs leading-tight text-foreground">
                {t("personalProjects.publishingPipeline.diagram.step1.title")}
              </span>
              <span className="mt-0.5 block text-[11px] leading-tight text-muted-foreground">
                {t("personalProjects.publishingPipeline.diagram.step1.detail")}
              </span>
            </div>
          </div>

          <FlowConnector />

          <DiagramGroup
            label={t("personalProjects.publishingPipeline.diagram.group.ava")}
            className="md:flex-[1.05]"
          >
            <ol className="divide-y divide-border">
              {AVA_STEPS.map((step) => (
                <li key={step.index} className="py-2 first:pt-0 last:pb-0">
                  <StepCopy index={step.index} title={t(step.titleKey)} detail={t(step.detailKey)} />
                </li>
              ))}
            </ol>
          </DiagramGroup>

          <FlowConnector />

          <DiagramGroup
            label={t("personalProjects.publishingPipeline.diagram.group.agent")}
            className="md:flex-[1.25]"
          >
            <StepCopy
              index="06"
              title={t("personalProjects.publishingPipeline.diagram.step6.title")}
              detail={t("personalProjects.publishingPipeline.diagram.step6.detail")}
            />
            <div className="mt-2.5 grid grid-cols-2 items-stretch gap-2">
              <VideoUploadBranch
                videoTitle={t("personalProjects.publishingPipeline.diagram.r2.title")}
                videoDetail={t("personalProjects.publishingPipeline.diagram.r2.detail")}
                fallbackLabel={t("personalProjects.publishingPipeline.diagram.fallback")}
                backupTitle={t("personalProjects.publishingPipeline.diagram.youtube.title")}
                backupDetail={t("personalProjects.publishingPipeline.diagram.youtube.detail")}
              />
              <div className="flex flex-col gap-px border border-border bg-border">
                {CLOUD_UPLOADS.map((upload) => (
                  <CloudUploadCell
                    key={upload.titleKey}
                    title={t(upload.titleKey)}
                    detail={t(upload.detailKey)}
                  />
                ))}
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-2 border-t border-border pt-2">
              <span className="h-1.5 w-1.5 shrink-0 bg-[hsl(var(--contrib-q4))]" />
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
    </figure>
  );
};

export default PublishingPipelineDiagram;
