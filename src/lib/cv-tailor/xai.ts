import { cvFacts } from "./facts";
import type { CvLanguage, PostingAnalysis, TailoredCvDocument } from "./types";

const XAI_CHAT_URL = "https://api.x.ai/v1/chat/completions";
const MODEL = "grok-4.7";

export interface XaiClient {
  completeJson<T>(system: string, user: string): Promise<T>;
}

export function createXaiClient(apiKey: string): XaiClient {
  return {
    async completeJson<T>(system: string, user: string): Promise<T> {
      const response = await fetch(XAI_CHAT_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      });
      if (!response.ok) {
        const body = await response.text();
        throw new Error(`xai_error:${response.status}:${body.slice(0, 200)}`);
      }
      const payload = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = payload.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("xai_empty");
      }
      return JSON.parse(content) as T;
    },
  };
}

export async function analyzePosting(client: XaiClient, postingText: string): Promise<PostingAnalysis> {
  const system = `You extract structured hiring requirements from job postings. Return JSON only with keys:
language ("en"|"es"), seniority (string), yearsRequired (number|null), degreeRequired (boolean),
mustHaveSkills (string[]), keywords (string[]), companyName (string|null), roleTitle (string|null).`;
  const result = await client.completeJson<PostingAnalysis>(system, postingText.slice(0, 12000));
  return {
    language: result.language === "es" ? "es" : "en",
    seniority: result.seniority ?? "unknown",
    yearsRequired: typeof result.yearsRequired === "number" ? result.yearsRequired : null,
    degreeRequired: Boolean(result.degreeRequired),
    mustHaveSkills: Array.isArray(result.mustHaveSkills) ? result.mustHaveSkills : [],
    keywords: Array.isArray(result.keywords) ? result.keywords : [],
    companyName: result.companyName ?? null,
    roleTitle: result.roleTitle ?? null,
  };
}

export async function tailorCvWithFacts(
  client: XaiClient,
  postingText: string,
  analysis: PostingAnalysis,
  baseDocument: TailoredCvDocument,
): Promise<TailoredCvDocument> {
  const system = `You tailor a CV using ONLY the provided facts JSON. You may select, reorder, and lightly rephrase bullets.
Every bullet must include sourceId from the facts. Never invent employers, dates, metrics, or skills.
Always include mandatory skill ids: ${JSON.stringify(cvFacts.rules.mandatorySkillLabels)} mapped to skill ids in facts.
ACFIN framing: ${cvFacts.rules.acfinFraming}
Never use forbidden product names: ${JSON.stringify(cvFacts.rules.forbiddenProductNamesOnBusinessCvs)}
Write in ${analysis.language}. Return JSON matching TailoredCvDocument shape:
{ language, headline, summaryBulletSourceIds, skillIds, roles:[{roleId, bullets:[{sourceId,text}]}],
projects:[{projectId, bullets:[{sourceId,text}]}], includeEducation, includeAthletics, includeLanguages }`;

  const user = JSON.stringify({
    posting: postingText.slice(0, 12000),
    analysis,
    facts: cvFacts,
    baseDocument,
  });

  const tailored = await client.completeJson<TailoredCvDocument>(system, user);
  return {
    ...baseDocument,
    ...tailored,
    language: analysis.language,
  };
}
