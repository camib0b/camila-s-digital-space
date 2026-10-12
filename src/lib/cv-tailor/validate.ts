import { allBulletSourceIds, bulletTextById, cvFacts, extractNumbers, mandatorySkillIds, skillLabelById } from "./facts";
import type { CvLanguage, TailoredCvDocument } from "./types";

export interface ValidationIssue {
  code: string;
  message: string;
}

export function validateTailoredDocument(document: TailoredCvDocument): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const allowedBullets = allBulletSourceIds();
  const allowedSkills = new Set(cvFacts.skills.map((skill) => skill.id));

  for (const skillId of mandatorySkillIds()) {
    if (!document.skillIds.includes(skillId)) {
      issues.push({
        code: "missing_mandatory_skill",
        message: `Missing mandatory skill id ${skillId}`,
      });
    }
  }

  for (const skillId of document.skillIds) {
    if (!allowedSkills.has(skillId)) {
      issues.push({ code: "invalid_skill", message: `Unknown skill id ${skillId}` });
    }
  }

  const checkBullet = (sourceId: string, text: string) => {
    if (!allowedBullets.has(sourceId)) {
      issues.push({ code: "invalid_source", message: `Unknown bullet source id ${sourceId}` });
      return;
    }
    const sourceText = bulletTextById(sourceId, document.language);
    if (!sourceText) {
      issues.push({ code: "missing_source", message: `No source text for ${sourceId}` });
      return;
    }
    for (const forbidden of cvFacts.rules.forbiddenProductNamesOnBusinessCvs) {
      if (text.toLowerCase().includes(forbidden.toLowerCase())) {
        issues.push({
          code: "forbidden_product_name",
          message: `Bullet references forbidden product name: ${forbidden}`,
        });
      }
    }
    if (text.toLowerCase().includes("looker dashboard")) {
      issues.push({ code: "acfin_framing", message: "ACFIN must not be framed as building Looker dashboards." });
    }
    const sourceNumbers = new Set(extractNumbers(sourceText));
    for (const number of extractNumbers(text)) {
      if (!sourceNumbers.has(number)) {
        issues.push({
          code: "unsourced_number",
          message: `Number ${number} in tailored text is not present in source ${sourceId}`,
        });
      }
    }
    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount > cvFacts.rules.maxBulletWords) {
      issues.push({
        code: "bullet_too_long",
        message: `Bullet ${sourceId} exceeds ${cvFacts.rules.maxBulletWords} words`,
      });
    }
  };

  for (const sourceId of document.summaryBulletSourceIds) {
    if (!allowedBullets.has(sourceId)) {
      issues.push({ code: "invalid_source", message: `Unknown summary source id ${sourceId}` });
    }
  }

  for (const role of document.roles) {
    for (const bullet of role.bullets) {
      checkBullet(bullet.sourceId, bullet.text);
    }
  }
  for (const project of document.projects) {
    for (const bullet of project.bullets) {
      checkBullet(bullet.sourceId, bullet.text);
    }
  }

  return issues;
}

export function enforceMandatorySkills(document: TailoredCvDocument): TailoredCvDocument {
  const skillIds = [...document.skillIds];
  for (const mandatoryId of mandatorySkillIds()) {
    if (!skillIds.includes(mandatoryId)) {
      skillIds.push(mandatoryId);
    }
  }
  return { ...document, skillIds };
}

export function documentContainsMandatorySkillLabels(document: TailoredCvDocument, language: CvLanguage): boolean {
  const labels = cvFacts.rules.mandatorySkillLabels;
  const selected = document.skillIds.map((id) => skillLabelById(id)).filter(Boolean) as string[];
  return labels.every((label) => selected.includes(label));
}
