const hotelBaseline = 54;
const hotelWidth = 12;
const hotelRoofHeight = 5;
const metricCenterX = 140;
const metricCenterY = 34;
const metricFontSize = 17;
const metricLineGap = 16;

const hotels = [
  { originX: 4, bodyHeight: 16 },
  { originX: 19, bodyHeight: 24 },
  { originX: 34, bodyHeight: 15 },
  { originX: 49, bodyHeight: 22 },
  { originX: 64, bodyHeight: 18 },
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

const HotelDiagram = () => {
  return (
    <svg
      viewBox="0 0 200 60"
      width={200}
      height={60}
      aria-hidden="true"
      className="experience-hotel pointer-events-none h-[60px] w-[200px] max-w-full shrink-0 overflow-hidden fill-none stroke-muted-foreground"
    >
      <line x1="2" y1={hotelBaseline} x2="78" y2={hotelBaseline} />
      {hotels.map((hotel) => (
        <HotelOutline key={hotel.originX} originX={hotel.originX} bodyHeight={hotel.bodyHeight} />
      ))}
      <text
        x={metricCenterX}
        y={metricCenterY - metricLineGap}
        textAnchor="middle"
        fontSize={metricFontSize}
        className="experience-hotel-kpi fill-foreground stroke-none font-medium"
      >
        <tspan x={metricCenterX}>Occ 82%</tspan>
        <tspan x={metricCenterX} dy={metricLineGap}>
          ADR $118
        </tspan>
        <tspan x={metricCenterX} dy={metricLineGap}>
          RevPAR $97
        </tspan>
      </text>
    </svg>
  );
};

export default HotelDiagram;
