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
  aiInsight: string | null;
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
  aiInsight,
  provider,
}: AiInsightPanelProps) => {
  return (
    <section className="analytics-rise mb-16 border border-border bg-card px-4 py-5 md:px-5" aria-busy={loading}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">{label}</h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {showModelSelector && (
            <label className="flex flex-col gap-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:min-w-[12rem]">
              {modelLabel}
              <select
                value={selectedAiModel}
                onChange={(event) => onSelectedAiModelChange(event.target.value)}
                disabled={loading}
                className="h-8 border border-border bg-background px-2 font-mono text-xs normal-case tracking-normal text-foreground"
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
            className="inline-flex h-8 items-center justify-center border border-foreground bg-foreground px-3 text-[10px] font-medium uppercase tracking-[0.14em] text-background disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? generatingLabel : generateLabel}
          </button>
        </div>
      </div>
      {error && <p className="mb-3 text-sm text-number-negative">{error}</p>}
      {aiInsight ? (
        <div className="space-y-3">
          <AiInsightContent content={aiInsight} />
          {provider && (
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {viaLabel} {provider}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-muted-foreground">{placeholder}</p>
      )}
    </section>
  );
};

export default AiInsightPanel;
