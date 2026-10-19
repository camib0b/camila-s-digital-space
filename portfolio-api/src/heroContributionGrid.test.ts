import { describe, expect, it } from "vitest";
import {
  buildHeroContributionColumns,
  heroContributionLayout,
} from "../../src/lib/heroContributionGrid";

describe("heroContributionLayout", () => {
  it("targets enough weeks to cover the title plus side slack at a fixed cell size", () => {
    const layout = heroContributionLayout(320, true);
    expect(layout.cellSizePx).toBe(6);
    expect(layout.targetWeekCount).toBe(49);
  });
});

describe("buildHeroContributionColumns", () => {
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
