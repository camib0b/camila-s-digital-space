import type { CvJob, CvLeadership, CvProject } from "@/content/cv";
import { AVA_WAITLIST_HREF } from "@/content/personalProjects";

export type CvVariant = "analytics" | "growth" | "hockey";

export function cvVariantFromPath(pathname: string): CvVariant {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (normalized === "/cv/growth") return "growth";
  if (normalized === "/cv/hockey") return "hockey";
  return "analytics";
}

/** Growth CV. Tool names stay off each role and live in one skills line. */
export const cvGrowthJobs: CvJob[] = [
  {
    id: "acfin",
    titleKey: "cv.acfin.title",
    companyKey: "cv.acfin.company",
    periodKey: "cv.acfin.period",
    bulletKeys: ["cv.growth.acfin.bullet1", "cv.growth.acfin.bullet2"],
    technologies: [],
  },
  {
    id: "finapsys",
    titleKey: "cv.finapsys.title",
    companyKey: "cv.finapsys.company",
    periodKey: "cv.finapsys.period",
    bulletKeys: ["cv.finapsys.bullet1", "cv.finapsys.bullet2", "cv.finapsys.bullet3"],
    technologies: [],
  },
  {
    id: "a3",
    titleKey: "cv.growth.a3.title",
    companyKey: "cv.a3.company",
    periodKey: "cv.growth.a3.period",
    bulletKeys: ["cv.growth.a3.bullet"],
    technologies: [],
  },
  {
    id: "visionary",
    titleKey: "cv.visionary.title",
    companyKey: "cv.visionary.company",
    periodKey: "cv.visionary.period",
    bulletKeys: ["cv.visionary.bullet1", "cv.visionary.bullet2", "cv.visionary.bullet3"],
    technologies: [],
  },
];

export const cvGrowthProjects: CvProject[] = [
  {
    id: "pipeline",
    titleKey: "cv.growth.pipeline.title",
    typeKey: "cv.growth.pipeline.type",
    descriptionKey: "cv.growth.pipeline.description",
    bulletKeys: ["cv.growth.pipeline.carpeta", "cv.growth.pipeline.ava"],
    technologies: [],
    href: "/ava",
    externalHref: "https://carpeta.cl/",
    waitlistHref: AVA_WAITLIST_HREF,
    waitlistKey: "personalProjects.videoAnalysis.waitlist",
  },
  {
    id: "capital",
    titleKey: "personalProjects.capital.title",
    typeKey: "cv.growth.capital.type",
    descriptionKey: "cv.growth.capital.description",
    technologies: [],
    href: "/capital",
  },
  {
    id: "fleetOptimizer",
    titleKey: "cv.fleetOptimizer.title",
    typeKey: "cv.fleetOptimizer.type",
    descriptionKey: "cv.fleetOptimizer.description",
    technologies: [],
  },
];

export const cvGrowthLeadership: CvLeadership[] = [
  {
    id: "player",
    roleKey: "cv.player.role",
    organizationKey: "cv.player.organization",
  },
  {
    id: "clubUc",
    roleKey: "hockey.clubUc.role",
    organizationKey: "hockey.clubUc.period",
  },
  {
    id: "fehoch",
    roleKey: "hockey.fehoch.role",
    organizationKey: "hockey.fehoch.period",
  },
  {
    id: "videoAnalyst",
    roleKey: "cv.videoAnalyst.role",
    organizationKey: "cv.videoAnalyst.organization",
  },
];
