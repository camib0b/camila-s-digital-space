/** A priced portfolio holding. JSON field remains `stocks` (public API). */
export interface Holding {
  ticker: string;
  shares: number;
  totalCost: number;
  currentPrice: number;
  changePercent: number;
  currentValue: number;
}

export interface AiModelOption {
  id: string;
  label: string;
}

export interface PortfolioResponse {
  totalValue: string;
  totalInvested: string;
  totalGain: string;
  totalReturnPct: string;
  /** Public JSON key; values are priced holdings. */
  stocks: Holding[];
  aiInsight: string | null;
  lastUpdated: string;
  /** Public JSON key; number of holdings. */
  count: number;
  aiModels?: AiModelOption[];
}

export interface PortfolioHistoryPoint {
  date: string;
  value: number;
  returnPct?: number;
}

export interface RelativePerformancePoint {
  date: string;
  changePercent: number;
}

export interface MonthlyReturnPoint {
  month: string;
  returnPct: number;
}

export interface PortfolioHistoryResponse {
  portfolioHistory: PortfolioHistoryPoint[];
  monthlyReturns: MonthlyReturnPoint[];
  lastUpdated: string;
}

export interface AiInsightResponse {
  aiInsight: string;
  lastUpdated?: string;
  provider?: string;
  error?: string;
}

export interface HoldingWithMetrics extends Holding {
  allocation: string;
  gainPercent: string;
}

export interface AllocationChartPoint {
  ticker: string;
  allocation: number;
}
