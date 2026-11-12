import { useLanguage } from "@/contexts/LanguageContext";
import type { AnalyticsReport } from "@/types/portfolioAnalytics";
import { ExposureSection } from "./ExposureSection";
import { PerformanceSection } from "./PerformanceSection";
import { RiskSection } from "./RiskSection";

export default function AnalyticsReportSections({ report }: { report: AnalyticsReport }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <PerformanceSection report={report} />
      <RiskSection report={report} />
      <ExposureSection report={report} />
      <p className="text-[11px] tracking-wide text-muted-foreground">{t("portfolio.analytics.disclaimer")}</p>
    </div>
  );
}
