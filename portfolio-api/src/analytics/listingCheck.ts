export interface TradePrint {
  tradeDate: string;
  price: number;
}

/**
 * Compare ledger trade prices with same-day raw closes.
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
