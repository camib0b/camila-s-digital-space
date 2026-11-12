import type { CSSProperties } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import ExperienceDiagramControl from "@/components/experience-diagrams/ExperienceDiagramControl";

const interfaceCard = { x: 56, y: 4, width: 88, height: 52 };
const interfaceInput = { x: 64, y: 14, width: 64, height: 12 };
const interfaceButton = { x: 64, y: 34, width: 28, height: 14 };
const interfaceReuse = { x: 102, y: 34, width: 28, height: 14 };
const interfaceReuseShift = interfaceButton.x - interfaceReuse.x;

const interfacePieceStyle = (delay: string): CSSProperties => ({ animationDelay: delay });

function InterfaceMark({ x, y }: { x: number; y: number }) {
  const centerX = x + interfaceButton.width / 2;
  const centerY = y + interfaceButton.height / 2;

  return (
    <g>
      <circle cx={centerX} cy={centerY} r="6.5" className="stroke-foreground" />
      <circle cx={centerX} cy={centerY} r="1.35" stroke="none" className="fill-foreground" />
    </g>
  );
}

const InterfaceDiagram = () => {
  const { t } = useLanguage();

  return (
    <ExperienceDiagramControl
      label={t("experience.diagram.interface")}
      width={200}
      height={60}
      diagram="interface"
    >
      <svg
        viewBox="0 0 200 60"
        aria-hidden="true"
        className="experience-interface pointer-events-none h-full w-full overflow-hidden fill-none stroke-muted-foreground"
        style={{ "--experience-reuse-shift": `${interfaceReuseShift}px` } as CSSProperties}
      >
        <g className="experience-interface-card">
          <rect
            x={interfaceCard.x}
            y={interfaceCard.y}
            width={interfaceCard.width}
            height={interfaceCard.height}
            className="stroke-foreground"
          />
        </g>
        <g className="experience-interface-input" style={interfacePieceStyle("var(--duration-diagram-delay-70)")}>
          <rect
            x={interfaceInput.x}
            y={interfaceInput.y}
            width={interfaceInput.width}
            height={interfaceInput.height}
            className="stroke-foreground"
          />
          <line
            x1={interfaceInput.x + 6}
            y1={interfaceInput.y + 3}
            x2={interfaceInput.x + 6}
            y2={interfaceInput.y + interfaceInput.height - 3}
            strokeLinecap="butt"
            className="stroke-foreground"
          />
        </g>
        <g className="experience-interface-button" style={interfacePieceStyle("var(--duration-diagram-delay-210)")}>
          <InterfaceMark x={interfaceButton.x} y={interfaceButton.y} />
        </g>
        <g className="experience-interface-reuse">
          <InterfaceMark x={interfaceReuse.x} y={interfaceReuse.y} />
        </g>
      </svg>
    </ExperienceDiagramControl>
  );
};

export default InterfaceDiagram;
