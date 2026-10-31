/**
 * Single source for durations and easings.
 * The custom properties in the motion-tokens block of src/index.css mirror
 * `cssMotionVariables`. JS and TS import these constants instead of retyping them.
 */

export const ease = {
  out: "cubic-bezier(0.23, 1, 0.32, 1)",
  inOut: "cubic-bezier(0.77, 0, 0.175, 1)",
  hero: "cubic-bezier(0.16, 1, 0.3, 1)",
  hover: "ease",
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

/** Shared UI durations in milliseconds. */
export const duration = {
  press: 100,
  fast: 120,
  hover: 150,
  base: 200,
  enter: 250,
  hero: 600,
} as const;

/**
 * Durations that stay at their current values and do not sit on the six UI steps.
 * Diagram lengths are named on their own so a UI timing edit cannot retune them.
 */
export const keptDuration = {
  instant: 0,
  snap: 80,
  pressHold: 160,
  open: 180,
  settle: 140,
  pipelineStagger: 65,
  residue: 320,
  contribution: 400,
  curtain: 480,
  clipNudge: 560,
  landingStagger: 60,
  movedHighlight: 700,
  portfolioSync: 1600,
  portfolioSkeleton: 1800,
  sessionAdjacent: 420,
  sessionSkip: 500,
  sessionGap: 75,
  sessionHighlight: 240,
  diagramAnalytics: 2400,
  diagramRedraw: 800,
  diagramCommerce: 3000,
  diagramHotel: 1700,
  diagramInterface: 2100,
  diagramDelay50: 50,
  diagramDelay70: 70,
  diagramDelay210: 210,
  diagramDelay280: 280,
  avaScan: 18000,
  avaPlayhead: 22000,
  avaExport: 6000,
} as const;

function milliseconds(value: number): string {
  return `${value}ms`;
}

/** Specified values of the motion custom properties in src/index.css. */
export const cssMotionVariables = {
  "--ease-out-strong": ease.out,
  "--ease-in-out-strong": ease.inOut,
  "--ease-hero": ease.hero,
  "--ease-hover": ease.hover,
  "--ease-standard": ease.standard,
  "--duration-press": milliseconds(duration.press),
  "--duration-fast": milliseconds(duration.fast),
  "--duration-hover": milliseconds(duration.hover),
  "--duration-base": milliseconds(duration.base),
  "--duration-enter": milliseconds(duration.enter),
  "--duration-hero": milliseconds(duration.hero),
  "--duration-instant": milliseconds(keptDuration.instant),
  "--duration-snap": milliseconds(keptDuration.snap),
  "--duration-press-hold": milliseconds(keptDuration.pressHold),
  "--duration-open": milliseconds(keptDuration.open),
  "--duration-settle": milliseconds(keptDuration.settle),
  "--duration-pipeline-stagger": milliseconds(keptDuration.pipelineStagger),
  "--duration-residue": milliseconds(keptDuration.residue),
  "--duration-contribution": milliseconds(keptDuration.contribution),
  "--duration-clip-nudge": milliseconds(keptDuration.clipNudge),
  "--duration-portfolio-sync": milliseconds(keptDuration.portfolioSync),
  "--duration-portfolio-skeleton": milliseconds(keptDuration.portfolioSkeleton),
  "--duration-diagram-analytics": milliseconds(keptDuration.diagramAnalytics),
  "--duration-diagram-redraw": milliseconds(keptDuration.diagramRedraw),
  "--duration-diagram-commerce": milliseconds(keptDuration.diagramCommerce),
  "--duration-diagram-hotel": milliseconds(keptDuration.diagramHotel),
  "--duration-diagram-interface": milliseconds(keptDuration.diagramInterface),
  "--duration-diagram-delay-50": milliseconds(keptDuration.diagramDelay50),
  "--duration-diagram-delay-70": milliseconds(keptDuration.diagramDelay70),
  "--duration-diagram-delay-210": milliseconds(keptDuration.diagramDelay210),
  "--duration-diagram-delay-280": milliseconds(keptDuration.diagramDelay280),
  "--duration-ava-scan": milliseconds(keptDuration.avaScan),
  "--duration-ava-playhead": milliseconds(keptDuration.avaPlayhead),
  "--duration-ava-export": milliseconds(keptDuration.avaExport),
  /* Read back as a raw time by the analytics diagram. Do not alias these through var(). */
  "--curtain-duration": milliseconds(keptDuration.curtain),
  "--curtain-stagger": milliseconds(keptDuration.snap),
} as const;
