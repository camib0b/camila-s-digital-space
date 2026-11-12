/** Priced portfolio holding returned by `/api/portfolio` as `holdings[]`. */
export interface PublicHolding {
  ticker: string;
  currentPrice: number;
  /** Percent points versus the previous close. Null when that change is unavailable. */
  previousCloseChangePercent: number | null;
  /** Present when the API priced this holding from the latest trade instead of a live quote. */
  stale?: boolean;
  /** Weight of this holding in the portfolio, as a percent string ("12.3" means 12.3%). */
  weightPercent?: string;
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
  /** Open-lot market value versus remaining cost, in percent points. */
  openCostBasisGainPercent: string;
  /**
   * Present on the live quote payload. Used only to derive holding weights.
   * Never rendered.
   */
  totalValue?: number;
  holdings: PublicHolding[];
  aiInsight: string | null;
  lastUpdated: string;
  holdingsCount: number;
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
  previousCloseChangePercent: number | null;
  stale?: boolean;
  weightPercent: string;
  gainPercent: string;
}
