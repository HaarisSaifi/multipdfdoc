import { createPdfToolkit, PdfToolkit } from "pdfstudio";

let toolkitPromise: Promise<PdfToolkit> | null = null;

export async function getPdfToolkit(): Promise<PdfToolkit> {
  if (!toolkitPromise) {
    toolkitPromise = createPdfToolkit();
  }
  return toolkitPromise;
}
