"use client";

import React, { useState, useRef, useEffect } from "react";
import { MasterShell } from "@/components/layout/MasterShell";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import {
  FileText,
  Upload,
  Sparkles,
  Copy,
  Check,
  Download,
  RotateCcw,
  Zap,
  Search,
} from "lucide-react";
import { getPdfJs, getSafePdfDocumentParams } from "@/lib/pdf/pdfjs-loader";
import type { Worker } from "tesseract.js";
import { createLocalOcrWorker, waitForOcr } from "@/lib/pdf/local-ocr";

export default function PdfToTextPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [engineUsed, setEngineUsed] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scanEveryPage, setScanEveryPage] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; controllerRef.current?.abort(); }; }, []);
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
      setSearchQuery(""); setCopied(false);
    }
  };

  // Document processing stays inside this browser. Engine files load from this site.
  const processLocalOcr = async () => {
    if (!file || isProcessing) return;
    const controller = new AbortController();
    controllerRef.current = controller;
    const signal = controller.signal;
    setIsProcessing(true);
    setProgress(10);
    setStatusText("Reading document contents locally in-browser...");

    setErrorMsg(null);
    setExtractedText("");
    setEngineUsed(null);
    let worker: Worker | null = null;
    let pdf: any = null;
    try {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      const getWorker = async () => {
        if (!worker) worker = await createLocalOcrWorker(signal, event => {
          if (!mounted.current || signal.aborted) return;
          if (event.status === "recognizing text") setStatusText(`Recognizing text locally: ${Math.round(event.progress * 100)}%`);
        });
        return worker;
      };
      if (!globalThis.WebAssembly || !globalThis.Worker) throw new Error("This browser does not support local OCR. Use an updated browser.");
      if (file.size > 100 * 1024 * 1024) throw new Error("Choose a file below 100MB, or split it into smaller batches first.");
      if (isPdf) {
        const pdfjs = await getPdfJs();
        pdf = await pdfjs.getDocument(getSafePdfDocumentParams(await file.arrayBuffer())).promise;
        if (pdf.numPages > 200) throw new Error("Extract up to 200 PDF pages per batch. Use Split PDF to make a smaller document.");
        const output: string[] = [];
        let scanned = false;
        // Preserve page order; OCR only pages with no extractable native text.
        for (let p = 1; p <= pdf.numPages; p++) {
          signal.throwIfAborted();
          setStatusText(`Reading page ${p} of ${pdf.numPages} locally...`);
          setProgress(Math.round((p / pdf.numPages) * 95));
          const page = await pdf.getPage(p);
          const content = await page.getTextContent();
          let text = content.items.map((item: any) => typeof item.str === "string" ? item.str + (item.hasEOL ? "\n" : " ") : "").join("").trim();
          if (!text || scanEveryPage) {
            scanned = true;
            setStatusText(`Recognizing scanned page ${p} locally. First use loads the local OCR engine...`);
            const viewport = page.getViewport({ scale: 2 });
            if (viewport.width * viewport.height > 20000000) throw new Error("This page is too large for safe OCR rendering. Re-scan at a lower resolution.");
            const canvas = document.createElement("canvas");
            canvas.width = Math.ceil(viewport.width);
            canvas.height = Math.ceil(viewport.height);
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Could not create OCR canvas.");
            try {
              await waitForOcr(page.render({ canvasContext: ctx, viewport, background: "#ffffff" }).promise, signal);
              const result = await waitForOcr((await getWorker()).recognize(canvas), signal);
              text = result.data.text.trim();
            } finally { canvas.width = canvas.height = 0; }
          }
          output.push(`--- PAGE ${p} ---\n${text || "[No text detected on this page]"}`);
          page.cleanup();
        }
        setExtractedText(output.join("\n\n"));
        setEngineUsed(scanned ? "PDF.js + Tesseract.js (local)" : "PDF.js native text (local)");
      } else {
        setStatusText("Recognizing image locally. First use loads the local OCR engine...");
        const imageUrl = URL.createObjectURL(file);
        const image = new Image(); image.src = imageUrl;
        let result;
        try {
          await waitForOcr(image.decode(), signal, 15000);
          if (image.naturalWidth * image.naturalHeight > 20000000) throw new Error("This image exceeds 20 million pixels. Resize it before OCR.");
          result = await waitForOcr((await getWorker()).recognize(image), signal);
        } finally { URL.revokeObjectURL(imageUrl); }
        setExtractedText(result.data.text.trim());
        setEngineUsed("Tesseract.js (local)");
        if (!result.data.text.trim()) setErrorMsg("No text detected. Try a sharper, correctly oriented image.");
      }
      signal.throwIfAborted();
      setProgress(100);
    } catch (error: any) {
      if (mounted.current) { setErrorMsg(signal.aborted ? "Extraction cancelled. Choose Start Extraction to try again." : error?.message || "Could not extract text. Try a smaller document or unlock it first."); setExtractedText(""); }
    } finally {
      await Promise.allSettled([worker ? (worker as Worker).terminate() : Promise.resolve(), pdf?.destroy()]);
      if (mounted.current) setIsProcessing(false);
      if (controllerRef.current === controller) controllerRef.current = null;
    }
  };

  const handleStartExtraction = () => { if (file && !isProcessing) void processLocalOcr(); };

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
            Copy selectable PDF text or recognize printed English text from scans. Your document stays in your browser; no account or upload is required.
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-900">
          <p className="font-semibold">Digital text first. Local OCR when needed.</p>
          <p className="mt-1">The engine and English language files load from this website only when a scan needs OCR. Handwriting and complex tables may not be recognized accurately.</p>
          <label className="flex items-start gap-2 mt-3 text-slate-800">
            <input type="checkbox" className="mt-1" checked={scanEveryPage} onChange={event => { setScanEveryPage(event.target.checked); setExtractedText(""); setEngineUsed(null); }} />
            <span>OCR every PDF page (slower; useful for mixed text and scans)</span>
          </label>
        </div>

        {errorMsg && <p role="alert" className="p-4 mb-4 rounded-2xl border border-rose-200 bg-rose-50 text-rose-800">{errorMsg}</p>}
        <p className="text-center text-sm text-slate-500 mb-6">PDF, PNG, JPEG and WebP · English printed-text OCR · up to 100MB / 200 PDF pages per batch. Large scans can exceed your device memory; try a smaller batch.</p>
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
                    <span role="status" aria-live="polite">{statusText}</span>
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

    </fieldset>
    {isProcessing && <div className="text-center pb-6"><button type="button" onClick={() => controllerRef.current?.abort()} className="btn-bubble btn-bubble-secondary px-6 py-3 font-semibold">Cancel extraction</button></div>}
    </MasterShell>
  );
}
