const packageBarcodeOffsets = [3, 5, 7, 8, 10, 12];

const CommerceDiagram = () => {
  return (
    <svg
      viewBox="0 0 200 60"
      aria-hidden="true"
      className="experience-commerce pointer-events-none h-[60px] w-[200px] shrink-0 overflow-hidden fill-none stroke-muted-foreground"
    >
      <g>
        <rect x="8" y="10" width="46" height="30" rx="1.5" className="fill-background" />
        <line x1="14" y1="16" x2="32" y2="16" />
        <line x1="14" y1="21" x2="26" y2="21" />
        <line x1="31" y1="40" x2="31" y2="50" />
        <line x1="22" y1="50" x2="40" y2="50" />

        <line x1="78" y1="12" x2="78" y2="50" />
        <line x1="122" y1="12" x2="122" y2="50" />
        <line x1="74" y1="28" x2="126" y2="28" />
        <line x1="74" y1="44" x2="126" y2="44" />

        <rect x="140" y="22" width="34" height="18" rx="1" className="fill-background" />
        <rect x="174" y="26" width="18" height="14" className="fill-background" />
        <rect x="178" y="29" width="6" height="5" className="fill-background" />
        <circle cx="152" cy="46.5" r="3.5" className="fill-background" />
        <circle cx="184" cy="46.5" r="3.5" className="fill-background" />
      </g>

      <g className="experience-commerce-package">
        <rect width="16" height="12" rx="1" className="fill-background stroke-foreground" />
        {packageBarcodeOffsets.map((offset) => (
          <line
            key={offset}
            x1={offset}
            y1="3"
            x2={offset}
            y2="9"
            strokeLinecap="butt"
            className="stroke-foreground"
          />
        ))}
      </g>

      <line
        x1="95"
        y1="22"
        x2="107"
        y2="22"
        strokeLinecap="round"
        className="experience-commerce-scan stroke-accent-teal"
      />
    </svg>
  );
};

export default CommerceDiagram;
