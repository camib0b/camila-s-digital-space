import type { CSSProperties } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import ExperienceDiagramControl from "@/components/experience-diagrams/ExperienceDiagramControl";

const analyticsLid = { x: 26, y: 2, width: 60, height: 10 };
const analyticsLidLineY = analyticsLid.y + analyticsLid.height / 2;

/** Seven readings the loose field settles onto. One guide line passes through them. */
const analyticsScatter = [
  { x: 38, y: 46 },
  { x: 48, y: 40 },
  { x: 57, y: 43 },
  { x: 66, y: 35 },
  { x: 76, y: 37 },
  { x: 86, y: 30 },
  { x: 96, y: 32 },
] as const;

const analyticsDotCount = 42;
const goldenAngle = 2.399963229728653;

function roundTenth(value: number): number {
  return Math.round(value * 10) / 10;
}

function looseDotPosition(index: number): { x: number; y: number } {
  const angle = index * goldenAngle;
  const radius = 5 + (index % 8) * 3.15;
  const x = 68 + Math.cos(angle) * radius;
  const y = 36 + Math.sin(angle) * radius * 0.46;
  return {
    x: roundTenth(Math.min(104, Math.max(20, x))),
    y: roundTenth(Math.min(54, Math.max(14, y))),
  };
}

/**
 * A loose field that tightens onto the scatter. Positions are fixed so a
 * replay starts from the same frame. The parent row starts and stops the
 * motion; nothing here loops.
 */
const analyticsDots = Array.from({ length: analyticsDotCount }, (_, index) => {
  const end = analyticsScatter[index % analyticsScatter.length];
  const start = looseDotPosition(index);
  return {
    index,
    endX: end.x,
    endY: end.y,
    fromX: roundTenth(start.x - end.x),
    fromY: roundTenth(start.y - end.y),
  };
});

const AnalyticsDiagram = () => {
  const { t } = useLanguage();

  return (
    <ExperienceDiagramControl
      label={t("experience.diagram.analytics")}
      width={112}
      height={60}
      diagram="analytics"
    >
      <svg
        viewBox="0 0 112 60"
        aria-hidden="true"
        className="experience-analytics pointer-events-none h-full w-full overflow-hidden fill-none stroke-muted-foreground"
      >
        <g className="experience-analytics-plot">
          <line x1="32" y1="50" x2="102" y2="50" />
          <line x1="32" y1="16" x2="32" y2="50" />
          {analyticsDots.map((dot) => (
            <circle
              key={dot.index}
              cx={dot.endX}
              cy={dot.endY}
              r="1.7"
              stroke="none"
              className="experience-analytics-dot fill-foreground"
              style={
                {
                  "--dot-from-x": `${dot.fromX}px`,
                  "--dot-from-y": `${dot.fromY}px`,
                } as CSSProperties
              }
            />
          ))}
          <line
            x1="34"
            y1="48"
            x2="100"
            y2="29"
            pathLength={1}
            strokeLinecap="round"
            className="experience-analytics-line stroke-foreground"
          />
        </g>
        <g className="experience-analytics-lid">
          <line
            x1={analyticsLid.x}
            y1={analyticsLidLineY}
            x2={analyticsLid.x + analyticsLid.width}
            y2={analyticsLidLineY}
            className="stroke-foreground"
          />
        </g>
      </svg>
    </ExperienceDiagramControl>
  );
};

export default AnalyticsDiagram;
