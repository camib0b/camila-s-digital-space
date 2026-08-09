export interface Stock {
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
  stocks: Stock[];
  aiInsight: string | null;
  lastUpdated: string;
  count: number;
  aiModels?: AiModelOption[];
}

export interface PortfolioHistoryPoint {
  date: string;
  value: number;
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

export interface HoldingWithMetrics extends Stock {
  allocation: string;
  gainPercent: string;
}

export interface AllocationChartPoint {
  ticker: string;
  allocation: number;
}
