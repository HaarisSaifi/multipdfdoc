import type { PdfToolkit } from "pdfstudio";

let toolkitPromise: Promise<PdfToolkit> | null = null;

export async function getPdfToolkit(): Promise<PdfToolkit> {
  if (!toolkitPromise) {
    toolkitPromise = import("pdfstudio").then(({ createPdfToolkit }) => createPdfToolkit()).catch((error) => {
      toolkitPromise = null;
      throw error;
    });
  }
  return toolkitPromise;
}
