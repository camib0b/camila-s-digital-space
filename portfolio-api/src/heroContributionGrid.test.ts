import { describe, expect, it } from "vitest";
import {
  buildHeroContributionColumns,
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

    expect(columns).toHaveLength(5);
    expect(columns.slice(0, 3)).toEqual([null, null, null]);
    expect(columns[3]?.firstDay).toBe("2025-11-02");
    expect(columns[4]?.firstDay).toBe("2025-11-09");
  });

  it("pads older columns on the left when history is shorter than the target span", () => {
    const weeks = [
      { firstDay: "2025-12-07", contributionDays: [] },
      { firstDay: "2025-12-14", contributionDays: [] },
    ];
    const columns = buildHeroContributionColumns(weeks, 5);

    expect(columns).toHaveLength(5);
    expect(columns.slice(0, 3)).toEqual([null, null, null]);
    expect(columns[3]?.firstDay).toBe("2025-12-07");
    expect(columns[4]?.firstDay).toBe("2025-12-14");
  });
});
