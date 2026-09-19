import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const mode = (formData.get("mode") as string) || "auto"; // "auto" | "handwriting" | "document"

    if (!file) {
      return NextResponse.json(
        { error: "No image or document file provided." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    const mimeType = file.type || "image/png";

    // 1. Check if Oracle Cloud Microservice is configured
    const oracleBackendUrl = process.env.ORACLE_OCR_BACKEND_URL;
    if (oracleBackendUrl) {
      try {
        const backendRes = await fetch(`${oracleBackendUrl}/ocr`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_base64: base64Image,
            mime_type: mimeType,
            mode: mode,
          }),
        });

        if (backendRes.ok) {
          const result = await backendRes.json();
          return NextResponse.json({
            text: result.text || "",
            confidence: result.confidence || 0.95,
            engine: `Oracle Cloud 24GB (${result.engine || "PaddleOCR/TrOCR"})`,
          });
        }
      } catch (oracleErr) {
        console.warn("Oracle OCR microservice unreachable, falling back...", oracleErr);
      }
    }

    // 2. Fallback to Gemini 2.0 Flash API if configured
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
        const promptText =
          mode === "handwriting"
            ? "Transcribe this handwritten document with 100% verbatim accuracy. Preserve all line breaks, handwritten words, signatures, numbers, and symbols. Return ONLY the transcribed text without conversational commentary."
            : "Perform optical character recognition (OCR) on this document. Extract all printed text, headings, tables, and notes accurately. Return ONLY the extracted text.";

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
                      mime_type: mimeType.startsWith("image/") ? mimeType : "image/png",
                      data: base64Image,
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
            confidence: 0.99,
            engine: "Gemini 2.0 Flash AI Deep Scan",
          });
        }
      } catch (geminiErr) {
        console.warn("Gemini API error:", geminiErr);
      }
    }

    // 3. Fallback response instructing client-side processing
    return NextResponse.json({
      text: "",
      error: "Backend AI OCR engines are currently initializing. Use In-Browser Standard OCR mode for instant local extraction.",
      engine: "Local Browser Fallback Required",
    }, { status: 503 });

  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal OCR processing error" },
      { status: 500 }
    );
  }
}
