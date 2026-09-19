"use client";

import React, { useState, useRef } from "react";
import { MasterShell } from "@/components/layout/MasterShell";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import {
  FileText,
  Upload,
  Cpu,
  Sparkles,
  Copy,
  Check,
  Download,
  RotateCcw,
  ShieldCheck,
  Zap,
  Search,
  AlertCircle,
  Eye,
  Info,
} from "lucide-react";
import { getPdfJs } from "@/lib/pdf/pdfjs-loader";
import { createWorker } from "tesseract.js";

export default function PdfToTextPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [engineUsed, setEngineUsed] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [ocrMode, setOcrMode] = useState<"client" | "ai">("client");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAiNotice, setShowAiNotice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setExtractedText("");
      setEngineUsed(null);
    }
  };

  const processOCR = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(10);
    setStatusText("Reading document contents...");

    try {
      if (ocrMode === "client") {
        // --- LOCAL CLIENT-SIDE EXTRACTION (PDF.js + Tesseract.js) ---
        const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

        if (isPdf) {
          setStatusText("Initializing Mozilla PDF.js text layer...");
          setProgress(25);

          const pdfjs = await getPdfJs();
          const buffer = await file.arrayBuffer();
          const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
          const pdf = await loadingTask.promise;
          const totalPages = pdf.numPages;

          let digitalTextCombined = "";
          let scannedPagesDetected = 0;

          // Attempt digital text extraction first across pages
          for (let p = 1; p <= totalPages; p++) {
            setStatusText(`Extracting digital text from page ${p} of ${totalPages}...`);
            setProgress(Math.round(25 + (p / totalPages) * 35));

            const page = await pdf.getPage(p);
            const textContent = await page.getTextContent();
            const pageStrings = textContent.items
              .map((item: any) => item.str)
              .join(" ")
              .trim();

            if (pageStrings.length > 25) {
              digitalTextCombined += `\n--- PAGE ${p} ---\n${pageStrings}\n`;
            } else {
              scannedPagesDetected++;
            }
          }

          // If digital text was found on pages, display it
          if (digitalTextCombined.trim().length > 50 && scannedPagesDetected === 0) {
            setExtractedText(digitalTextCombined.trim());
            setEngineUsed("Mozilla PDF.js Native Text Extraction (Local)");
            setProgress(100);
            return;
          }

          // If pages had no digital text (scanned PDF), invoke local Tesseract.js WASM
          setStatusText(`Scanned pages detected. Launching Tesseract.js WASM OCR...`);
          setProgress(65);

          const worker = await createWorker("eng");
          let ocrOutput = digitalTextCombined ? `${digitalTextCombined}\n\n[OCR FOR SCANNED PAGES]:\n` : "";

          const maxOcrPages = Math.min(totalPages, 10);
          for (let p = 1; p <= maxOcrPages; p++) {
            setStatusText(`Running local Tesseract OCR on page ${p}/${maxOcrPages}...`);
            setProgress(Math.round(65 + (p / maxOcrPages) * 30));

            const page = await pdf.getPage(p);
            const viewport = page.getViewport({ scale: 2.0 }); // 144 DPI for crisp OCR
            const canvas = document.createElement("canvas");
            canvas.width = Math.ceil(viewport.width);
            canvas.height = Math.ceil(viewport.height);
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.fillStyle = "#FFFFFF";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              await page.render({ canvasContext: ctx, viewport }).promise;

              const {
                data: { text },
              } = await worker.recognize(canvas);
              ocrOutput += `\n--- PAGE ${p} (OCR) ---\n${text.trim()}\n`;
            }
          }

          await worker.terminate();
          setExtractedText(ocrOutput.trim() || "No text could be extracted from this document.");
          setEngineUsed("Tesseract.js WebAssembly OCR (Local)");
          setProgress(100);
        } else {
          // Image file (PNG / JPEG) -> Run directly through Tesseract.js
          setStatusText("Initializing Tesseract.js OCR engine...");
          setProgress(30);

          const worker = await createWorker("eng");
          setStatusText("Analyzing image characters...");
          setProgress(70);

          const imgUrl = URL.createObjectURL(file);
          const {
            data: { text },
          } = await worker.recognize(imgUrl);
          URL.revokeObjectURL(imgUrl);

          await worker.terminate();
          setExtractedText(text.trim() || "No text detected in image.");
          setEngineUsed("Tesseract.js In-Browser WASM (Local)");
          setProgress(100);
        }
      } else {
        // --- CLOUD AI DEEP SCAN MODE (/api/ocr) ---
        setStatusText("Transmitting to Cloud AI OCR API...");
        setProgress(40);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("mode", "handwriting");

        const res = await fetch("/api/ocr", {
          method: "POST",
          body: formData,
        });

        setProgress(85);
        setStatusText("Parsing neural transcription output...");

        if (res.ok) {
          const data = await res.json();
          setExtractedText(data.text || "No text returned by AI model.");
          setEngineUsed(data.engine || "Cloud AI OCR");
          setProgress(100);
        } else {
          const errData = await res.json().catch(() => ({}));
          setExtractedText(
            `Cloud Service Notice: ${
              errData.error || "Cloud AI endpoint is unavailable."
            }\n\nYou can switch to 'In-Browser Local Extraction' to extract text 100% offline without server dependencies.`
          );
          setEngineUsed("Service Notice");
          setProgress(100);
        }
      }
    } catch (err: any) {
      console.error("OCR Processing error:", err);
      setExtractedText(`Extraction Error: ${err?.message || "Failed to process document."}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${file?.name?.replace(/\.[^/.]+$/, "") || "extracted"}_text.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = extractedText
    ? extractedText.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const charCount = extractedText.length;
  const readingTime = Math.ceil(wordCount / 200);

  const displayedText = searchQuery
    ? extractedText
        .split("\n")
        .filter((line) => line.toLowerCase().includes(searchQuery.toLowerCase()))
        .join("\n")
    : extractedText;

  return (
    <MasterShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header Title */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-100/80 shadow-clay-badge mb-4">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span className="text-xs font-semibold text-violet-800 tracking-wide uppercase">
              Dual-Engine Document OCR
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            PDF & Image to Text{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              OCR Extractor
            </span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Extract clean text, tables, and notes from PDFs and images. Choose between 100% private in-browser extraction (PDF.js + Tesseract.js) or optional Cloud AI scanning.
          </p>
        </div>

        {/* Engine Mode Selection Toggle */}
        <div className="max-w-xl mx-auto mb-6">
          <div className="p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80 flex items-center shadow-inner">
            <button
              onClick={() => {
                setOcrMode("client");
                setShowAiNotice(false);
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                ocrMode === "client"
                  ? "bg-white text-violet-700 shadow-clay-card border border-violet-100"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>In-Browser Local Extraction</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold hidden sm:inline">
                Zero-Upload
              </span>
            </button>

            <button
              onClick={() => {
                setOcrMode("ai");
                setShowAiNotice(true);
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                ocrMode === "ai"
                  ? "bg-white text-violet-700 shadow-clay-card border border-violet-100"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Cpu className="w-4 h-4 text-violet-600" />
              <span>AI Deep Scan / Handwriting</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 font-bold hidden sm:inline">
                Cloud AI
              </span>
            </button>
          </div>
        </div>

        {/* Transparent Cloud Notice when AI Mode is active */}
        {ocrMode === "ai" && (
          <div className="max-w-xl mx-auto mb-6 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 animate-in fade-in-50">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Cloud Processing Notice:</strong> AI Deep Scan securely transmits this document to our OCR processing service for neural vision transcription. If you require zero data transmission, choose <strong>In-Browser Local Extraction</strong>.
            </div>
          </div>
        )}

        {/* Main Work Area Card */}
        <div className="bubble-card p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-clay-card mb-10 bg-white">
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-violet-400 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 bg-slate-50/50 hover:bg-violet-50/30 group"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center shadow-clay-badge group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                Select or Drop Document / Image
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
                Supports PDF documents, PNG, JPG, and WebP images.
              </p>
              <button
                type="button"
                className="btn-clay px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 shadow-clay-btn hover:shadow-clay-btn-hover"
              >
                Browse Document
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center font-bold flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type || "Document"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setFile(null);
                      setExtractedText("");
                      setEngineUsed(null);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
                  >
                    Change File
                  </button>
                  <button
                    onClick={processOCR}
                    disabled={isProcessing}
                    className="btn-clay px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 shadow-clay-btn hover:shadow-clay-btn-hover disabled:opacity-50 flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Zap className="w-4 h-4 animate-spin" />
                        <span>Extracting...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Start Extraction</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {isProcessing && (
                <div className="mb-6 p-4 rounded-2xl bg-violet-50/70 border border-violet-100">
                  <div className="flex justify-between items-center text-xs font-semibold text-violet-800 mb-2">
                    <span>{statusText}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-violet-200/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-300 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {extractedText && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">
                        Extracted Output
                      </span>
                      {engineUsed && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {engineUsed}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{wordCount} words</span>
                      <span>•</span>
                      <span>{charCount} chars</span>
                      <span>•</span>
                      <span>~{readingTime} min read</span>
                    </div>
                  </div>

                  <div className="relative mb-3">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search within extracted text..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <textarea
                    value={displayedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    rows={12}
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-violet-500 shadow-inner resize-y"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className="btn-clay px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 shadow-clay-card hover:bg-slate-50 flex items-center gap-1.5"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>Copy Text</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleDownload}
                        className="btn-clay px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 shadow-clay-card hover:bg-slate-50 flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                        <span>Download .TXT</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setExtractedText("")}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <AdPlaceholder slot="mid-rectangle" format="rectangle" />

        {/* Value Wrapper with Honest Sources & Technical Architecture */}
        <ValueWrapper
          title="Document Text Extraction Architecture: Native Text Layers vs. OCR Rasterization"
          subtitle="How client-side text parsers, WebAssembly Tesseract OCR, and neural vision models extract textual data from digital and scanned PDFs."
          authorName="MultiPDF Doc Technology Team"
          lastUpdated="Updated September 2026"
          sources={[
            {
              title: "Adobe PDF Reference (ISO 32000-1): Text Operators and Font Metrics",
              publisher: "Adobe Systems & ISO",
              url: "https://www.adobe.com/devnet/pdf/pdf_reference.html",
              accessed: "September 2026",
            },
            {
              title: "Mozilla PDF.js: Text Layer Extraction Architecture",
              publisher: "Mozilla Foundation",
              url: "https://mozilla.github.io/pdf.js/",
              accessed: "September 2026",
            },
            {
              title: "Tesseract OCR Engine Overview and WebAssembly Compilation",
              publisher: "Ray Smith / Apache 2.0 Open Source",
              url: "https://github.com/tesseract-ocr/tesseract",
              accessed: "September 2026",
            },
            {
              title: "Google Generative AI Document Processing Specifications",
              publisher: "Google AI for Developers",
              url: "https://ai.google.dev/gemini-api/docs/document-processing",
              accessed: "September 2026",
            },
          ]}
          sections={[
            {
              heading: "1. Digital PDF Text Extraction vs. Scanned Optical Character Recognition",
              content: `Understanding how text is stored inside a PDF determines the optimal extraction strategy:

• Digital Vector PDFs: Generated by software like Microsoft Word or LaTeX. Text glyphs are encoded alongside Unicode mappings and coordinate positioning matrices. Our Local Extraction engine uses Mozilla PDF.js to directly read these native character streams instantaneously with zero OCR overhead and 100% fidelity.
• Scanned Image PDFs & Photos: Contain flat bitmap pictures without underlying character coordinates. These require rasterization followed by Optical Character Recognition (OCR), where neural or statistical filters identify glyph shapes, baseline angles, and word boundaries.`,
            },
            {
              heading: "2. The Multi-Layer Extraction Architecture",
              content: `To provide the highest accuracy without compromising user privacy, MultiPDF Doc uses a 3-tier extraction pipeline:

1. Fast Local Text Layer (Mozilla PDF.js): Inspects native document streams inside browser memory. If selectable text exists, it is parsed directly.
2. Local Scanned OCR (Tesseract.js WebAssembly): If a page is purely an image, the page is rendered onto an in-memory HTML5 Canvas and processed by Tesseract's neural LSTM model compiled to WebAssembly. Zero bytes leave your machine.
3. Cloud AI Deep Scan (Multimodal Vision API): Designed for non-standard cursive handwriting, historical archives, or damaged photocopies. Prominently informs the user before transmitting the document to secure neural vision endpoints.`,
            },
            {
              heading: "3. Best Practices for High OCR Recognition Accuracy",
              content: `When scanning documents for OCR:
• Resolution: Ensure scanned images are at least 150 to 300 DPI. Resolutions below 100 DPI merge letter stems (such as 'rn' into 'm').
• Skew & Rotation: Use MultiPDF Doc's Organize tool to straighten rotated pages before running OCR.
• Lighting: Ensure uniform contrast without harsh drop-shadows on smartphone receipts or contracts.`,
            },
          ]}
          formula={{
            title: "Character Error Rate (CER) Metric Formulation",
            formula: "CER = (Substitutions + Insertions + Deletions) / Total_Ground_Truth_Characters",
            explanation: "In academic character recognition evaluations, Character Error Rate measures the Levenshtein edit distance between the extracted sequence and the reference ground truth text."
          }}
          faqs={[
            {
              question: "Are my files uploaded when using In-Browser Local Extraction?",
              answer:
                "No. When 'In-Browser Local Extraction' is selected, 100% of the extraction executes directly inside your browser using Mozilla PDF.js and Tesseract.js WebAssembly. Your files never touch an external server.",
            },
            {
              question: "When should I use 'AI Deep Scan / Handwriting' mode?",
              answer:
                "Use AI Deep Scan when your document contains doctor handwriting, cursive notes, complex multi-column scientific journals, or severely degraded historical scans that standard local OCR struggles to parse.",
            },
            {
              question: "Why does scanned OCR take longer than digital extraction?",
              answer:
                "Digital text extraction simply reads pre-computed Unicode character strings. Scanned OCR must rasterize the image, compute gradient contours, and execute neural network inference across millions of individual pixels.",
            },
          ]}
        />
      </div>
    </MasterShell>
  );
}
