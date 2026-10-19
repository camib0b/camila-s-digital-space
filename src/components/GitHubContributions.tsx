import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useGithubContributions } from "@/hooks/useGithubContributions";
import { cn } from "@/lib/utils";
import type {
  ContributionLevel,
  GithubContributionDay,
  GithubContributionWeek,
} from "@/types/githubContributions";

const CONTRIBUTION_ROW_COUNT = 7;
/** Gap scales with cell size (1px at a 5px cell in the original layout). */
const GAP_TO_CELL_RATIO = 1 / 5;
/** Room for the 3px wave so the crop does not clip the settle. */
const WAVE_CLEARANCE_PX = 6;
const WAVE_AMPLITUDE_PX = 3;
const WAVE_PHASE_STEP_RADIANS = 0.62;

/** Matches the hero title delay so the pattern enters with the name. */
const CONTRIBUTION_INTRO_OFFSET_MS = 80;
/** Short travel (3px): faster than the 12px hero fade, close to the curtain. */
const COLUMN_ENTER_DURATION_MS = 400;
/** Offset + column duration + stagger. Kept inside 1.2–1.8s. */
const INTRO_TOTAL_DURATION_MS = 1400;

const CONTRIBUTION_LEVEL_CLASS: Record<ContributionLevel, string> = {
  NONE: "bg-[hsl(var(--contrib-empty))]",
  FIRST_QUARTILE: "bg-[hsl(var(--contrib-q1))]",
  SECOND_QUARTILE: "bg-[hsl(var(--contrib-q2))]",
  THIRD_QUARTILE: "bg-[hsl(var(--contrib-q3))]",
  FOURTH_QUARTILE: "bg-[hsl(var(--contrib-q4))]",
};

interface ContributionFrameMetrics {
  cellSizePx: number;
  gapPx: number;
  visibleWeekCount: number;
}

type ContributionIntroPhase = "pending" | "playing" | "settled";

interface ContributionPatternStyle extends CSSProperties {
  "--contribution-intro-offset": string;
  "--contribution-column-duration": string;
  "--contribution-column-stagger": string;
}

interface ContributionColumnStyle extends CSSProperties {
  "--column-index": number;
  "--wave-offset": string;
}

const GitHubContributions = () => {
  const { contributions } = useGithubContributions();
  const frameRef = useRef<HTMLDivElement>(null);
  const introStartedRef = useRef(false);
  const playingColumnCountRef = useRef(0);
  const [frameMetrics, setFrameMetrics] = useState<ContributionFrameMetrics | null>(null);
  const [introPhase, setIntroPhase] = useState<ContributionIntroPhase>("pending");

  const availableWeekCount = contributions?.weeks.length ?? 0;

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) {
      return;
    }

    const measureFrame = () => {
      const bounds = frame.getBoundingClientRect();
      const nextMetrics = metricsForContributionFrame(
        bounds.width,
        bounds.height,
        availableWeekCount
      );
      setFrameMetrics((currentMetrics) =>
        sameFrameMetrics(currentMetrics, nextMetrics) ? currentMetrics : nextMetrics
      );
    };

    measureFrame();
    const resizeObserver = new ResizeObserver(measureFrame);
    resizeObserver.observe(frame);

    return () => {
      resizeObserver.disconnect();
    };
  }, [availableWeekCount]);

  useLayoutEffect(() => {
    if (introStartedRef.current || !contributions || !frameMetrics) {
      return;
    }

    const columnCount = Math.min(frameMetrics.visibleWeekCount, contributions.weeks.length);
    if (columnCount < 1) {
      return;
    }

    introStartedRef.current = true;
    playingColumnCountRef.current = columnCount;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIntroPhase(prefersReducedMotion ? "settled" : "playing");
  }, [contributions, frameMetrics]);

  useEffect(() => {
    if (introPhase !== "playing") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIntroPhase("settled");
    }, introEndMilliseconds(playingColumnCountRef.current));

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [introPhase]);

  const visibleWeeks =
    contributions && frameMetrics
      ? contributions.weeks.slice(-frameMetrics.visibleWeekCount)
      : [];
  const cellSizePx = frameMetrics?.cellSizePx ?? 3;
  const gapPx = frameMetrics?.gapPx ?? 1;
  const patternStyle: ContributionPatternStyle = {
    gap: gapPx,
    "--contribution-intro-offset": `${CONTRIBUTION_INTRO_OFFSET_MS}ms`,
    "--contribution-column-duration": `${COLUMN_ENTER_DURATION_MS}ms`,
    "--contribution-column-stagger": `${columnStaggerMilliseconds(visibleWeeks.length)}ms`,
  };

  return (
    <div
      ref={frameRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {visibleWeeks.length > 0 ? (
        <div className="absolute inset-y-0 left-0 flex items-center">
          <div className="flex flex-nowrap" style={patternStyle}>
            {visibleWeeks.map((week, columnIndex) => (
              <ContributionWeekColumn
                key={week.firstDay}
                week={week}
                columnIndex={columnIndex}
                cellSizePx={cellSizePx}
                gapPx={gapPx}
                introPhase={introPhase}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

interface ContributionWeekColumnProps {
  week: GithubContributionWeek;
  columnIndex: number;
  cellSizePx: number;
  gapPx: number;
  introPhase: ContributionIntroPhase;
}

const ContributionWeekColumn = ({
  week,
  columnIndex,
  cellSizePx,
  gapPx,
  introPhase,
}: ContributionWeekColumnProps) => {
  const columnStyle: ContributionColumnStyle = {
    "--column-index": columnIndex,
    "--wave-offset": `${waveOffsetPx(columnIndex).toFixed(2)}px`,
    gap: gapPx,
  };

  return (
    <div
      className="contribution-week flex shrink-0 flex-col"
      data-intro={introPhase === "playing" ? "playing" : "settled"}
      style={columnStyle}
    >
      {weekRows(week).map((day, rowIndex) => (
        <span
          key={day?.date ?? `empty-row-${rowIndex}`}
          className={cn(
            "block rounded-[1px]",
            day ? CONTRIBUTION_LEVEL_CLASS[day.contributionLevel] : CONTRIBUTION_LEVEL_CLASS.NONE
          )}
          style={{ width: cellSizePx, height: cellSizePx }}
        />
      ))}
    </div>
  );
};

function metricsForContributionFrame(
  frameWidthPx: number,
  frameHeightPx: number,
  availableWeekCount: number
): ContributionFrameMetrics {
  if (frameWidthPx <= 0 || frameHeightPx <= 0 || availableWeekCount < 1) {
    return { cellSizePx: 3, gapPx: 0.6, visibleWeekCount: 0 };
  }

  const weekCount = availableWeekCount;
  const columnStrideFactor = weekCount + (weekCount - 1) * GAP_TO_CELL_RATIO;
  const cellSizePx = frameWidthPx / columnStrideFactor;
  const gapPx = cellSizePx * GAP_TO_CELL_RATIO;

  return {
    cellSizePx,
    gapPx,
    visibleWeekCount: weekCount,
  };
}

function sameFrameMetrics(
  currentMetrics: ContributionFrameMetrics | null,
  nextMetrics: ContributionFrameMetrics
): boolean {
  return (
    currentMetrics !== null &&
    currentMetrics.cellSizePx === nextMetrics.cellSizePx &&
    currentMetrics.gapPx === nextMetrics.gapPx &&
    currentMetrics.visibleWeekCount === nextMetrics.visibleWeekCount
  );
}

function columnStaggerMilliseconds(columnCount: number): number {
  if (columnCount <= 1) {
    return 0;
  }

  const staggerWindowMs = INTRO_TOTAL_DURATION_MS - CONTRIBUTION_INTRO_OFFSET_MS - COLUMN_ENTER_DURATION_MS;
  return Math.max(0, Math.round(staggerWindowMs / (columnCount - 1)));
}

function introEndMilliseconds(columnCount: number): number {
  const staggerMs = columnStaggerMilliseconds(columnCount);
  return CONTRIBUTION_INTRO_OFFSET_MS + COLUMN_ENTER_DURATION_MS + Math.max(0, columnCount - 1) * staggerMs + 40;
}

function waveOffsetPx(columnIndex: number): number {
  return Math.sin(columnIndex * WAVE_PHASE_STEP_RADIANS) * WAVE_AMPLITUDE_PX;
}

function weekRows(week: GithubContributionWeek): Array<GithubContributionDay | null> {
  const rows: Array<GithubContributionDay | null> = Array.from(
    { length: CONTRIBUTION_ROW_COUNT },
    () => null
  );

  for (const day of week.contributionDays) {
    rows[contributionRowIndex(day.weekday)] = day;
  }

  return rows;
}

function contributionRowIndex(weekday: number): number {
  if (weekday === 7) {
    return 0;
  }
  if (weekday >= 0 && weekday <= 6) {
    return weekday;
  }
  return 0;
}

export default GitHubContributions;
