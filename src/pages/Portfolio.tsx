import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw, Sparkles } from "lucide-react";
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
import { useState, useEffect } from "react";

// ==================== TIPOS (TypeScript) ====================
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

// ==================== URL DE TU API  ====================
const API_URL = "https://portfolio-api.camilaescuderob.workers.dev/api/portfolio";
const AI_INSIGHT_URL = `${API_URL}/ai-insight`;

const AI_MODEL_STORAGE_KEY = "portfolio-preferred-ai-model";

const DEFAULT_AI_MODELS: AiModelOption[] = [
  { id: "grok", label: "Grok (xAI)" },
  { id: "openai", label: "GPT-4o mini (OpenAI)" },
];

const Portfolio = () => {
  const { t } = useLanguage();

  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAiModel, setSelectedAiModel] = useState<string>(() => {
    if (typeof window === "undefined") return "grok";
    return window.localStorage.getItem(AI_MODEL_STORAGE_KEY) || "grok";
  });
  const [aiInsightLoading, setAiInsightLoading] = useState(false);
  const [aiInsightError, setAiInsightError] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(AI_MODEL_STORAGE_KEY, selectedAiModel);
    } catch {
      /* ignore quota / private mode */
    }
  }, [selectedAiModel]);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al cargar el portafolio");
      const data: PortfolioResponse = await res.json();
      setPortfolio((previous) => ({
        ...data,
        aiInsight: data.aiInsight !== null && data.aiInsight !== undefined ? data.aiInsight : previous?.aiInsight ?? null,
      }));
      setError(null);
      setAiInsightError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAiInsight = async () => {
    setAiInsightLoading(true);
    setAiInsightError(null);
    try {
      const res = await fetch(AI_INSIGHT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: selectedAiModel }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof payload.error === "string" ? payload.error : "No se pudo generar el insight");
      }
      const aiInsightText = payload.aiInsight as string;
      const insightLastUpdated = payload.lastUpdated as string | undefined;
      setPortfolio((previous) =>
        previous
          ? {
              ...previous,
              aiInsight: aiInsightText,
              lastUpdated: insightLastUpdated ?? previous.lastUpdated,
            }
          : previous
      );
    } catch (err: any) {
      setAiInsightError(err.message);
    } finally {
      setAiInsightLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 60000);
    return () => clearInterval(interval);
  }, []);

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

  // Calcular % de allocation para la tabla
  const totalValueNum = parseFloat(portfolio.totalValue);
  const holdingsWithAllocation = portfolio.stocks.map(stock => ({
    ...stock,
    allocation: ((stock.currentValue / totalValueNum) * 100).toFixed(1),
    gainPct: (((stock.currentValue - stock.totalCost) / stock.totalCost) * 100).toFixed(2),
  }));

  return (
    <main className="min-h-screen bg-background relative">
      {/* ... (mantengo todo tu overlay de parchment y grain igual) ... */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23000' fill-opacity='1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")` }} />

      {/* Top bar (igual) */}
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container px-6 md:px-8 max-w-3xl mx-auto flex items-center justify-between h-12">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
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
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">grand exchange</p>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">investment portfolio</h1>
          <p className="text-sm text-muted-foreground">Datos en tiempo real • Última actualización: {new Date(portfolio.lastUpdated).toLocaleTimeString()}</p>
        </div>

        {/* Summary stats  */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden mb-12 ring-1 ring-border">
          {[
            { label: "Portfolio Value", value: `$${parseFloat(portfolio.totalValue).toLocaleString()}` },
            { label: "Total Return", value: `+${parseFloat(portfolio.totalReturnPct)}%` },
            { label: "Total Invested", value: `$${parseFloat(portfolio.totalInvested).toLocaleString()}` },
            { label: "Holdings", value: portfolio.count.toString() },
          ].map((stat) => (
            <div key={stat.label} className="bg-card p-4 text-center">
              <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-lg font-semibold tracking-tight">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* AI Insight (on demand) */}
        <div className="mb-12 bg-card rounded-lg ring-1 ring-border p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-3">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">AI insight</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <label className="flex flex-col gap-1 text-[10px] uppercase tracking-wider text-muted-foreground sm:min-w-[200px]">
                Modelo
                <select
                  value={selectedAiModel}
                  onChange={(event) => setSelectedAiModel(event.target.value)}
                  disabled={aiInsightLoading}
                  className="text-xs font-normal normal-case tracking-normal h-9 rounded-md border border-border bg-background px-2 text-foreground"
                >
                  {(portfolio.aiModels && portfolio.aiModels.length > 0 ? portfolio.aiModels : DEFAULT_AI_MODELS).map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={fetchAiInsight}
                disabled={aiInsightLoading}
                className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md text-xs font-medium bg-foreground text-background hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none transition-opacity"
              >
                {aiInsightLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Generando…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Generar insight
                  </>
                )}
              </button>
            </div>
          </div>
          {aiInsightError && <p className="text-sm text-red-600 dark:text-red-400 mb-3">{aiInsightError}</p>}
          <p className="text-sm leading-relaxed text-muted-foreground">
            {portfolio.aiInsight ??
              "Elige un modelo y empieza."}
          </p>
        </div>

        {/* Charts (por ahora siguen con mock – los podemos hacer reales después) */}
        {/* Portfolio Performance + Monthly Returns se mantienen igual por ahora */}

        {/* Holdings Table – AHORA CON TUS ACCIONES REALES */}
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
            {holdingsWithAllocation.map((h, i) => (
              <div
                key={h.ticker}
                className={`grid grid-cols-5 items-center px-4 py-3 text-sm ${i < holdingsWithAllocation.length - 1 ? "border-b border-border/50" : ""}`}
              >
                <span className="font-medium text-xs">{h.ticker}</span>
                <span className="text-right text-xs text-muted-foreground">{h.shares.toFixed(4)}</span>
                <span className="text-right text-xs font-medium">${h.currentValue.toFixed(2)}</span>
                <span className={`text-right text-xs font-medium ${parseFloat(h.gainPct) >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {parseFloat(h.gainPct) >= 0 ? "+" : ""}{h.gainPct}%
                </span>
                <span className="flex justify-end">
                  {parseFloat(h.gainPct) >= 0 ? (
                    <TrendingUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  )}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Business ROI – lo dejamos como mock porque es de tus side businesses */}
        {/* ... (mantienes esta sección igual que antes) ... */}

        <div className="border-t border-border pt-6 text-center">
          <button
            onClick={fetchPortfolio}
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
