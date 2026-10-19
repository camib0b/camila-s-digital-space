import type { CSSProperties } from "react";
import { AVA_EVENTS } from "@/content/ava";
import { useLanguage } from "@/contexts/LanguageContext";

const EXPORT_JOBS = [
  { token: "PC", progress: 0.72, durationSeconds: 2.8, delaySeconds: -0.4 },
  { token: "Goal", progress: 0.44, durationSeconds: 3.6, delaySeconds: -1.8 },
  { token: "Circle Entry", progress: 0.9, durationSeconds: 2.3, delaySeconds: -1.1 },
] as const;

type ExportJob = (typeof EXPORT_JOBS)[number];

function exportJobLabel(token: ExportJob["token"], language: "en" | "es"): string {
  const event = AVA_EVENTS.find((candidate) => candidate.token === token);
  if (!event) {
    return token;
  }

  return language === "es" ? event.es : event.en;
}

function exportJobFillStyle(job: ExportJob): CSSProperties {
  return {
    width: `${job.progress * 100}%`,
    animationDuration: `${job.durationSeconds}s`,
    animationDelay: `${job.delaySeconds}s`,
  };
}

const AvaExportJobs = () => {
  const { language, t } = useLanguage();

  return (
    <figure className="ava-export">
      <figcaption className="ava-kicker">{t("ava.export.status")}</figcaption>
      <ul className="ava-export-jobs" aria-label={t("ava.export.figure")}>
        {EXPORT_JOBS.map((job) => (
          <li className="ava-export-job" key={job.token}>
            <span className="ava-export-label">{exportJobLabel(job.token, language)}</span>
            <span className="ava-export-track" aria-hidden="true">
              <span className="ava-export-fill" style={exportJobFillStyle(job)} />
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
};

export default AvaExportJobs;
