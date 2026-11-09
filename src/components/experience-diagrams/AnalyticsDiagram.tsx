const AnalyticsDiagram = () => {
  return (
    <svg
      viewBox="70 0 118 60"
      width={118}
      height={60}
      aria-hidden="true"
      className="experience-analytics pointer-events-none h-[60px] w-[118px] max-w-full shrink-0 overflow-hidden fill-none stroke-muted-foreground"
    >
      <rect x="74" y="6" width="108" height="48" rx="2" className="fill-background" />

      <g>
        <rect x="80" y="12" width="28" height="36" />
        <line
          x1="88"
          y1="42"
          x2="88"
          y2="34"
          pathLength={1}
          strokeLinecap="butt"
          className="experience-analytics-mark stroke-foreground"
        />
        <line
          x1="94"
          y1="42"
          x2="94"
          y2="24"
          pathLength={1}
          strokeLinecap="butt"
          className="experience-analytics-mark stroke-foreground"
        />
        <line
          x1="100"
          y1="42"
          x2="100"
          y2="30"
          pathLength={1}
          strokeLinecap="butt"
          className="experience-analytics-mark stroke-foreground"
        />
      </g>

      <g>
        <rect x="114" y="12" width="28" height="36" />
        <polyline
          points="120,40 126,31 132,34 138,23"
          pathLength={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="experience-analytics-line stroke-foreground"
        />
      </g>

      <g>
        <rect x="148" y="12" width="28" height="36" />
        <text
          x="162"
          y="32"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="13"
          className="experience-analytics-number fill-foreground stroke-none font-medium"
        >
          128
        </text>
      </g>
    </svg>
  );
};

export default AnalyticsDiagram;
