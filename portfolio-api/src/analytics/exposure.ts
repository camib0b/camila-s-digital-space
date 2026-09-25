export interface SecurityWeight {
  isin: string;
  name: string;
  /** Fraction of the fund, not percent. */
  weight: number;
}

export interface FundSnapshot {
  fundTicker: string;
  name: string;
  isin: string | null;
  asOf: string;
  source: string;
  accession: string;
  assetClass: "equity" | "bond";
  lookThrough: boolean;
  holdings: SecurityWeight[];
}

export interface ExposurePosition {
  ticker: string;
  /** Weight of total portfolio value, including cash in the denominator. */
  weight: number;
  isin: string | null;
  assetClass: "stock" | "equity-fund" | "bond-fund";
  name: string;
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

export interface ExposureComputation {
  rows: LookThroughRow[];
  overlap: { fundA: string; fundB: string; overlap: number }[];
  apparentCompany: { ticker: string; name: string; isin: string; weight: number } | null;
  effectiveCompany: { name: string; isin: string; weight: number } | null;
  bondWeight: number;
  unattributedWeight: number;
  snapshotCoverage: { fundTicker: string; asOf: string; source: string; coverage: number }[];
}

export function pairwiseOverlap(
  leftHoldings: readonly SecurityWeight[],
  rightHoldings: readonly SecurityWeight[],
): number {
  const rightWeights = new Map<string, number>();
  for (const holding of rightHoldings) {
    rightWeights.set(holding.isin, (rightWeights.get(holding.isin) ?? 0) + holding.weight);
  }
  const leftWeights = new Map<string, number>();
  for (const holding of leftHoldings) {
    leftWeights.set(holding.isin, (leftWeights.get(holding.isin) ?? 0) + holding.weight);
  }
  const identifiers = new Set([...leftWeights.keys(), ...rightWeights.keys()]);
  let overlap = 0;
  for (const identifier of identifiers) {
    overlap += Math.min(leftWeights.get(identifier) ?? 0, rightWeights.get(identifier) ?? 0);
  }
  return overlap;
}

function aggregateHoldings(holdings: readonly SecurityWeight[]): SecurityWeight[] {
  const byIdentifier = new Map<string, SecurityWeight>();
  for (const holding of holdings) {
    const current = byIdentifier.get(holding.isin);
    if (current === undefined) {
      byIdentifier.set(holding.isin, { ...holding });
    } else {
      current.weight += holding.weight;
    }
  }
  return [...byIdentifier.values()];
}

export function computeLookThrough(
  positions: readonly ExposurePosition[],
  snapshots: readonly FundSnapshot[],
): ExposureComputation {
  const snapshotsByTicker = new Map(snapshots.map((snapshot) => [snapshot.fundTicker, snapshot]));
  const rowsByIsin = new Map<string, LookThroughRow>();
  let bondWeight = 0;
  let unattributedWeight = 0;
  const snapshotCoverage: ExposureComputation["snapshotCoverage"] = [];
  const equityFunds: { ticker: string; holdings: SecurityWeight[] }[] = [];

  const addContribution = (isin: string, name: string, source: string, weight: number) => {
    if (!(Math.abs(weight) > 0)) {
      return;
    }
    const current = rowsByIsin.get(isin);
    if (current === undefined) {
      rowsByIsin.set(isin, {
        isin,
        name,
        weight,
        contributions: [{ source, weight }],
      });
      return;
    }
    current.weight += weight;
    const existing = current.contributions.find((contribution) => contribution.source === source);
    if (existing === undefined) {
      current.contributions.push({ source, weight });
    } else {
      existing.weight += weight;
    }
  };

  for (const position of positions) {
    if (position.assetClass === "bond-fund") {
      bondWeight += position.weight;
      continue;
    }
    if (position.assetClass === "stock") {
      if (position.isin === null) {
        unattributedWeight += position.weight;
        continue;
      }
      addContribution(position.isin, position.name, "direct", position.weight);
      continue;
    }

    const snapshot = snapshotsByTicker.get(position.ticker);
    if (snapshot === undefined || !snapshot.lookThrough) {
      unattributedWeight += position.weight;
      continue;
    }
    const holdings = aggregateHoldings(snapshot.holdings);
    equityFunds.push({ ticker: position.ticker, holdings });
    let coverage = 0;
    for (const holding of holdings) {
      coverage += holding.weight;
      addContribution(holding.isin, holding.name, position.ticker, position.weight * holding.weight);
    }
    const residual = 1 - coverage;
    if (residual > 1e-8) {
      unattributedWeight += position.weight * residual;
    }
    snapshotCoverage.push({
      fundTicker: position.ticker,
      asOf: snapshot.asOf,
      source: snapshot.source,
      coverage,
    });
  }

  const overlap: ExposureComputation["overlap"] = [];
  for (let leftIndex = 0; leftIndex < equityFunds.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < equityFunds.length; rightIndex += 1) {
      const left = equityFunds[leftIndex];
      const right = equityFunds[rightIndex];
      if (left === undefined || right === undefined) {
        continue;
      }
      overlap.push({
        fundA: left.ticker,
        fundB: right.ticker,
        overlap: pairwiseOverlap(left.holdings, right.holdings),
      });
    }
  }

  const rows = [...rowsByIsin.values()].sort((left, right) => right.weight - left.weight);
  const apparent = positions
    .filter((position) => position.assetClass === "stock" && position.isin !== null)
    .sort((left, right) => right.weight - left.weight)[0];
  const effective = rows[0];

  return {
    rows,
    overlap,
    apparentCompany:
      apparent === undefined || apparent.isin === null
        ? null
        : { ticker: apparent.ticker, name: apparent.name, isin: apparent.isin, weight: apparent.weight },
    effectiveCompany:
      effective === undefined
        ? null
        : { name: effective.name, isin: effective.isin, weight: effective.weight },
    bondWeight,
    unattributedWeight,
    snapshotCoverage,
  };
}
