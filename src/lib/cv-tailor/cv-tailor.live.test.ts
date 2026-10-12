import { describe, expect, it } from "vitest";
import { createJevClient } from "./jev";
import { createXaiClient } from "./xai";
import { generateTailoredCv } from "./pipeline";
import { fetchLinkedInPostingText } from "./linkedin";
import { fitDocumentToOnePage } from "./fitOnePage";
import { renderCvDocument } from "./render";
import { countPdfPages, renderCvPdf } from "./pdf";
import { writeFileSync, mkdirSync } from "fs";
import path from "path";

const POSTINGS = [
  { name: "buk-prodops", url: "https://www.linkedin.com/jobs/view/4475941808/" },
  { name: "falabella-product-analyst", url: "https://www.linkedin.com/jobs/view/4472754974/" },
];

const hasKeys = Boolean(process.env.XAI_API_KEY && process.env.JEV_API_KEY);

describe.runIf(hasKeys)("cv-tailor live postings", () => {
  it("generates sample PDFs and verdict tables for real LinkedIn postings", async () => {
    const outDir = path.resolve("docs/cv-tailor-samples");
    mkdirSync(outDir, { recursive: true });

    const xai = createXaiClient(process.env.XAI_API_KEY!);
    const jev = createJevClient(process.env.JEV_API_KEY!);

    for (const posting of POSTINGS) {
      const text = await fetchLinkedInPostingText(posting.url);
      const result = await generateTailoredCv({ xai, jev }, text);
      expect(result.ok).toBe(true);
      if (!result.ok) {
        continue;
      }
      const fit = fitDocumentToOnePage(result.document);
      const rendered = renderCvDocument(fit.document);
      const pdf = await renderCvPdf(rendered, fit.fontSize);
      const pages = await countPdfPages(pdf);
      expect(pages).toBe(1);

      writeFileSync(path.join(outDir, `${posting.name}.pdf`), pdf);
      const table = [
        "| Change | Jev verdicts | Majority | Kept | Overstatement |",
        "| --- | --- | --- | --- | --- |",
        ...result.changeLog.map(
          (entry) =>
            `| ${entry.description.replace(/\|/g, "/")} | ${entry.verdicts.join(", ")} | ${entry.majorityVerdict} | ${entry.kept ? "yes" : "no"} | ${entry.maxOverstatementRisk.toFixed(2)} |`,
        ),
      ].join("\n");
      writeFileSync(path.join(outDir, `${posting.name}-jev.md`), table);
    }
  });
});
