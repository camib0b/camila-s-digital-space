import type { TranslationKey } from "@/i18n/types";

export type HowIWorkColumnId = "comesCheap" | "hasToBeBuilt";

export type BigFiveTraitId =
  | "openness"
  | "conscientiousness"
  | "extraversion"
  | "agreeableness"
  | "neuroticism";

export interface HowIWorkColumn {
  id: HowIWorkColumnId;
  headingKey: TranslationKey;
  bodyKey: TranslationKey;
}

export interface BigFiveTrait {
  id: BigFiveTraitId;
  labelKey: TranslationKey;
  percentile: number;
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

export const bigFiveTraits: BigFiveTrait[] = [
  {
    id: "openness",
    labelKey: "howIWork.trait.openness",
    percentile: 91,
  },
  {
    id: "conscientiousness",
    labelKey: "howIWork.trait.conscientiousness",
    percentile: 20,
  },
  {
    id: "extraversion",
    labelKey: "howIWork.trait.extraversion",
    percentile: 63,
  },
  {
    id: "agreeableness",
    labelKey: "howIWork.trait.agreeableness",
    percentile: 35,
  },
  {
    id: "neuroticism",
    labelKey: "howIWork.trait.neuroticism",
    percentile: 18,
  },
];
