/** A priced portfolio holding. JSON field remains `stocks` (public API). */
export interface Holding {
  ticker: string;
  currentPrice: number;
  changePercent: number;
  /** Present when the API priced this holding from the latest trade instead of a live quote. */
  stale?: boolean;
  /** Weight of this holding in the portfolio, as a percent string. */
  allocation?: string;
  /** Gain versus cost basis, as a percent string. */
  gainPercent?: string;
  /**
   * Live quote payloads may still include market value and cost.
   * They are used only to derive percents. The UI must not render them.
   */
  currentValue?: number;
  totalCost?: number;
}

export interface AiModelOption {
  id: string;
  label: string;
}

export interface PortfolioResponse {
  totalReturnPct: string;
  /**
   * Present on the live quote payload. Used only to derive holding weights.
   * Never rendered.
   */
  totalValue?: number;
  /** Public JSON key; values are priced holdings. Dollar fields are not shown. */
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

/** Table and Details view. Dollar inputs are already removed. */
export interface HoldingWithMetrics {
  ticker: string;
  currentPrice: number;
  changePercent: number;
  stale?: boolean;
  allocation: string;
  gainPercent: string;
}
