export const HERO_CONTRIBUTION_GAP_TO_CELL_RATIO = 1 / 5;
const HERO_CELL_SIZE_PX = { base: 4, md: 6 } as const;
const HERO_SIDE_SLACK_RATIO = 0.04;
const HERO_SIDE_SLACK_MIN_CELLS = 1.5;

export function heroContributionCellSizePx(viewportIsMd: boolean): number {
  return viewportIsMd ? HERO_CELL_SIZE_PX.md : HERO_CELL_SIZE_PX.base;
}

export function heroContributionWeekCount(
  titleWidthPx: number,
  availableWeekCount: number,
  viewportIsMd: boolean
): { cellSizePx: number; gapPx: number; visibleWeekCount: number } {
  if (titleWidthPx <= 0 || availableWeekCount < 1) {
    return { cellSizePx: HERO_CELL_SIZE_PX.base, gapPx: 0.8, visibleWeekCount: 0 };
  }

  const cellSizePx = heroContributionCellSizePx(viewportIsMd);
  const gapPx = cellSizePx * HERO_CONTRIBUTION_GAP_TO_CELL_RATIO;
  const slackPerSidePx = Math.max(cellSizePx * HERO_SIDE_SLACK_MIN_CELLS, titleWidthPx * HERO_SIDE_SLACK_RATIO);
  const targetWidthPx = titleWidthPx + slackPerSidePx * 2;
  const visibleWeekCount = Math.min(
    availableWeekCount,
    Math.max(1, Math.ceil((targetWidthPx + gapPx) / (cellSizePx + gapPx)))
  );

  return { cellSizePx, gapPx, visibleWeekCount };
}
