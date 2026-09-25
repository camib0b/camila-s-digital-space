const TICKER_FUND_NAMES: Record<string, string> = {
  VOO: "Vanguard S&P 500 ETF",
  NET: "Cloudflare, Inc.",
  BND: "Vanguard Total Bond Market ETF",
  TSLA: "Tesla, Inc.",
  VXUS: "Vanguard Total International Stock ETF",
  ROBO: "ROBO Global Robotics & Automation Index ETF",
  SHOP: "Shopify Inc.",
  ASML: "ASML Holding N.V.",
  SOXX: "iShares Semiconductor ETF",
  ILF: "iShares Latin America 40 ETF",
};

export function fundNameForTicker(ticker: string): string | undefined {
  return TICKER_FUND_NAMES[ticker] ?? TICKER_FUND_NAMES[ticker.toUpperCase()];
}
