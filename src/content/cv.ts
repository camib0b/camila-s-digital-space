import type { TranslationKey } from "@/i18n/types";

export type CvJobId = "acfin" | "softwareIntern" | "webIntern" | "frontendIntern";
export type CvProjectId = "sportsVideo" | "fleetOptimizer";
export type CvLeadershipId = "coach" | "player";

export interface CvProject {
  id: CvProjectId;
  titleKey: TranslationKey;
  typeKey: TranslationKey;
  descriptionKey: TranslationKey;
  impactKey: TranslationKey;
  technologies: string[];
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
    id: "sportsVideo",
    titleKey: "cv.sportsVideo.title",
    typeKey: "cv.sportsVideo.type",
    descriptionKey: "cv.sportsVideo.description",
    impactKey: "cv.sportsVideo.impact",
    technologies: ["React", "TypeScript", "FFmpeg", "Node.js", "PostgreSQL"],
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
    technologies: ["Looker", "LookML", "SQL", "Python"],
  },
  {
    id: "softwareIntern",
    titleKey: "cv.softwareIntern.title",
    companyKey: "cv.softwareIntern.company",
    periodKey: "cv.softwareIntern.period",
    bulletKeys: [
      "cv.softwareIntern.bullet1",
      "cv.softwareIntern.bullet2",
      "cv.softwareIntern.bullet3",
    ],
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL"],
  },
  {
    id: "webIntern",
    titleKey: "cv.webIntern.title",
    companyKey: "cv.webIntern.company",
    periodKey: "cv.webIntern.period",
    bulletKeys: ["cv.webIntern.bullet1", "cv.webIntern.bullet2", "cv.webIntern.bullet3"],
    technologies: ["Vue.js", "Tailwind CSS", "PostgreSQL"],
  },
  {
    id: "frontendIntern",
    titleKey: "cv.frontendIntern.title",
    companyKey: "cv.frontendIntern.company",
    periodKey: "cv.frontendIntern.period",
    bulletKeys: [
      "cv.frontendIntern.bullet1",
      "cv.frontendIntern.bullet2",
      "cv.frontendIntern.bullet3",
    ],
    technologies: ["React", "Styled Components", "Jest", "Figma"],
  },
];

export const cvLeadership: CvLeadership[] = [
  {
    id: "coach",
    roleKey: "cv.coach.role",
    organizationKey: "cv.coach.organization",
    descriptionKey: "cv.coach.description",
  },
  {
    id: "player",
    roleKey: "cv.player.role",
    organizationKey: "cv.player.organization",
    descriptionKey: "cv.player.description",
  },
];

export const cvSkills = {
  languages: ["TypeScript", "JavaScript", "Python", "SQL", "HTML/CSS"],
  frameworks: ["React", "Node.js", "Vue.js", "Tailwind CSS"],
  tools: ["Git", "PostgreSQL", "Looker", "LookML", "Figma", "REST APIs", "Vite"],
};
