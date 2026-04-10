const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const AI_MODELS = {
  grok: { provider: "Grok", apiModel: "grok-4.20-reasoning" },
  openai: { provider: "OpenAI", apiModel: "gpt-4o-mini" },
};

async function getPortfolioSnapshot(env) {
  const { results: holdings } = await env.DB.prepare(`
        SELECT ticker, SUM(shares) as total_shares, SUM(total_cost) as total_cost
        FROM purchases GROUP BY ticker
      `).all();

  const pricePromises = holdings.map(async (h) => {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${h.ticker}&token=${env.FINNHUB_API_KEY}`);
    const data = await res.json();
    return {
      ticker: h.ticker,
      shares: parseFloat(h.total_shares),
      totalCost: parseFloat(h.total_cost),
      currentPrice: data.c || 0,
      changePercent: data.dp || 0,
    };
  });

  const stocks = await Promise.all(pricePromises);

  let totalValue = 0;
  let totalInvested = 0;
  stocks.forEach((s) => {
    s.currentValue = s.shares * s.currentPrice;
    totalValue += s.currentValue;
    totalInvested += s.totalCost;
  });

  const totalGain = totalValue - totalInvested;
  const totalReturnPct = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

  const aiPrompt = `
        Eres un asesor financiero frío, pragmático, audaz, y con humor.
        Describe lo que piensas sobre un portafolio de $${totalValue.toFixed(2)},
        con los siguientes Holdings: ${stocks.map((s) => `${s.ticker} ×${s.shares.toFixed(4)} ($${s.currentValue.toFixed(2)})`).join(" | ")}
      `;

  return {
    totalValue,
    totalInvested,
    totalGain,
    totalReturnPct,
    stocks,
    aiPrompt,
    count: stocks.length,
  };
}

async function runAiInsight(env, modelKey, aiPrompt) {
  const config = AI_MODELS[modelKey];
  if (!config) {
    return { ok: false, status: 400, error: "Unknown model" };
  }

  let aiInsight = "";
  let usage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

  if (modelKey === "grok") {
    if (!env.XAI_API_KEY) {
      return { ok: false, status: 503, error: "Grok API key not configured" };
    }
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.XAI_API_KEY}` },
      body: JSON.stringify({
        model: config.apiModel,
        messages: [{ role: "user", content: aiPrompt }],
        max_tokens: 250,
        temperature: 0.6,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      return { ok: false, status: res.status, error: `Grok error: ${res.status} ${errText.slice(0, 200)}` };
    }
    const data = await res.json();
    aiInsight = data.choices?.[0]?.message?.content || "Insight generado por Grok";
    usage = data.usage || usage;
    return {
      ok: true,
      aiInsight: `${aiInsight} [${config.provider}]`,
      provider: config.provider,
      modelId: config.apiModel,
      usage,
    };
  }

  if (modelKey === "openai") {
    if (!env.OPENAI_API_KEY) {
      return { ok: false, status: 503, error: "OpenAI API key not configured" };
    }
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: config.apiModel,
        messages: [{ role: "user", content: aiPrompt }],
        max_tokens: 250,
        temperature: 0.6,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      return { ok: false, status: res.status, error: `OpenAI error: ${res.status} ${errText.slice(0, 200)}` };
    }
    const data = await res.json();
    aiInsight = data.choices?.[0]?.message?.content || "Insight generado por OpenAI";
    usage = data.usage || usage;
    return {
      ok: true,
      aiInsight: `${aiInsight} (${config.apiModel}) [${config.provider}]`,
      provider: config.provider,
      modelId: config.apiModel,
      usage,
    };
  }

  return { ok: false, status: 400, error: "Unknown model" };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      if (url.pathname === "/api/portfolio" || url.pathname === "/api/portfolio/ai-insight") {
        return new Response(null, { headers: CORS_HEADERS });
      }
      return new Response("Not found", { status: 404 });
    }

    try {
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
            aiModels: Object.keys(AI_MODELS).map((key) => ({
              id: key,
              label: key === "grok" ? "Grok (xAI)" : "GPT-4o mini (OpenAI)",
            })),
          },
          { headers: CORS_HEADERS }
        );
      }

      if (url.pathname === "/api/portfolio/ai-insight" && request.method === "POST") {
        let body = {};
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400, headers: CORS_HEADERS });
        }

        const modelKey = typeof body.model === "string" ? body.model.trim().toLowerCase() : "";
        if (!AI_MODELS[modelKey]) {
          return Response.json(
            { error: "Invalid model", allowed: Object.keys(AI_MODELS) },
            { status: 400, headers: CORS_HEADERS }
          );
        }

        const snapshot = await getPortfolioSnapshot(env);
        const result = await runAiInsight(env, modelKey, snapshot.aiPrompt);

        if (!result.ok) {
          return Response.json({ error: result.error }, { status: result.status, headers: CORS_HEADERS });
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
    } catch (err) {
      console.error("Worker Error:", err);
      return Response.json({ error: err.message }, { status: 500, headers: CORS_HEADERS });
    }
  },
};
