const hotelWindowColumns = [19, 27, 35];
const hotelWindowRows = [18, 26, 34, 42];

const HotelDiagram = () => {
  return (
    <svg
      viewBox="0 0 120 60"
      aria-hidden="true"
      className="experience-hotel pointer-events-none h-[60px] w-[120px] shrink-0 overflow-hidden fill-none stroke-muted-foreground"
    >
      <line x1="8" y1="55" x2="54" y2="55" />
      <rect x="14" y="14" width="32" height="41" className="fill-background" />
      <polyline points="12,14 30,4 48,14" />
      {hotelWindowRows.map((rowPosition) =>
        hotelWindowColumns.map((columnPosition) => (
          <rect
            key={`${columnPosition}-${rowPosition}`}
            x={columnPosition}
            y={rowPosition}
            width="5"
            height="4"
          />
        )),
      )}

      <g className="experience-hotel-lens">
        <circle r="14" className="experience-hotel-ring fill-background" />
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="5.5"
          className="experience-hotel-metric experience-hotel-metric-occupancy fill-foreground stroke-none font-medium"
        >
          Occ 82%
        </text>
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="7"
          className="experience-hotel-metric experience-hotel-metric-rate fill-foreground stroke-none font-medium"
        >
          ADR
        </text>
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="6"
          className="experience-hotel-metric experience-hotel-metric-yield fill-foreground stroke-none font-medium"
        >
          RevPAR
        </text>
        <line x1="13" y1="4" x2="24" y2="12" className="stroke-foreground" />
      </g>
    </svg>
  );
};

export default HotelDiagram;
