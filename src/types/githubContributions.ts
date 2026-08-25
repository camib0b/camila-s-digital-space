export const CONTRIBUTION_LEVELS = [
  "NONE",
  "FIRST_QUARTILE",
  "SECOND_QUARTILE",
  "THIRD_QUARTILE",
  "FOURTH_QUARTILE",
] as const;

export type ContributionLevel = (typeof CONTRIBUTION_LEVELS)[number];

export interface GithubContributionDay {
  date: string;
  weekday: number;
  contributionCount: number;
  contributionLevel: ContributionLevel;
}

export interface GithubContributionWeek {
  firstDay: string;
  contributionDays: GithubContributionDay[];
}

export interface GithubContributionMonth {
  name: string;
  firstDay: string;
  totalWeeks: number;
}

export interface GithubContributionsPayload {
  totalContributions: number;
  generatedAt: string;
  months: GithubContributionMonth[];
  weeks: GithubContributionWeek[];
}

export function isContributionLevel(value: string): value is ContributionLevel {
  return (CONTRIBUTION_LEVELS as readonly string[]).includes(value);
}
