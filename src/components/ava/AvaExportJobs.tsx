import { AVA_EVENTS } from "@/content/ava";
import { useLanguage } from "@/contexts/LanguageContext";

/** Fewest clips per game → fastest bar; most clips → slowest. Shared cycle in ava.css. */
const EXPORT_JOBS = [
  { token: "Goal", fillClass: "ava-export-fill--goal" },
  { token: "PC", fillClass: "ava-export-fill--pc" },
  { token: "Circle Entry", fillClass: "ava-export-fill--circle-entry" },
] as const;

type ExportJob = (typeof EXPORT_JOBS)[number];

function exportJobLabel(token: ExportJob["token"], language: "en" | "es"): string {
  const event = AVA_EVENTS.find((candidate) => candidate.token === token);
  if (!event) {
    return token;
  }

  return language === "es" ? event.es : event.en;
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
              <span className={`ava-export-fill ${job.fillClass}`} />
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
};

export default AvaExportJobs;
