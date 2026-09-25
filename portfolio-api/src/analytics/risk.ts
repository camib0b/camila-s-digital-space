import { calendarDaysBetween, isFriday } from "./dates";
import {
  dotProduct,
  multiplyMatrixVector,
  sampleCovarianceMatrix,
  scaleMatrix,
  sharpeRatio,
} from "./statistics";

export const WEEKLY_LOOKBACK = 156;
export const MINIMUM_WEEKLY_OBSERVATIONS = 52;
export const MINIMUM_DAILY_SHARPE_OBSERVATIONS = 252;
export const WEEKS_PER_YEAR = 52;
export const TRADING_DAYS_PER_YEAR = 252;
export const MAXIMUM_RISK_FREE_GAP_DAYS = 5;

export interface WeeklyReturnSeries {
  /** Week-ending Fridays, oldest first. */
  weekEndingDates: string[];
  /** Simple Friday-to-Friday total returns, aligned with `weekEndingDates`. */
  returns: number[];
}

/**
 * Friday-to-Friday simple returns. A pair is kept only when both Fridays exist
 * and are exactly 7 calendar days apart, so a holiday Friday is dropped instead
 * of being bridged or filled.
 */
export function fridayToFridayReturns(adjustedCloseByDate: ReadonlyMap<string, number>): WeeklyReturnSeries {
  const fridays = [...adjustedCloseByDate.keys()].filter(isFriday).sort();
  const weekEndingDates: string[] = [];
  const returns: number[] = [];
  for (let index = 1; index < fridays.length; index += 1) {
    const previousDate = fridays[index - 1];
    const date = fridays[index];
    if (previousDate === undefined || date === undefined) {
      continue;
    }
    if (calendarDaysBetween(previousDate, date) !== 7) {
      continue;
    }
    const previousClose = adjustedCloseByDate.get(previousDate);
    const close = adjustedCloseByDate.get(date);
    if (previousClose === undefined || close === undefined || !(previousClose > 0) || !(close > 0)) {
      continue;
    }
    weekEndingDates.push(date);
    returns.push(close / previousClose - 1);
  }
  return { weekEndingDates, returns };
}

export function trailingCommonWeeks(
  seriesByTicker: ReadonlyMap<string, WeeklyReturnSeries>,
  tickers: readonly string[],
): { weekEndingDates: string[]; returnsByTicker: Map<string, number[]> } | null {
  if (tickers.length === 0) {
    return null;
  }
  const firstTicker = tickers[0];
  if (firstTicker === undefined) {
    return null;
  }
  const firstSeries = seriesByTicker.get(firstTicker);
  if (firstSeries === undefined) {
    return null;
  }
  const commonDates = firstSeries.weekEndingDates.filter((date) =>
    tickers.every((ticker) => {
      const series = seriesByTicker.get(ticker);
      return series !== undefined && series.weekEndingDates.includes(date);
    }),
  );
  const trailingDates = commonDates.slice(-WEEKLY_LOOKBACK);
  const returnsByTicker = new Map<string, number[]>();
  for (const ticker of tickers) {
    const series = seriesByTicker.get(ticker);
    if (series === undefined) {
      return null;
    }
    const returnByDate = new Map<string, number>();
    for (let index = 0; index < series.weekEndingDates.length; index += 1) {
      const date = series.weekEndingDates[index];
      const weeklyReturn = series.returns[index];
      if (date !== undefined && weeklyReturn !== undefined) {
        returnByDate.set(date, weeklyReturn);
      }
    }
    const aligned: number[] = [];
    for (const date of trailingDates) {
      const weeklyReturn = returnByDate.get(date);
      if (weeklyReturn === undefined) {
        return null;
      }
      aligned.push(weeklyReturn);
    }
    returnsByTicker.set(ticker, aligned);
  }
  return { weekEndingDates: trailingDates, returnsByTicker };
}

export interface RiskContribution {
  ticker: string;
  weight: number;
  marginalContribution: number;
  componentContribution: number;
  percentContribution: number;
}

export interface RiskContributionResult {
  annualizedVolatility: number;
  contributions: RiskContribution[];
  weightsSum: number;
  componentContributionSum: number;
  percentContributionSum: number;
}

/**
 * Ex-ante risk with current weights and the annualized sample covariance.
 * Sigma_ann = 52 * Sigma_weekly. Component contributions sum to volatility.
 * Percent contributions sum to 1 and may be negative.
 */
export function riskContributions(
  tickers: readonly string[],
  weights: readonly number[],
  weeklyReturnsByColumn: readonly (readonly number[])[],
): RiskContributionResult {
  if (tickers.length !== weights.length || weeklyReturnsByColumn.length < 2) {
    throw new Error("Risk contribution inputs are inconsistent");
  }
  const weeklyCovariance = sampleCovarianceMatrix(weeklyReturnsByColumn);
  const annualizedCovariance = scaleMatrix(weeklyCovariance, WEEKS_PER_YEAR);
  const covarianceTimesWeight = multiplyMatrixVector(annualizedCovariance, weights);
  const variance = dotProduct(weights, covarianceTimesWeight);
  if (!(variance > 0)) {
    throw new Error("Portfolio variance is not positive");
  }
  const annualizedVolatility = Math.sqrt(variance);
  const contributions: RiskContribution[] = [];
  let weightsSum = 0;
  let componentContributionSum = 0;
  let percentContributionSum = 0;
  for (let index = 0; index < tickers.length; index += 1) {
    const ticker = tickers[index];
    const weight = weights[index];
    const covarianceComponent = covarianceTimesWeight[index];
    if (ticker === undefined || weight === undefined || covarianceComponent === undefined) {
      throw new Error("Risk contribution row is missing");
    }
    const marginalContribution = covarianceComponent / annualizedVolatility;
    const componentContribution = (weight * covarianceComponent) / annualizedVolatility;
    const percentContribution = (weight * covarianceComponent) / variance;
    weightsSum += weight;
    componentContributionSum += componentContribution;
    percentContributionSum += percentContribution;
    contributions.push({
      ticker,
      weight,
      marginalContribution,
      componentContribution,
      percentContribution,
    });
  }
  return {
    annualizedVolatility,
    contributions,
    weightsSum,
    componentContributionSum,
    percentContributionSum,
  };
}

export function weightedReturns(
  weights: readonly number[],
  weeklyReturnsByColumn: readonly (readonly number[])[],
): number[] {
  return weeklyReturnsByColumn.map((week) => {
    let total = 0;
    for (let index = 0; index < weights.length; index += 1) {
      const weight = weights[index];
      const assetReturn = week[index];
      if (weight === undefined || assetReturn === undefined) {
        throw new Error("Weekly return row is missing");
      }
      total += weight * assetReturn;
    }
    return total;
  });
}

export function holdingsSharpeRatio(
  portfolioReturns: readonly number[],
  riskFreeRates: readonly number[],
): number | null {
  return sharpeRatio(portfolioReturns, riskFreeRates, WEEKS_PER_YEAR);
}

export function realizedSharpeRatio(
  dailyReturns: readonly number[],
  riskFreeRates: readonly number[],
): number | null {
  return sharpeRatio(dailyReturns, riskFreeRates, TRADING_DAYS_PER_YEAR);
}

export interface RiskFreeObservation {
  date: string;
  /** Annual yield as a decimal, for example 0.041 for 4.1%. */
  annualYield: number;
}

/**
 * Latest official print on or before `date`, within a short gap.
 * A longer gap is refused rather than interpolated.
 */
export function matchAnnualYield(
  observations: readonly RiskFreeObservation[],
  date: string,
  maximumGapDays = MAXIMUM_RISK_FREE_GAP_DAYS,
): number | null {
  let matched: RiskFreeObservation | null = null;
  for (const observation of observations) {
    if (observation.date <= date) {
      matched = observation;
    } else {
      break;
    }
  }
  if (matched === null) {
    return null;
  }
  if (calendarDaysBetween(matched.date, date) > maximumGapDays) {
    return null;
  }
  return matched.annualYield;
}
