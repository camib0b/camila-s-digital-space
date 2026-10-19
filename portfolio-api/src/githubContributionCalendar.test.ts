import { describe, expect, it } from "vitest";
import {
  clipCalendarFromDate,
  earliestHistoryStartDate,
  mergeContributionCalendars,
  yearlyContributionRanges,
} from "./githubContributionCalendar";

describe("yearlyContributionRanges", () => {
  it("splits a multi-year window into consecutive one-year ranges", () => {
    const ranges = yearlyContributionRanges("2023-01-15", "2025-06-10");
    expect(ranges).toEqual([
      { from: "2023-01-15", to: "2024-01-14" },
      { from: "2024-01-15", to: "2025-01-14" },
      { from: "2025-01-15", to: "2025-06-10" },
    ]);
  });
});

describe("mergeContributionCalendars", () => {
  it("orders weeks and de-duplicates boundary weeks by firstDay", () => {
    const merged = mergeContributionCalendars([
      {
        totalContributions: 1,
        months: [{ name: "Jan", firstDay: "2024-01-01", totalWeeks: 1 }],
        weeks: [
          {
            firstDay: "2024-01-07",
            contributionDays: [
              {
                date: "2024-01-07",
                weekday: 0,
                contributionCount: 1,
                contributionLevel: "FIRST_QUARTILE",
              },
            ],
          },
        ],
      },
      {
        totalContributions: 2,
        months: [{ name: "Jan", firstDay: "2024-01-01", totalWeeks: 1 }],
        weeks: [
          {
            firstDay: "2024-01-07",
            contributionDays: [
              {
                date: "2024-01-07",
                weekday: 0,
                contributionCount: 2,
                contributionLevel: "SECOND_QUARTILE",
              },
            ],
          },
          {
            firstDay: "2024-01-14",
            contributionDays: [
              {
                date: "2024-01-14",
                weekday: 0,
                contributionCount: 1,
                contributionLevel: "FIRST_QUARTILE",
              },
            ],
          },
        ],
      },
    ]);

    expect(merged.weeks.map((week) => week.firstDay)).toEqual(["2024-01-07", "2024-01-14"]);
    expect(merged.weeks[0].contributionDays[0].contributionCount).toBe(2);
    expect(merged.totalContributions).toBe(3);
  });
});

describe("earliestHistoryStartDate", () => {
  it("uses account creation when it is more recent than the history floor", () => {
    const start = earliestHistoryStartDate("2025-06-01T00:00:00Z", new Date("2026-10-19T12:00:00Z"));
    expect(start).toBe("2025-06-01");
  });

  it("uses the three-year floor when the account is older", () => {
    const start = earliestHistoryStartDate("2018-01-01T00:00:00Z", new Date("2026-10-19T12:00:00Z"));
    expect(start).toBe("2023-10-19");
  });
});

describe("clipCalendarFromDate", () => {
  it("drops days before the start date inside each week", () => {
    const clipped = clipCalendarFromDate(
      {
        totalContributions: 2,
        months: [],
        weeks: [
          {
            firstDay: "2025-11-30",
            contributionDays: [
              {
                date: "2025-11-30",
                weekday: 0,
                contributionCount: 1,
                contributionLevel: "FIRST_QUARTILE",
              },
              {
                date: "2025-12-01",
                weekday: 1,
                contributionCount: 1,
                contributionLevel: "FIRST_QUARTILE",
              },
            ],
          },
        ],
      },
      "2025-12-01"
    );

    expect(clipped.weeks).toHaveLength(1);
    expect(clipped.weeks[0].contributionDays.map((day) => day.date)).toEqual(["2025-12-01"]);
    expect(clipped.totalContributions).toBe(1);
  });
});
