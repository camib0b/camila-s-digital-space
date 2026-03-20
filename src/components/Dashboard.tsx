import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const { t, language } = useLanguage();

  const getDayName = (index: number) => {
    if (language === "es") {
      return ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"][index];
    }
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index];
  };

  const weeklyActivity = [
    { day: getDayName(0), coding: 4, hockey: 2, study: 3 },
    { day: getDayName(1), coding: 6, hockey: 0, study: 4 },
    { day: getDayName(2), coding: 5, hockey: 2, study: 2 },
    { day: getDayName(3), coding: 7, hockey: 0, study: 3 },
    { day: getDayName(4), coding: 4, hockey: 2, study: 2 },
    { day: getDayName(5), coding: 2, hockey: 3, study: 1 },
    { day: getDayName(6), coding: 1, hockey: 2, study: 0 },
  ];

  const stats = [
    { label: t("dashboard.stats.yearsCoding"), value: "4+" },
    { label: t("dashboard.stats.booksThisYear"), value: "12" },
    { label: t("dashboard.stats.internships"), value: "3" },
    { label: t("dashboard.stats.projects"), value: "8+" },
  ];

  const chartConfig = {
    coding: { label: t("dashboard.coding"), color: "hsl(220 14% 28%)" },
    hockey: { label: t("dashboard.hockey"), color: "hsl(220 14% 50%)" },
    study: { label: t("dashboard.study"), color: "hsl(220 14% 72%)" },
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

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-medium text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="border border-border rounded-md p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
              {t("dashboard.weeklyActivity")}
            </p>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <AreaChart data={weeklyActivity}>
                <defs>
                  <linearGradient id="codingG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(220 14% 28%)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(220 14% 28%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="hockeyG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(220 14% 50%)" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="hsl(220 14% 50%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="studyG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(220 14% 72%)" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="hsl(220 14% 72%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(220 8% 46%)', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(220 8% 46%)', fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="coding" stroke="hsl(220 14% 28%)" strokeWidth={1.5} fill="url(#codingG)" />
                <Area type="monotone" dataKey="hockey" stroke="hsl(220 14% 50%)" strokeWidth={1.5} fill="url(#hockeyG)" />
                <Area type="monotone" dataKey="study" stroke="hsl(220 14% 72%)" strokeWidth={1.5} fill="url(#studyG)" />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
