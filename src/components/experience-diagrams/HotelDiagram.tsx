import type { CSSProperties } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import ExperienceDiagramControl from "@/components/experience-diagrams/ExperienceDiagramControl";

const hotelBaseline = 50;

const hotelMasses = [
  { x: 6, y: 32, width: 16, height: 18 },
  { x: 30, y: 14, width: 18, height: 36 },
  { x: 56, y: 24, width: 14, height: 26 },
  { x: 78, y: 30, width: 16, height: 20 },
] as const;

const hotelMarkDelays = [
  "var(--duration-diagram-delay-70)",
  "var(--duration-diagram-delay-210)",
  "var(--duration-diagram-delay-280)",
  "calc(var(--duration-diagram-delay-280) + var(--duration-diagram-delay-70))",
] as const;

function hotelCenter(mass: { x: number; width: number }): number {
  return mass.x + mass.width / 2;
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
        <line x1="4" y1={hotelBaseline} x2="100" y2={hotelBaseline} />
        {hotelMasses.map((mass) => (
          <rect
            key={mass.x}
            x={mass.x}
            y={mass.y}
            width={mass.width}
            height={mass.height}
            className="experience-hotel-mass fill-background stroke-foreground"
          />
        ))}
        {hotelMasses.map((mass, index) => (
          <line
            key={mass.x}
            x1={hotelCenter(mass)}
            y1={hotelBaseline}
            x2={hotelCenter(mass)}
            y2={mass.y}
            pathLength={1}
            strokeLinecap="butt"
            className="experience-hotel-mark stroke-foreground"
            style={{ animationDelay: hotelMarkDelays[index] } as CSSProperties}
          />
        ))}
      </svg>
    </ExperienceDiagramControl>
  );
};

export default HotelDiagram;
