import type { TranslationKey } from "@/i18n/types";

export type CvJobId = "acfin" | "finapsys" | "a3" | "visionary";
export type CvProjectId = "ava" | "fleetOptimizer";
export type CvLeadershipId = "player" | "coachUc" | "coachNational" | "videoAnalyst";

export interface CvProject {
  id: CvProjectId;
  titleKey: TranslationKey;
  typeKey: TranslationKey;
  descriptionKey: TranslationKey;
  impactKey?: TranslationKey;
  technologies: string[];
  href?: string;
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
  descriptionKey: TranslationKey;
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
    id: "fleetOptimizer",
    titleKey: "cv.fleetOptimizer.title",
    typeKey: "cv.fleetOptimizer.type",
    descriptionKey: "cv.fleetOptimizer.description",
    impactKey: "cv.fleetOptimizer.impact",
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
    technologies: ["Looker", "LookML", "BigQuery", "SQL", "Python"],
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
    descriptionKey: "cv.player.description",
  },
  {
    id: "coachUc",
    roleKey: "cv.coachUc.role",
    organizationKey: "cv.coachUc.organization",
    descriptionKey: "cv.coachUc.description",
  },
  {
    id: "coachNational",
    roleKey: "cv.coachNational.role",
    organizationKey: "cv.coachNational.organization",
    descriptionKey: "cv.coachNational.description",
  },
  {
    id: "videoAnalyst",
    roleKey: "cv.videoAnalyst.role",
    organizationKey: "cv.videoAnalyst.organization",
    descriptionKey: "cv.videoAnalyst.description",
  },
];

export const cvSkills = {
  languages: ["TypeScript", "JavaScript", "Python", "SQL", "HTML/CSS"],
  frameworks: ["React", "Node.js", "Vue.js", "Tailwind CSS"],
  tools: ["Git", "PostgreSQL", "Looker", "LookML", "Figma", "REST APIs", "Vite"],
};
