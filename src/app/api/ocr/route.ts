import { NextRequest, NextResponse } from "next/server";
import { getClientIp } from "@/lib/security/ip-utils";
import { checkOcrRateLimit } from "@/lib/security/rate-limiter";
import { validateDocumentFile } from "@/lib/security/file-validation";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit
const UPSTREAM_TIMEOUT_MS = 20000; // 20-second timeout

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Early Content-Length Gate (reject oversized requests before parsing multipart body)
    const contentLengthHeader = req.headers.get("content-length");
    if (contentLengthHeader) {
      const contentLength = parseInt(contentLengthHeader, 10);
      // Allow 8KB margin for multipart boundary metadata
      if (!isNaN(contentLength) && contentLength > MAX_FILE_SIZE_BYTES + 8192) {
        return NextResponse.json(
          {
            error:
              "Request payload exceeds 10MB maximum limit. Please use our 100% In-Browser Local Extraction for large files.",
          },
          { status: 413 }
        );
      }
    }

    // 2. Trusted-Proxy IP Extraction & Distributed Rate Limiting
    const clientIp = getClientIp(req);
    const rateLimitResult = await checkOcrRateLimit(clientIp);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        { status: rateLimitResult.status || 429 }
      );
    }

    // 3. Multipart Form Data Parsing
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const mode = (formData.get("mode") as string) || "auto"; // "auto" | "handwriting" | "document"

    if (!file) {
      return NextResponse.json(
        { error: "No document or image file provided." },
        { status: 400 }
      );
    }

    // 4. Post-Parse File Size Verification (never trust only Content-Length header)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          error:
            "File size exceeds 10MB maximum limit. Please use our unlimited 100% In-Browser Local Extraction.",
        },
        { status: 413 }
      );
    }

    // 5. Read Buffer & Verify Magic Byte Signatures + MIME Type + 20-Page Cap
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const validation = await validateDocumentFile(buffer, file.type);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: validation.status || 415 }
      );
    }

    const effectiveMime = validation.detectedMime || "application/pdf";
    const base64Data = buffer.toString("base64");

    // 6. Gemini Multimodal Document Vision API with Multi-Key Failover Pool & 20s Timeout
    const keysRaw = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "";
    const apiKeys = keysRaw
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    if (apiKeys.length === 0) {
      return NextResponse.json(
        {
          error:
            "Cloud AI OCR service is currently unconfigured. Please use 'In-Browser Local Extraction' mode for instant zero-server extraction.",
        },
        { status: 503 }
      );
    }

    const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const promptText =
      mode === "handwriting"
        ? "Transcribe this handwritten document with exact verbatim precision. Preserve all line breaks, handwritten annotations, signatures, numbers, and symbols. Return ONLY the transcribed text without introductory or conversational filler."
        : "Perform optical character recognition (OCR) on this document. Extract all printed text, headings, tabular content, and notations accurately with original structure. Return ONLY the extracted text.";

    // Sequential key failover loop with AbortController timeout
    for (let i = 0; i < apiKeys.length; i++) {
      const activeKey = apiKeys[i];
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${activeKey}`;

      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), UPSTREAM_TIMEOUT_MS);

      try {
        const geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: promptText },
                  {
                    inline_data: {
                      mime_type: effectiveMime,
                      data: base64Data,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 8192,
            },
          }),
          signal: abortController.signal,
        });

        clearTimeout(timeoutId);

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const extractedText =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

          // Sanitized telemetry log — zero PII, zero text logging, zero filenames, zero keys
          console.info("[ocr-audit] Cloud OCR scan succeeded", {
            durationMs: Date.now() - startTime,
            pageCount: validation.pageCount ?? 1,
            mime: effectiveMime,
            keyIndex: i + 1,
          });

          return NextResponse.json({
            text: extractedText,
            engine: `Cloud Neural AI (${geminiModel}) [Key Pool #${i + 1}]`,
          });
        } else {
          // Log only HTTP status code — never log response body which may echo user content
          console.warn("[ocr-audit] Upstream provider returned non-200 status", {
            keyIndex: i + 1,
            statusCode: geminiRes.status,
          });
        }
      } catch (fetchErr: any) {
        clearTimeout(timeoutId);

        if (fetchErr?.name === "AbortError" || abortController.signal.aborted) {
          console.warn("[ocr-audit] Upstream provider request timed out (20s cap reached)", {
            keyIndex: i + 1,
          });
          return NextResponse.json(
            {
              error:
                "Cloud AI provider timed out (20-second limit reached). Please retry or use our instant In-Browser Local Extraction.",
            },
            { status: 504 }
          );
        }

        // Generic error without leaking network or key internals
        console.warn("[ocr-audit] Upstream key attempt failed", {
          keyIndex: i + 1,
          errorType: fetchErr?.name || "FetchError",
        });
      }
    }

    // 7. Failover Exhausted Response
    return NextResponse.json(
      {
        error:
          "Upstream Cloud AI provider is currently unreachable or capacity is exhausted. Please use 'In-Browser Local Extraction' for instant zero-server processing.",
      },
      { status: 502 }
    );
  } catch (err: any) {
    // Top-level unhandled exception guard — no PII leakage
    console.error("[ocr-audit] Internal server error in OCR route handler", {
      errorType: err?.name || "UnknownError",
    });

    return NextResponse.json(
      { error: "Internal server error during document processing." },
      { status: 500 }
    );
  }
}
