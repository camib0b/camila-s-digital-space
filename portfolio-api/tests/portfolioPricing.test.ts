import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { latestTradePriceByTicker, type Transaction } from "../src/holdings.ts";
import { resolveHoldingQuote } from "../src/quotes.ts";

function trade(overrides: Partial<Transaction> & Pick<Transaction, "transaction_id" | "ticker" | "trade_date" | "price">): Transaction {
  return {
    quantity: 1,
    transaction_type: "BUY",
    ...overrides,
  };
}

describe("latestTradePriceByTicker", () => {
  it("keeps the newest trade date, including sells", () => {
    const prices = latestTradePriceByTicker([
      trade({ transaction_id: 1, ticker: "VOO", trade_date: "2026-04-06", price: 605.7 }),
      trade({
        transaction_id: 2,
        ticker: "VOO",
        trade_date: "2026-04-20",
        price: 651.37,
        transaction_type: "SELL",
      }),
      trade({ transaction_id: 3, ticker: "NET", trade_date: "2026-04-22", price: 207.59 }),
    ]);

    assert.equal(prices.get("VOO"), 651.37);
    assert.equal(prices.get("NET"), 207.59);
  });

  it("breaks same-day ties with the higher transaction id", () => {
    const prices = latestTradePriceByTicker([
      trade({ transaction_id: 9, ticker: "ILF", trade_date: "2026-04-13", price: 37.62 }),
      trade({ transaction_id: 6, ticker: "ILF", trade_date: "2026-04-13", price: 38.08 }),
    ]);

    assert.equal(prices.get("ILF"), 37.62);
  });

  it("prefers a later date over a higher id on an earlier date", () => {
    const prices = latestTradePriceByTicker([
      trade({ transaction_id: 40, ticker: "TSLA", trade_date: "2026-05-05", price: 391.42 }),
      trade({ transaction_id: 4, ticker: "TSLA", trade_date: "2026-06-15", price: 411.4 }),
    ]);

    assert.equal(prices.get("TSLA"), 411.4);
  });

  it("ignores non-trades and non-positive prices", () => {
    const prices = latestTradePriceByTicker([
      trade({ transaction_id: 1, ticker: "BND", trade_date: "2026-06-05", price: 72.89 }),
      trade({
        transaction_id: 2,
        ticker: "BND",
        trade_date: "2026-06-06",
        price: 0,
        transaction_type: "SELL",
      }),
      trade({
        transaction_id: 3,
        ticker: "BND",
        trade_date: "2026-06-07",
        price: 80,
        transaction_type: "DIVIDEND",
      }),
    ]);

    assert.equal(prices.get("BND"), 72.89);
  });
});

describe("resolveHoldingQuote", () => {
  it("keeps a live quote", () => {
    assert.deepEqual(resolveHoldingQuote({ currentPrice: 220.5, changePercent: -1.25 }, 200), {
      currentPrice: 220.5,
      changePercent: -1.25,
      stale: false,
    });
  });

  it("falls back to the last trade price when the quote is missing", () => {
    assert.deepEqual(resolveHoldingQuote({ currentPrice: 0, changePercent: 3 }, 109.42), {
      currentPrice: 109.42,
      changePercent: 0,
      stale: true,
    });
  });

  it("does not mark a holding stale when there is no trade price to use", () => {
    assert.deepEqual(resolveHoldingQuote({ currentPrice: 0, changePercent: 3 }, undefined), {
      currentPrice: 0,
      changePercent: 0,
      stale: false,
    });
    assert.deepEqual(resolveHoldingQuote({ currentPrice: 0, changePercent: 3 }, 0), {
      currentPrice: 0,
      changePercent: 0,
      stale: false,
    });
  });
});
