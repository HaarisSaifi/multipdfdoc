"use client";

import React, { useState, useRef, useEffect } from "react";
import { MasterShell } from "@/components/layout/MasterShell";
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
  ShieldAlert,
} from "lucide-react";
import { getPdfJs, getSafePdfDocumentParams } from "@/lib/pdf/pdfjs-loader";
import type { createWorker } from "tesseract.js";

export default function PdfToTextPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [engineUsed, setEngineUsed] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const cloudEnabled = process.env.NEXT_PUBLIC_CLOUD_OCR_ENABLED === "true";
  const consentDialog = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);
  const [ocrMode, setOcrMode] = useState<"client" | "ai">("client");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAiNotice, setShowAiNotice] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  useEffect(() => { if (showConsentModal) consentDialog.current?.showModal(); }, [showConsentModal]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isProcessing) return;
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!["application/pdf", "image/png", "image/jpeg", "image/webp"].includes(selected.type) && !/\.(pdf|png|jpe?g|webp)$/i.test(selected.name)) { setErrorMsg("Choose a PDF, PNG, JPEG or WebP file."); return; }
      setErrorMsg(null);
      setFile(selected);
      setExtractedText("");
      setEngineUsed(null);
    }
  };

  /**
   * 100% IN-BROWSER LOCAL EXTRACTION
   * Uses Mozilla PDF.js for native digital text and Tesseract.js WebAssembly for scanned raster pages.
   * GUARANTEE: Never transmits any file, bytes, or data to /api/ocr or external servers.
   */
  const processLocalOcr = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(10);
    setStatusText("Reading document contents locally in-browser...");

    setErrorMsg(null);
    setExtractedText("");
    setEngineUsed(null);
    let worker: Awaited<ReturnType<typeof createWorker>> | null = null;
    let pdf: any = null;
    try {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      const getWorker = async () => { if (!worker) { const { createWorker } = await import("tesseract.js"); worker = await createWorker("eng"); } return worker; };
      if (isPdf) {
        const pdfjs = await getPdfJs();
        pdf = await pdfjs.getDocument(getSafePdfDocumentParams(await file.arrayBuffer())).promise;
        const output: string[] = [];
        let scanned = false;
        // Preserve page order; OCR only pages with no extractable native text.
        for (let p = 1; p <= pdf.numPages; p++) {
          setStatusText(`Reading page ${p} of ${pdf.numPages} locally...`);
          setProgress(Math.round((p / pdf.numPages) * 95));
          const page = await pdf.getPage(p);
          const content = await page.getTextContent();
          let text = content.items.map((item: any) => typeof item.str === "string" ? item.str + (item.hasEOL ? "\n" : " ") : "").join("").trim();
          if (!text) {
            scanned = true;
            setStatusText(`Recognizing scanned page ${p} locally. First use downloads the OCR engine...`);
            const viewport = page.getViewport({ scale: 2 });
            if (viewport.width * viewport.height > 20000000) throw new Error("This page is too large for safe OCR rendering. Re-scan at a lower resolution.");
            const canvas = document.createElement("canvas");
            canvas.width = Math.ceil(viewport.width);
            canvas.height = Math.ceil(viewport.height);
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Could not create OCR canvas.");
            try {
              await page.render({ canvasContext: ctx, viewport, background: "#ffffff" }).promise;
              const result = await (await getWorker()).recognize(canvas);
              text = result.data.text.trim();
            } finally { canvas.width = canvas.height = 0; }
          }
          output.push(`--- PAGE ${p} ---\n${text || "[No text detected on this page]"}`);
          page.cleanup();
        }
        setExtractedText(output.join("\n\n"));
        setEngineUsed(scanned ? "PDF.js + Tesseract.js (local)" : "PDF.js native text (local)");
      } else {
        setStatusText("Recognizing image locally. First use downloads the OCR engine...");
        const result = await (await getWorker()).recognize(file);
        setExtractedText(result.data.text.trim());
        setEngineUsed("Tesseract.js (local)");
        if (!result.data.text.trim()) setErrorMsg("No text detected. Try a sharper, correctly oriented image.");
      }
      setProgress(100);
    } catch (error: any) {
      setErrorMsg(error?.message || "Could not extract text. Try unlocking or repairing the document first.");
    } finally {
      await Promise.allSettled([worker ? (worker as Awaited<ReturnType<typeof createWorker>>).terminate() : Promise.resolve(), pdf?.destroy()]);
      setIsProcessing(false);
    }
  };

  /**
   * CLOUD AI OCR EXECUTION
   * Invoked ONLY after the user explicitly reviews and approves the Cloud AI Consent Modal.
   */
  const executeCloudOcr = async () => {
    setShowConsentModal(false);
    if (!file) return;

    setErrorMsg(null);
    setExtractedText("");
    setEngineUsed(null);
    setIsProcessing(true);
    setProgress(20);
    setStatusText("Securely transmitting document to Cloud AI OCR endpoint...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mode", "handwriting");

      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      setProgress(85);
      setStatusText("Parsing neural vision transcription...");

      if (res.ok) {
        const data = await res.json();
        setExtractedText(data.text || "No text returned by AI model.");
        setEngineUsed(data.engine || "Cloud AI OCR");
        setProgress(100);
      } else {
        const errData = await res.json().catch(() => ({}));
        setErrorMsg(errData.error || `Cloud OCR unavailable (${res.status}). Use local extraction.`);
      }
    } catch (err: any) {
      console.error("Cloud OCR error:", err);
      setErrorMsg("Cloud OCR could not be reached. Use local extraction or try again later.");
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Triggers extraction based on active mode.
   * If Cloud AI mode is selected, opens the mandatory consent dialog first.
   */
  const handleStartExtraction = () => {
    if (!file) return;
    if (ocrMode === "ai") {
      if (!cloudEnabled) { setErrorMsg("Cloud OCR is unavailable. Use local extraction."); return; }
      if (file.size > 4 * 1024 * 1024) { setErrorMsg("Cloud OCR supports files up to 4MB. Use local extraction for larger files."); return; }
      setShowConsentModal(true);
    } else {
      processLocalOcr();
    }
  };

  const handleCopy = async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { setErrorMsg("Clipboard unavailable. Select and copy the text manually."); }
  };

  const handleDownload = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${file?.name?.replace(/\.[^/.]+$/, "") || "extracted"}_text.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
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
    <MasterShell><fieldset disabled={isProcessing} className="contents" aria-busy={isProcessing}>
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

            <button disabled={!cloudEnabled || isProcessing}
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
              <span>{cloudEnabled ? "AI Deep Scan" : "Cloud OCR unavailable"}</span>
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

        {errorMsg && <p role="alert" className="p-4 mb-4 rounded-2xl border border-rose-200 bg-rose-50 text-rose-800">{errorMsg}</p>}
        <p className="text-center text-sm text-slate-500 mb-6">Local OCR may download its engine and English language data on first use. Document contents stay local. Check names, numbers and tables against the original.</p>
        {/* Main Work Area Card */}
        <div className="bubble-card p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-clay-card mb-10 bg-white">
          {!file ? (
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInputRef.current?.click(); } }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); if (isProcessing) return; const input = fileInputRef.current; if (input) { input.files = e.dataTransfer.files; input.dispatchEvent(new Event("change", { bubbles: true })); } }}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-violet-400 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 bg-slate-50/50 hover:bg-violet-50/30 group"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center shadow-clay-badge group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 mb-1">
                Select or Drop Document / Image
              </h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
                Supports PDF documents, PNG, JPG, and WebP images.
              </p>
              <span
                className="btn-clay px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 shadow-clay-btn hover:shadow-clay-btn-hover"
              >
                Browse Document
              </span>
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
                  <button disabled={isProcessing}
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
                    onClick={handleStartExtraction}
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
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Filter extracted text"
                      placeholder="Search within extracted text..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 focus:border-violet-500"
                    />
                  </div>

                  <textarea
                    aria-label="Extracted text"
                    readOnly={Boolean(searchQuery)}
                    value={displayedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    rows={12}
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs sm:text-sm text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 focus:border-violet-500 shadow-inner resize-y"
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

      </div>

      {/* Cloud AI Transmission Explicit Consent Modal */}
      {showConsentModal && (
        <dialog ref={consentDialog} onCancel={() => setShowConsentModal(false)} aria-labelledby="cloud-consent-title" className="max-w-lg w-[calc(100%-2rem)] rounded-3xl p-0 border-0">
          <div
            className="bubble-card bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200/80 shadow-clay-card space-y-5 animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 shadow-clay-badge">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h2 id="cloud-consent-title" className="text-lg font-bold text-slate-900">
                  Cloud AI Transmission Consent
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Explicit user approval required before external API transmission
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 bg-amber-50/60 p-4 rounded-2xl border border-amber-100">
              <p>
                You are about to transmit <strong>{file?.name}</strong> to our backend Cloud AI OCR service (powered by Google Gemini Vision API) for neural transcription.
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
                <li><strong>Provider handling:</strong> Google's retention and data-use terms depend on the service configuration. Do not submit confidential or sensitive information. Read our <a href="/privacy-policy" className="underline">privacy policy</a> first.</li>
                <li><strong>Transmission:</strong> Encrypted in transit via HTTPS/TLS.</li>
                <li><strong>Processing Limits:</strong> Maximum 4MB file size, 20 PDF pages, and 5 scans/hour per client.</li>
                <li><strong>Privacy Alternative:</strong> If your document contains confidential, medical, or proprietary data, we recommend using our 100% In-Browser Local Extraction.</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowConsentModal(false);
                  setOcrMode("client");
                  setShowAiNotice(false);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-center"
              >
                Cancel &amp; Use Local Mode
              </button>
              <button
                type="button"
                onClick={executeCloudOcr}
                className="flex-1 btn-clay py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 shadow-clay-btn hover:shadow-clay-btn-hover flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Agree &amp; Transmit</span>
              </button>
            </div>
          </div>
        </dialog>
      )}
    </fieldset></MasterShell>
  );
}
