import type { TranslationKey } from "@/i18n/types";

export type PersonalProjectLink =
  | { kind: "internal"; path: string }
  | { kind: "external"; url: string }
  | { kind: "none" };

export type PersonalProjectCategory = "project" | "learning-lab";

export interface PersonalProject {
  id: string;
  category: PersonalProjectCategory;
  descriptionKey: TranslationKey;
  link: PersonalProjectLink;
}

export const personalProjects: PersonalProject[] = [
  {
    id: "video-analysis",
    category: "project",
    descriptionKey: "personalProjects.videoAnalysis",
    link: { kind: "internal", path: "/ava" },
  },
  {
    id: "clip-library",
    category: "project",
    descriptionKey: "personalProjects.clipLibrary",
    link: { kind: "external", url: "https://carpeta.cl/" },
  },
  {
    id: "raycast",
    category: "project",
    descriptionKey: "personalProjects.raycast",
    link: { kind: "external", url: "https://www.raycast.com/camib0b/zodme" },
  },
  {
    id: "tomorrow",
    category: "learning-lab",
    descriptionKey: "personalProjects.tomorrow",
    link: { kind: "internal", path: "/tomorrow" },
  },
  {
    id: "capital",
    category: "learning-lab",
    descriptionKey: "personalProjects.capital",
    link: { kind: "internal", path: "/capital" },
  },
];
