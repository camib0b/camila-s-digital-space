import type { ComponentType, PointerEvent } from "react";
import CurtainReveal from "@/components/CurtainReveal";
import AnalyticsDiagram from "@/components/experience-diagrams/AnalyticsDiagram";
import CommerceDiagram from "@/components/experience-diagrams/CommerceDiagram";
import HotelDiagram from "@/components/experience-diagrams/HotelDiagram";
import InterfaceDiagram from "@/components/experience-diagrams/InterfaceDiagram";
import { useLanguage } from "@/contexts/LanguageContext";
import { experienceRoles, type ExperienceDiagramId } from "@/content/experience";

const experienceDiagrams: Record<ExperienceDiagramId, ComponentType> = {
  analytics: AnalyticsDiagram,
  commerce: CommerceDiagram,
  hotel: HotelDiagram,
  interface: InterfaceDiagram,
};

function toggleExperienceDiagramOnTouch(event: PointerEvent<HTMLDivElement>) {
  if (event.pointerType !== "touch") {
    return;
  }

  const roleRow = event.currentTarget;
  roleRow.dataset.experienceTouch = roleRow.dataset.experienceTouch === "on" ? "off" : "on";
}

const Experience = () => {
  const { t } = useLanguage();

  return (
    <section id="experience" className="py-20 md:py-28">
      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider mb-8">
            {t("experience.label")}
          </h2>

          <CurtainReveal className="space-y-8">
            {experienceRoles.map((role, index) => {
              const Diagram = role.diagram ? experienceDiagrams[role.diagram] : null;

              return (
                <div
                  key={role.id}
                  className="group"
                  data-experience-role={role.id}
                  onPointerUp={toggleExperienceDiagramOnTouch}
                >
                  <div className="mb-1 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{t(role.titleKey)}</p>
                      <p className="text-sm text-muted-foreground">{t(role.companyKey)}</p>
                    </div>
                    <div className="flex flex-col items-start gap-2 sm:items-end">
                      <p className="text-xs text-muted-foreground tabular-nums shrink-0 whitespace-nowrap">
                        {t(role.periodKey)}
                      </p>
                      {Diagram ? <Diagram /> : null}
                    </div>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed mt-2">
                    {t(role.descriptionKey)}
                  </p>
                  {index < experienceRoles.length - 1 && (
                    <div className="border-b border-border/60 mt-8" />
                  )}
                </div>
              );
            })}
          </CurtainReveal>
        </div>
      </div>
    </section>
  );
};

export default Experience;
