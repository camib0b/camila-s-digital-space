const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const PORTFOLIO_PATHS = ["/api/portfolio", "/api/portfolio/ai-insight", "/api/portfolio/history"];

const AI_MODELS = {
  grok: { provider: "Grok", apiModel: "grok-4.20-reasoning" },
  openai: { provider: "OpenAI", apiModel: "gpt-4o-mini" },
};

async function getTransactions(env) {
  const { results } = await env.DB.prepare(`
    SELECT transaction_id, ticker, trade_date, price, quantity, transaction_type
    FROM transactions
    ORDER BY trade_date ASC, transaction_id ASC
  `).all();
  return results;
}

function computeHoldings(transactions, asOfDate = null) {
  const holdings = new Map();

  for (const transaction of transactions) {
    if (asOfDate && transaction.trade_date > asOfDate) {
      break;
    }

    const quantity = parseFloat(transaction.quantity);
    const price = parseFloat(transaction.price);
    const entry = holdings.get(transaction.ticker) || { shares: 0, totalCost: 0 };

    if (transaction.transaction_type === "BUY") {
      entry.shares += quantity;
      entry.totalCost += price * quantity;
    } else {
      if (entry.shares > 0) {
        const averageCost = entry.totalCost / entry.shares;
        entry.shares -= quantity;
        entry.totalCost -= averageCost * quantity;
      }
    }

    if (entry.shares > 1e-8) {
      holdings.set(transaction.ticker, entry);
    } else {
      holdings.delete(transaction.ticker);
    }
  }

  return holdings;
}

const quoteCache = new Map();

async function fetchQuote(ticker, apiKey) {
  const cached = quoteCache.get(ticker);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(ticker)}&token=${apiKey}`);
  if (!response.ok) {
    console.warn(`Finnhub quote unavailable for ${ticker}:`, response.status);
    return cached?.data ?? { currentPrice: 0, changePercent: 0 };
  }

  let data;
  try {
    data = await response.json();
  } catch {
    console.warn(`Finnhub quote returned non-JSON for ${ticker}`);
    return cached?.data ?? { currentPrice: 0, changePercent: 0 };
  }

  const quote = {
    currentPrice: data.c || 0,
    changePercent: data.dp || 0,
  };
  quoteCache.set(ticker, { data: quote, expiresAt: Date.now() + 60_000 });
  return quote;
}

async function fetchDailyCloses(ticker, fromUnix, toUnix, apiKey) {
  const response = await fetch(
    `https://finnhub.io/api/v1/stock/candle?symbol=${encodeURIComponent(ticker)}&resolution=D&from=${fromUnix}&to=${toUnix}&token=${apiKey}`
  );
  const data = await response.json();
  if (data.s !== "ok" || !Array.isArray(data.t) || !Array.isArray(data.c)) {
    console.warn(`Finnhub candle unavailable for ${ticker}:`, data.s ?? response.status);
    return new Map();
  }

  const closesByDate = new Map();
  data.t.forEach((timestamp, index) => {
    const date = new Date(timestamp * 1000).toISOString().slice(0, 10);
    closesByDate.set(date, data.c[index]);
  });
  return closesByDate;
}

function buildTradePriceHistory(transactions) {
  const sortedTransactions = [...transactions].sort((left, right) => {
    if (left.trade_date === right.trade_date) {
      return left.transaction_id - right.transaction_id;
    }
    return left.trade_date.localeCompare(right.trade_date);
  });
  const lastTradePriceByTicker = new Map();
  const historyByDate = new Map();

  for (const transaction of sortedTransactions) {
    lastTradePriceByTicker.set(transaction.ticker, parseFloat(transaction.price));

    const holdings = computeHoldings(sortedTransactions, transaction.trade_date);
    let portfolioValue = 0;

    for (const [ticker, holding] of holdings) {
      const price = lastTradePriceByTicker.get(ticker);
      if (price !== undefined) {
        portfolioValue += holding.shares * price;
      }
    }

    if (portfolioValue > 0) {
      historyByDate.set(transaction.trade_date, Math.round(portfolioValue * 100) / 100);
    }
  }

  return [...historyByDate.entries()]
    .map(([date, value]) => ({ date, value }))
    .sort((left, right) => left.date.localeCompare(right.date));
}

function computeMonthlyReturns(portfolioHistory) {
  const months = new Map();

  for (const point of portfolioHistory) {
    const month = point.date.slice(0, 7);
    if (!months.has(month)) {
      months.set(month, { start: point.value, end: point.value });
    } else {
      months.get(month).end = point.value;
    }
  }

  return [...months.entries()]
    .map(([month, values]) => ({
      month,
      returnPct:
        values.start > 0
          ? Math.round((((values.end - values.start) / values.start) * 100) * 100) / 100
          : 0,
    }))
    .sort((left, right) => left.month.localeCompare(right.month));
}

async function buildPortfolioHistory(env, transactions) {
  if (transactions.length === 0) {
    return { portfolioHistory: [], monthlyReturns: [] };
  }

  const firstDate = transactions[0].trade_date;
  const fromUnix = Math.floor(new Date(`${firstDate}T00:00:00Z`).getTime() / 1000);
  const toUnix = Math.floor(Date.now() / 1000);
  const tickers = [...new Set(transactions.map((transaction) => transaction.ticker))];

  const priceMaps = {};
  for (const ticker of tickers) {
    priceMaps[ticker] = await fetchDailyCloses(ticker, fromUnix, toUnix, env.FINNHUB_API_KEY);
    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  const tradingDates = new Set();
  for (const priceMap of Object.values(priceMaps)) {
    for (const date of priceMap.keys()) {
      tradingDates.add(date);
    }
  }

  let portfolioHistory = [];
  for (const date of [...tradingDates].sort()) {
    if (date < firstDate) {
      continue;
    }

    const holdings = computeHoldings(transactions, date);
    if (holdings.size === 0) {
      continue;
    }

    let portfolioValue = 0;
    let pricedHoldings = 0;

    for (const [ticker, holding] of holdings) {
      const closePrice = priceMaps[ticker]?.get(date);
      if (closePrice !== undefined) {
        portfolioValue += holding.shares * closePrice;
        pricedHoldings += 1;
      }
    }

    if (pricedHoldings > 0 && portfolioValue > 0) {
      portfolioHistory.push({
        date,
        value: Math.round(portfolioValue * 100) / 100,
      });
    }
  }

  if (portfolioHistory.length === 0) {
    portfolioHistory = buildTradePriceHistory(transactions);
  }

  const today = new Date().toISOString().slice(0, 10);
  const lastPoint = portfolioHistory[portfolioHistory.length - 1];
  if (!lastPoint || lastPoint.date !== today) {
    let liveValue = 0;
    const holdings = computeHoldings(transactions);
    for (const [ticker, holding] of holdings) {
      const quote = await fetchQuote(ticker, env.FINNHUB_API_KEY);
      liveValue += holding.shares * quote.currentPrice;
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    if (liveValue > 0) {
      portfolioHistory.push({ date: today, value: Math.round(liveValue * 100) / 100 });
    }
  }

  return {
    portfolioHistory,
    monthlyReturns: computeMonthlyReturns(portfolioHistory),
  };
}

async function getPortfolioSnapshot(env) {
  const transactions = await getTransactions(env);
  const holdings = computeHoldings(transactions);

  const stocks = [];
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

  const aiPrompt = `
        Eres un asesor financiero frío, pragmático, audaz, y con humor.
        Describe lo que piensas sobre un portafolio de $${totalValue.toFixed(2)},
        con los siguientes Holdings: ${stocks.map((stock) => `${stock.ticker} ×${stock.shares.toFixed(4)} ($${stock.currentValue.toFixed(2)})`).join(" | ")}
      `;

  return {
    totalValue,
    totalInvested,
    totalGain,
    totalReturnPct,
    stocks,
    aiPrompt,
    count: stocks.length,
    transactions,
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
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.XAI_API_KEY}` },
      body: JSON.stringify({
        model: config.apiModel,
        messages: [{ role: "user", content: aiPrompt }],
        max_tokens: 250,
        temperature: 0.6,
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      return { ok: false, status: response.status, error: `Grok error: ${response.status} ${errorText.slice(0, 200)}` };
    }
    const data = await response.json();
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
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: config.apiModel,
        messages: [{ role: "user", content: aiPrompt }],
        max_tokens: 250,
        temperature: 0.6,
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      return { ok: false, status: response.status, error: `OpenAI error: ${response.status} ${errorText.slice(0, 200)}` };
    }
    const data = await response.json();
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
      if (PORTFOLIO_PATHS.includes(url.pathname)) {
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
