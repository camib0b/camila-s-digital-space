import { computeHoldings, type Transaction } from "./holdings";
import { fetchDailyCloses, fetchQuote } from "./quotes";

export interface PortfolioHistoryPoint {
  date: string;
  value: number;
}

export interface MonthlyReturnPoint {
  month: string;
  returnPct: number;
}

function buildTradePriceHistory(transactions: Transaction[]): PortfolioHistoryPoint[] {
  const sortedTransactions = [...transactions].sort((left, right) => {
    if (left.trade_date === right.trade_date) {
      return left.transaction_id - right.transaction_id;
    }
    return left.trade_date.localeCompare(right.trade_date);
  });
  const lastTradePriceByTicker = new Map<string, number>();
  const historyByDate = new Map<string, number>();

  for (const transaction of sortedTransactions) {
    lastTradePriceByTicker.set(transaction.ticker, parseFloat(String(transaction.price)));

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

function computeMonthlyReturns(
  portfolioHistory: PortfolioHistoryPoint[]
): MonthlyReturnPoint[] {
  const months = new Map<string, { start: number; end: number }>();

  for (const point of portfolioHistory) {
    const month = point.date.slice(0, 7);
    if (!months.has(month)) {
      months.set(month, { start: point.value, end: point.value });
    } else {
      months.get(month)!.end = point.value;
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

export async function buildPortfolioHistory(
  env: Env,
  transactions: Transaction[]
): Promise<{
  portfolioHistory: PortfolioHistoryPoint[];
  monthlyReturns: MonthlyReturnPoint[];
}> {
  if (transactions.length === 0) {
    return { portfolioHistory: [], monthlyReturns: [] };
  }

  const firstDate = transactions[0].trade_date;
  const fromUnix = Math.floor(new Date(`${firstDate}T00:00:00Z`).getTime() / 1000);
  const toUnix = Math.floor(Date.now() / 1000);
  const tickers = [...new Set(transactions.map((transaction) => transaction.ticker))];

  const priceMaps: Record<string, Map<string, number>> = {};
  for (const ticker of tickers) {
    priceMaps[ticker] = await fetchDailyCloses(ticker, fromUnix, toUnix, env.FINNHUB_API_KEY);
    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  const tradingDates = new Set<string>();
  for (const priceMap of Object.values(priceMaps)) {
    for (const date of priceMap.keys()) {
      tradingDates.add(date);
    }
  }

  let portfolioHistory: PortfolioHistoryPoint[] = [];
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
