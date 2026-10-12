import { cvFacts, localized } from "./facts";
import type { CvLanguage, RenderedCv, TailoredCvDocument } from "./types";

export function buildDefaultDocument(language: CvLanguage): TailoredCvDocument {
  return {
    language,
    headline: localized(cvFacts.headline, language),
    summaryBulletSourceIds: cvFacts.summaryBullets.map((bullet) => bullet.id),
    skillIds: cvFacts.skills.map((skill) => skill.id),
    roles: cvFacts.roles.map((role) => ({
      roleId: role.id,
      bullets: role.bullets.map((bullet) => ({
        sourceId: bullet.id,
        text: language === "es" ? bullet.es : bullet.en,
      })),
    })),
    projects: cvFacts.projects.map((project) => ({
      projectId: project.id,
      bullets: project.bullets.map((bullet) => ({
        sourceId: bullet.id,
        text: language === "es" ? bullet.es : bullet.en,
      })),
    })),
    includeEducation: true,
    includeAthletics: true,
    includeLanguages: true,
  };
}

export function renderCvDocument(document: TailoredCvDocument): RenderedCv {
  const language = document.language;
  const lines: string[] = [];
  const sections: Record<string, string[]> = {};

  lines.push(cvFacts.contact.name);
  lines.push(document.headline);
  lines.push(`${cvFacts.contact.location} · ${cvFacts.contact.email}`);
  lines.push("");

  const summaryLines: string[] = [];
  for (const sourceId of document.summaryBulletSourceIds) {
    const bullet = cvFacts.summaryBullets.find((item) => item.id === sourceId);
    if (bullet) {
      summaryLines.push(language === "es" ? bullet.es : bullet.en);
    }
  }
  if (summaryLines.length > 0) {
    sections.summary = summaryLines;
    lines.push(language === "es" ? "RESUMEN" : "SUMMARY");
    for (const line of summaryLines) {
      lines.push(`· ${line}`);
    }
    lines.push("");
  }

  const skillLabels = document.skillIds
    .map((id) => cvFacts.skills.find((skill) => skill.id === id)?.label)
    .filter(Boolean) as string[];
  sections.skills = skillLabels;
  lines.push(language === "es" ? "HABILIDADES" : "SKILLS");
  lines.push(skillLabels.join(" · "));
  lines.push("");

  const experienceLines: string[] = [];
  lines.push(language === "es" ? "EXPERIENCIA" : "EXPERIENCE");
  for (const roleSection of document.roles) {
    const role = cvFacts.roles.find((item) => item.id === roleSection.roleId);
    if (!role) {
      continue;
    }
    const header = `${localized(role.title, language)} — ${localized(role.company, language)} (${localized(role.period, language)})`;
    experienceLines.push(header);
    lines.push(header);
    for (const bullet of roleSection.bullets) {
      const line = `· ${bullet.text}`;
      experienceLines.push(line);
      lines.push(line);
    }
    lines.push("");
  }
  sections.experience = experienceLines;

  const projectLines: string[] = [];
  lines.push(language === "es" ? "PROYECTOS" : "PROJECTS");
  for (const projectSection of document.projects) {
    const project = cvFacts.projects.find((item) => item.id === projectSection.projectId);
    if (!project) {
      continue;
    }
    const header = `${localized(project.title, language)} (${localized(project.type, language)})`;
    projectLines.push(header);
    lines.push(header);
    for (const bullet of projectSection.bullets) {
      const line = `· ${bullet.text}`;
      projectLines.push(line);
      lines.push(line);
    }
    lines.push("");
  }
  sections.projects = projectLines;

  if (document.includeEducation) {
    const educationLines = [
      `${localized(cvFacts.education.degree, language)} — ${localized(cvFacts.education.institution, language)}`,
      localized(cvFacts.education.period, language),
      localized(cvFacts.education.details, language),
      `${language === "es" ? "Asignaturas" : "Coursework"}: ${localized(cvFacts.education.coursework, language)}`,
    ];
    sections.education = educationLines;
    lines.push(language === "es" ? "EDUCACIÓN" : "EDUCATION");
    for (const line of educationLines) {
      lines.push(line);
    }
    lines.push("");
  }

  if (document.includeLanguages) {
    const languageLines = [
      `${localized(cvFacts.languages.pair, language)} — ${localized(cvFacts.languages.note, language)}`,
    ];
    sections.languages = languageLines;
    lines.push(language === "es" ? "IDIOMAS" : "LANGUAGES");
    for (const line of languageLines) {
      lines.push(line);
    }
    lines.push("");
  }

  if (document.includeAthletics) {
    const athleticsLines: string[] = [];
    lines.push(language === "es" ? "HOCKEY" : "HOCKEY");
    for (const item of cvFacts.athletics) {
      let line = `${localized(item.role, language)} — ${localized(item.organization, language)}`;
      if (item.description) {
        line += `. ${localized(item.description, language)}`;
      }
      athleticsLines.push(line);
      lines.push(line);
    }
    sections.athletics = athleticsLines;
  }

  return {
    language,
    plainText: lines.join("\n").trim(),
    sections,
  };
}
