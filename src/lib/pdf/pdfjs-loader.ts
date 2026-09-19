/**
 * Safe client-side loader for Mozilla PDF.js.
 * Loads pdfjs in the browser without SSR Node canvas/fs errors.
 */

let pdfjsLibInstance: any = null;

export async function getPdfJs(): Promise<any> {
  if (typeof window === "undefined") {
    throw new Error("PDF.js rendering must execute client-side in the browser.");
  }

  if (pdfjsLibInstance) {
    return pdfjsLibInstance;
  }

  if ((window as any).pdfjsLib) {
    pdfjsLibInstance = (window as any).pdfjsLib;
    return pdfjsLibInstance;
  }

  return new Promise((resolve, reject) => {
    const existing = document.getElementById("pdfjs-cdn-script");
    if (existing) {
      if ((window as any).pdfjsLib) {
        pdfjsLibInstance = (window as any).pdfjsLib;
        resolve(pdfjsLibInstance);
        return;
      }
      existing.addEventListener("load", () => {
        const lib = (window as any).pdfjsLib;
        if (lib) {
          lib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          pdfjsLibInstance = lib;
          resolve(lib);
        } else {
          reject(new Error("PDF.js script loaded but pdfjsLib not found."));
        }
      });
      return;
    }

    const script = document.createElement("script");
    script.id = "pdfjs-cdn-script";
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;

    script.onload = () => {
      const lib = (window as any).pdfjsLib;
      if (lib) {
        lib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        pdfjsLibInstance = lib;
        resolve(lib);
      } else {
        reject(new Error("PDF.js failed to initialize on window object."));
      }
    };

    script.onerror = () => {
      reject(new Error("Failed to load PDF.js script from CDN. Please check network connection."));
    };

    document.head.appendChild(script);
  });
}
