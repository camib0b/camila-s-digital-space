import type { CSSProperties } from "react";

const hotelBaseline = 54;
const hotelWidth = 12;
const hotelRoofHeight = 5;
const portfolioKpiX = 84;
const portfolioKpiY = 16;

const hotels = [
  { originX: 4, bodyHeight: 16, markDelay: "0s" },
  { originX: 19, bodyHeight: 24, markDelay: "0.07s" },
  { originX: 34, bodyHeight: 15, markDelay: "0.14s" },
  { originX: 49, bodyHeight: 22, markDelay: "0.21s" },
  { originX: 64, bodyHeight: 18, markDelay: "0.28s" },
];

function HotelOutline({ originX, bodyHeight }: { originX: number; bodyHeight: number }) {
  const bodyTop = hotelBaseline - bodyHeight;
  const roofPeakY = bodyTop - hotelRoofHeight;

  return (
    <g>
      <rect x={originX} y={bodyTop} width={hotelWidth} height={bodyHeight} className="fill-background" />
      <polyline points={`${originX},${bodyTop} ${originX + hotelWidth / 2},${roofPeakY} ${originX + hotelWidth},${bodyTop}`} />
      <rect x={originX + 2} y={hotelBaseline - 7} width="3" height="4" />
      <rect x={originX + 7} y={hotelBaseline - 7} width="3" height="4" />
    </g>
  );
}

function HotelMetricMark({
  originX,
  bodyHeight,
  markDelay,
}: {
  originX: number;
  bodyHeight: number;
  markDelay: string;
}) {
  const roofPeakY = hotelBaseline - bodyHeight - hotelRoofHeight;
  const markX = originX + hotelWidth / 2;
  const markY = roofPeakY - 3;
  const markStyle = {
    "--mark-travel-x": `${portfolioKpiX + 6 - markX}px`,
    "--mark-travel-y": `${portfolioKpiY - markY}px`,
    animationDelay: markDelay,
  } as CSSProperties;

  return (
    <line
      x1={originX + 2}
      y1={markY}
      x2={originX + hotelWidth - 2}
      y2={markY}
      className="experience-hotel-mark stroke-foreground"
      style={markStyle}
    />
  );
}

const HotelDiagram = () => {
  return (
    <svg
      viewBox="0 0 200 60"
      aria-hidden="true"
      className="experience-hotel pointer-events-none h-[60px] w-[200px] shrink-0 overflow-hidden fill-none stroke-muted-foreground"
    >
      <line x1="2" y1={hotelBaseline} x2="78" y2={hotelBaseline} />
      {hotels.map((hotel) => (
        <HotelOutline key={hotel.originX} originX={hotel.originX} bodyHeight={hotel.bodyHeight} />
      ))}
      {hotels.map((hotel) => (
        <HotelMetricMark
          key={`mark-${hotel.originX}`}
          originX={hotel.originX}
          bodyHeight={hotel.bodyHeight}
          markDelay={hotel.markDelay}
        />
      ))}
      <text
        x={portfolioKpiX}
        y={portfolioKpiY}
        fontSize="7"
        dominantBaseline="middle"
        className="experience-hotel-kpi fill-accent-teal stroke-none font-medium"
      >
        Occ 82% · ADR $118 · RevPAR $97
      </text>
    </svg>
  );
};

export default HotelDiagram;
