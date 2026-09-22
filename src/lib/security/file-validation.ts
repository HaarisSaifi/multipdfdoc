import { PDFDocument } from "pdf-lib";

export interface FileValidationResult {
  valid: boolean;
  status?: number;
  error?: string;
  detectedMime?: string;
  pageCount?: number;
}

/**
 * Validates file magic bytes against accepted document and image formats.
 * Accepts ONLY:
 * - PDF (%PDF)
 * - PNG (\x89PNG\r\n\x1a\n)
 * - JPEG (\xFF\xD8\xFF)
 * - WebP (RIFF....WEBP)
 */
export async function validateDocumentFile(
  buffer: Buffer,
  declaredMimeType: string
): Promise<FileValidationResult> {
  if (!buffer || buffer.length === 0) {
    return {
      valid: false,
      status: 400,
      error: "Uploaded file payload is empty.",
    };
  }

  if (buffer.length < 4) {
    return {
      valid: false,
      status: 415,
      error: "Unsupported file signature. Only authentic PDF, PNG, JPEG, and WebP files are accepted.",
    };
  }

  // 1. Detect Magic Bytes
  let detectedMime: string | null = null;

  // PDF check: starts with '%PDF' (0x25 0x50 0x44 0x46)
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    detectedMime = "application/pdf";
  }
  // PNG check: 89 50 4E 47 0D 0A 1A 0A
  else if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    detectedMime = "image/png";
  }
  // JPEG check: FF D8 FF
  else if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    detectedMime = "image/jpeg";
  }
  // WebP check: RIFF at [0..3] and WEBP at [8..11]
  else if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    detectedMime = "image/webp";
  }

  // If no allowed magic signature matches, reject immediately
  if (!detectedMime) {
    return {
      valid: false,
      status: 415,
      error: "Unsupported file signature. Only authentic PDF, PNG, JPEG, and WebP files are accepted.",
    };
  }

  // 2. MIME Mismatch / File Masking Protection
  const normalizedDeclared = (declaredMimeType || "").toLowerCase().trim();
  if (normalizedDeclared) {
    // If declared MIME conflicts with detected magic bytes (e.g. executable disguised as .pdf)
    const isPdfMatch = detectedMime === "application/pdf" && normalizedDeclared.includes("pdf");
    const isImageMatch = detectedMime.startsWith("image/") && (normalizedDeclared.startsWith("image/") || normalizedDeclared === "application/octet-stream");

    if (!isPdfMatch && !isImageMatch) {
      return {
        valid: false,
        status: 415,
        error: `MIME type mismatch: Declared '${declaredMimeType}' does not match detected file signature '${detectedMime}'.`,
      };
    }
  }

  // 3. PDF Page Cap Enforcement (Max 20 pages for Cloud AI)
  if (detectedMime === "application/pdf") {
    try {
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pageCount = pdfDoc.getPageCount();

      if (pageCount > 20) {
        return {
          valid: false,
          status: 413,
          error: `Document has ${pageCount} pages, exceeding the 20-page Cloud AI limit. For large documents, please use our unlimited 100% In-Browser Local Extraction.`,
          pageCount,
        };
      }

      return {
        valid: true,
        detectedMime,
        pageCount,
      };
    } catch (pdfErr: any) {
      return {
        valid: false,
        status: 415,
        error: "Unable to parse PDF structure. The file may be password-protected or corrupted.",
      };
    }
  }

  return {
    valid: true,
    detectedMime,
  };
}
