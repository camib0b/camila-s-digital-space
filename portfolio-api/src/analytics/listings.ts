import type { InstrumentListing } from "./compute";

/**
 * US-listed instruments in the ledger, plus VOO as the benchmark.
 * ROBO is the NYSE Arca ROBO Global Robotics and Automation Index ETF.
 * Trades on 2026-09-25 printed 80.57, 80.73, and 80.90, inside that listing's
 * same-day range. The L&G UCITS USD line (LSE, ISIN IE00BMW3QX54, accumulating)
 * closed at 32.74 USD the same day, so it is not this position.
 */
export const INSTRUMENT_LISTINGS: readonly InstrumentListing[] = [
  {
    ticker: "VOO",
    name: "Vanguard S&P 500 ETF",
    exchange: "NYSE Arca",
    currency: "USD",
    distributionPolicy: "distributing",
    isin: "US9229083632",
    kind: "equity-fund",
    identificationNote: "US-listed Vanguard S&P 500 ETF. Yahoo and Finnhub symbol VOO.",
  },
  {
    ticker: "VXUS",
    name: "Vanguard Total International Stock ETF",
    exchange: "NASDAQ",
    currency: "USD",
    distributionPolicy: "distributing",
    isin: "US9219097683",
    kind: "equity-fund",
    identificationNote: "US-listed Vanguard Total International Stock ETF. Yahoo and Finnhub symbol VXUS.",
  },
  {
    ticker: "BND",
    name: "Vanguard Total Bond Market ETF",
    exchange: "NASDAQ",
    currency: "USD",
    distributionPolicy: "distributing",
    isin: "US9219378356",
    kind: "bond-fund",
    identificationNote: "US-listed Vanguard Total Bond Market ETF. Treated as a bond sleeve, not looked through to issuers.",
  },
  {
    ticker: "NET",
    name: "Cloudflare, Inc.",
    exchange: "NYSE",
    currency: "USD",
    distributionPolicy: "none",
    isin: "US18915M1071",
    kind: "stock",
    identificationNote: "NYSE common stock. ISIN US18915M1071.",
  },
  {
    ticker: "TSLA",
    name: "Tesla, Inc.",
    exchange: "NASDAQ",
    currency: "USD",
    distributionPolicy: "none",
    isin: "US88160R1014",
    kind: "stock",
    identificationNote: "NASDAQ common stock. ISIN US88160R1014.",
  },
  {
    ticker: "SHOP",
    name: "Shopify Inc.",
    exchange: "NYSE",
    currency: "USD",
    distributionPolicy: "none",
    isin: "CA82509L1076",
    kind: "stock",
    identificationNote: "NYSE listing of Shopify. The NYSE and TSX lines share ISIN CA82509L1076, which is how VXUS holdings are matched.",
  },
  {
    ticker: "ROBO",
    name: "ROBO Global Robotics and Automation Index ETF",
    exchange: "NYSE Arca",
    currency: "USD",
    distributionPolicy: "distributing",
    isin: "US3015057074",
    kind: "equity-fund",
    identificationNote:
      "NYSE Arca listing of the ROBO Global Robotics and Automation Index ETF (distributing, USD). Ledger trades on 2026-09-25 at 80.57–80.90 match this listing and do not match L&G ROBO Global Robotics and Automation UCITS ETF USD Accumulating (LSE ticker ROBO, ISIN IE00BMW3QX54), which closed at 32.74 USD that day. US ROBO prices are not a substitute for that UCITS line; they are the listing the ledger prices identify.",
  },
  {
    ticker: "ILF",
    name: "iShares Latin America 40 ETF",
    exchange: "NYSE Arca",
    currency: "USD",
    distributionPolicy: "distributing",
    isin: "US4642873909",
    kind: "equity-fund",
    identificationNote: "Former holding. US-listed iShares Latin America 40 ETF, needed to value history before it was sold.",
  },
  {
    ticker: "ASML",
    name: "ASML Holding N.V. ADR",
    exchange: "NASDAQ",
    currency: "USD",
    distributionPolicy: "distributing",
    isin: "USN070592100",
    kind: "stock",
    identificationNote: "NASDAQ ADR. Ledger prices near 1,600–1,900 USD match this listing, not the Amsterdam line in euros.",
  },
  {
    ticker: "SOXX",
    name: "iShares Semiconductor ETF",
    exchange: "NASDAQ",
    currency: "USD",
    distributionPolicy: "distributing",
    isin: "US4642875235",
    kind: "equity-fund",
    identificationNote: "Former holding. US-listed iShares Semiconductor ETF, needed to value history before it was sold.",
  },
];

export function listingByTicker(ticker: string): InstrumentListing | undefined {
  return INSTRUMENT_LISTINGS.find((listing) => listing.ticker === ticker);
}

export function yahooSymbolForTicker(ticker: string): string | null {
  const listing = listingByTicker(ticker);
  if (listing === undefined) {
    return null;
  }
  return listing.ticker;
}
