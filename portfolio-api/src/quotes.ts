export interface Quote {
  currentPrice: number;
  changePercent: number;
}

const quoteCache = new Map<string, { data: Quote; expiresAt: number }>();

export async function fetchQuote(ticker: string, apiKey: string): Promise<Quote> {
  const cached = quoteCache.get(ticker);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const response = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(ticker)}&token=${apiKey}`
  );
  if (!response.ok) {
    console.warn(`Finnhub quote unavailable for ${ticker}:`, response.status);
    return cached?.data ?? { currentPrice: 0, changePercent: 0 };
  }

  let data: { c?: number; dp?: number };
  try {
    data = (await response.json()) as { c?: number; dp?: number };
  } catch {
    console.warn(`Finnhub quote returned non-JSON for ${ticker}`);
    return cached?.data ?? { currentPrice: 0, changePercent: 0 };
  }

  const quote: Quote = {
    currentPrice: data.c || 0,
    changePercent: data.dp || 0,
  };
  quoteCache.set(ticker, { data: quote, expiresAt: Date.now() + 60_000 });
  return quote;
}

export async function fetchDailyCloses(
  ticker: string,
  fromUnix: number,
  toUnix: number,
  apiKey: string
): Promise<Map<string, number>> {
  const response = await fetch(
    `https://finnhub.io/api/v1/stock/candle?symbol=${encodeURIComponent(ticker)}&resolution=D&from=${fromUnix}&to=${toUnix}&token=${apiKey}`
  );
  const data = (await response.json()) as {
    s?: string;
    t?: number[];
    c?: number[];
  };

  if (data.s !== "ok" || !Array.isArray(data.t) || !Array.isArray(data.c)) {
    console.warn(`Finnhub candle unavailable for ${ticker}:`, data.s ?? response.status);
    return new Map();
  }

  const closesByDate = new Map<string, number>();
  data.t.forEach((timestamp, index) => {
    const date = new Date(timestamp * 1000).toISOString().slice(0, 10);
    closesByDate.set(date, data.c![index]);
  });
  return closesByDate;
}
