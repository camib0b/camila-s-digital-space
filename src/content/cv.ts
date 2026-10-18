import type { TranslationKey } from "@/i18n/types";

const translatedTechnologyKeys = [
  "cv.skill.bi",
  "cv.skill.excel",
  "cv.skill.office",
] as const satisfies readonly TranslationKey[];

type TranslatedCvTechnology = (typeof translatedTechnologyKeys)[number];

function isTranslatedCvTechnology(technology: string): technology is TranslatedCvTechnology {
  return (translatedTechnologyKeys as readonly string[]).includes(technology);
}

/** Literal tool names stay as written. Skill lines that differ by language use a translation key. */
export function cvTechnologyLabel(
  technology: string,
  translate: (key: TranslationKey) => string,
): string {
  if (isTranslatedCvTechnology(technology)) {
    return translate(technology);
  }
  return technology;
}

export type CvJobId = "acfin" | "finapsys" | "a3" | "visionary";
export type CvProjectId = "ava" | "carpeta" | "publishingPipeline" | "fleetOptimizer";
export type CvLeadershipId = "player" | "coaching" | "videoAnalyst";

export interface CvProject {
  id: CvProjectId;
  titleKey: TranslationKey;
  typeKey: TranslationKey;
  descriptionKey: TranslationKey;
  impactKey?: TranslationKey;
  technologies: string[];
  href?: string;
  externalHref?: string;
}

export interface CvJob {
  id: CvJobId;
  titleKey: TranslationKey;
  companyKey: TranslationKey;
  periodKey: TranslationKey;
  bulletKeys: TranslationKey[];
  technologies: string[];
}

export interface CvLeadership {
  id: CvLeadershipId;
  roleKey: TranslationKey;
  organizationKey: TranslationKey;
  descriptionKey?: TranslationKey;
}

export const cvProjects: CvProject[] = [
  {
    id: "ava",
    titleKey: "cv.ava.title",
    typeKey: "cv.ava.type",
    descriptionKey: "cv.ava.description",
    technologies: ["C++"],
    href: "/ava",
  },
  {
    id: "carpeta",
    titleKey: "cv.carpeta.title",
    typeKey: "cv.carpeta.type",
    descriptionKey: "cv.carpeta.description",
    technologies: [],
    externalHref: "https://carpeta.cl/",
  },
  {
    id: "publishingPipeline",
    titleKey: "cv.publishingPipeline.title",
    typeKey: "cv.publishingPipeline.type",
    descriptionKey: "cv.publishingPipeline.description",
    technologies: [],
  },
  {
    id: "fleetOptimizer",
    titleKey: "cv.fleetOptimizer.title",
    typeKey: "cv.fleetOptimizer.type",
    descriptionKey: "cv.fleetOptimizer.description",
    technologies: ["Python", "Linear Programming", "Gurobi", "Pandas"],
  },
];

export const cvJobs: CvJob[] = [
  {
    id: "acfin",
    titleKey: "cv.acfin.title",
    companyKey: "cv.acfin.company",
    periodKey: "cv.acfin.period",
    bulletKeys: ["cv.acfin.bullet1", "cv.acfin.bullet2", "cv.acfin.bullet3"],
    technologies: [
      "cv.skill.bi",
      "BigQuery",
      "SQL",
      "Python",
      "cv.skill.excel",
      "cv.skill.office",
    ],
  },
  {
    id: "finapsys",
    titleKey: "cv.finapsys.title",
    companyKey: "cv.finapsys.company",
    periodKey: "cv.finapsys.period",
    bulletKeys: ["cv.finapsys.bullet1", "cv.finapsys.bullet2", "cv.finapsys.bullet3"],
    technologies: ["Vue 3", "TypeScript", "Pinia", "Firebase"],
  },
  {
    id: "a3",
    titleKey: "cv.a3.title",
    companyKey: "cv.a3.company",
    periodKey: "cv.a3.period",
    bulletKeys: ["cv.a3.bullet1", "cv.a3.bullet2", "cv.a3.bullet3"],
    technologies: [],
  },
  {
    id: "visionary",
    titleKey: "cv.visionary.title",
    companyKey: "cv.visionary.company",
    periodKey: "cv.visionary.period",
    bulletKeys: ["cv.visionary.bullet1", "cv.visionary.bullet2", "cv.visionary.bullet3"],
    technologies: ["Shopify", "BSale"],
  },
];

export const cvLeadership: CvLeadership[] = [
  {
    id: "player",
    roleKey: "cv.player.role",
    organizationKey: "cv.player.organization",
  },
  {
    id: "coaching",
    roleKey: "cv.coaching.role",
    organizationKey: "cv.coaching.organization",
  },
  {
    id: "videoAnalyst",
    roleKey: "cv.videoAnalyst.role",
    organizationKey: "cv.videoAnalyst.organization",
  },
];
