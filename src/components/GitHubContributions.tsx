import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useGithubContributions } from "@/hooks/useGithubContributions";
import { buildHeroContributionColumns, heroContributionLayout } from "@/lib/heroContributionGrid";
import { cn } from "@/lib/utils";
import type {
  ContributionLevel,
  GithubContributionDay,
  GithubContributionWeek,
} from "@/types/githubContributions";

const CONTRIBUTION_ROW_COUNT = 7;
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
  targetWeekCount: number;
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
  const [viewportIsMd, setViewportIsMd] = useState(false);

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const updateViewport = () => setViewportIsMd(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) {
      return;
    }

    const measureFrame = () => {
      const bounds = frame.getBoundingClientRect();
      const nextMetrics = heroContributionLayout(bounds.width, viewportIsMd);
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
  }, [viewportIsMd]);

  useLayoutEffect(() => {
    if (introStartedRef.current || !contributions || !frameMetrics) {
      return;
    }

    if (frameMetrics.targetWeekCount < 1) {
      return;
    }

    const columnCount = buildHeroContributionColumns(
      contributions.weeks,
      frameMetrics.targetWeekCount,
      contributions.months
    ).length;

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

  const displayColumns =
    contributions && frameMetrics
      ? buildHeroContributionColumns(
          contributions.weeks,
          frameMetrics.targetWeekCount,
          contributions.months
        )
      : [];
  const cellSizePx = frameMetrics?.cellSizePx ?? 4;
  const gapPx = frameMetrics?.gapPx ?? 0.8;
  const patternStyle: ContributionPatternStyle = {
    gap: gapPx,
    "--contribution-intro-offset": `${CONTRIBUTION_INTRO_OFFSET_MS}ms`,
    "--contribution-column-duration": `${COLUMN_ENTER_DURATION_MS}ms`,
    "--contribution-column-stagger": `${columnStaggerMilliseconds(displayColumns.length)}ms`,
  };

  return (
    <div
      ref={frameRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {displayColumns.length > 0 ? (
        <div className="absolute inset-y-0 right-0 flex items-center opacity-90">
          <div className="flex flex-nowrap" style={patternStyle}>
            {displayColumns.map((week, columnIndex) => (
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

  const rows = weekRows(week);

  return (
    <div
      className="contribution-week flex shrink-0 flex-col"
      data-intro={introPhase === "playing" ? "playing" : "settled"}
      style={columnStyle}
    >
      {rows.map((day, rowIndex) => (
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

function sameFrameMetrics(
  currentMetrics: ContributionFrameMetrics | null,
  nextMetrics: ContributionFrameMetrics
): boolean {
  return (
    currentMetrics !== null &&
    currentMetrics.cellSizePx === nextMetrics.cellSizePx &&
    currentMetrics.gapPx === nextMetrics.gapPx &&
    currentMetrics.targetWeekCount === nextMetrics.targetWeekCount
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
