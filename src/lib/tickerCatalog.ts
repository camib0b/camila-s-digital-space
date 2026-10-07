import type { TranslationKey } from "@/i18n/types";

/**
 * Direct instruments on /capital.
 * There is no thesis field. Camila asked for the thesis to be removed entirely.
 * Every role below is approved (roleApproved = true).
 */
export type HoldingRole = "core" | "conviction" | "diversification" | "diversified-conviction";

export type InstrumentKind = "stock" | "equity-fund" | "bond-fund";

export interface DirectInstrument {
  ticker: string;
  name: string;
  isin: string;
  exchange: string;
  issuer: string;
  kind: InstrumentKind;
  role: HoldingRole;
  roleApproved: true;
  /** Official index an ETF tracks. Stocks omit this. */
  tracks?: string;
  sectorKey?: TranslationKey;
}

/** Portfolio weight in the Details panel is a percent. Dollar amounts stay hidden. */
export const showHoldingWeightInDetails = true;

export const ROLE_LABEL_KEY: Record<HoldingRole, TranslationKey> = {
  core: "portfolio.role.core",
  conviction: "portfolio.role.conviction",
  diversification: "portfolio.role.diversification",
  "diversified-conviction": "portfolio.role.diversifiedConviction",
};

export const KIND_LABEL_KEY: Record<InstrumentKind, TranslationKey> = {
  stock: "portfolio.ticker.kind.stock",
  "equity-fund": "portfolio.ticker.kind.equityFund",
  "bond-fund": "portfolio.ticker.kind.bondFund",
};

export const DIRECT_INSTRUMENTS: readonly DirectInstrument[] = [
  {
    ticker: "VOO",
    name: "Vanguard S&P 500 ETF",
    isin: "US9229083632",
    exchange: "NYSE Arca",
    issuer: "Vanguard",
    kind: "equity-fund",
    role: "core",
    roleApproved: true,
    tracks: "S&P 500",
  },
  {
    ticker: "VXUS",
    name: "Vanguard Total International Stock ETF",
    isin: "US9219097683",
    exchange: "NASDAQ",
    issuer: "Vanguard",
    kind: "equity-fund",
    role: "diversification",
    roleApproved: true,
    tracks: "FTSE All-World ex US Index",
  },
  {
    ticker: "BND",
    name: "Vanguard Total Bond Market ETF",
    isin: "US9219378356",
    exchange: "NASDAQ",
    issuer: "Vanguard",
    kind: "bond-fund",
    role: "diversification",
    roleApproved: true,
    tracks: "Bloomberg U.S. Aggregate Float Adjusted Index",
  },
  {
    ticker: "NET",
    name: "Cloudflare, Inc.",
    isin: "US18915M1071",
    exchange: "NYSE",
    issuer: "Cloudflare, Inc.",
    kind: "stock",
    role: "conviction",
    roleApproved: true,
    sectorKey: "portfolio.sector.cloud",
  },
  {
    ticker: "TSLA",
    name: "Tesla, Inc.",
    isin: "US88160R1014",
    exchange: "NASDAQ",
    issuer: "Tesla, Inc.",
    kind: "stock",
    role: "conviction",
    roleApproved: true,
    sectorKey: "portfolio.sector.autos",
  },
  {
    ticker: "SHOP",
    name: "Shopify Inc.",
    isin: "CA82509L1076",
    exchange: "Nasdaq Global Select Market",
    issuer: "Shopify Inc.",
    kind: "stock",
    role: "conviction",
    roleApproved: true,
    sectorKey: "portfolio.sector.commerce",
  },
  {
    ticker: "ROBO",
    name: "ROBO Global Robotics and Automation Index ETF",
    isin: "US3015057074",
    exchange: "NYSE Arca",
    issuer: "Exchange Traded Concepts Trust",
    kind: "equity-fund",
    role: "diversified-conviction",
    roleApproved: true,
    tracks: "ROBO Global Robotics and Automation Index",
  },
];

const FORMER_NAMES: Record<string, string> = {
  ASML: "ASML Holding N.V.",
  SOXX: "iShares Semiconductor ETF",
  ILF: "iShares Latin America 40 ETF",
};

const instrumentsByTicker = new Map(DIRECT_INSTRUMENTS.map((instrument) => [instrument.ticker, instrument]));

/** Look-through rows that are the same company as a direct holding use that ticker. */
export const ISIN_TO_TICKER: Readonly<Record<string, string>> = Object.fromEntries(
  DIRECT_INSTRUMENTS.map((instrument) => [instrument.isin, instrument.ticker]),
);

export function instrumentByTicker(ticker: string): DirectInstrument | undefined {
  return instrumentsByTicker.get(ticker.toUpperCase());
}

export function tickerForIsin(isin: string): string | undefined {
  return ISIN_TO_TICKER[isin];
}

export function canonicalCompanyLabel(isin: string, name: string): string {
  return tickerForIsin(isin) ?? name;
}

export function fundNameForTicker(ticker: string): string | undefined {
  return instrumentByTicker(ticker)?.name ?? FORMER_NAMES[ticker.toUpperCase()];
}
