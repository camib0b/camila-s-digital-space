export function arithmeticMean(values: readonly number[]): number {
  if (values.length === 0) {
    throw new Error("Mean requires at least one observation");
  }
  let total = 0;
  for (const value of values) {
    total += value;
  }
  return total / values.length;
}

/** Sample standard deviation, divisor n − 1. */
export function sampleStandardDeviation(values: readonly number[]): number {
  if (values.length < 2) {
    throw new Error("Sample standard deviation requires at least two observations");
  }
  const mean = arithmeticMean(values);
  let sumOfSquares = 0;
  for (const value of values) {
    const deviation = value - mean;
    sumOfSquares += deviation * deviation;
  }
  return Math.sqrt(sumOfSquares / (values.length - 1));
}

/**
 * Sample covariance matrix (divisor n − 1).
 * `observations[weekIndex][assetIndex]` are simple returns.
 */
export function sampleCovarianceMatrix(observations: readonly (readonly number[])[]): number[][] {
  const weekCount = observations.length;
  const firstWeek = observations[0];
  if (firstWeek === undefined || weekCount < 2) {
    throw new Error("Covariance requires at least two observations");
  }
  const assetCount = firstWeek.length;
  const means: number[] = [];
  for (let assetIndex = 0; assetIndex < assetCount; assetIndex += 1) {
    let total = 0;
    for (const week of observations) {
      const value = week[assetIndex];
      if (value === undefined) {
        throw new Error("Return matrix is ragged");
      }
      total += value;
    }
    means.push(total / weekCount);
  }

  const covariance: number[][] = [];
  for (let row = 0; row < assetCount; row += 1) {
    const covarianceRow: number[] = [];
    for (let column = 0; column < assetCount; column += 1) {
      let productSum = 0;
      for (const week of observations) {
        const rowValue = week[row];
        const columnValue = week[column];
        const rowMean = means[row];
        const columnMean = means[column];
        if (
          rowValue === undefined ||
          columnValue === undefined ||
          rowMean === undefined ||
          columnMean === undefined
        ) {
          throw new Error("Return matrix is ragged");
        }
        productSum += (rowValue - rowMean) * (columnValue - columnMean);
      }
      covarianceRow.push(productSum / (weekCount - 1));
    }
    covariance.push(covarianceRow);
  }
  return covariance;
}

export function scaleMatrix(matrix: readonly (readonly number[])[], factor: number): number[][] {
  return matrix.map((row) => row.map((value) => value * factor));
}

export function multiplyMatrixVector(
  matrix: readonly (readonly number[])[],
  vector: readonly number[],
): number[] {
  return matrix.map((row) => {
    let total = 0;
    for (let index = 0; index < vector.length; index += 1) {
      const rowValue = row[index];
      const vectorValue = vector[index];
      if (rowValue === undefined || vectorValue === undefined) {
        throw new Error("Matrix and vector dimensions differ");
      }
      total += rowValue * vectorValue;
    }
    return total;
  });
}

export function dotProduct(left: readonly number[], right: readonly number[]): number {
  let total = 0;
  for (let index = 0; index < left.length; index += 1) {
    const leftValue = left[index];
    const rightValue = right[index];
    if (leftValue === undefined || rightValue === undefined) {
      throw new Error("Vector lengths differ");
    }
    total += leftValue * rightValue;
  }
  return total;
}

/**
 * Sharpe ratio from paired simple returns and risk-free rates.
 * Arithmetic mean and sample standard deviation of excess returns, scaled once
 * by sqrt(periodsPerYear). Returns null when volatility is zero.
 */
export function sharpeRatio(
  returns: readonly number[],
  riskFreeRates: readonly number[],
  periodsPerYear: number,
): number | null {
  if (returns.length !== riskFreeRates.length || returns.length < 2) {
    throw new Error("Sharpe ratio requires paired observations");
  }
  const excessReturns: number[] = [];
  for (let index = 0; index < returns.length; index += 1) {
    const assetReturn = returns[index];
    const riskFreeRate = riskFreeRates[index];
    if (assetReturn === undefined || riskFreeRate === undefined) {
      throw new Error("Missing paired observation");
    }
    excessReturns.push(assetReturn - riskFreeRate);
  }
  const volatility = sampleStandardDeviation(excessReturns);
  if (volatility === 0) {
    return null;
  }
  return (arithmeticMean(excessReturns) / volatility) * Math.sqrt(periodsPerYear);
}

export function compoundGrowth(periodicReturns: readonly number[]): number {
  let growth = 1;
  for (const periodicReturn of periodicReturns) {
    growth *= 1 + periodicReturn;
  }
  return growth - 1;
}

export function annualizeCumulativeReturn(cumulativeReturn: number, calendarDayCount: number): number | null {
  if (calendarDayCount < 365) {
    return null;
  }
  return (1 + cumulativeReturn) ** (365 / calendarDayCount) - 1;
}

/** Convert a quoted annual yield (decimal) into a simple per-period rate. */
export function periodicRiskFreeRate(annualYield: number, periodsPerYear: number): number {
  return (1 + annualYield) ** (1 / periodsPerYear) - 1;
}
