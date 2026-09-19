import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const mode = (formData.get("mode") as string) || "auto"; // "auto" | "handwriting" | "document"

    if (!file) {
      return NextResponse.json(
        { error: "No document or image file provided." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");
    const mimeType = file.type || (file.name.endsWith(".pdf") ? "application/pdf" : "image/png");

    // 1. Check if Oracle Cloud Microservice is configured
    const oracleBackendUrl = process.env.ORACLE_OCR_BACKEND_URL;
    if (oracleBackendUrl && mimeType.startsWith("image/")) {
      try {
        const backendRes = await fetch(`${oracleBackendUrl}/ocr`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_base64: base64Data,
            mime_type: mimeType,
            mode: mode,
          }),
        });

        if (backendRes.ok) {
          const result = await backendRes.json();
          return NextResponse.json({
            text: result.text || "",
            confidence: typeof result.confidence === "number" ? result.confidence : undefined,
            engine: `Oracle Cloud OCR (${result.engine || "PaddleOCR/TrOCR"})`,
          });
        }
      } catch (oracleErr) {
        console.warn("Oracle OCR microservice unreachable, falling back to Gemini API...", oracleErr);
      }
    }

    // 2. Fallback to Gemini Multimodal Document Vision API
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey) {
      try {
        const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;
        const promptText =
          mode === "handwriting"
            ? "Transcribe this handwritten document with exact verbatim precision. Preserve all line breaks, handwritten annotations, signatures, numbers, and symbols. Return ONLY the transcribed text without introductory or conversational filler."
            : "Perform optical character recognition (OCR) on this document. Extract all printed text, headings, tabular content, and notations accurately with original structure. Return ONLY the extracted text.";

        // Correct MIME mapping: pass application/pdf natively or clean image MIME
        const effectiveMime =
          mimeType === "application/pdf"
            ? "application/pdf"
            : mimeType.startsWith("image/")
            ? mimeType
            : "image/png";

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
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const extractedText =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          return NextResponse.json({
            text: extractedText,
            engine: `Cloud Neural AI (${geminiModel})`,
          });
        } else {
          const errBody = await geminiRes.text();
          console.warn("Gemini API non-200 response:", geminiRes.status, errBody);
        }
      } catch (geminiErr) {
        console.warn("Gemini API error:", geminiErr);
      }
    }

    // 3. Informative response if cloud credentials are not provisioned
    return NextResponse.json(
      {
        text: "",
        error:
          "Cloud AI OCR credentials are not currently configured on this instance. Please use Local In-Browser Extraction mode for instant zero-server OCR.",
      },
      { status: 503 }
    );
  } catch (error: any) {
    console.error("OCR API error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during OCR processing." },
      { status: 500 }
    );
  }
}
