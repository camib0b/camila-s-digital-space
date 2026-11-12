export interface TradePrint {
  tradeDate: string;
  price: number;
}

/**
 * Yahoo and Finnhub raw closes are split-adjusted into current shares.
 * A ledger print is the price paid that day. Multiply each close by splits
 * whose ex-date is still after that day so the comparison uses trade terms.
 * A split on or before the trade is already in both the print and the close.
 */
export function closesInTradeTerms(
  splitAdjustedCloseByDate: ReadonlyMap<string, number>,
  splits: readonly { exDate: string; shareMultiplier: number }[],
): Map<string, number> {
  const comparableCloses = new Map<string, number>();
  for (const [date, splitAdjustedClose] of splitAdjustedCloseByDate) {
    let shareMultiplier = 1;
    for (const split of splits) {
      if (split.exDate > date && split.shareMultiplier > 0) {
        shareMultiplier *= split.shareMultiplier;
      }
    }
    comparableCloses.set(date, splitAdjustedClose * shareMultiplier);
  }
  return comparableCloses;
}

/**
 * Compare ledger trade prices with same-day closes in trade terms.
 * A large median gap means the price series is a different listing.
 */
export function listingConsistency(
  trades: readonly TradePrint[],
  rawCloseByDate: ReadonlyMap<string, number>,
  maximumMedianGap = 0.1,
): { consistent: boolean; medianAbsoluteGap: number | null; matchedTrades: number } {
  const gaps: number[] = [];
  for (const trade of trades) {
    if (!(trade.price > 0)) {
      continue;
    }
    const close = rawCloseByDate.get(trade.tradeDate);
    if (close === undefined || !(close > 0)) {
      continue;
    }
    gaps.push(Math.abs(trade.price - close) / close);
  }
  if (gaps.length === 0) {
    return { consistent: false, medianAbsoluteGap: null, matchedTrades: 0 };
  }
  gaps.sort((left, right) => left - right);
  const middle = Math.floor(gaps.length / 2);
  const medianAbsoluteGap = gaps.length % 2 === 1
    ? gaps[middle] ?? 0
    : ((gaps[middle - 1] ?? 0) + (gaps[middle] ?? 0)) / 2;
  return {
    consistent: medianAbsoluteGap <= maximumMedianGap,
    medianAbsoluteGap,
    matchedTrades: gaps.length,
  };
}
