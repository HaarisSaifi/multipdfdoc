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

    // 2. Gemini Multimodal Document Vision API with Multi-Key Failover Pool
    const keysRaw = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "";
    const apiKeys = keysRaw
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    if (apiKeys.length > 0) {
      const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
      const promptText =
        mode === "handwriting"
          ? "Transcribe this handwritten document with exact verbatim precision. Preserve all line breaks, handwritten annotations, signatures, numbers, and symbols. Return ONLY the transcribed text without introductory or conversational filler."
          : "Perform optical character recognition (OCR) on this document. Extract all printed text, headings, tabular content, and notations accurately with original structure. Return ONLY the extracted text.";

      const effectiveMime =
        mimeType === "application/pdf"
          ? "application/pdf"
          : mimeType.startsWith("image/")
          ? mimeType
          : "image/png";

      let lastError = "";

      // Try each key in the failover pool sequentially
      for (let i = 0; i < apiKeys.length; i++) {
        const activeKey = apiKeys[i];
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${activeKey}`;

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
          });

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const extractedText =
              geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            return NextResponse.json({
              text: extractedText,
              engine: `Cloud Neural AI (${geminiModel}) [Key Pool #${i + 1}]`,
            });
          } else {
            const errBody = await geminiRes.text();
            lastError = `Key #${i + 1} HTTP ${geminiRes.status}: ${errBody}`;
            console.warn(`Gemini API key #${i + 1} failed, attempting next key in pool...`, lastError);
          }
        } catch (keyErr: any) {
          lastError = keyErr?.message || "Network error";
          console.warn(`Gemini API key #${i + 1} encountered exception, attempting next key...`, lastError);
        }
      }

      console.error("All Gemini API keys in failover pool were exhausted or failed:", lastError);
    }

    // 3. Fallback response instructing local in-browser mode
    return NextResponse.json(
      {
        text: "",
        error:
          "Cloud AI OCR service is currently busy or re-indexing. Please use 'In-Browser Local Extraction' mode for instant zero-server extraction.",
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
