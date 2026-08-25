import { CORS_HEADERS, GITHUB_CONTRIBUTIONS_PATH } from "./cors";

export const GITHUB_CONTRIBUTIONS_CACHE_MAX_AGE_SECONDS = 6 * 60 * 60;

const DEFAULT_GITHUB_USERNAME = "camib0b";
const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const GITHUB_USER_AGENT = "camila-s-digital-space (https://camilaescudero.cl)";

const CONTRIBUTION_LEVELS = [
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

const CONTRIBUTION_CALENDAR_QUERY = `
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        colors
        months { name firstDay totalWeeks }
        weeks {
          firstDay
          contributionDays {
            date
            weekday
            contributionCount
            contributionLevel
            color
          }
        }
      }
    }
  }
}
`;

class GithubContributionsError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "GithubContributionsError";
    this.status = status;
  }
}

export async function handleGithubContributionsRequest(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const cache = caches.default;
  const cacheKey = githubContributionsCacheKey(request);

  const cached = await cache.match(cacheKey);
  if (cached) {
    return withCors(cached);
  }

  try {
    const payload = await fetchContributionCalendar(env);
    const response = Response.json(payload, {
      headers: {
        ...CORS_HEADERS,
        "Cache-Control": `public, max-age=${GITHUB_CONTRIBUTIONS_CACHE_MAX_AGE_SECONDS}`,
      },
    });
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (error) {
    if (error instanceof GithubContributionsError) {
      return jsonError(error.message, error.status);
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return jsonError(message, 500);
  }
}

function githubContributionsCacheKey(request: Request): Request {
  const url = new URL(GITHUB_CONTRIBUTIONS_PATH, request.url);
  url.search = "";
  return new Request(url.toString(), { method: "GET" });
}

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [headerName, headerValue] of Object.entries(CORS_HEADERS)) {
    headers.set(headerName, headerValue);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function jsonError(message: string, status: number): Response {
  return Response.json(
    { error: message },
    {
      status,
      headers: {
        ...CORS_HEADERS,
        "Cache-Control": "no-store",
      },
    }
  );
}

async function fetchContributionCalendar(env: Env): Promise<GithubContributionsPayload> {
  const token = env.GITHUB_TOKEN?.trim();
  if (!token) {
    throw new GithubContributionsError("GitHub token is not configured", 503);
  }

  const login = env.GITHUB_USERNAME?.trim() || DEFAULT_GITHUB_USERNAME;

  const githubResponse = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": GITHUB_USER_AGENT,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      query: CONTRIBUTION_CALENDAR_QUERY,
      variables: { login },
    }),
  });

  const githubBody: unknown = await parseJsonBody(githubResponse);

  if (!githubResponse.ok) {
    throw new GithubContributionsError(githubAuthorizationErrorMessage(githubResponse.status), 502);
  }

  const graph = asRecord(githubBody);
  if (!graph) {
    throw new GithubContributionsError("GitHub returned an unexpected response", 502);
  }

  const graphqlErrors = graph.errors;
  if (Array.isArray(graphqlErrors) && graphqlErrors.length > 0) {
    throw new GithubContributionsError(firstGraphqlErrorMessage(graphqlErrors), 502);
  }

  const calendar = readContributionCalendar(graph.data);
  if (!calendar) {
    throw new GithubContributionsError("GitHub user not found", 404);
  }

  return {
    totalContributions: calendar.totalContributions,
    generatedAt: new Date().toISOString(),
    months: calendar.months,
    weeks: calendar.weeks,
  };
}

async function parseJsonBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function githubAuthorizationErrorMessage(status: number): string {
  if (status === 401 || status === 403) {
    return "GitHub authorization failed";
  }
  return "GitHub request failed";
}

function firstGraphqlErrorMessage(errors: unknown[]): string {
  for (const entry of errors) {
    const record = asRecord(entry);
    if (record && typeof record.message === "string" && record.message.trim()) {
      return record.message;
    }
  }
  return "GitHub request failed";
}

function readContributionCalendar(data: unknown): Omit<GithubContributionsPayload, "generatedAt"> | null {
  const dataRecord = asRecord(data);
  const user = asRecord(dataRecord?.user);
  if (dataRecord && dataRecord.user === null) {
    return null;
  }

  const collection = asRecord(user?.contributionsCollection);
  const calendar = asRecord(collection?.contributionCalendar);
  if (!calendar) {
    throw new GithubContributionsError("GitHub returned an unexpected response", 502);
  }

  if (typeof calendar.totalContributions !== "number") {
    throw new GithubContributionsError("GitHub returned an unexpected response", 502);
  }

  return {
    totalContributions: calendar.totalContributions,
    months: readMonths(calendar.months),
    weeks: readWeeks(calendar.weeks),
  };
}

function readMonths(value: unknown): GithubContributionMonth[] {
  if (!Array.isArray(value)) {
    throw new GithubContributionsError("GitHub returned an unexpected response", 502);
  }

  return value.map((entry) => {
    const month = asRecord(entry);
    if (
      !month ||
      typeof month.name !== "string" ||
      typeof month.firstDay !== "string" ||
      typeof month.totalWeeks !== "number"
    ) {
      throw new GithubContributionsError("GitHub returned an unexpected response", 502);
    }

    return {
      name: month.name,
      firstDay: month.firstDay,
      totalWeeks: month.totalWeeks,
    };
  });
}

function readWeeks(value: unknown): GithubContributionWeek[] {
  if (!Array.isArray(value)) {
    throw new GithubContributionsError("GitHub returned an unexpected response", 502);
  }

  return value.map((entry) => {
    const week = asRecord(entry);
    if (!week || typeof week.firstDay !== "string" || !Array.isArray(week.contributionDays)) {
      throw new GithubContributionsError("GitHub returned an unexpected response", 502);
    }

    return {
      firstDay: week.firstDay,
      contributionDays: week.contributionDays.map(readDay),
    };
  });
}

function readDay(value: unknown): GithubContributionDay {
  const day = asRecord(value);
  if (
    !day ||
    typeof day.date !== "string" ||
    typeof day.weekday !== "number" ||
    typeof day.contributionCount !== "number"
  ) {
    throw new GithubContributionsError("GitHub returned an unexpected response", 502);
  }

  return {
    date: day.date,
    weekday: day.weekday,
    contributionCount: day.contributionCount,
    contributionLevel: readContributionLevel(day.contributionLevel),
  };
}

function readContributionLevel(value: unknown): ContributionLevel {
  if (typeof value === "string" && isContributionLevel(value)) {
    return value;
  }
  return "NONE";
}

function isContributionLevel(value: string): value is ContributionLevel {
  return (CONTRIBUTION_LEVELS as readonly string[]).includes(value);
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return undefined;
}
