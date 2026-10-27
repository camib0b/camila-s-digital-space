import { describe, expect, it } from "vitest";
import {
  buildHeroContributionColumns,
  heroContributionGridWidthPx,
  heroContributionLayout,
  leadingWeekCountInOldestDisplayedMonth,
} from "../../src/lib/heroContributionGrid";

describe("heroContributionLayout", () => {
  it("targets enough weeks to cover the title plus side slack at a fixed cell size", () => {
    const layout = heroContributionLayout(320, true);
    expect(layout.cellSizePx).toBe(6);
    expect(layout.targetWeekCount).toBe(49);
  });
});

describe("leadingWeekCountInOldestDisplayedMonth", () => {
  it("counts weeks in the leftmost month of the trailing window", () => {
    const weeks = [
      { firstDay: "2025-10-05", contributionDays: [] },
      { firstDay: "2025-10-12", contributionDays: [] },
      { firstDay: "2025-10-19", contributionDays: [] },
      { firstDay: "2025-11-02", contributionDays: [] },
    ];
    const months = [
      { name: "Oct", firstDay: "2025-10-01", totalWeeks: 3 },
      { name: "Nov", firstDay: "2025-11-01", totalWeeks: 1 },
    ];

    expect(leadingWeekCountInOldestDisplayedMonth(weeks, months)).toBe(3);
  });
});

describe("buildHeroContributionColumns", () => {
  it("drops the oldest displayed month while keeping the grid ending on the newest weeks", () => {
    const weeks = [
      { firstDay: "2025-10-05", contributionDays: [] },
      { firstDay: "2025-10-12", contributionDays: [] },
      { firstDay: "2025-10-19", contributionDays: [] },
      { firstDay: "2025-11-02", contributionDays: [] },
      { firstDay: "2025-11-09", contributionDays: [] },
    ];
    const months = [
      { name: "Oct", firstDay: "2025-10-01", totalWeeks: 3 },
      { name: "Nov", firstDay: "2025-11-01", totalWeeks: 2 },
    ];

    const columns = buildHeroContributionColumns(weeks, 5, months);

    expect(columns).toHaveLength(2);
    expect(columns[0]?.firstDay).toBe("2025-11-02");
    expect(columns[1]?.firstDay).toBe("2025-11-09");
  });

  it("renders only available weeks when history is shorter than the target span", () => {
    const weeks = [
      { firstDay: "2025-12-07", contributionDays: [] },
      { firstDay: "2025-12-14", contributionDays: [] },
    ];
    const columns = buildHeroContributionColumns(weeks, 5);

    expect(columns).toHaveLength(2);
    expect(columns[0]?.firstDay).toBe("2025-12-07");
    expect(columns[1]?.firstDay).toBe("2025-12-14");
  });

  it("narrows the grid enough for the newest week to sit inside a title-sized frame", () => {
    const frameWidthPx = 320;
    const layout = heroContributionLayout(frameWidthPx, true);
    const cellSizePx = layout.cellSizePx;
    const gapPx = layout.gapPx;
    const columnsBefore = layout.targetWeekCount;
    const widthBeforePx = heroContributionGridWidthPx(columnsBefore, cellSizePx, gapPx);

    const dropWeeks = 5;
    const columnsAfter = columnsBefore - dropWeeks;
    const widthAfterPx = heroContributionGridWidthPx(columnsAfter, cellSizePx, gapPx);

    expect(widthBeforePx).toBeGreaterThan(frameWidthPx);
    expect(widthAfterPx).toBeLessThanOrEqual(frameWidthPx);
    expect(columnsBefore).toBe(49);
    expect(widthBeforePx).toBe(351.6);
    expect(widthAfterPx).toBe(315.6);
  });
});
