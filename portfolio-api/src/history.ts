import { computeHoldings, latestTradePriceByTicker, type Transaction } from "./holdings";
import { fetchDailyCloses, fetchQuote, resolveHoldingQuote } from "./quotes";

export interface PortfolioHistoryPoint {
  date: string;
  value: number;
  returnPct: number;
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
  const historyByDate = new Map<string, { value: number; returnPct: number }>();

  for (const transaction of sortedTransactions) {
    lastTradePriceByTicker.set(transaction.ticker, parseFloat(String(transaction.price)));

    const holdings = computeHoldings(sortedTransactions, transaction.trade_date);
    let portfolioValue = 0;
    let totalCost = 0;

    for (const [ticker, holding] of holdings) {
      totalCost += holding.totalCost;
      const price = lastTradePriceByTicker.get(ticker);
      if (price !== undefined) {
        portfolioValue += holding.shares * price;
      }
    }

    if (portfolioValue > 0) {
      historyByDate.set(transaction.trade_date, {
        value: Math.round(portfolioValue * 100) / 100,
        returnPct: percentReturn(portfolioValue, totalCost),
      });
    }
  }

  return [...historyByDate.entries()]
    .map(([date, point]) => ({ date, ...point }))
    .sort((left, right) => left.date.localeCompare(right.date));
}

function percentReturn(portfolioValue: number, totalCost: number): number {
  if (totalCost <= 0) {
    return 0;
  }
  return Math.round(((portfolioValue - totalCost) / totalCost) * 10000) / 100;
}

function computeMonthlyReturns(
  portfolioHistory: PortfolioHistoryPoint[]
): MonthlyReturnPoint[] {
  const valueRangeByMonth = new Map<string, { openingValue: number; closingValue: number }>();

  for (const point of portfolioHistory) {
    const month = point.date.slice(0, 7);
    if (!valueRangeByMonth.has(month)) {
      valueRangeByMonth.set(month, { openingValue: point.value, closingValue: point.value });
    } else {
      valueRangeByMonth.get(month)!.closingValue = point.value;
    }
  }

  return [...valueRangeByMonth.entries()]
    .map(([month, values]) => ({
      month,
      returnPct:
        values.openingValue > 0
          ? Math.round((((values.closingValue - values.openingValue) / values.openingValue) * 100) * 100) / 100
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

  const dailyClosesByTicker: Record<string, Map<string, number>> = {};
  for (const ticker of tickers) {
    dailyClosesByTicker[ticker] = await fetchDailyCloses(ticker, fromUnix, toUnix, env.FINNHUB_API_KEY);
    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  const tradingDates = new Set<string>();
  for (const dailyCloses of Object.values(dailyClosesByTicker)) {
    for (const date of dailyCloses.keys()) {
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
    let pricedHoldingsCount = 0;
    let totalCost = 0;

    for (const [ticker, holding] of holdings) {
      totalCost += holding.totalCost;
      const closePrice = dailyClosesByTicker[ticker]?.get(date);
      if (closePrice !== undefined) {
        portfolioValue += holding.shares * closePrice;
        pricedHoldingsCount += 1;
      }
    }

    if (pricedHoldingsCount > 0 && portfolioValue > 0) {
      portfolioHistory.push({
        date,
        value: Math.round(portfolioValue * 100) / 100,
        returnPct: percentReturn(portfolioValue, totalCost),
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
    const lastTradePriceByTicker = latestTradePriceByTicker(transactions);
    let liveCost = 0;
    for (const [ticker, holding] of holdings) {
      liveCost += holding.totalCost;
      const quote = await fetchQuote(ticker, env.FINNHUB_API_KEY);
      const resolvedQuote = resolveHoldingQuote(quote, lastTradePriceByTicker.get(ticker));
      liveValue += holding.shares * resolvedQuote.currentPrice;
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    if (liveValue > 0) {
      portfolioHistory.push({
        date: today,
        value: Math.round(liveValue * 100) / 100,
        returnPct: percentReturn(liveValue, liveCost),
      });
    }
  }

  return {
    portfolioHistory,
    monthlyReturns: computeMonthlyReturns(portfolioHistory),
  };
}
