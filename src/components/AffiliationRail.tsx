import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/i18n/types";

type AffiliationMark = {
  id: string;
  mark: string;
  nameKey?: TranslationKey;
};

/**
 * Text wordmarks only. The repo has no PUC, FEHOCH, or employer logo files,
 * and third-party marks are not downloaded.
 */
const affiliationMarks: readonly AffiliationMark[] = [
  { id: "puc", mark: "PUC", nameKey: "cv.education.institution" },
  { id: "fehoch", mark: "FEHOCH" },
  { id: "acfin", mark: "ACFIN", nameKey: "cv.acfin.company" },
  { id: "finapsys", mark: "Finapsys", nameKey: "cv.finapsys.company" },
  { id: "a3", mark: "A3", nameKey: "cv.a3.company" },
  { id: "visionary", mark: "Visionary", nameKey: "cv.visionary.company" },
];

const AffiliationRail = () => {
  const { t } = useLanguage();

  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
      {affiliationMarks.map((affiliation) => {
        const accessibleName = affiliation.nameKey === undefined ? affiliation.mark : t(affiliation.nameKey);
        const showFullName = accessibleName !== affiliation.mark;

        return (
          <li key={affiliation.id}>
            <span className="font-mono text-xs tracking-[0.12em] text-foreground transition-opacity duration-hover ease-hover hover:opacity-70">
              {showFullName ? (
                <>
                  <span aria-hidden="true">{affiliation.mark}</span>
                  <span className="sr-only">{accessibleName}</span>
                </>
              ) : (
                affiliation.mark
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default AffiliationRail;
