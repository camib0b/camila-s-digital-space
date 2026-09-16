export interface Transaction {
  transaction_id: number;
  ticker: string;
  trade_date: string;
  price: number | string;
  quantity: number | string;
  transaction_type: string;
}

export interface HoldingPosition {
  shares: number;
  totalCost: number;
}

export async function fetchTransactions(env: Env): Promise<Transaction[]> {
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
): Map<string, HoldingPosition> {
  const holdings = new Map<string, HoldingPosition>();

  for (const transaction of transactions) {
    if (asOfDate && transaction.trade_date > asOfDate) {
      break;
    }

    const quantity = parseFloat(String(transaction.quantity));
    const price = parseFloat(String(transaction.price));
    const position = holdings.get(transaction.ticker) || { shares: 0, totalCost: 0 };

    if (transaction.transaction_type === "BUY") {
      position.shares += quantity;
      position.totalCost += price * quantity;
    } else if (position.shares > 0) {
      const averageCost = position.totalCost / position.shares;
      position.shares -= quantity;
      position.totalCost -= averageCost * quantity;
    }

    if (position.shares > 1e-8) {
      holdings.set(transaction.ticker, position);
    } else {
      holdings.delete(transaction.ticker);
    }
  }

  return holdings;
}
