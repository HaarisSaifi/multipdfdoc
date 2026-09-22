/**
 * Safe client-side loader for Mozilla PDF.js.
 * Loads locally self-hosted, patched PDF.js v4.10.38 without external CDN dependencies.
 * Uses CSP-safe native dynamic import (no eval, no new Function, no unsafe-eval).
 * Only executes in the browser to avoid Node/SSR canvas/fs errors.
 */

let pdfjsLibPromise: Promise<any> | null = null;

export async function getPdfJs(): Promise<any> {
  if (typeof window === "undefined") {
    throw new Error("PDF.js rendering must execute client-side in the browser.");
  }

  if (pdfjsLibPromise) {
    return pdfjsLibPromise;
  }

  pdfjsLibPromise = (async () => {
    try {
      // Same-origin URL resolution for CSP compliance
      const moduleUrl = new URL(
        "/vendor/pdfjs/pdf.min.mjs",
        window.location.origin
      ).href;

      // Native browser dynamic import with webpackIgnore: true
      // Webpack emits native import(moduleUrl) without bundling or requiring unsafe-eval
      const pdfjs: any = await import(
        /* webpackIgnore: true */
        moduleUrl
      );

      if (!pdfjs || !pdfjs.getDocument) {
        throw new Error("Failed to load local PDF.js library: getDocument not found.");
      }

      // Set worker to the exact matching locally self-hosted worker (v4.10.38)
      const workerUrl = new URL(
        "/vendor/pdfjs/pdf.worker.min.mjs",
        window.location.origin
      ).href;
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

      return pdfjs;
    } catch (err) {
      // Reset cached Promise on error so retry remains possible
      pdfjsLibPromise = null;
      throw err;
    }
  })();

  return pdfjsLibPromise;
}

/**
 * Standard parameters for opening untrusted PDFs with execution mitigations.
 * Sets isEvalSupported: false to disable untrusted PDF JavaScript evaluation.
 * Note: While isEvalSupported: false mitigates script evaluation in untrusted documents,
 * client-side sanitization and validation remain important defense-in-depth measures.
 */
export function getSafePdfDocumentParams(data: Uint8Array | ArrayBuffer) {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  return {
    data: bytes,
    isEvalSupported: false,
    disableFontFace: false,
    cMapUrl: "/vendor/pdfjs/cmaps/",
    cMapPacked: true,
    standardFontDataUrl: "/vendor/pdfjs/standard_fonts/",
  };
}
