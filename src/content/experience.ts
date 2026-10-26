export type ExperienceRoleId = "acfin" | "finapsys" | "a3" | "visionary";

export type ExperienceDiagramId = "analytics" | "commerce" | "hotel" | "interface";

export interface ExperienceRole {
  id: ExperienceRoleId;
  titleKey: `experience.${ExperienceRoleId}.title`;
  companyKey: `experience.${ExperienceRoleId}.company`;
  periodKey: `experience.${ExperienceRoleId}.period`;
  descriptionKey: `experience.${ExperienceRoleId}.description`;
  diagram: ExperienceDiagramId | null;
}

export const experienceRoles: ExperienceRole[] = [
  {
    id: "acfin",
    titleKey: "experience.acfin.title",
    companyKey: "experience.acfin.company",
    periodKey: "experience.acfin.period",
    descriptionKey: "experience.acfin.description",
    diagram: "analytics",
  },
  {
    id: "finapsys",
    titleKey: "experience.finapsys.title",
    companyKey: "experience.finapsys.company",
    periodKey: "experience.finapsys.period",
    descriptionKey: "experience.finapsys.description",
    diagram: "interface",
  },
  {
    id: "a3",
    titleKey: "experience.a3.title",
    companyKey: "experience.a3.company",
    periodKey: "experience.a3.period",
    descriptionKey: "experience.a3.description",
    diagram: "hotel",
  },
  {
    id: "visionary",
    titleKey: "experience.visionary.title",
    companyKey: "experience.visionary.company",
    periodKey: "experience.visionary.period",
    descriptionKey: "experience.visionary.description",
    diagram: "commerce",
  },
];
