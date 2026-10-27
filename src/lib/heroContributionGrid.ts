import type { GithubContributionMonth, GithubContributionWeek } from "@/types/githubContributions";

export const HERO_CONTRIBUTION_GAP_TO_CELL_RATIO = 1 / 5;
const HERO_CELL_SIZE_PX = { base: 4, md: 6 } as const;
const HERO_SIDE_SLACK_RATIO = 0.04;
const HERO_SIDE_SLACK_MIN_CELLS = 1.5;

export function heroContributionCellSizePx(viewportIsMd: boolean): number {
  return viewportIsMd ? HERO_CELL_SIZE_PX.md : HERO_CELL_SIZE_PX.base;
}

export interface HeroContributionLayout {
  cellSizePx: number;
  gapPx: number;
  targetWeekCount: number;
}

export function heroContributionLayout(titleWidthPx: number, viewportIsMd: boolean): HeroContributionLayout {
  if (titleWidthPx <= 0) {
    return { cellSizePx: HERO_CELL_SIZE_PX.base, gapPx: 0.8, targetWeekCount: 0 };
  }

  const cellSizePx = heroContributionCellSizePx(viewportIsMd);
  const gapPx = cellSizePx * HERO_CONTRIBUTION_GAP_TO_CELL_RATIO;
  const slackPerSidePx = Math.max(cellSizePx * HERO_SIDE_SLACK_MIN_CELLS, titleWidthPx * HERO_SIDE_SLACK_RATIO);
  const targetWidthPx = titleWidthPx + slackPerSidePx * 2;
  const targetWeekCount = Math.max(1, Math.ceil((targetWidthPx + gapPx) / (cellSizePx + gapPx)));

  return { cellSizePx, gapPx, targetWeekCount };
}

function monthForWeekFirstDay(
  weekFirstDay: string,
  months: GithubContributionMonth[]
): GithubContributionMonth | undefined {
  if (months.length === 0) {
    return undefined;
  }

  const sortedMonths = [...months].sort((left, right) => left.firstDay.localeCompare(right.firstDay));
  let matched = sortedMonths[0];

  for (const month of sortedMonths) {
    if (weekFirstDay >= month.firstDay) {
      matched = month;
    }
  }

  return matched;
}

/** Weeks in the leftmost month of a trailing window (dropped so recent days stay visible). */
export function leadingWeekCountInOldestDisplayedMonth(
  trailingWeeks: GithubContributionWeek[],
  months: GithubContributionMonth[]
): number {
  if (trailingWeeks.length === 0 || months.length === 0) {
    return 0;
  }

  const oldestMonthKey = monthForWeekFirstDay(trailingWeeks[0].firstDay, months)?.firstDay;
  if (!oldestMonthKey) {
    return 0;
  }

  let count = 0;
  for (const week of trailingWeeks) {
    const monthKey = monthForWeekFirstDay(week.firstDay, months)?.firstDay;
    if (monthKey !== oldestMonthKey) {
      break;
    }
    count += 1;
  }

  return count;
}

/** Real weeks are trailing (newest on the right); `null` pads older columns on the left. */
export function buildHeroContributionColumns(
  weeks: GithubContributionWeek[],
  targetWeekCount: number,
  months: GithubContributionMonth[] = []
): Array<GithubContributionWeek | null> {
  if (targetWeekCount < 1) {
    return [];
  }

  const tentativeTrailing = weeks.slice(-targetWeekCount);
  const dropOldestMonthWeeks = leadingWeekCountInOldestDisplayedMonth(tentativeTrailing, months);
  const trailingWeeks = tentativeTrailing.slice(dropOldestMonthWeeks);
  const paddingWeekCount = Math.max(0, targetWeekCount - trailingWeeks.length);
  const paddingColumns = Array.from({ length: paddingWeekCount }, () => null);

  return [...paddingColumns, ...trailingWeeks];
}
