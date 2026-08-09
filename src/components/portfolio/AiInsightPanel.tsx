import { RefreshCw, Sparkles } from "lucide-react";
import AiInsightContent from "@/components/AiInsightContent";
import type { AiModelOption } from "@/types/portfolio";

interface AiInsightPanelProps {
  label: string;
  modelLabel: string;
  generateLabel: string;
  generatingLabel: string;
  placeholder: string;
  viaLabel: string;
  showModelSelector: boolean;
  availableAiModels: AiModelOption[];
  selectedAiModel: string;
  onSelectedAiModelChange: (modelId: string) => void;
  onGenerate: () => void;
  loading: boolean;
  error: string | null;
  insight: string | null;
  provider: string | null;
}

const AiInsightPanel = ({
  label,
  modelLabel,
  generateLabel,
  generatingLabel,
  placeholder,
  viaLabel,
  showModelSelector,
  availableAiModels,
  selectedAiModel,
  onSelectedAiModelChange,
  onGenerate,
  loading,
  error,
  insight,
  provider,
}: AiInsightPanelProps) => {
  return (
    <div className="mb-12 bg-card rounded-lg ring-1 ring-border p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-3">
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">{label}</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          {showModelSelector && (
            <label className="flex flex-col gap-1 text-[10px] uppercase tracking-wider text-muted-foreground sm:min-w-[200px]">
              {modelLabel}
              <select
                value={selectedAiModel}
                onChange={(event) => onSelectedAiModelChange(event.target.value)}
                disabled={loading}
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
            onClick={onGenerate}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md text-xs font-medium bg-foreground text-background hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none transition-opacity"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                {generatingLabel}
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                {generateLabel}
              </>
            )}
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>}
      {insight ? (
        <div className="space-y-3">
          <AiInsightContent content={insight} />
          {provider && (
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {viaLabel} {provider}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-muted-foreground">{placeholder}</p>
      )}
    </div>
  );
};

export default AiInsightPanel;
