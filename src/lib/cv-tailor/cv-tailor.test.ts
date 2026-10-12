import { describe, expect, it } from "vitest";
import { extractPostingTextFromHtml } from "./linkedin";
import { generateTailoredCvMock } from "./pipeline";
import { buildDefaultDocument, renderCvDocument } from "./render";
import { enforceMandatorySkills, validateTailoredDocument, documentContainsMandatorySkillLabels } from "./validate";
import { fitDocumentToOnePage } from "./fitOnePage";
import { countPdfPages, renderCvPdf } from "./pdf";
import { readFileSync } from "fs";
import path from "path";

const FAKE_POSTING = `
Product Operations Specialist — requires Excel, stakeholder communication, and SQL.
Bachelor's degree required. 2+ years experience. Spanish working language.
`;

describe("cv-tailor pipeline", () => {
  it("rejects bullets without valid source ids", async () => {
    const base = buildDefaultDocument("en");
    const invalid = {
      ...base,
      roles: [
        {
          roleId: "role.acfin",
          bullets: [{ sourceId: "not.a.real.id", text: "Invented bullet." }],
        },
      ],
    };
    const issues = validateTailoredDocument(invalid);
    expect(issues.some((issue) => issue.code === "invalid_source")).toBe(true);
  });

  it("always includes mandatory Office and Excel skills after enforcement", async () => {
    const result = await generateTailoredCvMock(FAKE_POSTING);
    const enforced = enforceMandatorySkills(result.document);
    expect(documentContainsMandatorySkillLabels(enforced, enforced.language)).toBe(true);
    const issues = validateTailoredDocument(enforced);
    expect(issues.filter((issue) => issue.code === "missing_mandatory_skill")).toHaveLength(0);
  });

  it("renders a one-page PDF for a fitted document", async () => {
    const result = await generateTailoredCvMock(FAKE_POSTING);
    const fit = fitDocumentToOnePage(result.document);
    const rendered = renderCvDocument(fit.document);
    const pdf = await renderCvPdf(rendered, fit.fontSize);
    const pages = await countPdfPages(pdf);
    expect(pages).toBe(1);
  });

  it("extracts LinkedIn guest HTML posting text", () => {
    const htmlPath = path.resolve("/tmp/buk-job.html");
    let html = "<div class=\"description__text description__text--rich\"><div class=\"show-more-less-html__markup\">Hi</div></div>";
    try {
      html = readFileSync(htmlPath, "utf8");
    } catch {
      // use minimal fixture when live fetch file absent
    }
    const text = extractPostingTextFromHtml(html);
    expect(text.length).toBeGreaterThan(20);
  });
});
