import { RefreshCw } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { CHART_COLORS, performanceChartConfig } from "@/lib/chartTheme";
import { formatChartDate, formatCurrency } from "@/lib/portfolioMetrics";
import type { PortfolioHistoryPoint } from "@/types/portfolio";

interface PortfolioValueChartProps {
  history: PortfolioHistoryPoint[] | undefined;
  loading: boolean;
  error: string | null;
  loadingLabel: string;
  emptyLabel: string;
}

const PortfolioValueChart = ({
  history,
  loading,
  error,
  loadingLabel,
  emptyLabel,
}: PortfolioValueChartProps) => {
  if (loading) {
    return (
      <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
        {loadingLabel}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-600 dark:text-red-400">{error}</p>;
  }

  if (!history || history.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <ChartContainer config={performanceChartConfig} className="h-[220px] w-full">
      <AreaChart data={history}>
        <defs>
          <linearGradient id="portfolioValueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.25} />
            <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatChartDate}
          axisLine={false}
          tickLine={false}
          tick={{ fill: CHART_COLORS.tick, fontSize: 11 }}
          minTickGap={24}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: CHART_COLORS.tick, fontSize: 11 }}
          tickFormatter={(value) => `$${value}`}
          width={56}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => formatCurrency(Number(value))}
              labelFormatter={(label) => String(label)}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={CHART_COLORS.primary}
          strokeWidth={1.5}
          fill="url(#portfolioValueGradient)"
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default PortfolioValueChart;
