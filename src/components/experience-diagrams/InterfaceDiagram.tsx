import type { CSSProperties } from "react";

const interfaceCardWidth = 68;
const interfaceCardHeight = 14;
const interfaceCardStartX = 50;
const interfaceCardStartY = 24;

const interfaceCards = [
  { endPositionX: 10, endPositionY: 20, delay: "0s" },
  { endPositionX: 90, endPositionY: 20, delay: "0.05s" },
  { endPositionX: 10, endPositionY: 40, delay: "0.1s" },
  { endPositionX: 90, endPositionY: 40, delay: "0.15s" },
];

function InterfaceBlock() {
  return (
    <>
      <rect
        width={interfaceCardWidth}
        height={interfaceCardHeight}
        rx="1"
        className="fill-background stroke-muted-foreground"
      />
      <line x1="5" y1="4" x2="16" y2="4" className="stroke-accent-teal" />
    </>
  );
}

const InterfaceDiagram = () => {
  return (
    <svg
      viewBox="0 0 168 60"
      aria-hidden="true"
      className="experience-interface pointer-events-none h-[60px] w-[168px] shrink-0 overflow-hidden fill-none stroke-muted-foreground"
    >
      <rect x="2" y="2" width="164" height="56" rx="2" className="fill-background" />
      <line x1="2" y1="16" x2="166" y2="16" />
      <text
        x="84"
        y="38"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="13"
        className="experience-interface-code fill-muted-foreground stroke-none font-mono"
      >
        {"<Card />"}
      </text>

      <g className="experience-interface-source">
        <InterfaceBlock />
      </g>

      {interfaceCards.map((card) => {
        const cardStyle = {
          "--card-end-x": `${card.endPositionX}px`,
          "--card-end-y": `${card.endPositionY}px`,
          animationDelay: card.delay,
        } as CSSProperties;

        return (
          <g key={`${card.endPositionX}-${card.endPositionY}`} className="experience-interface-card" style={cardStyle}>
            <InterfaceBlock />
          </g>
        );
      })}
    </svg>
  );
};

export default InterfaceDiagram;
