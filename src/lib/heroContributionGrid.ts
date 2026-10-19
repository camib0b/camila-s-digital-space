import type { GithubContributionWeek } from "@/types/githubContributions";

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

/** Real weeks are trailing (newest on the right); `null` pads older columns on the left. */
export function buildHeroContributionColumns(
  weeks: GithubContributionWeek[],
  targetWeekCount: number
): Array<GithubContributionWeek | null> {
  if (targetWeekCount < 1) {
    return [];
  }

  const trailingWeeks = weeks.slice(-targetWeekCount);
  const paddingWeekCount = Math.max(0, targetWeekCount - trailingWeeks.length);
  const paddingColumns = Array.from({ length: paddingWeekCount }, () => null);

  return [...paddingColumns, ...trailingWeeks];
}
