import { RefreshCw } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { CHART_COLORS, monthlyReturnsChartConfig } from "@/lib/chartTheme";
import { formatMonthLabel } from "@/lib/portfolioMetrics";
import type { MonthlyReturnPoint } from "@/types/portfolio";

interface MonthlyReturnsChartProps {
  monthlyReturns: MonthlyReturnPoint[] | undefined;
  loading: boolean;
  loadingLabel: string;
  emptyLabel: string;
}

const MonthlyReturnsChart = ({
  monthlyReturns,
  loading,
  loadingLabel,
  emptyLabel,
}: MonthlyReturnsChartProps) => {
  if (loading) {
    return (
      <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
        {loadingLabel}
      </div>
    );
  }

  if (!monthlyReturns || monthlyReturns.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <ChartContainer config={monthlyReturnsChartConfig} className="h-[200px] w-full">
      <BarChart data={monthlyReturns}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="month"
          tickFormatter={formatMonthLabel}
          axisLine={false}
          tickLine={false}
          tick={{ fill: CHART_COLORS.tick, fontSize: 11 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: CHART_COLORS.tick, fontSize: 11 }}
          tickFormatter={(value) => `${value}%`}
          width={40}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => `${Number(value) >= 0 ? "+" : ""}${value}%`}
              labelFormatter={(label) => formatMonthLabel(String(label))}
            />
          }
        />
        <Bar dataKey="returnPct" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
};

export default MonthlyReturnsChart;
