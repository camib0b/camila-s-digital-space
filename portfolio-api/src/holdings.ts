export interface Transaction {
  transaction_id: number;
  ticker: string;
  trade_date: string;
  price: number | string;
  quantity: number | string;
  transaction_type: string;
}

export interface HoldingEntry {
  shares: number;
  totalCost: number;
}

export async function getTransactions(env: Env): Promise<Transaction[]> {
  const { results } = await env.DB.prepare(`
    SELECT transaction_id, ticker, trade_date, price, quantity, transaction_type
    FROM transactions
    ORDER BY trade_date ASC, transaction_id ASC
  `).all<Transaction>();
  return results ?? [];
}

export function computeHoldings(
  transactions: Transaction[],
  asOfDate: string | null = null
): Map<string, HoldingEntry> {
  const holdings = new Map<string, HoldingEntry>();

  for (const transaction of transactions) {
    if (asOfDate && transaction.trade_date > asOfDate) {
      break;
    }

    const quantity = parseFloat(String(transaction.quantity));
    const price = parseFloat(String(transaction.price));
    const entry = holdings.get(transaction.ticker) || { shares: 0, totalCost: 0 };

    if (transaction.transaction_type === "BUY") {
      entry.shares += quantity;
      entry.totalCost += price * quantity;
    } else if (entry.shares > 0) {
      const averageCost = entry.totalCost / entry.shares;
      entry.shares -= quantity;
      entry.totalCost -= averageCost * quantity;
    }

    if (entry.shares > 1e-8) {
      holdings.set(transaction.ticker, entry);
    } else {
      holdings.delete(transaction.ticker);
    }
  }

  return holdings;
}
