import type { CSSProperties } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import ExperienceDiagramControl from "@/components/experience-diagrams/ExperienceDiagramControl";

const analyticsBars = [
  { x: 42, top: 40, delay: "var(--duration-diagram-delay-280)" },
  {
    x: 48,
    top: 34,
    delay: "calc(var(--duration-diagram-delay-280) + var(--duration-diagram-delay-70))",
  },
  {
    x: 54,
    top: 38,
    delay: "calc(var(--duration-diagram-delay-280) + var(--duration-diagram-delay-70) + var(--duration-diagram-delay-70))",
  },
  {
    x: 60,
    top: 30,
    delay: "calc(var(--duration-diagram-delay-280) + var(--duration-diagram-delay-210))",
  },
  {
    x: 66,
    top: 36,
    delay: "calc(var(--duration-diagram-delay-280) + var(--duration-diagram-delay-280))",
  },
] as const;

const analyticsBaseline = 48;

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
        <rect x="30" y="24" width="52" height="30" className="fill-background" />
        <g className="experience-analytics-plot">
          <line x1="38" y1={analyticsBaseline} x2="74" y2={analyticsBaseline} />
          {analyticsBars.map((bar) => (
            <line
              key={bar.x}
              x1={bar.x}
              y1={analyticsBaseline}
              x2={bar.x}
              y2={bar.top}
              pathLength={1}
              strokeLinecap="butt"
              className="experience-analytics-bar stroke-foreground"
              style={{ animationDelay: bar.delay } as CSSProperties}
            />
          ))}
          <polyline
            points="42,40 48,34 54,38 60,30 66,36"
            pathLength={1}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="experience-analytics-line stroke-foreground"
          />
        </g>
        <g className="experience-analytics-lid">
          <rect x="26" y="8" width="60" height="10" className="fill-background" />
          <line x1="26" y1="13" x2="86" y2="13" className="stroke-foreground" />
        </g>
      </svg>
    </ExperienceDiagramControl>
  );
};

export default AnalyticsDiagram;
