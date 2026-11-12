import type { CSSProperties, ReactNode } from "react";
import {
  replayExperienceOnActivate,
  replayExperienceOnFocus,
  replayExperienceOnPointerEnter,
  usePrefersReducedMotion,
} from "@/components/experience-diagrams/experienceDiagramMotion";

type ExperienceDiagramControlProps = {
  label: string;
  width: number;
  height: number;
  diagram: string;
  children: ReactNode;
};

const diagramControlClassName =
  "inline-flex shrink-0 items-center justify-center border-0 bg-transparent p-0 leading-none";

const diagramControlFocusClassName =
  "cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ring";

const ExperienceDiagramControl = ({ label, width, height, diagram, children }: ExperienceDiagramControlProps) => {
  const reducedMotion = usePrefersReducedMotion();
  const boxStyle = { width, height } as CSSProperties;

  if (reducedMotion) {
    return (
      <div className={diagramControlClassName} style={boxStyle} data-experience-diagram={diagram}>
        {children}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`${diagramControlClassName} ${diagramControlFocusClassName}`}
      style={boxStyle}
      data-experience-diagram={diagram}
      aria-label={label}
      onPointerEnter={replayExperienceOnPointerEnter}
      onFocus={replayExperienceOnFocus}
      onClick={replayExperienceOnActivate}
    >
      {children}
    </button>
  );
};

export default ExperienceDiagramControl;
