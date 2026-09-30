/** A priced portfolio holding. JSON field remains `stocks` (public API). */
export interface Holding {
  ticker: string;
  currentPrice: number;
  changePercent: number;
  /** Present when the API priced this holding from the latest trade instead of a live quote. */
  stale?: boolean;
  /** Weight of this holding in the portfolio, as a percent string from the API. */
  allocation: string;
  /** Gain versus cost basis, as a percent string from the API. */
  gainPercent: string;
}

export interface AiModelOption {
  id: string;
  label: string;
}

export interface PortfolioResponse {
  totalReturnPct: string;
  /** Public JSON key; values are priced holdings without share or dollar amounts. */
  stocks: Holding[];
  aiInsight: string | null;
  lastUpdated: string;
  /** Public JSON key; number of holdings. */
  count: number;
  aiModels?: AiModelOption[];
}

export interface AiInsightResponse {
  aiInsight: string;
  lastUpdated?: string;
  provider?: string;
  error?: string;
}

export type HoldingWithMetrics = Holding;
