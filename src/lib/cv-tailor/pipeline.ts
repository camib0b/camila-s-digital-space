import { buildDefaultDocument, renderCvDocument } from "./render";
import { enforceMandatorySkills, validateTailoredDocument } from "./validate";
import { fitDocumentToOnePage } from "./fitOnePage";
import type {
  CvChangeLogEntry,
  CvGenerateResult,
  CvWarning,
  PostingAnalysis,
  TailoredCvDocument,
} from "./types";
import type { JevClient } from "./jev";
import { evaluateChangeWithMajority } from "./jev";
import type { XaiClient } from "./xai";
import { analyzePosting, tailorCvWithFacts } from "./xai";
import { cvFacts } from "./facts";

export interface PipelineDeps {
  xai: XaiClient;
  jev: JevClient;
}

function buildWarnings(analysis: PostingAnalysis): CvWarning[] {
  const warnings: CvWarning[] = [];
  if (analysis.degreeRequired) {
    warnings.push({
      code: "degree_in_progress",
      message: `Posting expects a completed degree; expected graduation is July 2027 (${cvFacts.education.graduationMonth}).`,
    });
  }
  if (analysis.yearsRequired !== null && analysis.yearsRequired >= 3) {
    warnings.push({
      code: "years_experience",
      message: `Posting asks for ~${analysis.yearsRequired} years of experience; highlight internships and shipped products honestly.`,
    });
  }
  return warnings;
}

function diffDocuments(base: TailoredCvDocument, tailored: TailoredCvDocument): Array<{
  id: string;
  section: string;
  description: string;
  before: string | null;
  after: string;
}> {
  const changes: Array<{
    id: string;
    section: string;
    description: string;
    before: string | null;
    after: string;
  }> = [];

  const baseSkillSet = new Set(base.skillIds);
  const tailoredSkillSet = new Set(tailored.skillIds);
  for (const skillId of tailoredSkillSet) {
    if (!baseSkillSet.has(skillId)) {
      changes.push({
        id: `skill-add-${skillId}`,
        section: "skills",
        description: `Added skill ${skillId}`,
        before: null,
        after: skillId,
      });
    }
  }

  for (const role of tailored.roles) {
    const baseRole = base.roles.find((item) => item.roleId === role.roleId);
    for (const bullet of role.bullets) {
      const baseBullet = baseRole?.bullets.find((item) => item.sourceId === bullet.sourceId);
      if (!baseBullet || baseBullet.text !== bullet.text) {
        changes.push({
          id: `role-${role.roleId}-${bullet.sourceId}`,
          section: role.roleId,
          description: `Role bullet ${bullet.sourceId}`,
          before: baseBullet?.text ?? null,
          after: bullet.text,
        });
      }
    }
  }

  return changes;
}

function revertChange(document: TailoredCvDocument, changeId: string, base: TailoredCvDocument): TailoredCvDocument {
  if (changeId.startsWith("skill-add-")) {
    const skillId = changeId.replace("skill-add-", "");
    return {
      ...document,
      skillIds: document.skillIds.filter((id) => id !== skillId),
    };
  }
  const match = changeId.match(/^role-(.+)-(.+)$/);
  if (!match) {
    return document;
  }
  const roleId = match[1];
  const sourceId = match[2];
  const baseRole = base.roles.find((role) => role.roleId === roleId);
  const baseBullet = baseRole?.bullets.find((bullet) => bullet.sourceId === sourceId);
  return {
    ...document,
    roles: document.roles.map((role) => {
      if (role.roleId !== roleId) {
        return role;
      }
      return {
        ...role,
        bullets: role.bullets.map((bullet) => {
          if (bullet.sourceId !== sourceId) {
            return bullet;
          }
          if (baseBullet) {
            return { ...bullet, text: baseBullet.text };
          }
          return bullet;
        }),
      };
    }),
  };
}

export async function generateTailoredCv(
  deps: PipelineDeps,
  postingText: string,
): Promise<CvGenerateResult | { ok: false; error: string; details?: string[] }> {
  const analysis = await analyzePosting(deps.xai, postingText);
  const language = analysis.language;
  const baseDocument = buildDefaultDocument(language);
  let tailoredDocument = await tailorCvWithFacts(deps.xai, postingText, analysis, baseDocument);
  tailoredDocument = enforceMandatorySkills(tailoredDocument);

  const validationIssues = validateTailoredDocument(tailoredDocument);
  if (validationIssues.length > 0) {
    return {
      ok: false,
      error: "validation_failed",
      details: validationIssues.map((issue) => issue.message),
    };
  }

  const baseCv = renderCvDocument(baseDocument);
  let workingDocument = tailoredDocument;
  const rawChanges = diffDocuments(baseDocument, workingDocument);
  const changeLog: CvChangeLogEntry[] = [];

  for (const change of rawChanges) {
    const evaluation = await evaluateChangeWithMajority(deps.jev, {
      posting: postingText,
      baseCv: baseCv.plainText,
      tailoredCv: renderCvDocument(workingDocument).plainText,
      changeDescription: `${change.section}: ${change.after}`,
    });
    const maxOverstatement = Math.max(...evaluation.overstatementScores);
    const kept = evaluation.majority === "helps";
    if (!kept) {
      workingDocument = revertChange(workingDocument, change.id, baseDocument);
    }
    changeLog.push({
      id: change.id,
      section: change.section,
      description: change.description,
      before: change.before,
      after: change.after,
      verdicts: evaluation.verdicts,
      majorityVerdict: evaluation.majority,
      overstatementScores: evaluation.overstatementScores,
      maxOverstatementRisk: maxOverstatement,
      kept,
      highRisk: maxOverstatement >= 1.5,
    });
  }

  workingDocument = enforceMandatorySkills(workingDocument);
  const fit = fitDocumentToOnePage(workingDocument);
  workingDocument = fit.document;

  const tailoredCv = renderCvDocument(workingDocument);
  const warnings = buildWarnings(analysis);

  return {
    ok: true,
    postingAnalysis: analysis,
    baseCv,
    tailoredCv,
    document: workingDocument,
    changeLog,
    warnings,
  };
}

export async function generateTailoredCvMock(postingText: string): Promise<CvGenerateResult> {
  const language: "en" | "es" = /[áéíóúñ¿¡]/i.test(postingText) ? "es" : "en";
  const analysis: PostingAnalysis = {
    language,
    seniority: "mid",
    yearsRequired: 2,
    degreeRequired: true,
    mustHaveSkills: ["Excel"],
    keywords: ["operations", "product"],
    companyName: "Example Co",
    roleTitle: "Analyst",
  };
  const baseDocument = buildDefaultDocument(language);
  let tailoredDocument = enforceMandatorySkills({
    ...baseDocument,
    skillIds: baseDocument.skillIds.slice(0, 8),
    roles: baseDocument.roles.map((role) => ({
      ...role,
      bullets: role.bullets.slice(0, 2),
    })),
  });
  const fit = fitDocumentToOnePage(tailoredDocument);
  tailoredDocument = fit.document;
  return {
    ok: true,
    postingAnalysis: analysis,
    baseCv: renderCvDocument(baseDocument),
    tailoredCv: renderCvDocument(tailoredDocument),
    document: tailoredDocument,
    changeLog: [],
    warnings: buildWarnings(analysis),
  };
}
