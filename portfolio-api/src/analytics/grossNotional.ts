/** Column written by migration 0002 and by current seeds. */
export const GROSS_NOTIONAL_COLUMN = "gross_notional";

/** Column on databases that have not applied migration 0002. */
export const LEGACY_TOTAL_AMOUNT_COLUMN = "total_amount";

export type GrossNotionalColumn = typeof GROSS_NOTIONAL_COLUMN | typeof LEGACY_TOTAL_AMOUNT_COLUMN;

export function transactionAmountSelect(column: GrossNotionalColumn): string {
  return `SELECT transaction_id, ticker, trade_date, price, quantity, transaction_type, ${column} AS gross_notional
     FROM transactions
     ORDER BY trade_date, transaction_id`;
}

export function isMissingGrossNotionalColumn(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /no such column:\s*gross_notional/i.test(message);
}

export function readGrossNotional(row: {
  gross_notional?: number | null;
  total_amount?: number | null;
}): number {
  if (row.gross_notional !== undefined && row.gross_notional !== null) {
    return Number(row.gross_notional);
  }
  if (row.total_amount !== undefined && row.total_amount !== null) {
    return Number(row.total_amount);
  }
  return Number.NaN;
}
