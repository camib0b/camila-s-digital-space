import { PORTFOLIO_API_BASE } from "@/lib/portfolioApi";
import {
  isContributionLevel,
  type GithubContributionDay,
  type GithubContributionMonth,
  type GithubContributionWeek,
  type GithubContributionsPayload,
} from "@/types/githubContributions";

function resolveWorkerOrigin(portfolioBase: string): string {
  try {
    const url = new URL(portfolioBase);
    const trimmedPath = url.pathname.replace(/\/api\/portfolio\/?$/, "");
    return `${url.origin}${trimmedPath}`;
  } catch {
    return "https://portfolio-api.camilaescuderob.workers.dev";
  }
}

export const GITHUB_CONTRIBUTIONS_URL = `${resolveWorkerOrigin(PORTFOLIO_API_BASE)}/api/github/contributions`;

export async function fetchGithubContributions(): Promise<GithubContributionsPayload> {
  const response = await fetch(GITHUB_CONTRIBUTIONS_URL);
  if (!response.ok) {
    throw new Error("github.error");
  }

  const payload: unknown = await response.json();
  const parsed = parseGithubContributionsPayload(payload);
  if (!parsed) {
    throw new Error("github.error");
  }
  return parsed;
}

function parseGithubContributionsPayload(value: unknown): GithubContributionsPayload | null {
  const record = asRecord(value);
  if (!record || typeof record.totalContributions !== "number" || typeof record.generatedAt !== "string") {
    return null;
  }
  if (!Array.isArray(record.months) || !Array.isArray(record.weeks)) {
    return null;
  }

  return {
    totalContributions: record.totalContributions,
    generatedAt: record.generatedAt,
    months: record.months.map(parseMonth).filter(isPresent),
    weeks: record.weeks.map(parseWeek).filter(isPresent),
  };
}

function parseMonth(value: unknown): GithubContributionMonth | null {
  const month = asRecord(value);
  if (
    !month ||
    typeof month.name !== "string" ||
    typeof month.firstDay !== "string" ||
    typeof month.totalWeeks !== "number"
  ) {
    return null;
  }
  return {
    name: month.name,
    firstDay: month.firstDay,
    totalWeeks: month.totalWeeks,
  };
}

function parseWeek(value: unknown): GithubContributionWeek | null {
  const week = asRecord(value);
  if (!week || typeof week.firstDay !== "string" || !Array.isArray(week.contributionDays)) {
    return null;
  }
  return {
    firstDay: week.firstDay,
    contributionDays: week.contributionDays.map(parseDay).filter(isPresent),
  };
}

function parseDay(value: unknown): GithubContributionDay | null {
  const day = asRecord(value);
  if (
    !day ||
    typeof day.date !== "string" ||
    typeof day.weekday !== "number" ||
    typeof day.contributionCount !== "number"
  ) {
    return null;
  }

  const rawLevel = typeof day.contributionLevel === "string" ? day.contributionLevel : "NONE";

  return {
    date: day.date,
    weekday: day.weekday,
    contributionCount: day.contributionCount,
    contributionLevel: isContributionLevel(rawLevel) ? rawLevel : "NONE",
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function isPresent<T>(value: T | null): value is T {
  return value !== null;
}
