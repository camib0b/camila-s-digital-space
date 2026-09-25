export interface UnavailableBlock {
  status: "unavailable";
  reasonCode: string;
  reason: string;
  sampleSize: number | null;
}

export interface PerformanceSeriesPoint {
  date: string;
  portfolioValue: number;
  counterfactualValue: number | null;
  cumulativeTimeWeightedReturn: number;
  cumulativeBenchmarkReturn: number | null;
}

export interface BenchmarkBlock {
  status: "ok";
  timeWeightedReturn: number;
  annualized: boolean;
  annualizedTimeWeightedReturn: number | null;
  annualizationLabel: string;
  asOf: string;
  lookbackStart: string;
  lookbackEnd: string;
  sampleSize: number;
  source: string;
}

export interface PerformanceBlock {
  status: "ok";
  asOf: string;
  lookbackStart: string;
  lookbackEnd: string;
  sampleSize: number;
  source: string;
  timeWeightedReturn: number;
  annualized: boolean;
  annualizedTimeWeightedReturn: number | null;
  annualizationLabel: string;
  calendarDayCount: number;
  simpleReturn: number | null;
  simpleReturnLabel: string;
  netInvested: number;
  portfolioValue: number;
  benchmark: BenchmarkBlock | UnavailableBlock;
  excessReturn: number | null;
  excessLabel: string;
  counterfactualValue: number | null;
  counterfactualReason: string | null;
  maxDrawdown: { peakDate: string; troughDate: string; drawdown: number } | null;
  skippedValuationDates: number;
  valuationGapNote: string | null;
  dailyReturns: { date: string; dailyReturn: number }[];
  series: PerformanceSeriesPoint[];
}

export interface RiskContributionRow {
  ticker: string;
  weight: number;
  marginalContribution: number;
  componentContribution: number;
  percentContribution: number;
}

export interface RiskBlock {
  status: "ok";
  asOf: string;
  lookbackStart: string;
  lookbackEnd: string;
  sampleSize: number;
  source: string;
  requestedWeeks: number;
  portfolioVolatility: number;
  weightsSum: number;
  cashMarketValue: number;
  cashWeightOfPortfolio: number;
  cashTreatment: string;
  label: string;
  contributions: RiskContributionRow[];
}

export interface SharpeWindow {
  asOf: string | null;
  lookbackStart: string | null;
  lookbackEnd: string | null;
  sampleSize: number | null;
  source: string;
}

export interface HoldingsSharpeBlock {
  status: "ok";
  sharpe: number;
  benchmarkSharpe: number | null;
  benchmarkReason: string | null;
  window: SharpeWindow;
  riskFreeSeries: string;
  method: string;
}

export interface RealizedSharpeBlock {
  status: "ok";
  sharpe: number;
  window: SharpeWindow;
  riskFreeSeries: string;
  method: string;
}

export interface ExposureContribution {
  source: string;
  weight: number;
}

export interface LookThroughRow {
  isin: string;
  name: string;
  weight: number;
  contributions: ExposureContribution[];
}

export interface ExposureBlock {
  status: "ok";
  asOf: string;
  lookbackStart: string | null;
  lookbackEnd: string | null;
  sampleSize: number;
  source: string;
  topExposures: LookThroughRow[];
  overlap: { fundA: string; fundB: string; overlap: number }[];
  apparentCompany: { ticker: string; name: string; isin: string; weight: number } | null;
  effectiveCompany: { name: string; isin: string; weight: number } | null;
  bondWeight: number;
  cashWeight: number;
  unattributedWeight: number;
  snapshotCoverage: { fundTicker: string; asOf: string; source: string; coverage: number }[];
}

export interface AnalyticsReport {
  ledger: {
    dividendRecordCount: number;
    dividendCaveat: string | null;
    externalFlowMethod: string;
    feeTotal: number;
    warnings: string[];
    listings: {
      ticker: string;
      name: string;
      exchange: string;
      currency: string;
      distributionPolicy: string;
      isin: string | null;
      kind: string;
      identificationNote: string;
    }[];
  };
  performance: PerformanceBlock | UnavailableBlock;
  risk: RiskBlock | UnavailableBlock;
  sharpe: {
    holdings: HoldingsSharpeBlock | UnavailableBlock;
    realized: RealizedSharpeBlock | UnavailableBlock;
  };
  exposure: ExposureBlock | UnavailableBlock;
}

export function isUnavailable<T extends { status: string }>(
  block: T | UnavailableBlock,
): block is UnavailableBlock {
  return block.status === "unavailable";
}
