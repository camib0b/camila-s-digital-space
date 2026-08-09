import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  WEEKDAY_NAMES,
  dashboardStatValues,
  weeklyActivityHours,
} from "@/content/weeklyActivity";
import { CHART_COLORS } from "@/lib/chartTheme";

const Dashboard = () => {
  const { t, language } = useLanguage();
  const weekdayNames = WEEKDAY_NAMES[language];

  const weeklyActivity = weeklyActivityHours.map((hours, dayIndex) => ({
    day: weekdayNames[dayIndex],
    ...hours,
  }));

  const stats = [
    { label: t("dashboard.stats.yearsCoding"), value: dashboardStatValues.yearsCoding },
    { label: t("dashboard.stats.booksThisYear"), value: dashboardStatValues.booksThisYear },
    { label: t("dashboard.stats.internships"), value: dashboardStatValues.internships },
    { label: t("dashboard.stats.projects"), value: dashboardStatValues.projects },
  ];

  const chartConfig = {
    coding: { label: t("dashboard.coding"), color: CHART_COLORS.primary },
    hockey: { label: t("dashboard.hockey"), color: CHART_COLORS.secondary },
    study: { label: t("dashboard.study"), color: CHART_COLORS.muted },
  };

  return (
    <section id="dashboard" className="py-20 md:py-28 bg-background">
      <div className="container px-6 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider mb-2">
            {t("dashboard.label")}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-10">
            {t("dashboard.description")}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-medium text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="border border-border rounded-md p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
              {t("dashboard.weeklyActivity")}
            </p>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <AreaChart data={weeklyActivity}>
                <defs>
                  <linearGradient id="codingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="hockeyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS.secondary} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={CHART_COLORS.secondary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLORS.muted} stopOpacity={0.1} />
                    <stop offset="100%" stopColor={CHART_COLORS.muted} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: CHART_COLORS.tick, fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: CHART_COLORS.tick, fontSize: 11 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="coding"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={1.5}
                  fill="url(#codingGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="hockey"
                  stroke={CHART_COLORS.secondary}
                  strokeWidth={1.5}
                  fill="url(#hockeyGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="study"
                  stroke={CHART_COLORS.muted}
                  strokeWidth={1.5}
                  fill="url(#studyGradient)"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
