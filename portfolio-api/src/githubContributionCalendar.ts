import type { GithubContributionMonth, GithubContributionWeek } from "./githubContributions";

export const CONTRIBUTION_HISTORY_YEARS = 3;

/** Inclusive UTC date string (YYYY-MM-DD). */
export function formatUtcDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function subtractUtcYears(date: Date, years: number): Date {
  const copy = new Date(date.getTime());
  copy.setUTCFullYear(copy.getUTCFullYear() - years);
  return copy;
}

export function parseUtcDate(dateString: string): Date {
  return new Date(`${dateString}T00:00:00.000Z`);
}

export function earliestHistoryStartDate(accountCreatedAt: string | null, now = new Date()): string {
  const historyFloor = subtractUtcYears(now, CONTRIBUTION_HISTORY_YEARS);
  if (!accountCreatedAt) {
    return formatUtcDate(historyFloor);
  }

  const accountCreated = new Date(accountCreatedAt);
  if (Number.isNaN(accountCreated.getTime())) {
    return formatUtcDate(historyFloor);
  }

  const earliest = accountCreated.getTime() > historyFloor.getTime() ? accountCreated : historyFloor;
  return formatUtcDate(earliest);
}

export interface ContributionDateRange {
  from: string;
  to: string;
}

/**
 * GitHub's contributionsCollection is limited to one year per query. Build consecutive
 * non-overlapping ranges from `fromDate` through `toDate` (inclusive calendar days).
 */
export function yearlyContributionRanges(fromDate: string, toDate: string): ContributionDateRange[] {
  const start = parseUtcDate(fromDate);
  const end = parseUtcDate(toDate);
  if (start.getTime() > end.getTime()) {
    return [];
  }

  const ranges: ContributionDateRange[] = [];
  let rangeStart = start;

  while (rangeStart.getTime() <= end.getTime()) {
    const rangeEnd = new Date(rangeStart.getTime());
    rangeEnd.setUTCFullYear(rangeEnd.getUTCFullYear() + 1);
    rangeEnd.setUTCDate(rangeEnd.getUTCDate() - 1);

    const cappedEnd = rangeEnd.getTime() > end.getTime() ? end : rangeEnd;
    ranges.push({
      from: formatUtcDate(rangeStart),
      to: formatUtcDate(cappedEnd),
    });

    const nextStart = new Date(cappedEnd.getTime());
    nextStart.setUTCDate(nextStart.getUTCDate() + 1);
    rangeStart = nextStart;
  }

  return ranges;
}

export interface ContributionCalendarSlice {
  totalContributions: number;
  months: GithubContributionMonth[];
  weeks: GithubContributionWeek[];
}

export function mergeContributionCalendars(slices: ContributionCalendarSlice[]): ContributionCalendarSlice {
  const weekByFirstDay = new Map<string, GithubContributionWeek>();
  const monthByFirstDay = new Map<string, GithubContributionMonth>();

  for (const slice of slices) {
    for (const week of slice.weeks) {
      weekByFirstDay.set(week.firstDay, week);
    }
    for (const month of slice.months) {
      monthByFirstDay.set(month.firstDay, month);
    }
  }

  const weeks = [...weekByFirstDay.values()].sort((left, right) =>
    left.firstDay.localeCompare(right.firstDay)
  );
  const months = [...monthByFirstDay.values()].sort((left, right) =>
    left.firstDay.localeCompare(right.firstDay)
  );

  const totalContributions = weeks.reduce(
    (sum, week) =>
      sum +
      week.contributionDays.reduce((weekSum, day) => weekSum + day.contributionCount, 0),
    0
  );

  return {
    totalContributions,
    months,
    weeks,
  };
}

export function clipCalendarFromDate(
  calendar: ContributionCalendarSlice,
  startDate: string
): ContributionCalendarSlice {
  const weeks: GithubContributionWeek[] = [];

  for (const week of calendar.weeks) {
    const contributionDays = week.contributionDays.filter((day) => day.date >= startDate);
    if (contributionDays.length === 0) {
      continue;
    }
    weeks.push({
      firstDay: contributionDays[0].date,
      contributionDays,
    });
  }

  const months = calendar.months.filter((month) => month.firstDay >= startDate);

  const totalContributions = weeks.reduce(
    (sum, week) =>
      sum +
      week.contributionDays.reduce((weekSum, day) => weekSum + day.contributionCount, 0),
    0
  );

  return {
    totalContributions,
    months,
    weeks,
  };
}
