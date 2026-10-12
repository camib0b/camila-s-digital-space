import factsJson from "@/data/cv-facts.json";
import type { CvFactsFile, CvLanguage } from "./types";

export const cvFacts = factsJson as CvFactsFile;

export function localized(f: { en: string; es: string }, language: CvLanguage): string {
  return language === "es" ? f.es : f.en;
}

export function bulletTextById(sourceId: string, language: CvLanguage): string | null {
  for (const bullet of cvFacts.summaryBullets) {
    if (bullet.id === sourceId) {
      return language === "es" ? bullet.es : bullet.en;
    }
  }
  for (const role of cvFacts.roles) {
    for (const bullet of role.bullets) {
      if (bullet.id === sourceId) {
        return language === "es" ? bullet.es : bullet.en;
      }
    }
  }
  for (const project of cvFacts.projects) {
    for (const bullet of project.bullets) {
      if (bullet.id === sourceId) {
        return language === "es" ? bullet.es : bullet.en;
      }
    }
  }
  return null;
}

export function allBulletSourceIds(): Set<string> {
  const ids = new Set<string>();
  for (const bullet of cvFacts.summaryBullets) {
    ids.add(bullet.id);
  }
  for (const role of cvFacts.roles) {
    for (const bullet of role.bullets) {
      ids.add(bullet.id);
    }
  }
  for (const project of cvFacts.projects) {
    for (const bullet of project.bullets) {
      ids.add(bullet.id);
    }
  }
  return ids;
}

export function skillLabelById(skillId: string): string | null {
  return cvFacts.skills.find((skill) => skill.id === skillId)?.label ?? null;
}

export function mandatorySkillIds(): string[] {
  const mandatory = new Set(cvFacts.rules.mandatorySkillLabels);
  return cvFacts.skills.filter((skill) => mandatory.has(skill.label)).map((skill) => skill.id);
}

export function extractNumbers(text: string): string[] {
  const matches = text.match(/\d+(?:[.,]\d+)?%?/g);
  return matches ?? [];
}
