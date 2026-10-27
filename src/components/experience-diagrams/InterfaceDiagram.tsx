import type { CSSProperties } from "react";

const interfaceCardWidth = 68;
const interfaceCardHeight = 14;
const interfaceCardStartX = 50;
const interfaceCardStartY = 24;
const interfaceCodeStartX = 8;
const interfaceCodeStartY = 22;
const interfaceCodeLineGap = 6.4;

const interfaceCards = [
  { endPositionX: 10, endPositionY: 20, delay: "0s" },
  { endPositionX: 90, endPositionY: 20, delay: "0.05s" },
  { endPositionX: 10, endPositionY: 40, delay: "0.1s" },
  { endPositionX: 90, endPositionY: 40, delay: "0.15s" },
];

type InterfaceCodeTone = "keyword" | "identifier" | "string" | "punctuation";

const interfaceCodeToneClassName: Record<InterfaceCodeTone, string> = {
  keyword: "fill-primary",
  identifier: "fill-foreground",
  string: "fill-number-positive",
  punctuation: "fill-muted-foreground",
};

const interfaceCodeLines: Array<Array<{ text: string; tone: InterfaceCodeTone }>> = [
  [
    { text: "function", tone: "keyword" },
    { text: " ", tone: "punctuation" },
    { text: "Card", tone: "identifier" },
    { text: "({ ", tone: "punctuation" },
    { text: "src", tone: "identifier" },
    { text: ", ", tone: "punctuation" },
    { text: "tag", tone: "identifier" },
    { text: ", ", tone: "punctuation" },
    { text: "on", tone: "identifier" },
    { text: " }: ", tone: "punctuation" },
    { text: "Props", tone: "identifier" },
    { text: ") {", tone: "punctuation" },
  ],
  [
    { text: "  ", tone: "punctuation" },
    { text: "const", tone: "keyword" },
    { text: " ", tone: "punctuation" },
    { text: "hot", tone: "identifier" },
    { text: " = ", tone: "punctuation" },
    { text: "on", tone: "identifier" },
    { text: " ? ", tone: "punctuation" },
    { text: '"press"', tone: "string" },
    { text: " : ", tone: "punctuation" },
    { text: '"hover"', tone: "string" },
  ],
  [
    { text: "  ", tone: "punctuation" },
    { text: "return", tone: "keyword" },
    { text: " <", tone: "punctuation" },
    { text: "Card", tone: "identifier" },
    { text: " ", tone: "punctuation" },
    { text: "variant", tone: "identifier" },
    { text: "=", tone: "punctuation" },
    { text: '"lift"', tone: "string" },
    { text: " ", tone: "punctuation" },
    { text: "state", tone: "identifier" },
    { text: "={", tone: "punctuation" },
    { text: "hot", tone: "identifier" },
    { text: "}>", tone: "punctuation" },
  ],
  [
    { text: "    <", tone: "punctuation" },
    { text: "img", tone: "identifier" },
    { text: " ", tone: "punctuation" },
    { text: "src", tone: "identifier" },
    { text: "={", tone: "punctuation" },
    { text: "src", tone: "identifier" },
    { text: "} /><", tone: "punctuation" },
    { text: "Badge", tone: "identifier" },
    { text: ">{", tone: "punctuation" },
    { text: "tag", tone: "identifier" },
    { text: "}</", tone: "punctuation" },
    { text: "Badge", tone: "identifier" },
    { text: ">", tone: "punctuation" },
  ],
  [
    { text: "  </", tone: "punctuation" },
    { text: "Card", tone: "identifier" },
    { text: ">", tone: "punctuation" },
  ],
  [{ text: "}", tone: "punctuation" }],
];

function InterfaceBlock() {
  return (
    <>
      <rect
        width={interfaceCardWidth}
        height={interfaceCardHeight}
        rx="1"
        className="fill-background stroke-muted-foreground"
      />
      <line x1="5" y1="4" x2="16" y2="4" className="stroke-accent-teal" />
    </>
  );
}

const InterfaceDiagram = () => {
  return (
    <svg
      viewBox="0 0 168 60"
      aria-hidden="true"
      className="experience-interface pointer-events-none h-[60px] w-[168px] shrink-0 overflow-hidden fill-none stroke-muted-foreground"
    >
      <rect x="2" y="2" width="164" height="56" rx="2" className="fill-background" />
      <line x1="2" y1="16" x2="166" y2="16" />
      <text
        y={interfaceCodeStartY}
        fontSize="6"
        className="experience-interface-code stroke-none font-mono"
      >
        {interfaceCodeLines.map((line, lineIndex) => (
          <tspan
            key={line.map((token) => token.text).join("")}
            x={interfaceCodeStartX}
            dy={lineIndex === 0 ? 0 : interfaceCodeLineGap}
          >
            {line.map((token, tokenIndex) => (
              <tspan key={tokenIndex} className={interfaceCodeToneClassName[token.tone]}>
                {token.text}
              </tspan>
            ))}
          </tspan>
        ))}
      </text>

      <g className="experience-interface-source">
        <InterfaceBlock />
      </g>

      {interfaceCards.map((card) => {
        const cardStyle = {
          "--card-end-x": `${card.endPositionX}px`,
          "--card-end-y": `${card.endPositionY}px`,
          animationDelay: card.delay,
        } as CSSProperties;

        return (
          <g key={`${card.endPositionX}-${card.endPositionY}`} className="experience-interface-card" style={cardStyle}>
            <InterfaceBlock />
          </g>
        );
      })}
    </svg>
  );
};

export default InterfaceDiagram;
