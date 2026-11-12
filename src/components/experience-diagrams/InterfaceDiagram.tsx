import type { CSSProperties } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import ExperienceDiagramControl from "@/components/experience-diagrams/ExperienceDiagramControl";

const interfaceCard = { x: 56, y: 4, width: 88, height: 52 };
const interfaceInput = { x: 64, y: 16, width: 64, height: 12 };
const interfaceButton = { x: 64, y: 36, width: 30, height: 12 };
const interfaceReuse = { x: 102, y: 36, width: 30, height: 12 };
const interfaceButtonLabelWidth = 16;
const interfaceReuseShift = interfaceButton.x - interfaceReuse.x;

const interfacePieceStyle = (delay: string): CSSProperties => ({ animationDelay: delay });

function InterfaceButton({ x, y }: { x: number; y: number }) {
  const labelInset = (interfaceButton.width - interfaceButtonLabelWidth) / 2;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={interfaceButton.width}
        height={interfaceButton.height}
        rx="6"
        className="fill-background stroke-foreground"
      />
      <line
        x1={x + labelInset}
        y1={y + interfaceButton.height / 2}
        x2={x + labelInset + interfaceButtonLabelWidth}
        y2={y + interfaceButton.height / 2}
        strokeLinecap="butt"
        className="stroke-foreground"
      />
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
            rx="1"
            className="fill-background"
          />
        </g>
        <g className="experience-interface-input" style={interfacePieceStyle("var(--duration-diagram-delay-70)")}>
          <rect
            x={interfaceInput.x}
            y={interfaceInput.y}
            width={interfaceInput.width}
            height={interfaceInput.height}
            rx="1"
            className="fill-background"
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
          <InterfaceButton x={interfaceButton.x} y={interfaceButton.y} />
        </g>
        <g className="experience-interface-reuse">
          <InterfaceButton x={interfaceReuse.x} y={interfaceReuse.y} />
        </g>
      </svg>
    </ExperienceDiagramControl>
  );
};

export default InterfaceDiagram;
