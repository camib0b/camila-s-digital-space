import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

// Mock portfolio performance data (monthly)
const portfolioData = [
  { month: "Jan", value: 10000, benchmark: 10000 },
  { month: "Feb", value: 10320, benchmark: 10150 },
  { month: "Mar", value: 10180, benchmark: 10050 },
  { month: "Apr", value: 10650, benchmark: 10280 },
  { month: "May", value: 11200, benchmark: 10450 },
  { month: "Jun", value: 10980, benchmark: 10380 },
  { month: "Jul", value: 11450, benchmark: 10600 },
  { month: "Aug", value: 11820, benchmark: 10720 },
  { month: "Sep", value: 12100, benchmark: 10900 },
  { month: "Oct", value: 11950, benchmark: 10850 },
  { month: "Nov", value: 12400, benchmark: 11050 },
  { month: "Dec", value: 12850, benchmark: 11200 },
];

// Holdings breakdown
const holdings = [
  { name: "US Equities", allocation: 35, return: 14.2, trend: "up" as const },
  { name: "Intl Equities", allocation: 20, return: 8.7, trend: "up" as const },
  { name: "Fixed Income", allocation: 15, return: 3.1, trend: "up" as const },
  { name: "Real Estate", allocation: 10, return: -2.4, trend: "down" as const },
  { name: "Crypto", allocation: 10, return: 22.5, trend: "up" as const },
  { name: "Cash", allocation: 10, return: 0.5, trend: "flat" as const },
];

// Business ROI data
const businessROI = [
  { name: "AVA", invested: 2500, returned: 0, roi: -100, status: "Building" },
  { name: "Freelance Dev", invested: 0, returned: 4800, roi: Infinity, status: "Active" },
  { name: "Hockey Coaching", invested: 200, returned: 1800, roi: 800, status: "Active" },
];

// Monthly returns for bar chart
const monthlyReturns = [
  { month: "Jan", return: 3.2 },
  { month: "Feb", return: -1.3 },
  { month: "Mar", return: 4.6 },
  { month: "Apr", return: 5.2 },
  { month: "May", return: -2.0 },
  { month: "Jun", return: 4.3 },
  { month: "Jul", return: 3.2 },
  { month: "Aug", return: 2.4 },
  { month: "Sep", return: -1.2 },
  { month: "Oct", return: 3.8 },
  { month: "Nov", return: 3.6 },
  { month: "Dec", return: 0 },
];

const TrendIcon = ({ trend }: { trend: "up" | "down" | "flat" }) => {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />;
  if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
};

const Portfolio = () => {
  const { t } = useLanguage();
  const totalValue = 12850;
  const totalReturn = ((totalValue - 10000) / 10000 * 100).toFixed(1);

  return (
    <main className="min-h-screen bg-background relative">
      {/* Subtle OSRS-inspired parchment texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      {/* Stone-like grain */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23000' fill-opacity='1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
        }}
      />

      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container px-6 md:px-8 max-w-3xl mx-auto flex items-center justify-between h-12">
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3 h-3" />
            home
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </div>

      <div className="container px-6 md:px-8 max-w-3xl mx-auto py-16 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
            grand exchange
          </p>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">investment portfolio</h1>
          <p className="text-sm text-muted-foreground max-w-md">
            Tracking investments, side-business returns, and overall financial performance.
          </p>
        </div>

        {/* Summary stats — stone tablet style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden mb-12 ring-1 ring-border">
          {[
            { label: "Portfolio Value", value: `$${totalValue.toLocaleString()}` },
            { label: "Total Return", value: `+${totalReturn}%` },
            { label: "YTD Return", value: "+28.5%" },
            { label: "Holdings", value: `${holdings.length}` },
          ].map((stat) => (
            <div key={stat.label} className="bg-card p-4 text-center">
              <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">
                {stat.label}
              </p>
              <p className="text-lg font-semibold tracking-tight">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main chart — Portfolio Performance */}
        <section className="mb-12">
          <h2 className="text-sm font-medium mb-1">portfolio performance</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Portfolio vs benchmark (S&P 500), starting at $10,000
          </p>
          <div className="bg-card rounded-lg ring-1 ring-border p-4 md:p-6">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={portfolioData}>
                <defs>
                  <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(142, 50%, 40%)" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="hsl(142, 50%, 40%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 10%, 90%)" strokeOpacity={0.5} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "hsl(220, 8%, 46%)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "hsl(220, 8%, 46%)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(220, 14%, 98%)",
                    border: "1px solid hsl(220, 10%, 90%)",
                    borderRadius: "6px",
                    fontSize: "11px",
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(142, 50%, 35%)"
                  strokeWidth={2}
                  fill="url(#portfolioGrad)"
                  name="Portfolio"
                />
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  stroke="hsl(220, 8%, 60%)"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  name="S&P 500"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Monthly Returns */}
        <section className="mb-12">
          <h2 className="text-sm font-medium mb-1">monthly returns</h2>
          <p className="text-xs text-muted-foreground mb-4">Percentage gain/loss per month</p>
          <div className="bg-card rounded-lg ring-1 ring-border p-4 md:p-6">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyReturns}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 10%, 90%)" strokeOpacity={0.5} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "hsl(220, 8%, 46%)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "hsl(220, 8%, 46%)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(220, 14%, 98%)",
                    border: "1px solid hsl(220, 10%, 90%)",
                    borderRadius: "6px",
                    fontSize: "11px",
                  }}
                  formatter={(value: number) => [`${value}%`, "Return"]}
                />
                <Bar
                  dataKey="return"
                  fill="hsl(220, 14%, 28%)"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Holdings Table */}
        <section className="mb-12">
          <h2 className="text-sm font-medium mb-1">holdings</h2>
          <p className="text-xs text-muted-foreground mb-4">Current asset allocation</p>
          <div className="bg-card rounded-lg ring-1 ring-border overflow-hidden">
            <div className="grid grid-cols-4 text-[10px] tracking-[0.1em] uppercase text-muted-foreground px-4 py-2.5 border-b border-border bg-muted/30">
              <span>Asset</span>
              <span className="text-right">Allocation</span>
              <span className="text-right">Return</span>
              <span className="text-right">Trend</span>
            </div>
            {holdings.map((h, i) => (
              <div
                key={h.name}
                className={`grid grid-cols-4 items-center px-4 py-3 text-sm ${
                  i < holdings.length - 1 ? "border-b border-border/50" : ""
                }`}
              >
                <span className="font-medium text-xs">{h.name}</span>
                <span className="text-right text-xs text-muted-foreground">{h.allocation}%</span>
                <span
                  className={`text-right text-xs font-medium ${
                    h.return >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {h.return >= 0 ? "+" : ""}
                  {h.return}%
                </span>
                <span className="flex justify-end">
                  <TrendIcon trend={h.trend} />
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Business ROI */}
        <section className="mb-16">
          <h2 className="text-sm font-medium mb-1">business roi</h2>
          <p className="text-xs text-muted-foreground mb-4">Side ventures and their returns</p>
          <div className="space-y-3">
            {businessROI.map((b) => (
              <div
                key={b.name}
                className="bg-card rounded-lg ring-1 ring-border p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{b.name}</p>
                  <p className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground mt-0.5">
                    {b.status}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    ${b.invested.toLocaleString()} → ${b.returned.toLocaleString()}
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      b.roi > 0
                        ? "text-green-600 dark:text-green-400"
                        : b.roi === 0
                        ? "text-muted-foreground"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {b.roi === Infinity
                      ? "∞ ROI"
                      : b.roi === -100
                      ? "Pre-revenue"
                      : `+${b.roi}% ROI`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer note */}
        <div className="border-t border-border pt-6 text-center">
          <p className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground">
            All figures are illustrative · Updated quarterly
          </p>
        </div>
      </div>
    </main>
  );
};

export default Portfolio;
