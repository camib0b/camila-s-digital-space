export function formatPercent(decimal: number, digits = 2): string {
  return `${(decimal * 100).toFixed(digits)}%`;
}

export function formatSignedPercent(decimal: number, digits = 2): string {
  const scaled = decimal * 100;
  const sign = scaled > 0 ? "+" : "";
  return `${sign}${scaled.toFixed(digits)}%`;
}

export function formatPercentagePoints(decimal: number, digits = 2): string {
  const scaled = decimal * 100;
  const sign = scaled > 0 ? "+" : "";
  return `${sign}${scaled.toFixed(digits)} pp`;
}

export function formatUsd(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function numberTone(value: number): string {
  if (value > 0) {
    return "text-number-positive";
  }
  if (value < 0) {
    return "text-number-negative";
  }
  return "text-foreground";
}

export function sourceTag(parts: readonly string[]): string {
  return `SRC: ${parts.filter((part) => part.length > 0).join(" · ")}`;
}
