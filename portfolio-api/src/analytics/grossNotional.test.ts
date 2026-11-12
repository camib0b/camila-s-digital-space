import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  isMissingGrossNotionalColumn,
  readGrossNotional,
  transactionAmountSelect,
} from "./grossNotional";

describe("gross notional column", () => {
  it("reads the renamed column and the legacy column", () => {
    expect(readGrossNotional({ gross_notional: 45.00000078, total_amount: 1 })).toBe(45.00000078);
    expect(readGrossNotional({ total_amount: 99.9998586 })).toBe(99.9998586);
    expect(readGrossNotional({})).toBeNaN();
  });

  it("retries only when the renamed column is missing", () => {
    expect(isMissingGrossNotionalColumn(new Error("D1_ERROR: no such column: gross_notional: SQLITE_ERROR"))).toBe(true);
    expect(isMissingGrossNotionalColumn(new Error("no such table: transactions"))).toBe(false);
    expect(transactionAmountSelect("gross_notional")).toContain("gross_notional AS gross_notional");
    expect(transactionAmountSelect("total_amount")).toContain("total_amount AS gross_notional");
    expect(transactionAmountSelect("gross_notional")).not.toContain("total_amount");
  });

  it("keeps 52 ledger rows and the previous notional values under the new key", () => {
    const ledgerPath = path.join(process.cwd(), "data/ledger.json");
    const rows = JSON.parse(readFileSync(ledgerPath, "utf8")) as {
      transactionId: number;
      grossNotional?: number;
      totalAmount?: number;
    }[];
    expect(rows).toHaveLength(52);
    expect(rows.every((row) => row.totalAmount === undefined && typeof row.grossNotional === "number")).toBe(true);
    const sum = rows.reduce((total, row) => total + (row.grossNotional ?? 0), 0);
    expect(sum).toBeCloseTo(2240.33347603616, 8);
    expect(new Set(rows.map((row) => row.transactionId)).size).toBe(52);
  });
});
