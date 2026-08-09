import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DEFAULT_AI_MODEL_ID,
  PORTFOLIO_REFRESH_INTERVAL_MS,
  fetchAiInsight,
  fetchPortfolio,
  fetchPortfolioHistory,
} from "@/lib/portfolioApi";
import {
  buildAllocationChartData,
  buildHoldingsWithMetrics,
} from "@/lib/portfolioMetrics";
import type { TranslationKey } from "@/i18n/types";
import type { AiModelOption, PortfolioResponse } from "@/types/portfolio";

const DEFAULT_AI_MODELS: AiModelOption[] = [
  { id: DEFAULT_AI_MODEL_ID, label: "Grok (xAI)" },
];

const PORTFOLIO_ERROR_KEYS = new Set<TranslationKey>([
  "portfolio.error.load",
  "portfolio.error.history",
  "portfolio.error.aiInsight",
]);

function resolveErrorMessage(
  error: unknown,
  translate: (key: TranslationKey) => string,
  fallbackKey: TranslationKey
): string {
  if (error instanceof Error) {
    if (PORTFOLIO_ERROR_KEYS.has(error.message as TranslationKey)) {
      return translate(error.message as TranslationKey);
    }
    return error.message;
  }
  return translate(fallbackKey);
}

export function usePortfolioData() {
  const { language, t } = useLanguage();
  const queryClient = useQueryClient();
  const [selectedAiModel, setSelectedAiModel] = useState(DEFAULT_AI_MODEL_ID);
  const [insightProvider, setInsightProvider] = useState<string | null>(null);
  const [localAiInsight, setLocalAiInsight] = useState<string | null>(null);

  const portfolioQuery = useQuery({
    queryKey: ["portfolio"],
    queryFn: fetchPortfolio,
    refetchInterval: PORTFOLIO_REFRESH_INTERVAL_MS,
  });

  const historyQuery = useQuery({
    queryKey: ["portfolio-history"],
    queryFn: fetchPortfolioHistory,
  });

  useEffect(() => {
    setLocalAiInsight(null);
    setInsightProvider(null);
  }, [language]);

  useEffect(() => {
    const models = portfolioQuery.data?.aiModels;
    if (!models || models.length === 0) {
      return;
    }
    const modelIds = models.map((model) => model.id);
    if (!modelIds.includes(selectedAiModel)) {
      setSelectedAiModel(models[0].id);
    }
  }, [portfolioQuery.data?.aiModels, selectedAiModel]);

  const aiInsightMutation = useMutation({
    mutationFn: () =>
      fetchAiInsight({
        model: selectedAiModel,
        language,
      }),
    onSuccess: (payload) => {
      setLocalAiInsight(payload.aiInsight);
      setInsightProvider(typeof payload.provider === "string" ? payload.provider : null);
      if (payload.lastUpdated) {
        queryClient.setQueryData<PortfolioResponse>(["portfolio"], (previous) =>
          previous
            ? {
                ...previous,
                aiInsight: payload.aiInsight,
                lastUpdated: payload.lastUpdated ?? previous.lastUpdated,
              }
            : previous
        );
      }
    },
  });

  const portfolio = useMemo(() => {
    if (!portfolioQuery.data) {
      return null;
    }
    return {
      ...portfolioQuery.data,
      aiInsight:
        localAiInsight ??
        portfolioQuery.data.aiInsight ??
        null,
    };
  }, [portfolioQuery.data, localAiInsight]);

  const holdingsWithAllocation = useMemo(
    () => (portfolio ? buildHoldingsWithMetrics(portfolio) : []),
    [portfolio]
  );

  const allocationChartData = useMemo(
    () => buildAllocationChartData(holdingsWithAllocation),
    [holdingsWithAllocation]
  );

  const availableAiModels =
    portfolio?.aiModels && portfolio.aiModels.length > 0
      ? portfolio.aiModels
      : DEFAULT_AI_MODELS;

  const refreshLiveData = () => {
    void portfolioQuery.refetch();
    void historyQuery.refetch();
  };

  return {
    portfolio,
    history: historyQuery.data ?? null,
    loading: portfolioQuery.isLoading,
    historyLoading: historyQuery.isLoading,
    error: portfolioQuery.error
      ? resolveErrorMessage(portfolioQuery.error, t, "portfolio.error.load")
      : null,
    historyError: historyQuery.error
      ? resolveErrorMessage(historyQuery.error, t, "portfolio.error.history")
      : null,
    holdingsWithAllocation,
    allocationChartData,
    availableAiModels,
    showModelSelector: availableAiModels.length > 1,
    selectedAiModel,
    setSelectedAiModel,
    insightProvider,
    aiInsightLoading: aiInsightMutation.isPending,
    aiInsightError: aiInsightMutation.error
      ? resolveErrorMessage(aiInsightMutation.error, t, "portfolio.error.aiInsight")
      : null,
    generateAiInsight: () => aiInsightMutation.mutate(),
    refreshLiveData,
  };
}
