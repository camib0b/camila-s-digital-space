import type { TranslationKey } from "@/i18n/types";

export type PersonalProjectLink =
  | { kind: "internal"; path: string; fullPage?: boolean }
  | { kind: "external"; url: string }
  | { kind: "none" };

export type PersonalProjectCategory = "project" | "small-tool";

export interface PersonalProject {
  id: string;
  category: PersonalProjectCategory;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  link: PersonalProjectLink;
}

export const personalProjects: PersonalProject[] = [
  {
    id: "video-analysis",
    category: "project",
    titleKey: "personalProjects.videoAnalysis.title",
    descriptionKey: "personalProjects.videoAnalysis",
    link: { kind: "internal", path: "/ava" },
  },
  {
    id: "clip-library",
    category: "project",
    titleKey: "personalProjects.clipLibrary.title",
    descriptionKey: "personalProjects.clipLibrary",
    link: { kind: "external", url: "https://carpeta.cl/" },
  },
  {
    id: "tomorrow",
    category: "small-tool",
    titleKey: "personalProjects.tomorrow.title",
    descriptionKey: "personalProjects.tomorrow",
    link: { kind: "internal", path: "/tomorrow" },
  },
  {
    id: "capital",
    category: "small-tool",
    titleKey: "personalProjects.capital.title",
    descriptionKey: "personalProjects.capital",
    link: { kind: "internal", path: "/capital" },
  },
  {
    id: "xml-viz",
    category: "small-tool",
    titleKey: "personalProjects.xmlViz.title",
    descriptionKey: "personalProjects.xmlViz",
    link: { kind: "internal", path: "/xml/", fullPage: true },
  },
  {
    id: "raycast",
    category: "small-tool",
    titleKey: "personalProjects.raycast.title",
    descriptionKey: "personalProjects.raycast",
    link: { kind: "external", url: "https://www.raycast.com/camib0b/zodme" },
  },
];
