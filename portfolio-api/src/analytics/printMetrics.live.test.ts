import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { computeAnalytics } from "./compute";
import type { LedgerTransaction } from "./ledger";
import { listingConsistency } from "./listingCheck";
import { INSTRUMENT_LISTINGS } from "./listings";
import { FUND_SNAPSHOTS } from "./snapshots";
import { fetchFredDgs3mo, fetchYahooHistory } from "../marketData";

describe("live ledger", () => {
  it("recomputes analytics from vendor data", async () => {
    const ledgerPath = path.join(process.cwd(), "data/ledger.json");
    const transactions = JSON.parse(readFileSync(ledgerPath, "utf8")) as LedgerTransaction[];
    const firstTradeDate = transactions.map((transaction) => transaction.tradeDate).sort()[0] ?? "2026-01-13";
    const startDate = "2022-09-01";
    const endDate = new Date().toISOString().slice(0, 10);
    const tickers = [...new Set([...transactions.map((transaction) => transaction.ticker), "VOO"])];
    const prices = [];
    const splits = [];
    const listingNotes: string[] = [];
    for (const ticker of tickers) {
      const history = await fetchYahooHistory(ticker, startDate, endDate);
      if ("error" in history) {
        listingNotes.push(`${ticker} ERROR ${history.error}`);
        continue;
      }
      const closes = new Map(history.bars.flatMap((bar) => (bar.rawClose === null ? [] : [[bar.date, bar.rawClose] as const])));
      const trades = transactions.filter((transaction) => transaction.ticker === ticker);
      const consistency = listingConsistency(
        trades.map((trade) => ({ tradeDate: trade.tradeDate, price: trade.price })),
        closes,
      );
      listingNotes.push(
        `${ticker} currency=${history.currency} bars=${history.bars.length} splits=${history.splits.length} medianGap=${consistency.medianAbsoluteGap === null ? "none" : (consistency.medianAbsoluteGap * 100).toFixed(2) + "%"} matched=${consistency.matchedTrades} consistent=${consistency.consistent} first=${history.bars[0]?.date}`,
      );
      if (!consistency.consistent) {
        continue;
      }
      prices.push(...history.bars);
      splits.push(...history.splits);
    }
    const yields = await fetchFredDgs3mo();
    if ("error" in yields) {
      throw new Error(yields.error);
    }
    const report = computeAnalytics({
      transactions,
      listings: INSTRUMENT_LISTINGS,
      prices,
      fxRates: [],
      riskFreeRates: yields.filter((row) => row.date >= "2022-01-01"),
      splits,
      fundSnapshots: FUND_SNAPSHOTS,
      priceSource: "Yahoo Finance chart API; raw close is split-adjusted, adjusted close reinvests dividends",
      riskFreeSource: "FRED DGS3MO",
    });
    const summary = {
      firstTradeDate,
      listings: listingNotes,
      dividendRecordCount: report.ledger.dividendRecordCount,
      warnings: report.ledger.warnings,
      performance: report.performance.status === "ok"
        ? {
            asOf: report.performance.asOf,
            lookback: `${report.performance.lookbackStart} → ${report.performance.lookbackEnd}`,
            sampleSize: report.performance.sampleSize,
            calendarDayCount: report.performance.calendarDayCount,
            twr: report.performance.timeWeightedReturn,
            annualizationLabel: report.performance.annualizationLabel,
            simpleReturn: report.performance.simpleReturn,
            netInvested: report.performance.netInvested,
            portfolioValue: report.performance.portfolioValue,
            benchmark: report.performance.benchmark,
            excessReturn: report.performance.excessReturn,
            counterfactualValue: report.performance.counterfactualValue,
            counterfactualReason: report.performance.counterfactualReason,
            maxDrawdown: report.performance.maxDrawdown,
            skippedValuationDates: report.performance.skippedValuationDates,
          }
        : report.performance,
      risk: report.risk.status === "ok"
        ? {
            asOf: report.risk.asOf,
            lookback: `${report.risk.lookbackStart} → ${report.risk.lookbackEnd}`,
            sampleSize: report.risk.sampleSize,
            volatility: report.risk.portfolioVolatility,
            weightsSum: report.risk.weightsSum,
            cash: report.risk.cashMarketValue,
            cashWeight: report.risk.cashWeightOfPortfolio,
            componentSum: report.risk.contributions.reduce((total, row) => total + row.componentContribution, 0),
            percentSum: report.risk.contributions.reduce((total, row) => total + row.percentContribution, 0),
            contributions: report.risk.contributions.map((row) => ({
              ticker: row.ticker,
              weight: row.weight,
              percentContribution: row.percentContribution,
              componentContribution: row.componentContribution,
            })),
          }
        : report.risk,
      sharpe: report.sharpe,
      exposure: report.exposure.status === "ok"
        ? {
            apparent: report.exposure.apparentCompany,
            effective: report.exposure.effectiveCompany,
            bondWeight: report.exposure.bondWeight,
            cashWeight: report.exposure.cashWeight,
            unattributedWeight: report.exposure.unattributedWeight,
            overlap: report.exposure.overlap,
            coverage: report.exposure.snapshotCoverage,
            top: report.exposure.topExposures.slice(0, 8).map((row) => ({
              name: row.name,
              isin: row.isin,
              weight: row.weight,
              contributions: row.contributions,
            })),
          }
        : report.exposure,
    };
    writeFileSync("/tmp/analytics-summary.json", JSON.stringify(summary, null, 2));
    expect(listingNotes.length).toBeGreaterThan(0);
  }, 180_000);
});
