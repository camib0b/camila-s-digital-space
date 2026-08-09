import type { TranslationKey } from "@/i18n/types";

export interface HockeyMilestone {
  year: string;
  titleKey?: TranslationKey;
  title?: string;
  descriptionKey: TranslationKey;
}

export const playerMilestones: HockeyMilestone[] = [
  {
    year: "2009",
    titleKey: "hockey.started.title",
    descriptionKey: "hockey.started.description",
  },
  {
    year: "2018",
    titleKey: "hockey.earlyRetirement.title",
    descriptionKey: "hockey.earlyRetirement.description",
  },
  {
    year: "2022",
    titleKey: "hockey.returned.title",
    descriptionKey: "hockey.returned.description",
  },
  {
    year: "2025",
    titleKey: "hockey.aclRupture.title",
    descriptionKey: "hockey.aclRupture.description",
  },
];

export const coachingMilestones: HockeyMilestone[] = [
  {
    year: "2023–25",
    title: "Club Deportivo Universidad Católica",
    descriptionKey: "hockey.coachingUc.description",
  },
  {
    year: "2024–",
    title: "Selección Nacional",
    descriptionKey: "hockey.coachingNational.description",
  },
  {
    year: "Dec 2025",
    title: "Video Analyst",
    descriptionKey: "hockey.coachingJwC.description",
  },
];
