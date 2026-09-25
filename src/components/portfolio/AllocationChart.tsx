import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CHART_COLORS, allocationChartConfig } from "@/lib/chartTheme";
import { fundNameForTicker } from "@/lib/tickerNames";
import type { AllocationChartPoint } from "@/types/portfolio";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface AllocationChartProps {
  data: AllocationChartPoint[];
  emptyLabel: string;
}

function AllocationTooltipLabel({ ticker }: { ticker: string }) {
  const fundName = fundNameForTicker(ticker);
  if (!fundName) {
    return ticker;
  }

  return (
    <span className="flex max-w-[14rem] flex-col gap-0.5">
      <span>{ticker}</span>
      <span className="text-[10px] font-normal leading-snug text-muted-foreground">{fundName}</span>
    </span>
  );
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
              labelFormatter={(label) => <AllocationTooltipLabel ticker={String(label)} />}
            />
          }
        />
        <Bar dataKey="allocation" fill={CHART_COLORS.tertiary} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartContainer>
  );
};

export default AllocationChart;
