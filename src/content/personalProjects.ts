import type { TranslationKey } from "@/i18n/types";

export type PersonalProjectDestinationKey =
  | "personalProjects.videoAnalysis.destination"
  | "personalProjects.clipLibrary.destination"
  | "personalProjects.capital.destination"
  | "personalProjects.xmlViz.destination"
  | "personalProjects.raycast.destination";

type PersonalProjectBase = {
  id: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
};

export type LinkedPersonalProject = PersonalProjectBase & {
  category: "project" | "small-tool";
  destinationKey: PersonalProjectDestinationKey;
  link:
    | { kind: "internal"; path: string; fullPage?: boolean }
    | { kind: "external"; url: string };
};

export type ConnectorPersonalProject = PersonalProjectBase & {
  category: "connector";
  link: { kind: "none" };
};

export type PersonalProject = LinkedPersonalProject | ConnectorPersonalProject;

export type PersonalProjectCategory = PersonalProject["category"];

export type PersonalProjectLink = PersonalProject["link"];

export const personalProjects: PersonalProject[] = [
  {
    id: "video-analysis",
    category: "project",
    titleKey: "personalProjects.videoAnalysis.title",
    descriptionKey: "personalProjects.videoAnalysis",
    destinationKey: "personalProjects.videoAnalysis.destination",
    link: { kind: "internal", path: "/ava" },
  },
  {
    id: "clip-library",
    category: "project",
    titleKey: "personalProjects.clipLibrary.title",
    descriptionKey: "personalProjects.clipLibrary",
    destinationKey: "personalProjects.clipLibrary.destination",
    link: { kind: "external", url: "https://carpeta.cl/" },
  },
  {
    id: "publishing-pipeline",
    category: "connector",
    titleKey: "personalProjects.publishingPipeline.title",
    descriptionKey: "personalProjects.publishingPipeline",
    link: { kind: "none" },
  },
  {
    id: "capital",
    category: "small-tool",
    titleKey: "personalProjects.capital.title",
    descriptionKey: "personalProjects.capital",
    destinationKey: "personalProjects.capital.destination",
    link: { kind: "internal", path: "/capital" },
  },
  {
    id: "xml-viz",
    category: "small-tool",
    titleKey: "personalProjects.xmlViz.title",
    descriptionKey: "personalProjects.xmlViz",
    destinationKey: "personalProjects.xmlViz.destination",
    link: { kind: "internal", path: "/xml/", fullPage: true },
  },
  {
    id: "raycast",
    category: "small-tool",
    titleKey: "personalProjects.raycast.title",
    descriptionKey: "personalProjects.raycast",
    destinationKey: "personalProjects.raycast.destination",
    link: { kind: "external", url: "https://www.raycast.com/camib0b/zodme" },
  },
];
