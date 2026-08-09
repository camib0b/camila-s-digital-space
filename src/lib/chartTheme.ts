export const CHART_COLORS = {
  primary: "hsl(220 14% 28%)",
  secondary: "hsl(220 14% 50%)",
  tertiary: "hsl(220 14% 40%)",
  muted: "hsl(220 14% 72%)",
  tick: "hsl(220 8% 46%)",
} as const;

export const performanceChartConfig = {
  value: { label: "Portfolio value", color: CHART_COLORS.primary },
};

export const monthlyReturnsChartConfig = {
  returnPct: { label: "Monthly return", color: CHART_COLORS.secondary },
};

export const allocationChartConfig = {
  allocation: { label: "Allocation", color: CHART_COLORS.tertiary },
};
