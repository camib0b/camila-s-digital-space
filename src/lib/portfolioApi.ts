import type {
  AiInsightResponse,
  PortfolioHistoryResponse,
  PortfolioResponse,
} from "@/types/portfolio";

const DEFAULT_PORTFOLIO_API_BASE =
  "https://portfolio-api.camilaescuderob.workers.dev/api/portfolio";

export const PORTFOLIO_API_BASE =
  import.meta.env.VITE_PORTFOLIO_API_URL ?? DEFAULT_PORTFOLIO_API_BASE;

export const PORTFOLIO_HISTORY_URL = `${PORTFOLIO_API_BASE}/history`;
export const PORTFOLIO_AI_INSIGHT_URL = `${PORTFOLIO_API_BASE}/ai-insight`;

export const PORTFOLIO_REFRESH_INTERVAL_MS = 60_000;

export const DEFAULT_AI_MODEL_ID = "grok";

async function parseJsonOrEmpty(response: Response): Promise<Record<string, unknown>> {
  try {
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function fetchPortfolio(): Promise<PortfolioResponse> {
  const response = await fetch(PORTFOLIO_API_BASE);
  if (!response.ok) {
    throw new Error("portfolio.error.load");
  }
  return (await response.json()) as PortfolioResponse;
}

export async function fetchPortfolioHistory(): Promise<PortfolioHistoryResponse> {
  const response = await fetch(PORTFOLIO_HISTORY_URL);
  if (!response.ok) {
    throw new Error("portfolio.error.history");
  }
  return (await response.json()) as PortfolioHistoryResponse;
}

export async function fetchAiInsight(params: {
  model: string;
  language: string;
}): Promise<AiInsightResponse> {
  const response = await fetch(PORTFOLIO_AI_INSIGHT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: params.model, language: params.language }),
  });
  const payload = (await parseJsonOrEmpty(response)) as AiInsightResponse;
  if (!response.ok) {
    throw new Error(
      typeof payload.error === "string" ? payload.error : "portfolio.error.aiInsight"
    );
  }
  return payload;
}
