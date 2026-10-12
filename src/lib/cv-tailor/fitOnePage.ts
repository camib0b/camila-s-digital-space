import { cvFacts } from "./facts";
import type { TailoredCvDocument, TailoredBullet } from "./types";
import { renderCvDocument } from "./render";

const MIN_FONT_SIZE = 9;
const START_FONT_SIZE = 10.5;
const MAX_LINES_APPROX = 52;

export interface FitResult {
  document: TailoredCvDocument;
  fontSize: number;
  trimmed: string[];
}

interface TrimCandidate {
  roleId?: string;
  projectId?: string;
  sourceId: string;
  priority: number;
}

function collectTrimCandidates(document: TailoredCvDocument): TrimCandidate[] {
  const candidates: TrimCandidate[] = [];
  for (const roleSection of document.roles) {
    const role = cvFacts.roles.find((item) => item.id === roleSection.roleId);
    for (const bullet of roleSection.bullets) {
      const source = role?.bullets.find((item) => item.id === bullet.sourceId);
      candidates.push({
        roleId: roleSection.roleId,
        sourceId: bullet.sourceId,
        priority: source?.priority ?? 0,
      });
    }
  }
  for (const projectSection of document.projects) {
    const project = cvFacts.projects.find((item) => item.id === projectSection.projectId);
    for (const bullet of projectSection.bullets) {
      const source = project?.bullets.find((item) => item.id === bullet.sourceId);
      candidates.push({
        projectId: projectSection.projectId,
        sourceId: bullet.sourceId,
        priority: source?.priority ?? 0,
      });
    }
  }
  return candidates.sort((a, b) => a.priority - b.priority);
}

function estimateLineCount(plainText: string, fontSize: number): number {
  const charsPerLine = Math.floor(480 / (fontSize * 0.55));
  const lines = plainText.split("\n");
  let total = 0;
  for (const line of lines) {
    if (line.trim() === "") {
      total += 1;
      continue;
    }
    total += Math.max(1, Math.ceil(line.length / charsPerLine));
  }
  return total;
}

function removeBullet(document: TailoredCvDocument, candidate: TrimCandidate): TailoredCvDocument {
  const next: TailoredCvDocument = {
    ...document,
    roles: document.roles.map((role) => {
      if (candidate.roleId && role.roleId === candidate.roleId) {
        return {
          ...role,
          bullets: role.bullets.filter((bullet) => bullet.sourceId !== candidate.sourceId),
        };
      }
      return role;
    }),
    projects: document.projects.map((project) => {
      if (candidate.projectId && project.projectId === candidate.projectId) {
        return {
          ...project,
          bullets: project.bullets.filter((bullet) => bullet.sourceId !== candidate.sourceId),
        };
      }
      return project;
    }),
  };
  return next;
}

export function fitDocumentToOnePage(document: TailoredCvDocument): FitResult {
  let working = document;
  let fontSize = START_FONT_SIZE;
  const trimmed: string[] = [];

  const fits = () => estimateLineCount(renderCvDocument(working).plainText, fontSize) <= MAX_LINES_APPROX;

  while (!fits() && fontSize > MIN_FONT_SIZE) {
    fontSize -= 0.5;
  }

  const candidates = collectTrimCandidates(working);
  let index = 0;
  while (!fits() && index < candidates.length) {
    const candidate = candidates[index];
    index += 1;
    working = removeBullet(working, candidate);
    trimmed.push(candidate.sourceId);
  }

  if (!fits() && working.includeAthletics) {
    working = { ...working, includeAthletics: false };
    trimmed.push("section:athletics");
  }
  if (!fits() && working.projects.length > 1) {
    working = { ...working, projects: working.projects.slice(0, 1) };
    trimmed.push("section:projects-trimmed");
  }

  return { document: working, fontSize, trimmed };
}

export function flattenBullets(document: TailoredCvDocument): TailoredBullet[] {
  const bullets: TailoredBullet[] = [];
  for (const role of document.roles) {
    bullets.push(...role.bullets);
  }
  for (const project of document.projects) {
    bullets.push(...project.bullets);
  }
  return bullets;
}
