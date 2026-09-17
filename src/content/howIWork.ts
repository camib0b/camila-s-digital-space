import type { TranslationKey } from "@/i18n/types";

export type HowIWorkColumnId = "comesCheap" | "hasToBeBuilt";

export interface HowIWorkColumn {
  id: HowIWorkColumnId;
  headingKey: TranslationKey;
  bodyKey: TranslationKey;
}

export const howIWorkColumns: HowIWorkColumn[] = [
  {
    id: "comesCheap",
    headingKey: "howIWork.comesCheap.heading",
    bodyKey: "howIWork.comesCheap.body",
  },
  {
    id: "hasToBeBuilt",
    headingKey: "howIWork.hasToBeBuilt.heading",
    bodyKey: "howIWork.hasToBeBuilt.body",
  },
];
