import { AI_MODELS, buildAiPrompt, runAiInsight, type StockSnapshot } from "./aiInsight";
import { CORS_HEADERS, GITHUB_CONTRIBUTIONS_PATH, PORTFOLIO_PATHS } from "./cors";
import { handleGithubContributionsRequest } from "./githubContributions";
import { computeHoldings, getTransactions } from "./holdings";
import { buildPortfolioHistory } from "./history";
import { fetchQuote } from "./quotes";

async function getPortfolioSnapshot(env: Env) {
  const transactions = await getTransactions(env);
  const holdings = computeHoldings(transactions);

  const stocks: StockSnapshot[] = [];
  for (const [ticker, holding] of holdings.entries()) {
    const quote = await fetchQuote(ticker, env.FINNHUB_API_KEY);
    const currentValue = holding.shares * quote.currentPrice;
    stocks.push({
      ticker,
      shares: holding.shares,
      totalCost: holding.totalCost,
      currentPrice: quote.currentPrice,
      changePercent: quote.changePercent,
      currentValue,
    });
    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  stocks.sort((left, right) => right.currentValue - left.currentValue);

  let totalValue = 0;
  let totalInvested = 0;
  for (const stock of stocks) {
    totalValue += stock.currentValue;
    totalInvested += stock.totalCost;
  }

  const totalGain = totalValue - totalInvested;
  const totalReturnPct = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

  return {
    totalValue,
    totalInvested,
    totalGain,
    totalReturnPct,
    stocks,
    count: stocks.length,
    transactions,
  };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      if (PORTFOLIO_PATHS.includes(url.pathname)) {
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
            stocks: snapshot.stocks,
            aiInsight: null,
            lastUpdated: new Date().toISOString(),
            count: snapshot.count,
            aiModels: [{ id: "grok", label: "Grok (xAI)" }],
          },
          { headers: CORS_HEADERS }
        );
      }

      if (url.pathname === "/api/portfolio/history" && request.method === "GET") {
        const transactions = await getTransactions(env);
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
        const aiPrompt = buildAiPrompt(snapshot.stocks, snapshot.totalValue, language);
        const result = await runAiInsight(env, modelKey, aiPrompt);

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
};
