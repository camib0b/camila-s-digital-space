export const SHARE_DUST = 1e-8;

export type TransactionType = "BUY" | "SELL" | "DIVIDEND" | "DEPOSIT" | "WITHDRAWAL" | "FEE";

export interface LedgerTransaction {
  transactionId: number;
  ticker: string;
  tradeDate: string;
  price: number;
  quantity: number;
  transactionType: TransactionType;
  totalAmount: number;
}

export interface SplitEvent {
  ticker: string;
  exDate: string;
  /** Multiply share count by this factor. A 2-for-1 split is 2. */
  shareMultiplier: number;
}

export interface DailyLedgerState {
  date: string;
  actualSharesByTicker: ReadonlyMap<string, number>;
  cash: number;
  externalFlow: number;
}

export interface LedgerBuild {
  states: DailyLedgerState[];
  externalFlowMethod: "inferred_buy_shortfall" | "explicit_deposits";
  dividendRecordCount: number;
  feeTotal: number;
  warnings: string[];
}

function compareTransactions(left: LedgerTransaction, right: LedgerTransaction): number {
  if (left.tradeDate === right.tradeDate) {
    return left.transactionId - right.transactionId;
  }
  return left.tradeDate < right.tradeDate ? -1 : 1;
}

function sumAmounts(transactions: readonly LedgerTransaction[]): number {
  let total = 0;
  for (const transaction of transactions) {
    total += transaction.totalAmount;
  }
  return total;
}

function cloneShares(shares: ReadonlyMap<string, number>): Map<string, number> {
  return new Map(shares);
}

/**
 * Cash sleeve plus holdings.
 * Same-day sale proceeds fund same-day buys. A buy that still exceeds cash is an
 * external inflow, unless the ledger has explicit deposit rows — then only those
 * deposits (and explicit withdrawals) are external flows.
 * Fees reduce cash and are not flows. Dividends and sale proceeds increase cash
 * and are not flows.
 */
export function buildLedger(
  transactions: readonly LedgerTransaction[],
  splits: readonly SplitEvent[],
): LedgerBuild {
  const sorted = [...transactions].sort(compareTransactions);
  const hasExplicitDeposits = sorted.some((transaction) => transaction.transactionType === "DEPOSIT");
  const warnings: string[] = [];
  const eventDates = new Set<string>();
  for (const transaction of sorted) {
    eventDates.add(transaction.tradeDate);
  }
  for (const split of splits) {
    eventDates.add(split.exDate);
  }

  const dates = [...eventDates].sort();
  const states: DailyLedgerState[] = [];
  let shares = new Map<string, number>();
  let cash = 0;

  for (const date of dates) {
    shares = cloneShares(shares);
    for (const split of splits) {
      if (split.exDate !== date) {
        continue;
      }
      const currentShares = shares.get(split.ticker) ?? 0;
      if (Math.abs(currentShares) > SHARE_DUST) {
        shares.set(split.ticker, currentShares * split.shareMultiplier);
      }
    }

    const dayTransactions = sorted.filter((transaction) => transaction.tradeDate === date);
    const sells = dayTransactions.filter((transaction) => transaction.transactionType === "SELL");
    const dividends = dayTransactions.filter((transaction) => transaction.transactionType === "DIVIDEND");
    const deposits = dayTransactions.filter((transaction) => transaction.transactionType === "DEPOSIT");
    const fees = dayTransactions.filter((transaction) => transaction.transactionType === "FEE");
    const buys = dayTransactions.filter((transaction) => transaction.transactionType === "BUY");
    const withdrawals = dayTransactions.filter((transaction) => transaction.transactionType === "WITHDRAWAL");

    for (const sale of sells) {
      const currentShares = shares.get(sale.ticker) ?? 0;
      shares.set(sale.ticker, currentShares - sale.quantity);
      cash += sale.totalAmount;
    }
    cash += sumAmounts(dividends);
    cash += sumAmounts(deposits);
    const feeTotal = sumAmounts(fees);
    cash -= feeTotal;

    for (const purchase of buys) {
      const currentShares = shares.get(purchase.ticker) ?? 0;
      shares.set(purchase.ticker, currentShares + purchase.quantity);
    }

    const buyCost = sumAmounts(buys);
    let externalFlow = 0;
    if (hasExplicitDeposits) {
      externalFlow += sumAmounts(deposits);
      cash -= buyCost;
      if (cash < -1e-6 && buyCost > 0) {
        warnings.push(
          `Buys on ${date} exceeded cash and recorded deposits. The shortfall was not treated as an extra inflow.`,
        );
      }
    } else {
      const availableCash = Math.max(cash, 0);
      if (buyCost > availableCash) {
        const shortfall = buyCost - availableCash;
        externalFlow += shortfall;
        cash = cash - buyCost + shortfall;
      } else {
        cash -= buyCost;
      }
    }

    const withdrawalTotal = sumAmounts(withdrawals);
    externalFlow -= withdrawalTotal;
    cash -= withdrawalTotal;

    for (const [ticker, quantity] of shares) {
      if (quantity < -SHARE_DUST) {
        warnings.push(`Ticker ${ticker} has negative shares on ${date}.`);
      }
    }

    states.push({
      date,
      actualSharesByTicker: shares,
      cash,
      externalFlow,
    });
  }

  return {
    states,
    externalFlowMethod: hasExplicitDeposits ? "explicit_deposits" : "inferred_buy_shortfall",
    dividendRecordCount: sorted.filter((transaction) => transaction.transactionType === "DIVIDEND").length,
    feeTotal: sorted
      .filter((transaction) => transaction.transactionType === "FEE")
      .reduce((total, transaction) => total + transaction.totalAmount, 0),
    warnings,
  };
}

export function ledgerStateAsOf(
  states: readonly DailyLedgerState[],
  date: string,
): DailyLedgerState | null {
  let matched: DailyLedgerState | null = null;
  for (const state of states) {
    if (state.date <= date) {
      matched = state;
    } else {
      break;
    }
  }
  return matched;
}

export function externalFlowThroughDate(
  states: readonly DailyLedgerState[],
  afterDate: string | null,
  throughDate: string,
): number {
  let total = 0;
  for (const state of states) {
    const afterPrevious = afterDate === null || state.date > afterDate;
    if (afterPrevious && state.date <= throughDate) {
      total += state.externalFlow;
    }
  }
  return total;
}

/**
 * Prices stored from Yahoo and Finnhub daily candles are split-adjusted into
 * current-share terms. Ledger quantities are the shares actually traded that day.
 * Value on date D is actual shares on D, multiplied by splits whose ex-date is
 * still in the future, times the split-adjusted close.
 */
export function sharesForSplitAdjustedPrice(
  actualShares: number,
  asOfDate: string,
  splits: readonly SplitEvent[],
): number {
  let multiplier = 1;
  for (const split of splits) {
    if (split.exDate > asOfDate) {
      multiplier *= split.shareMultiplier;
    }
  }
  return actualShares * multiplier;
}

export function externalFlowsByDate(states: readonly DailyLedgerState[]): Map<string, number> {
  const flows = new Map<string, number>();
  for (const state of states) {
    if (state.externalFlow !== 0) {
      flows.set(state.date, (flows.get(state.date) ?? 0) + state.externalFlow);
    }
  }
  return flows;
}
