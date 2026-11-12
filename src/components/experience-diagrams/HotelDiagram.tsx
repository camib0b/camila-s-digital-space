import type { CSSProperties } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import ExperienceDiagramControl from "@/components/experience-diagrams/ExperienceDiagramControl";

const hotelBaseline = 48;

const hotelMasses = [
  { x: 28, width: 12, height: 18 },
  { x: 42, width: 14, height: 30 },
  { x: 58, width: 12, height: 24 },
  { x: 72, width: 12, height: 16 },
] as const;

const hotelMarkDelays = [
  "calc(var(--duration-diagram-delay-210) + var(--duration-diagram-delay-210))",
  "calc(var(--duration-diagram-delay-210) + var(--duration-diagram-delay-210) + var(--duration-diagram-delay-70))",
  "calc(var(--duration-diagram-delay-210) + var(--duration-diagram-delay-210) + var(--duration-diagram-delay-70) + var(--duration-diagram-delay-70))",
  "calc(var(--duration-diagram-delay-210) + var(--duration-diagram-delay-210) + var(--duration-diagram-delay-210))",
] as const;

function hotelCenter(mass: { x: number; width: number }): number {
  return mass.x + mass.width / 2;
}

function HotelContour({ mass }: { mass: (typeof hotelMasses)[number] }) {
  const top = hotelBaseline - mass.height;
  const windowInset = 2.5;
  const windowStart = mass.x + windowInset;
  const windowEnd = mass.x + mass.width - windowInset;
  const firstWindow = top + mass.height * 0.38;
  const secondWindow = top + mass.height * 0.64;
  const origin = {
    transformBox: "view-box",
    transformOrigin: `${hotelCenter(mass)}px ${hotelBaseline}px`,
  } as CSSProperties;

  return (
    <g className="experience-hotel-mass" style={origin}>
      <rect
        x={mass.x}
        y={top}
        width={mass.width}
        height={mass.height}
        className="fill-background stroke-foreground"
        fillOpacity={0}
      />
      <line x1={windowStart} y1={firstWindow} x2={windowEnd} y2={firstWindow} className="stroke-foreground" />
      <line x1={windowStart} y1={secondWindow} x2={windowEnd} y2={secondWindow} className="stroke-foreground" />
    </g>
  );
}

const HotelDiagram = () => {
  const { t } = useLanguage();

  return (
    <ExperienceDiagramControl label={t("experience.diagram.hotel")} width={104} height={60} diagram="hotel">
      <svg
        viewBox="0 0 104 60"
        aria-hidden="true"
        className="experience-hotel pointer-events-none h-full w-full overflow-hidden fill-none stroke-muted-foreground"
      >
        <circle cx="52" cy="32" r="27" />
        {hotelMasses.map((mass) => (
          <HotelContour key={mass.x} mass={mass} />
        ))}
        <line x1="24" y1={hotelBaseline} x2="86" y2={hotelBaseline} className="stroke-foreground" />
        {hotelMasses.map((mass, index) => (
          <line
            key={mass.x}
            x1={hotelCenter(mass)}
            y1={hotelBaseline}
            x2={hotelCenter(mass)}
            y2={hotelBaseline - mass.height}
            pathLength={1}
            strokeLinecap="square"
            className="experience-hotel-mark stroke-foreground"
            style={{ animationDelay: hotelMarkDelays[index] } as CSSProperties}
          />
        ))}
      </svg>
    </ExperienceDiagramControl>
  );
};

export default HotelDiagram;
