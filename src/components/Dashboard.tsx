import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";
import { Code, Trophy, Briefcase, BookOpen, Zap, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const { t, language } = useLanguage();

  const getDayName = (index: number) => {
    if (language === "es") {
      const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
      return days[index];
    } else if (language === "fr") {
      const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
      return days[index];
    } else {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return days[index];
    }
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

  const skillsRadial = [
    { name: t("dashboard.frontend"), value: 85, fill: "hsl(38 90% 55%)" },
    { name: t("dashboard.backend"), value: 65, fill: "hsl(38 70% 45%)" },
    { name: t("dashboard.design"), value: 70, fill: "hsl(38 50% 40%)" },
  ];

  const metrics = [
    {
      label: t("dashboard.degreeProgress"),
      value: 80,
      detail: t("dashboard.degreeProgressDetail"),
      icon: Target,
    },
    {
      label: t("dashboard.internshipsLabel"),
      value: 100,
      detail: t("dashboard.internshipsDetail"),
      icon: Briefcase,
    },
    {
      label: t("dashboard.hockeyYears"),
      value: 75,
      detail: t("dashboard.hockeyYearsDetail"),
      icon: Trophy,
    },
    {
      label: t("dashboard.sideProjects"),
      value: 60,
      detail: t("dashboard.sideProjectsDetail"),
      icon: Zap,
    },
  ];

  const stats = [
    { label: t("dashboard.stats.yearsCoding"), value: "4+", icon: Code },
    { label: t("dashboard.stats.booksThisYear"), value: "12", icon: BookOpen },
    { label: t("dashboard.stats.internships"), value: "3", icon: Briefcase },
    { label: t("dashboard.stats.projects"), value: "8+", icon: Zap },
  ];

  const chartConfig = {
    coding: {
      label: t("dashboard.coding"),
      color: "hsl(38 90% 55%)",
    },
    hockey: {
      label: t("dashboard.hockey"),
      color: "hsl(38 70% 45%)",
    },
    study: {
      label: t("dashboard.study"),
      color: "hsl(38 50% 35%)",
    },
  };

  return (
    <section id="dashboard" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-2xl mb-16 animate-fade-in">
          <span className="text-primary text-sm tracking-widest uppercase mb-4 block">
            {t("dashboard.label")}
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
            {t("dashboard.title")}
          </h2>
          <p className="text-muted-foreground">
            {t("dashboard.description")}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card 
              key={stat.label} 
              className="bg-card/50 border-border/50 backdrop-blur-sm hover:border-primary/30 transition-colors duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-display text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Weekly Activity Chart */}
          <Card className="md:col-span-2 bg-card/50 border-border/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-display text-foreground">
                {t("dashboard.weeklyActivity")}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{t("dashboard.weeklyActivityDesc")}</p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <AreaChart data={weeklyActivity}>
                  <defs>
                    <linearGradient id="codingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(38 90% 55%)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(38 90% 55%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="hockeyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(38 70% 45%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(38 70% 45%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(38 50% 35%)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(38 50% 35%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: 'hsl(40 10% 55%)', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: 'hsl(40 10% 55%)', fontSize: 12 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="coding"
                    stroke="hsl(38 90% 55%)"
                    strokeWidth={2}
                    fill="url(#codingGradient)"
                    stackId="1"
                  />
                  <Area
                    type="monotone"
                    dataKey="hockey"
                    stroke="hsl(38 70% 45%)"
                    strokeWidth={2}
                    fill="url(#hockeyGradient)"
                    stackId="2"
                  />
                  <Area
                    type="monotone"
                    dataKey="study"
                    stroke="hsl(38 50% 35%)"
                    strokeWidth={2}
                    fill="url(#studyGradient)"
                    stackId="3"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Skills Radial */}
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-display text-foreground">
                {t("dashboard.skillFocus")}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{t("dashboard.skillFocusDesc")}</p>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="30%"
                    outerRadius="90%"
                    data={skillsRadial}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      dataKey="value"
                      cornerRadius={4}
                      background={{ fill: 'hsl(20 8% 12%)' }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-2">
                {skillsRadial.map((skill) => (
                  <div key={skill.name} className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: skill.fill }}
                    />
                    <span className="text-xs text-muted-foreground">{skill.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {metrics.map((metric, index) => (
            <Card 
              key={metric.label}
              className="bg-card/50 border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group"
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{metric.label}</span>
                  <metric.icon className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
                </div>
                <Progress 
                  value={metric.value} 
                  className="h-2 mb-2 bg-secondary"
                />
                <p className="text-xs text-muted-foreground">{metric.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
