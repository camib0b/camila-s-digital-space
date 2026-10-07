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

/** Axis ticks for /capital charts. Colors stay on the existing theme tokens. */
export const chartAxisTick = {
  fill: "hsl(var(--muted-foreground))",
  fontSize: 11,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
} as const;

export const chartTooltipClassName =
  "border border-border bg-background px-2 py-1.5 font-mono text-[11px] text-foreground";
