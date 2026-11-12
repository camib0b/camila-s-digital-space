import type { TranslationKey } from "@/i18n/types";

/** Public file. The hockey tab links here; the page itself is the CV. */
export const COACHING_CV_PDF_URL = "/cv/Camila_Escudero_Coaching_CV.pdf";

/** Printed on the coaching PDF. */
export const COACHING_CV_PHONE_DISPLAY = "+56 9 8424 8620";
export const COACHING_CV_PHONE_HREF = "tel:+56984248620";

export interface CvHockeyRole {
  id: string;
  titleKey: TranslationKey;
  organizationKey: TranslationKey;
  periodKey: TranslationKey;
  bulletKeys: TranslationKey[];
}

/**
 * Year-by-year record from the coaching PDF.
 * Club UC coaching is 2023–2025. The 2026 Club UC line is video analysis, not coaching.
 * FEHOCH runs through 2026, which is the present year on that PDF.
 */
export const cvHockeyRoles: CvHockeyRole[] = [
  {
    id: "2023-club-uc",
    titleKey: "cv.hockey.coach",
    organizationKey: "cv.hockey.org.clubUc",
    periodKey: "cv.hockey.year.2023",
    bulletKeys: ["cv.hockey.y2023.team", "cv.hockey.y2023.tour"],
  },
  {
    id: "2024-club-uc",
    titleKey: "cv.hockey.coach",
    organizationKey: "cv.hockey.org.clubUc",
    periodKey: "cv.hockey.year.2024",
    bulletKeys: ["cv.hockey.y2024.clubUc.teams", "cv.hockey.y2024.clubUc.tours"],
  },
  {
    id: "2024-fehoch",
    titleKey: "cv.hockey.assistantCoach",
    organizationKey: "cv.hockey.org.fehoch",
    periodKey: "cv.hockey.year.2024",
    bulletKeys: ["cv.hockey.y2024.fehoch.team"],
  },
  {
    id: "2025-club-uc",
    titleKey: "cv.hockey.coach",
    organizationKey: "cv.hockey.org.clubUc",
    periodKey: "cv.hockey.year.2025",
    bulletKeys: ["cv.hockey.y2025.clubUc.teams"],
  },
  {
    id: "2025-fehoch",
    titleKey: "cv.hockey.assistantCoach",
    organizationKey: "cv.hockey.org.fehoch",
    periodKey: "cv.hockey.year.2025",
    bulletKeys: ["cv.hockey.y2025.fehoch.teams", "cv.hockey.y2025.fehoch.tour"],
  },
  {
    id: "2025-video",
    titleKey: "cv.hockey.videoAssistant",
    organizationKey: "cv.hockey.org.worldCup",
    periodKey: "cv.hockey.year.2025",
    bulletKeys: [],
  },
  {
    id: "2026-fehoch",
    titleKey: "cv.hockey.coordinator",
    organizationKey: "cv.hockey.org.fehoch",
    periodKey: "cv.hockey.year.2026",
    bulletKeys: ["cv.hockey.y2026.fehoch.assistant", "cv.hockey.y2026.fehoch.tours"],
  },
  {
    id: "2026-club-uc",
    titleKey: "cv.hockey.videoAnalyst",
    organizationKey: "cv.hockey.org.clubUc",
    periodKey: "cv.hockey.year.2026",
    bulletKeys: ["cv.hockey.y2026.clubUc.team"],
  },
];

export interface CvHockeyTool {
  id: "ava" | "carpeta";
  title: string;
  descriptionKey: TranslationKey;
  href: string;
  external: boolean;
}

export const cvHockeyTools: CvHockeyTool[] = [
  {
    id: "ava",
    title: "AVA",
    descriptionKey: "cv.hockey.ava",
    href: "/ava",
    external: false,
  },
  {
    id: "carpeta",
    title: "carpeta.cl",
    descriptionKey: "cv.hockey.carpeta",
    href: "https://carpeta.cl/",
    external: true,
  },
];

export const cvHockeyCertificationKeys = [
  "cv.hockey.cert.fih",
  "cv.hockey.cert.table",
  "cv.hockey.cert.umpire",
] as const satisfies readonly TranslationKey[];

export const cvHockeySkillKeys = [
  "cv.hockey.skill.english",
  "cv.hockey.skill.excel",
  "cv.hockey.skill.development",
  "cv.hockey.skill.dashboards",
] as const satisfies readonly TranslationKey[];
