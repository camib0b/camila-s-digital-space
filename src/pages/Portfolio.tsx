import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw, Sparkles } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import AiInsightContent from "@/components/AiInsightContent";
import { useLanguage } from "@/contexts/LanguageContext";
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
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { useState, useEffect, useMemo } from "react";

interface Stock {
  ticker: string;
  shares: number;
  totalCost: number;
  currentPrice: number;
  changePercent: number;
  currentValue: number;
}

interface AiModelOption {
  id: string;
  label: string;
}

interface PortfolioResponse {
  totalValue: string;
  totalInvested: string;
  totalGain: string;
  totalReturnPct: string;
  stocks: Stock[];
  aiInsight: string | null;
  lastUpdated: string;
  count: number;
  aiModels?: AiModelOption[];
}

interface PortfolioHistoryPoint {
  date: string;
  value: number;
}

interface MonthlyReturnPoint {
  month: string;
  returnPct: number;
}

interface PortfolioHistoryResponse {
  portfolioHistory: PortfolioHistoryPoint[];
  monthlyReturns: MonthlyReturnPoint[];
  lastUpdated: string;
}

const API_URL = "https://portfolio-api.camilaescuderob.workers.dev/api/portfolio";
const HISTORY_URL = `${API_URL}/history`;
const AI_INSIGHT_URL = `${API_URL}/ai-insight`;

const DEFAULT_AI_MODELS: AiModelOption[] = [{ id: "grok", label: "Grok (xAI)" }];

const performanceChartConfig = {
  value: { label: "Portfolio value", color: "hsl(220 14% 28%)" },
};

const monthlyReturnsChartConfig = {
  returnPct: { label: "Monthly return", color: "hsl(220 14% 50%)" },
};

const allocationChartConfig = {
  allocation: { label: "Allocation", color: "hsl(220 14% 40%)" },
};

function formatChartDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${month}/${day}`;
}

function formatMonthLabel(month: string) {
  const [year, monthNumber] = month.split("-");
  const date = new Date(Number(year), Number(monthNumber) - 1, 1);
  return date.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

const Portfolio = () => {
  const { language, t } = useLanguage();

  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [history, setHistory] = useState<PortfolioHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [aiInsightLoading, setAiInsightLoading] = useState(false);
  const [aiInsightError, setAiInsightError] = useState<string | null>(null);
  const [insightProvider, setInsightProvider] = useState<string | null>(null);

  useEffect(() => {
    setPortfolio((previous) => (previous ? { ...previous, aiInsight: null } : previous));
    setInsightProvider(null);
    setAiInsightError(null);
  }, [language]);

  const fetchPortfolio = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al cargar el portafolio");
      const data: PortfolioResponse = await response.json();
      setPortfolio((previous) => ({
        ...data,
        aiInsight:
          data.aiInsight !== null && data.aiInsight !== undefined
            ? data.aiInsight
            : previous?.aiInsight ?? null,
      }));
      setError(null);
      setAiInsightError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar el portafolio");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await fetch(HISTORY_URL);
      if (!response.ok) throw new Error("Error al cargar el historial del portafolio");
      const data: PortfolioHistoryResponse = await response.json();
      setHistory(data);
      setHistoryError(null);
    } catch (err: unknown) {
      setHistoryError(err instanceof Error ? err.message : "Error al cargar el historial");
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchAiInsight = async () => {
    setAiInsightLoading(true);
    setAiInsightError(null);
    try {
      const response = await fetch(AI_INSIGHT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "grok", language }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(typeof payload.error === "string" ? payload.error : "No se pudo generar el insight");
      }
      const aiInsightText = payload.aiInsight as string;
      const insightLastUpdated = payload.lastUpdated as string | undefined;
      const provider = typeof payload.provider === "string" ? payload.provider : null;
      setInsightProvider(provider);
      setPortfolio((previous) =>
        previous
          ? {
              ...previous,
              aiInsight: aiInsightText,
              lastUpdated: insightLastUpdated ?? previous.lastUpdated,
            }
          : previous
      );
    } catch (err: unknown) {
      setAiInsightError(err instanceof Error ? err.message : "No se pudo generar el insight");
    } finally {
      setAiInsightLoading(false);
    }
  };

  useEffect(() => {
    const loadPortfolio = async () => {
      await fetchPortfolio(true);
      await fetchHistory();
    };

    loadPortfolio();
    const interval = setInterval(() => fetchPortfolio(false), 60000);
    return () => clearInterval(interval);
  }, []);

  const holdingsWithAllocation = useMemo(() => {
    if (!portfolio) return [];
    const totalValueNum = parseFloat(portfolio.totalValue);
    return portfolio.stocks.map((stock) => ({
      ...stock,
      allocation: totalValueNum > 0 ? ((stock.currentValue / totalValueNum) * 100).toFixed(1) : "0.0",
      gainPct:
        stock.totalCost > 0
          ? (((stock.currentValue - stock.totalCost) / stock.totalCost) * 100).toFixed(2)
          : "0.00",
    }));
  }, [portfolio]);

  const allocationChartData = useMemo(
    () =>
      holdingsWithAllocation.map((holding) => ({
        ticker: holding.ticker,
        allocation: parseFloat(holding.allocation),
      })),
    [holdingsWithAllocation]
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Cargando portafolio en vivo...</span>
        </div>
      </main>
    );
  }

  if (error || !portfolio) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </main>
    );
  }

  const totalReturnPct = parseFloat(portfolio.totalReturnPct);
  const totalReturnLabel = `${totalReturnPct >= 0 ? "+" : ""}${totalReturnPct}%`;
  const availableAiModels =
    portfolio.aiModels && portfolio.aiModels.length > 0 ? portfolio.aiModels : DEFAULT_AI_MODELS;
  const showModelSelector = availableAiModels.length > 1;

  return (
    <main className="min-h-screen bg-background relative">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23000' fill-opacity='1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
        }}
      />

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
        <div className="mb-12">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">grand exchange</p>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">investment portfolio</h1>
          <p className="text-sm text-muted-foreground">
            Datos en tiempo real • Última actualización: {new Date(portfolio.lastUpdated).toLocaleTimeString()}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden mb-12 ring-1 ring-border">
          {[
            { label: "Portfolio Value", value: `$${parseFloat(portfolio.totalValue).toLocaleString()}` },
            {
              label: "Total Return",
              value: totalReturnLabel,
              className:
                totalReturnPct >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
            },
            { label: "Total Invested", value: `$${parseFloat(portfolio.totalInvested).toLocaleString()}` },
            { label: "Holdings", value: portfolio.count.toString() },
          ].map((stat) => (
            <div key={stat.label} className="bg-card p-4 text-center">
              <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-lg font-semibold tracking-tight ${stat.className ?? ""}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <section className="mb-12 space-y-6">
          <div className="bg-card rounded-lg ring-1 ring-border p-6">
            <h2 className="text-sm font-medium mb-1">portfolio performance</h2>
            <p className="text-xs text-muted-foreground mb-4">Valor total del portafolio con precios históricos de Finnhub</p>
            {historyLoading ? (
              <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                Cargando historial...
              </div>
            ) : historyError ? (
              <p className="text-sm text-red-600 dark:text-red-400">{historyError}</p>
            ) : history && history.portfolioHistory.length > 0 ? (
              <ChartContainer config={performanceChartConfig} className="h-[220px] w-full">
                <AreaChart data={history.portfolioHistory}>
                  <defs>
                    <linearGradient id="portfolioValueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(220 14% 28%)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="hsl(220 14% 28%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatChartDate}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(220 8% 46%)", fontSize: 11 }}
                    minTickGap={24}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(220 8% 46%)", fontSize: 11 }}
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
                    stroke="hsl(220 14% 28%)"
                    strokeWidth={1.5}
                    fill="url(#portfolioValueGradient)"
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <p className="text-sm text-muted-foreground">No hay datos históricos disponibles.</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg ring-1 ring-border p-6">
              <h2 className="text-sm font-medium mb-1">monthly returns</h2>
              <p className="text-xs text-muted-foreground mb-4">Cambio mensual del valor del portafolio</p>
              {historyLoading ? (
                <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Cargando...
                </div>
              ) : history && history.monthlyReturns.length > 0 ? (
                <ChartContainer config={monthlyReturnsChartConfig} className="h-[200px] w-full">
                  <BarChart data={history.monthlyReturns}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickFormatter={formatMonthLabel}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(220 8% 46%)", fontSize: 11 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(220 8% 46%)", fontSize: 11 }}
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
                    <Bar dataKey="returnPct" fill="hsl(220 14% 50%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <p className="text-sm text-muted-foreground">Sin retornos mensuales aún.</p>
              )}
            </div>

            <div className="bg-card rounded-lg ring-1 ring-border p-6">
              <h2 className="text-sm font-medium mb-1">allocation</h2>
              <p className="text-xs text-muted-foreground mb-4">Distribución actual por ticker</p>
              {allocationChartData.length > 0 ? (
                <ChartContainer config={allocationChartConfig} className="h-[200px] w-full">
                  <BarChart data={allocationChartData} layout="vertical" margin={{ left: 8, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(220 8% 46%)", fontSize: 11 }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <YAxis
                      type="category"
                      dataKey="ticker"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(220 8% 46%)", fontSize: 11 }}
                      width={48}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent formatter={(value) => `${value}%`} labelFormatter={(label) => String(label)} />
                      }
                    />
                    <Bar dataKey="allocation" fill="hsl(220 14% 40%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <p className="text-sm text-muted-foreground">Sin posiciones abiertas.</p>
              )}
            </div>
          </div>
        </section>

        <div className="mb-12 bg-card rounded-lg ring-1 ring-border p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-3">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">{t("portfolio.aiInsight.label")}</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              {showModelSelector && (
                <label className="flex flex-col gap-1 text-[10px] uppercase tracking-wider text-muted-foreground sm:min-w-[200px]">
                  {t("portfolio.aiInsight.model")}
                  <select
                    value={selectedAiModel}
                    onChange={(event) => setSelectedAiModel(event.target.value)}
                    disabled={aiInsightLoading}
                    className="text-xs font-normal normal-case tracking-normal h-9 rounded-md border border-border bg-background px-2 text-foreground"
                  >
                    {availableAiModels.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <button
                type="button"
                onClick={fetchAiInsight}
                disabled={aiInsightLoading}
                className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md text-xs font-medium bg-foreground text-background hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none transition-opacity"
              >
                {aiInsightLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    {t("portfolio.aiInsight.generating")}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    {t("portfolio.aiInsight.generate")}
                  </>
                )}
              </button>
            </div>
          </div>
          {aiInsightError && <p className="text-sm text-red-600 dark:text-red-400 mb-3">{aiInsightError}</p>}
          {portfolio.aiInsight ? (
            <div className="space-y-3">
              <AiInsightContent content={portfolio.aiInsight} />
              {insightProvider && (
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {t("portfolio.aiInsight.via")} {insightProvider}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-muted-foreground">{t("portfolio.aiInsight.placeholder")}</p>
          )}
        </div>

        <section className="mb-12">
          <h2 className="text-sm font-medium mb-1">holdings</h2>
          <p className="text-xs text-muted-foreground mb-4">Tus acciones en tiempo real</p>
          <div className="bg-card rounded-lg ring-1 ring-border overflow-hidden">
            <div className="grid grid-cols-5 text-[10px] tracking-[0.1em] uppercase text-muted-foreground px-4 py-2.5 border-b border-border bg-muted/30">
              <span>Ticker</span>
              <span className="text-right">Shares</span>
              <span className="text-right">Value</span>
              <span className="text-right">Return %</span>
              <span className="text-right">Trend</span>
            </div>
            {holdingsWithAllocation.map((holding, index) => (
              <div
                key={holding.ticker}
                className={`grid grid-cols-5 items-center px-4 py-3 text-sm ${
                  index < holdingsWithAllocation.length - 1 ? "border-b border-border/50" : ""
                }`}
              >
                <span className="font-medium text-xs">{holding.ticker}</span>
                <span className="text-right text-xs text-muted-foreground">{holding.shares.toFixed(4)}</span>
                <span className="text-right text-xs font-medium">${holding.currentValue.toFixed(2)}</span>
                <span
                  className={`text-right text-xs font-medium ${
                    parseFloat(holding.gainPct) >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {parseFloat(holding.gainPct) >= 0 ? "+" : ""}
                  {holding.gainPct}%
                </span>
                <span className="flex justify-end">
                  {parseFloat(holding.gainPct) >= 0 ? (
                    <TrendingUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  )}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-border pt-6 text-center">
          <button
            onClick={() => {
              fetchPortfolio(false);
              fetchHistory();
            }}
            className="text-xs flex items-center gap-1 mx-auto text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh live data
          </button>
        </div>
      </div>
    </main>
  );
};

export default Portfolio;
