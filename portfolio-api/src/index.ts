import { AI_MODELS, buildAiPrompt, generateAiInsight, type Holding } from "./aiInsight";
import { CORS_ALLOWED_PATHS, CORS_HEADERS, GITHUB_CONTRIBUTIONS_PATH } from "./cors";
import { handleGithubContributionsRequest } from "./githubContributions";
import { computeHoldings, fetchTransactions, latestTradePriceByTicker } from "./holdings";
import { buildPortfolioHistory } from "./history";
import { buildAnalyticsReport } from "./analytics/load";
import { syncMarketData } from "./marketData";
import { fetchQuote, resolveHoldingQuote } from "./quotes";

async function getPortfolioSnapshot(env: Env) {
  const transactions = await fetchTransactions(env);
  const holdingsByTicker = computeHoldings(transactions);
  const lastTradePriceByTicker = latestTradePriceByTicker(transactions);

  const holdings: Holding[] = [];
  for (const [ticker, position] of holdingsByTicker.entries()) {
    const quote = await fetchQuote(ticker, env.FINNHUB_API_KEY);
    const resolvedQuote = resolveHoldingQuote(quote, lastTradePriceByTicker.get(ticker));
    const currentValue = position.shares * resolvedQuote.currentPrice;
    holdings.push({
      ticker,
      shares: position.shares,
      totalCost: position.totalCost,
      currentPrice: resolvedQuote.currentPrice,
      changePercent: resolvedQuote.changePercent,
      currentValue,
      stale: resolvedQuote.stale,
    });
    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  holdings.sort((left, right) => right.currentValue - left.currentValue);

  let totalValue = 0;
  let totalInvested = 0;
  for (const holding of holdings) {
    totalValue += holding.currentValue;
    totalInvested += holding.totalCost;
  }

  const totalGain = totalValue - totalInvested;
  const totalReturnPct = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

  return {
    totalValue,
    totalInvested,
    totalGain,
    totalReturnPct,
    holdings,
    holdingsCount: holdings.length,
    transactions,
  };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      if (CORS_ALLOWED_PATHS.includes(url.pathname)) {
        return new Response(null, { headers: CORS_HEADERS });
      }
      return new Response("Not found", { status: 404 });
    }

    try {
      if (url.pathname === GITHUB_CONTRIBUTIONS_PATH && request.method === "GET") {
        return handleGithubContributionsRequest(request, env, ctx);
      }

      if (url.pathname === "/api/portfolio" && request.method === "GET") {
        const snapshot = await getPortfolioSnapshot(env);

        return Response.json(
          {
            totalValue: snapshot.totalValue.toFixed(2),
            totalInvested: snapshot.totalInvested.toFixed(2),
            totalGain: snapshot.totalGain.toFixed(2),
            totalReturnPct: snapshot.totalReturnPct.toFixed(2),
            stocks: snapshot.holdings,
            aiInsight: null,
            lastUpdated: new Date().toISOString(),
            count: snapshot.holdingsCount,
            aiModels: [{ id: "grok", label: "Grok (xAI)" }],
          },
          { headers: CORS_HEADERS }
        );
      }

      if (url.pathname === "/api/analytics" && request.method === "GET") {
        try {
          const report = await buildAnalyticsReport(env);
          return Response.json(report, { headers: CORS_HEADERS });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          const tablesMissing = /no such table/i.test(message);
          return Response.json(
            {
              error: tablesMissing
                ? "Market-data tables are not initialized. Apply the D1 migration, then let the daily sync run."
                : message,
            },
            { status: tablesMissing ? 503 : 500, headers: CORS_HEADERS },
          );
        }
      }

      if (url.pathname === "/api/portfolio/history" && request.method === "GET") {
        const transactions = await fetchTransactions(env);
        const history = await buildPortfolioHistory(env, transactions);

        return Response.json(
          {
            ...history,
            lastUpdated: new Date().toISOString(),
          },
          { headers: CORS_HEADERS }
        );
      }

      if (url.pathname === "/api/portfolio/ai-insight" && request.method === "POST") {
        let body: { model?: string; language?: string } = {};
        try {
          body = (await request.json()) as { model?: string; language?: string };
        } catch {
          return Response.json(
            { error: "Invalid JSON body" },
            { status: 400, headers: CORS_HEADERS }
          );
        }

        const modelKey =
          typeof body.model === "string" ? body.model.trim().toLowerCase() : "";
        if (!(modelKey in AI_MODELS)) {
          return Response.json(
            { error: "Invalid model", allowed: Object.keys(AI_MODELS) },
            { status: 400, headers: CORS_HEADERS }
          );
        }

        const language = body.language === "es" ? "es" : "en";
        const snapshot = await getPortfolioSnapshot(env);
        const aiPrompt = buildAiPrompt(snapshot.holdings, snapshot.totalValue, language);
        const result = await generateAiInsight(env, modelKey, aiPrompt);

        if (result.ok === false) {
          return Response.json(
            { error: result.error },
            { status: result.status, headers: CORS_HEADERS }
          );
        }

        if (result.usage.total_tokens > 0) {
          await env.DB.prepare(`
          INSERT INTO ai_usage (provider, model, prompt_tokens, completion_tokens, total_tokens, estimated_cost_usd)
          VALUES (?, ?, ?, ?, ?, ?)
        `)
            .bind(
              result.provider,
              result.modelId,
              result.usage.prompt_tokens,
              result.usage.completion_tokens,
              result.usage.total_tokens,
              0
            )
            .run();
        }

        return Response.json(
          {
            aiInsight: result.aiInsight,
            provider: result.provider,
            model: result.modelId,
            aiUsage: result.usage,
            lastUpdated: new Date().toISOString(),
          },
          { headers: CORS_HEADERS }
        );
      }

      return new Response("Not found", { status: 404 });
    } catch (error) {
      console.error("Worker Error:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      return Response.json({ error: message }, { status: 500, headers: CORS_HEADERS });
    }
  },

  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(syncMarketData(env));
  },
};
