import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { RenderedCv } from "./types";

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const MARGIN = 48;

export async function renderCvPdf(cv: RenderedCv, fontSize = 10.5): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([A4_WIDTH, A4_HEIGHT]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let y = A4_HEIGHT - MARGIN;
  const lines = cv.plainText.split("\n");

  for (const line of lines) {
    if (y < MARGIN) {
      break;
    }
    const isHeading =
      line === line.toUpperCase() &&
      line.length < 40 &&
      !line.startsWith("·") &&
      line.trim() !== "" &&
      !line.includes("@");
    const activeFont = isHeading ? bold : font;
    const size = isHeading ? fontSize + 1 : fontSize;
    page.drawText(line, {
      x: MARGIN,
      y,
      size,
      font: activeFont,
      color: rgb(0.1, 0.1, 0.12),
      maxWidth: A4_WIDTH - MARGIN * 2,
    });
    y -= size + 4;
  }

  return pdf.save();
}

export async function countPdfPages(pdfBytes: Uint8Array): Promise<number> {
  const doc = await PDFDocument.load(pdfBytes);
  return doc.getPageCount();
}
