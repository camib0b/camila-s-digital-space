import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { CHART_COLORS, allocationChartConfig } from "@/lib/chartTheme";
import type { AllocationChartPoint } from "@/types/portfolio";

interface AllocationChartProps {
  data: AllocationChartPoint[];
  emptyLabel: string;
}

const AllocationChart = ({ data, emptyLabel }: AllocationChartProps) => {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <ChartContainer config={allocationChartConfig} className="h-[200px] w-full">
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tick={{ fill: CHART_COLORS.tick, fontSize: 11 }}
          tickFormatter={(value) => `${value}%`}
        />
        <YAxis
          type="category"
          dataKey="ticker"
          axisLine={false}
          tickLine={false}
          tick={{ fill: CHART_COLORS.tick, fontSize: 11 }}
          width={48}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => `${value}%`}
              labelFormatter={(label) => String(label)}
            />
          }
        />
        <Bar dataKey="allocation" fill={CHART_COLORS.tertiary} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartContainer>
  );
};

export default AllocationChart;
