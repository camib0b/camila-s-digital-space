import { calendarDaysBetween } from "./dates";
import {
  annualizeCumulativeReturn,
  compoundGrowth,
} from "./statistics";

export interface ValuationPoint {
  date: string;
  portfolioValue: number;
  externalFlow: number;
}

export interface TimeWeightedReturnResult {
  dailyReturns: { date: string; dailyReturn: number }[];
  cumulativeReturn: number;
  calendarDayCount: number;
  annualizedReturn: number | null;
  annualizationLabel: string;
  cumulativePath: { date: string; cumulativeReturn: number }[];
}

/**
 * Start-of-day external-flow convention:
 * r_t = V_t / (V_{t-1} + F_t) − 1, with V_0 = 0 so r_1 = V_1 / F_1 − 1.
 */
export function timeWeightedReturn(points: readonly ValuationPoint[]): TimeWeightedReturnResult | null {
  if (points.length === 0) {
    return null;
  }
  const dailyReturns: { date: string; dailyReturn: number }[] = [];
  let previousValue = 0;
  for (const point of points) {
    const denominator = previousValue + point.externalFlow;
    if (!(denominator > 0) || !Number.isFinite(point.portfolioValue)) {
      return null;
    }
    dailyReturns.push({
      date: point.date,
      dailyReturn: point.portfolioValue / denominator - 1,
    });
    previousValue = point.portfolioValue;
  }

  const cumulativePath: { date: string; cumulativeReturn: number }[] = [];
  let growth = 1;
  for (const point of dailyReturns) {
    growth *= 1 + point.dailyReturn;
    cumulativePath.push({ date: point.date, cumulativeReturn: growth - 1 });
  }

  const first = points[0];
  const last = points[points.length - 1];
  if (first === undefined || last === undefined) {
    return null;
  }
  const calendarDayCount = calendarDaysBetween(first.date, last.date);
  const cumulativeReturn = compoundGrowth(dailyReturns.map((point) => point.dailyReturn));
  const annualizedReturn = annualizeCumulativeReturn(cumulativeReturn, calendarDayCount);
  return {
    dailyReturns,
    cumulativeReturn,
    calendarDayCount,
    annualizedReturn,
    annualizationLabel:
      annualizedReturn === null ? "not annualized (< 1 yr)" : "annualized, 365-day basis",
    cumulativePath,
  };
}

export interface CounterfactualPoint {
  date: string;
  value: number;
  totalReturnIndex: number;
}

export interface CounterfactualResult {
  series: CounterfactualPoint[];
  endValue: number;
}

/**
 * C_t = C_{t-1} * (TR_t / TR_{t-1}) + F_t, C_0 = 0.
 * A non-zero flow on a date without a total-return print is refused.
 */
export function vooCounterfactual(
  totalReturnByDate: ReadonlyMap<string, number>,
  externalFlowByDate: ReadonlyMap<string, number>,
): CounterfactualResult | { unavailableReason: string } {
  for (const [date, flow] of externalFlowByDate) {
    if (flow !== 0 && !totalReturnByDate.has(date)) {
      return {
        unavailableReason: `External flow on ${date} has no VOO total-return index, so the counterfactual was not filled in.`,
      };
    }
  }

  const dates = [...totalReturnByDate.keys()].sort();
  let value = 0;
  let previousTotalReturn: number | null = null;
  const series: CounterfactualPoint[] = [];
  for (const date of dates) {
    const totalReturnIndex = totalReturnByDate.get(date);
    if (totalReturnIndex === undefined || !(totalReturnIndex > 0)) {
      return { unavailableReason: `VOO total-return index is missing or not positive on ${date}.` };
    }
    const flow = externalFlowByDate.get(date) ?? 0;
    if (previousTotalReturn === null) {
      value = flow;
    } else {
      value = value * (totalReturnIndex / previousTotalReturn) + flow;
    }
    previousTotalReturn = totalReturnIndex;
    series.push({ date, value, totalReturnIndex });
  }

  const end = series[series.length - 1];
  if (end === undefined) {
    return { unavailableReason: "VOO total-return index is empty." };
  }
  return { series, endValue: end.value };
}

export function benchmarkTotalReturn(
  totalReturnByDate: ReadonlyMap<string, number>,
  startDate: string,
  endDate: string,
): number | { unavailableReason: string } {
  const start = totalReturnByDate.get(startDate);
  const end = totalReturnByDate.get(endDate);
  if (start === undefined) {
    return { unavailableReason: `VOO total-return index is missing on the first external-flow date ${startDate}.` };
  }
  if (end === undefined) {
    return { unavailableReason: `VOO total-return index is missing on ${endDate}.` };
  }
  if (!(start > 0) || !(end > 0)) {
    return { unavailableReason: "VOO total-return index is not positive." };
  }
  return end / start - 1;
}

export function cumulativeBenchmarkPath(
  totalReturnByDate: ReadonlyMap<string, number>,
  startDate: string,
): Map<string, number> {
  const start = totalReturnByDate.get(startDate);
  const path = new Map<string, number>();
  if (start === undefined || !(start > 0)) {
    return path;
  }
  for (const [date, totalReturnIndex] of totalReturnByDate) {
    if (date >= startDate && totalReturnIndex > 0) {
      path.set(date, totalReturnIndex / start - 1);
    }
  }
  return path;
}

export function maximumDrawdown(
  points: readonly { date: string; value: number }[],
): { peakDate: string; troughDate: string; drawdown: number } | null {
  const first = points[0];
  if (first === undefined || !(first.value > 0)) {
    return null;
  }
  let peakValue = first.value;
  let peakDate = first.date;
  let troughDate = first.date;
  let drawdownPeakDate = first.date;
  let drawdown = 0;
  for (const point of points) {
    if (!(point.value > 0)) {
      return null;
    }
    if (point.value > peakValue) {
      peakValue = point.value;
      peakDate = point.date;
    }
    const decline = point.value / peakValue - 1;
    if (decline < drawdown) {
      drawdown = decline;
      troughDate = point.date;
      drawdownPeakDate = peakDate;
    }
  }
  return { peakDate: drawdownPeakDate, troughDate, drawdown };
}
