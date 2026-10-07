import { useLayoutEffect, useRef, useState, type FocusEvent, type MouseEvent } from "react";
import { useGithubContributions } from "@/hooks/useGithubContributions";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import type { TranslationKey } from "@/i18n/types";
import {
  CONTRIBUTION_CALENDAR_START_DATE,
  CONTRIBUTION_LEVELS,
  type ContributionLevel,
  type GithubContributionMonth,
  type GithubContributionWeek,
} from "@/types/githubContributions";

const CELL_SIZE_PX = 11;
const CELL_GAP_PX = 3;
const MONTH_ROW_HEIGHT_PX = 14;
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

const CONTRIBUTION_LEVEL_CLASS: Record<ContributionLevel, string> = {
  NONE: "bg-[hsl(var(--contrib-empty))]",
  FIRST_QUARTILE: "bg-[hsl(var(--contrib-q1))]",
  SECOND_QUARTILE: "bg-[hsl(var(--contrib-q2))]",
  THIRD_QUARTILE: "bg-[hsl(var(--contrib-q3))]",
  FOURTH_QUARTILE: "bg-[hsl(var(--contrib-q4))]",
};

const WEEKDAY_LABELS: { gridRow: number; key: TranslationKey }[] = [
  { gridRow: 2, key: "github.weekdayMon" },
  { gridRow: 4, key: "github.weekdayWed" },
  { gridRow: 6, key: "github.weekdayFri" },
];

interface CalendarTooltip {
  text: string;
  x: number;
  y: number;
}

const GitHubContributions = () => {
  const { language, t } = useLanguage();
  const { contributions, isLoading, isError } = useGithubContributions();
  const [tooltip, setTooltip] = useState<CalendarTooltip | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const userHasScrolledRef = useRef(false);
  const pendingUserScrollFrameRef = useRef<number | null>(null);

  const weekCount = contributions?.weeks.length ?? skeletonWeekCount();

  useLayoutEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) {
      return;
    }

    scrollContainerToLatestContributions(scrollContainer);

    const resizeObserver = new ResizeObserver(() => {
      if (userHasScrolledRef.current || pendingUserScrollFrameRef.current !== null) {
        return;
      }
      scrollContainerToLatestContributions(scrollContainer);
    });
    resizeObserver.observe(scrollContainer);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isLoading, weekCount]);

  const hideTooltip = () => {
    setTooltip(null);
  };

  const handleCalendarScroll = () => {
    hideTooltip();
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) {
      return;
    }

    if (isScrolledToLatestContributions(scrollContainer)) {
      if (pendingUserScrollFrameRef.current !== null) {
        cancelAnimationFrame(pendingUserScrollFrameRef.current);
        pendingUserScrollFrameRef.current = null;
      }
      return;
    }

    if (pendingUserScrollFrameRef.current !== null) {
      return;
    }

    // Content swaps can emit a scroll event before useLayoutEffect pins the
    // right edge. Wait a frame so that correction is not treated as a user scroll.
    pendingUserScrollFrameRef.current = requestAnimationFrame(() => {
      pendingUserScrollFrameRef.current = null;
      const containerAfterFrame = scrollContainerRef.current;
      if (!containerAfterFrame || isScrolledToLatestContributions(containerAfterFrame)) {
        return;
      }
      userHasScrolledRef.current = true;
    });
  };

  const showTooltip = (
    event: MouseEvent<HTMLButtonElement> | FocusEvent<HTMLButtonElement>,
    text: string
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      text,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const monthCells = contributions
    ? monthLabelCells(contributions.months, contributions.weeks, language)
    : [{ label: "", span: skeletonWeekCount() }];

  return (
    <div id="github" className="mt-12">
      <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {t("github.label")}
      </h3>

      {isError && !isLoading ? (
        <p className="text-sm text-muted-foreground">{t("github.error")}</p>
      ) : (
        <>
          <div className="flex gap-2">
            <div className="flex shrink-0 flex-col" aria-hidden="true">
              <div style={{ height: MONTH_ROW_HEIGHT_PX, marginBottom: 2 }} />
              <div
                className="grid text-[10px] leading-none text-muted-foreground"
                style={{
                  gridTemplateRows: `repeat(7, ${CELL_SIZE_PX}px)`,
                  rowGap: CELL_GAP_PX,
                }}
              >
                {Array.from({ length: 7 }, (_, rowIndex) => {
                  const label = WEEKDAY_LABELS.find((entry) => entry.gridRow === rowIndex + 1);
                  return (
                    <span key={rowIndex} className="flex items-center pr-1">
                      {label ? t(label.key) : ""}
                    </span>
                  );
                })}
              </div>
            </div>

            <div
              ref={scrollContainerRef}
              className="min-w-0 flex-1 overflow-x-auto pb-1"
              role="region"
              aria-label={t("github.label")}
              aria-busy={isLoading}
              onScroll={handleCalendarScroll}
            >
              <div
                className="inline-block"
                style={{
                  minWidth: weekCount * CELL_SIZE_PX + Math.max(0, weekCount - 1) * CELL_GAP_PX,
                }}
              >
                <div
                  className="mb-[2px] grid text-[10px] leading-none text-muted-foreground"
                  style={{
                    height: MONTH_ROW_HEIGHT_PX,
                    gridTemplateColumns: `repeat(${weekCount}, ${CELL_SIZE_PX}px)`,
                    columnGap: CELL_GAP_PX,
                  }}
                >
                  {monthCells.map((cell, index) => (
                    <span
                      key={`${cell.label}-${index}`}
                      className="truncate"
                      style={{ gridColumn: `span ${cell.span}` }}
                    >
                      {cell.label}
                    </span>
                  ))}
                </div>

                {isLoading || !contributions ? (
                  <div
                    className="grid grid-flow-col"
                    style={{
                      gridTemplateRows: `repeat(7, ${CELL_SIZE_PX}px)`,
                      gridAutoColumns: CELL_SIZE_PX,
                      gap: CELL_GAP_PX,
                    }}
                  >
                    {Array.from({ length: skeletonWeekCount() * 7 }, (_, index) => (
                      <span
                        key={index}
                        className="block animate-pulse rounded-[2px] bg-[hsl(var(--contrib-empty))]"
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className="grid grid-flow-col"
                    style={{
                      gridTemplateRows: `repeat(7, ${CELL_SIZE_PX}px)`,
                      gridAutoColumns: CELL_SIZE_PX,
                      gap: CELL_GAP_PX,
                    }}
                  >
                    {contributions.weeks.map((week) =>
                      week.contributionDays.map((day) => {
                        const tooltipText = formatDayTooltip(day.date, day.contributionCount, t);
                        return (
                          <button
                            key={day.date}
                            type="button"
                            title={tooltipText}
                            aria-label={tooltipText}
                            className={cn(
                              "h-full w-full cursor-default appearance-none rounded-[2px] border-0 p-0",
                              CONTRIBUTION_LEVEL_CLASS[day.contributionLevel],
                              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                              "hover:ring-1 hover:ring-foreground/25"
                            )}
                            style={{ gridRow: contributionGridRow(day.weekday) }}
                            onMouseEnter={(event) => showTooltip(event, tooltipText)}
                            onMouseLeave={hideTooltip}
                            onFocus={(event) => showTooltip(event, tooltipText)}
                            onBlur={hideTooltip}
                          />
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {contributions && !isLoading ? (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                {interpolateTemplate(t("github.summary"), contributions.totalContributions)}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>{t("github.less")}</span>
                {CONTRIBUTION_LEVELS.map((level) => (
                  <span
                    key={level}
                    className={cn("inline-block rounded-[2px]", CONTRIBUTION_LEVEL_CLASS[level])}
                    style={{ width: CELL_SIZE_PX, height: CELL_SIZE_PX }}
                    aria-hidden="true"
                  />
                ))}
                <span>{t("github.more")}</span>
              </div>
            </div>
          ) : null}
        </>
      )}

      {tooltip ? (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-md border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-elev-2"
          style={{ left: tooltip.x, top: tooltip.y - 6 }}
        >
          {tooltip.text}
        </div>
      ) : null}
    </div>
  );
};

const SCROLL_EDGE_TOLERANCE_PX = 1;

let rightToLeftRightEdgeIsZeroCache: boolean | null = null;

function scrollContainerToLatestContributions(scrollContainer: HTMLElement): void {
  const maximumScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
  if (maximumScrollLeft <= SCROLL_EDGE_TOLERANCE_PX) {
    return;
  }

  const latestScrollLeft = scrollLeftForVisualRightEdge(scrollContainer, maximumScrollLeft);
  if (Math.abs(scrollContainer.scrollLeft - latestScrollLeft) <= SCROLL_EDGE_TOLERANCE_PX) {
    return;
  }

  scrollContainer.scrollLeft = latestScrollLeft;
}

function isScrolledToLatestContributions(scrollContainer: HTMLElement): boolean {
  const maximumScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
  if (maximumScrollLeft <= SCROLL_EDGE_TOLERANCE_PX) {
    return true;
  }

  const latestScrollLeft = scrollLeftForVisualRightEdge(scrollContainer, maximumScrollLeft);
  return Math.abs(scrollContainer.scrollLeft - latestScrollLeft) <= SCROLL_EDGE_TOLERANCE_PX;
}

// Weeks stay in DOM order, oldest on the left and newest on the right.
// scrollLeft = scrollWidth - clientWidth opens on that right edge in LTR.
// RTL scrollports use either 0 or that same maximum for the visual right edge;
// flipping flex direction would reverse the chronology, so only the scroll offset changes.
function scrollLeftForVisualRightEdge(scrollContainer: HTMLElement, maximumScrollLeft: number): number {
  if (getComputedStyle(scrollContainer).direction !== "rtl") {
    return maximumScrollLeft;
  }
  return rightToLeftRightEdgeIsZero() ? 0 : maximumScrollLeft;
}

function rightToLeftRightEdgeIsZero(): boolean {
  if (rightToLeftRightEdgeIsZeroCache !== null) {
    return rightToLeftRightEdgeIsZeroCache;
  }
  if (!document.body) {
    return false;
  }

  const probe = document.createElement("div");
  const content = document.createElement("div");
  probe.dir = "rtl";
  probe.style.direction = "rtl";
  probe.style.position = "absolute";
  probe.style.top = "-9999px";
  probe.style.width = "4px";
  probe.style.height = "1px";
  probe.style.overflow = "scroll";
  content.style.width = "8px";
  content.style.height = "1px";
  probe.appendChild(content);
  document.body.appendChild(probe);
  rightToLeftRightEdgeIsZeroCache = probe.scrollLeft === 0;
  probe.remove();
  return rightToLeftRightEdgeIsZeroCache;
}

function skeletonWeekCount(): number {
  const start = Date.parse(`${CONTRIBUTION_CALENDAR_START_DATE}T00:00:00Z`);
  if (Number.isNaN(start)) {
    return 1;
  }
  const elapsedMilliseconds = Math.max(0, Date.now() - start);
  return Math.max(1, Math.ceil(elapsedMilliseconds / MS_PER_WEEK));
}

function contributionGridRow(weekday: number): number {
  if (weekday === 7) {
    return 1;
  }
  if (weekday >= 0 && weekday <= 6) {
    return weekday + 1;
  }
  return 1;
}

function monthLabelCells(
  months: GithubContributionMonth[],
  weeks: GithubContributionWeek[],
  language: string
): { label: string; span: number }[] {
  const fromApi = months.map((month) => ({
    label: formatMonthLabel(month.firstDay, language),
    span: Math.max(0, month.totalWeeks),
  }));
  const totalSpan = fromApi.reduce((sum, cell) => sum + cell.span, 0);
  if (totalSpan === weeks.length) {
    return fromApi.filter((cell) => cell.span > 0);
  }

  const cells: { label: string; span: number }[] = [];
  for (const week of weeks) {
    const label = formatMonthLabel(week.firstDay, language);
    const lastCell = cells[cells.length - 1];
    if (lastCell && lastCell.label === label) {
      lastCell.span += 1;
    } else {
      cells.push({ label, span: 1 });
    }
  }
  return cells;
}

function formatMonthLabel(isoDate: string, language: string): string {
  const date = parseIsoDate(isoDate);
  if (!date) {
    return "";
  }
  return date.toLocaleDateString(language === "es" ? "es" : "en", { month: "short" });
}

function parseIsoDate(isoDate: string): Date | null {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function formatDayTooltip(
  date: string,
  contributionCount: number,
  translate: (key: TranslationKey) => string
): string {
  return `${date} · ${formatContributionCount(contributionCount, translate)}`;
}

function formatContributionCount(
  contributionCount: number,
  translate: (key: TranslationKey) => string
): string {
  if (contributionCount <= 0) {
    return translate("github.emptyDay");
  }
  if (contributionCount === 1) {
    return translate("github.oneContribution");
  }
  return interpolateTemplate(translate("github.nContributions"), contributionCount);
}

function interpolateTemplate(template: string, count: number): string {
  return template.replace(/\{n\}/g, String(count));
}

export default GitHubContributions;
