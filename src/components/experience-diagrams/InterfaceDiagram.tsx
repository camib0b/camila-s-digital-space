import type { CSSProperties } from "react";

const interfaceCardWidth = 68;
const interfaceCardHeight = 14;

const interfaceCards = [
  { x: 10, y: 20, delay: "var(--duration-instant)" },
  { x: 90, y: 20, delay: "var(--duration-instant)" },
  { x: 10, y: 40, delay: "var(--duration-diagram-delay-70)" },
  { x: 90, y: 40, delay: "var(--duration-diagram-delay-70)" },
];

function InterfaceCard({ x, y, delay }: { x: number; y: number; delay: string }) {
  const cardStyle = { animationDelay: delay } as CSSProperties;

  return (
    <g className="experience-interface-card" style={cardStyle}>
      <rect
        x={x}
        y={y}
        width={interfaceCardWidth}
        height={interfaceCardHeight}
        rx="1"
        className="fill-background stroke-muted-foreground"
      />
      <line x1={x + 5} y1={y + 4} x2={x + 16} y2={y + 4} className="stroke-foreground" />
    </g>
  );
}

const InterfaceDiagram = () => {
  return (
    <svg
      viewBox="0 0 168 60"
      width={168}
      height={60}
      aria-hidden="true"
      className="experience-interface pointer-events-none h-[60px] w-[168px] max-w-full shrink-0 overflow-hidden fill-none stroke-muted-foreground"
    >
      <rect x="2" y="2" width="164" height="56" rx="2" className="fill-background" />
      <line x1="2" y1="16" x2="166" y2="16" />
      {interfaceCards.map((card) => (
        <InterfaceCard key={`${card.x}-${card.y}`} x={card.x} y={card.y} delay={card.delay} />
      ))}
    </svg>
  );
};

export default InterfaceDiagram;
