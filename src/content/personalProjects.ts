import type { TranslationKey } from "@/i18n/types";

/** Existing AVA interest form. Not a sized waitlist. */
export const AVA_WAITLIST_HREF = "/ava#ava-interest";

export type PersonalProjectDestinationKey =
  | "personalProjects.videoAnalysis.destination"
  | "personalProjects.clipLibrary.destination"
  | "personalProjects.capital.destination"
  | "personalProjects.xmlViz.destination"
  | "personalProjects.concat.destination"
  | "personalProjects.raycast.destination";

type PersonalProjectBase = {
  id: string;
  titleKey: TranslationKey;
};

export type ProjectNarrative = {
  problemKey: TranslationKey;
  builtKey: TranslationKey;
  resultKey: TranslationKey;
};

export type ProjectWaitlist = {
  statusKey: TranslationKey;
  labelKey: TranslationKey;
  href: string;
};

export type LinkedPersonalProject = PersonalProjectBase & {
  category: "project" | "small-tool";
  descriptionKey?: TranslationKey;
  narrative?: ProjectNarrative;
  destinationKey?: PersonalProjectDestinationKey;
  waitlist?: ProjectWaitlist;
  link:
    | { kind: "internal"; path: string; fullPage?: boolean }
    | { kind: "external"; url: string }
    | { kind: "static" };
};

export type ConnectorPersonalProject = PersonalProjectBase & {
  category: "connector";
  descriptionKey: TranslationKey;
  link: { kind: "none" };
};

export type PersonalProject = LinkedPersonalProject | ConnectorPersonalProject;

export type PersonalProjectCategory = PersonalProject["category"];

export type PersonalProjectLink = PersonalProject["link"];

export const personalProjects: PersonalProject[] = [
  {
    id: "clip-library",
    category: "project",
    titleKey: "personalProjects.clipLibrary.title",
    narrative: {
      problemKey: "personalProjects.clipLibrary.problem",
      builtKey: "personalProjects.clipLibrary.built",
      resultKey: "personalProjects.clipLibrary.result",
    },
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
    id: "video-analysis",
    category: "project",
    titleKey: "personalProjects.videoAnalysis.title",
    narrative: {
      problemKey: "personalProjects.videoAnalysis.problem",
      builtKey: "personalProjects.videoAnalysis.built",
      resultKey: "personalProjects.videoAnalysis.result",
    },
    destinationKey: "personalProjects.videoAnalysis.destination",
    waitlist: {
      statusKey: "personalProjects.videoAnalysis.waitlistStatus",
      labelKey: "personalProjects.videoAnalysis.waitlist",
      href: AVA_WAITLIST_HREF,
    },
    link: { kind: "internal", path: "/ava" },
  },
  {
    id: "acfin",
    category: "project",
    titleKey: "personalProjects.acfin.title",
    narrative: {
      problemKey: "personalProjects.acfin.problem",
      builtKey: "personalProjects.acfin.built",
      resultKey: "personalProjects.acfin.result",
    },
    link: { kind: "static" },
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
    id: "concat",
    category: "small-tool",
    titleKey: "personalProjects.concat.title",
    descriptionKey: "personalProjects.concat",
    destinationKey: "personalProjects.concat.destination",
    link: { kind: "internal", path: "/concat" },
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
