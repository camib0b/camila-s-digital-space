import { useRef, type ComponentType } from "react";
import AnalyticsDiagram from "@/components/experience-diagrams/AnalyticsDiagram";
import CommerceDiagram from "@/components/experience-diagrams/CommerceDiagram";
import HotelDiagram from "@/components/experience-diagrams/HotelDiagram";
import InterfaceDiagram from "@/components/experience-diagrams/InterfaceDiagram";
import {
  clearExperiencePointerOrigin,
  rememberExperiencePointerOrigin,
  replayExperienceOnPointerUp,
  useExperienceDiagramMotion,
} from "@/components/experience-diagrams/experienceDiagramMotion";
import SectionEyebrow from "@/components/SectionEyebrow";
import { useLanguage } from "@/contexts/LanguageContext";
import { experienceRoles, type ExperienceDiagramId, type ExperienceRole } from "@/content/experience";

const experienceDiagrams: Record<ExperienceDiagramId, ComponentType> = {
  analytics: AnalyticsDiagram,
  commerce: CommerceDiagram,
  hotel: HotelDiagram,
  interface: InterfaceDiagram,
};

const wrappingCopyClassName = "min-w-0 [overflow-wrap:anywhere]";

function ExperienceRoleRow({ role, isLast }: { role: ExperienceRole; isLast: boolean }) {
  const { t } = useLanguage();
  const roleRef = useRef<HTMLDivElement>(null);
  const experienceMotion = useExperienceDiagramMotion(roleRef);
  const Diagram = role.diagram === null ? null : experienceDiagrams[role.diagram];

  return (
    <div
      ref={roleRef}
      className="min-w-0"
      data-experience-role={role.id}
      data-experience-motion={experienceMotion}
      onPointerDown={rememberExperiencePointerOrigin}
      onPointerUp={replayExperienceOnPointerUp}
      onPointerCancel={clearExperiencePointerOrigin}
    >
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className={`min-w-0 flex-1 ${wrappingCopyClassName}`}>
          <p className="font-medium text-foreground">{t(role.titleKey)}</p>
          <p className="text-sm text-muted-foreground">{t(role.companyKey)}</p>
        </div>
        <div className="flex w-full min-w-0 flex-col items-start gap-2 sm:w-[13.75rem] sm:shrink-0 sm:items-end">
          <p className={`text-xs text-muted-foreground tabular-nums sm:text-right ${wrappingCopyClassName}`}>
            {t(role.periodKey)}
          </p>
          {Diagram ? <Diagram /> : null}
        </div>
      </div>
      {t(role.descriptionKey) ? (
        <p className={`mt-2 text-base leading-relaxed text-muted-foreground ${wrappingCopyClassName}`}>
          {t(role.descriptionKey)}
        </p>
      ) : null}
      {isLast ? null : <div className="mt-8 border-b border-border/60" />}
    </div>
  );
}

const Experience = () => {
  const { t } = useLanguage();

  return (
    <section id="experience" className="py-20 md:py-28">
      <div className="container px-6 md:px-8">
        <div className="mx-auto max-w-2xl">
          <SectionEyebrow as="h2" className="mb-8" enterOnView>
            {t("experience.label")}
          </SectionEyebrow>
          <div className="space-y-8">
            {experienceRoles.map((role, index) => (
              <ExperienceRoleRow
                key={role.id}
                role={role}
                isLast={index === experienceRoles.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
