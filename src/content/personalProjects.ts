import type { TranslationKey } from "@/i18n/types";

export type PersonalProjectLink =
  | { kind: "internal"; path: string }
  | { kind: "external"; url: string }
  | { kind: "none" };

export interface PersonalProject {
  id: string;
  textKey: TranslationKey;
  link: PersonalProjectLink;
}

export const personalProjects: PersonalProject[] = [
  {
    id: "video-analysis",
    textKey: "personalProjects.videoAnalysis",
    link: { kind: "internal", path: "/ava" },
  },
  {
    id: "clip-library",
    textKey: "personalProjects.clipLibrary",
    link: { kind: "external", url: "https://carpeta.cl/" },
  },
  {
    id: "capital",
    textKey: "personalProjects.capital",
    link: { kind: "internal", path: "/capital" },
  },
  {
    id: "raycast",
    textKey: "personalProjects.raycast",
    link: { kind: "external", url: "https://www.raycast.com/camib0b/zodme" },
  }
];
