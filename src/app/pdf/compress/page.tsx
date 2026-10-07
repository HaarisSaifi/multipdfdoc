"use client";

import { useDownloadUrl } from "@/lib/use-download-url";
import React, { useState, useRef, useEffect } from "react";
import {
  Minimize2,
  UploadCloud,
  FileText,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Zap,
  Sliders,
  Info,
  Check,
} from "lucide-react";
import { getPdfToolkit } from "@/lib/pdf/qpdf-toolkit";
import { getPdfJs, getSafePdfDocumentParams } from "@/lib/pdf/pdfjs-loader";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

export default function CompressPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetSizeKb, setTargetSizeKb] = useState<number>(200);
  const [customKb, setCustomKb] = useState<string>("");
  const [compressionMode, setCompressionMode] = useState<"auto" | "lossless" | "target">("auto");
  const [compressing, setCompressing] = useState(false);
  const [compressStatus, setCompressStatus] = useState<string>("");
  const [compressedBlobUrl, setCompressedBlobUrl] = useDownloadUrl();
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [engineUsed, setEngineUsed] = useState<"lossless" | "adaptive" | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { setCompressedBlobUrl(null); }, [targetSizeKb, customKb, compressionMode]);

  const handleFile = (f: File) => {
    if (compressing) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setErrorMsg("Please upload a valid PDF document.");
      return;
    }
    setErrorMsg(null);
    setCompressedBlobUrl(null);
    setEngineUsed(null);
    setFile(f);
    setOriginalSize(f.size);
  };

  const handleCompress = async () => {
    if (!file) return;
    if (customKb && (!/^\d+$/.test(customKb) || !Number.isSafeInteger(Number(customKb)) || Number(customKb) < 1)) {
      setErrorMsg("Enter a positive whole number of KB for the custom target.");
      return;
    }
    setCompressing(true);
    setErrorMsg(null);
    setCompressedBlobUrl(null);
    setEngineUsed(null);

    const activeTargetKb = customKb && parseInt(customKb, 10) > 0 ? parseInt(customKb, 10) : targetSizeKb;
    const targetBytes = activeTargetKb * 1024;

    let renderingPdf: any = null;
    try {
      setCompressStatus("Initializing WebAssembly structural compressor...");
      const originalBuffer = await file.arrayBuffer();
      const inputBytes = new Uint8Array(originalBuffer);

      // --- STAGE 1: QPDF WASM Structural Optimization (Lossless) ---
      setCompressStatus("Executing qpdf object-stream deflating...");

      let losslessBytes: Uint8Array | null = null;
      try {
        const toolkit = await getPdfToolkit();
        losslessBytes = await toolkit.compress(inputBytes, {
          compressionLevel: 9,
          objectStreams: true,
          linearize: false,
        });
      } catch (qerr) {
        console.warn("qpdf compress warning, attempting pdf-lib fallback:", qerr);
        const { PDFDocument } = await import("pdf-lib");
        const pdfDoc = await PDFDocument.load(inputBytes);
        losslessBytes = await pdfDoc.save({ useObjectStreams: true });
      }
      // Structural optimization may grow an already optimized file.
      if (losslessBytes.byteLength > inputBytes.byteLength) losslessBytes = inputBytes;

      // If lossless already fits within target, or user explicitly requested lossless only
      if (
        compressionMode === "lossless" ||
        (losslessBytes && losslessBytes.byteLength <= targetBytes) ||
        (compressionMode === "auto" && losslessBytes && losslessBytes.byteLength <= targetBytes)
      ) {
        const finalBytes = losslessBytes || inputBytes;
        const blob = new Blob([finalBytes as unknown as BlobPart], { type: "application/pdf" });
        setCompressedBlobUrl(URL.createObjectURL(blob));
        setCompressedSize(blob.size);
        setEngineUsed("lossless");
        return;
      }

      // --- STAGE 2: Adaptive Raster Recompression Engine ---
      // If lossless alone didn't reach the target size, and user allowed target or auto
      setCompressStatus(`Target is ${activeTargetKb} KB. Activating adaptive page optimizer...`);
      setEngineUsed("adaptive");

      const pdfjs = await getPdfJs();
      const loadingTask = pdfjs.getDocument(getSafePdfDocumentParams(inputBytes.slice()));
      const pdf = await loadingTask.promise;
      renderingPdf = pdf;
      const numPages = pdf.numPages;

      // Calculate budget per page
      const safetyMargin = Math.max(4096, targetBytes * 0.03);
      const targetBudget = targetBytes - safetyMargin;

      // Start search parameters
      let currentDpi = 150;
      let jpegQuality = 0.75;

      // If document has many pages, start with 120 DPI
      if (numPages > 5) {
        currentDpi = 120;
      }
      if (numPages > 15) {
        currentDpi = 96;
        jpegQuality = 0.65;
      }

      // Helper to render and assemble PDF at specific DPI & quality
      const renderDocument = async (dpiVal: number, qualityVal: number): Promise<Uint8Array> => {
        const scale = dpiVal / 72;
        const { PDFDocument } = await import("pdf-lib");
        const newDoc = await PDFDocument.create();

        for (let p = 1; p <= numPages; p++) {
          setCompressStatus(
            `Rendering page ${p}/${numPages} (${dpiVal} DPI, ${Math.round(qualityVal * 100)}% quality)...`
          );
          const page = await pdf.getPage(p);
          const viewport = page.getViewport({ scale });

          if (!Number.isFinite(viewport.width * viewport.height) || viewport.width * viewport.height > 20_000_000) throw new Error("Page is too large to rasterize safely. Use lossless mode or resize the source.");
          const canvas = document.createElement("canvas");
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);

          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Canvas context creation failed.");

          // White background
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          await page.render({ canvasContext: ctx, viewport }).promise;

          const dataUrl = canvas.toDataURL("image/jpeg", qualityVal);
          const base64Data = dataUrl.split(",")[1];
          const imgBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

          const embeddedImage = await newDoc.embedJpg(imgBytes);
          // Maintain original unscaled dimensions in points
          const originalViewport = page.getViewport({ scale: 1.0 });
          const newPdfPage = newDoc.addPage([originalViewport.width, originalViewport.height]);
          newPdfPage.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: originalViewport.width,
            height: originalViewport.height,
          });
          canvas.width = canvas.height = 0;
          page.cleanup();
        }

        return await newDoc.save({ useObjectStreams: true });
      };

      // First pass
      let passBytes = await renderDocument(currentDpi, jpegQuality);
      let bestFit: Uint8Array | null = passBytes.byteLength <= targetBudget ? passBytes : null;

      // Binary search refinement on quality if needed
      if (passBytes.byteLength > targetBudget && jpegQuality > 0.35) {
        setCompressStatus(`Refining JPEG quality to reach under ${activeTargetKb} KB...`);
        let lowQ = 0.32;
        let highQ = jpegQuality;

        for (let iter = 0; iter < 3; iter++) {
          const midQ = Number(((lowQ + highQ) / 2).toFixed(2));
          const testBytes = await renderDocument(currentDpi, midQ);

          if (testBytes.byteLength <= targetBudget) {
            passBytes = testBytes;
            bestFit = testBytes;
            lowQ = midQ; // try to keep highest possible quality below budget
          } else {
            highQ = midQ;
            // Keep the previous fitting candidate when the next trial is too large.
          }
        }
      }
      if (bestFit) passBytes = bestFit;

      // If still too large, drop DPI to 96 and re-check once
      if (passBytes.byteLength > targetBudget && currentDpi > 96) {
        setCompressStatus("Adjusting raster resolution to 96 DPI...");
        currentDpi = 96;
        passBytes = await renderDocument(currentDpi, 0.45);
      }
      if (passBytes.byteLength > targetBytes) {
        throw new Error(`Could not meet ${activeTargetKb} KB without further quality loss. Use a larger target, split the document, or re-scan. No oversized result was marked as successful.`);
      }

      const finalBlob = new Blob([passBytes as unknown as BlobPart], { type: "application/pdf" });
      setCompressedBlobUrl(URL.createObjectURL(finalBlob));
      setCompressedSize(finalBlob.size);
    } catch (err: any) {
      console.error("Compression error:", err);
      setErrorMsg(err.message || "Failed to compress document. Please verify the file is not corrupted.");
    } finally {
      if (renderingPdf) await renderingPdf.destroy().catch(() => undefined);
      setCompressing(false);
      setCompressStatus("");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const reductionPercent =
    originalSize > 0 && compressedSize > 0
      ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
      : 0;

  const currentActiveLimit =
    customKb && parseInt(customKb, 10) > 0 ? parseInt(customKb, 10) : targetSizeKb;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"><fieldset disabled={compressing} className="contents" aria-busy={compressing}>
      {/* Hero Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold uppercase tracking-wider shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Dual-Engine: Lossless WASM + Adaptive Raster
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          Compress PDF <span className="text-sky-600">to Target File Size</span>
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Try a 100KB, 200KB, 500KB, 1MB, or custom target. Very small limits may be impossible for long documents. Adaptive mode turns pages into images and removes selectable text, forms, and links. Always review the downloaded copy. Files stay in your browser.
        </p>
      </div>

      <AdPlaceholder slot="top-leaderboard" format="horizontal" />

      {/* Main Interactive Tool Console */}
      <div className="mt-8 bubble-card p-6 sm:p-10 border border-slate-200/90">
        {!file ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
            }}
            role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInputRef.current?.click(); } }}
              onClick={() => fileInputRef.current?.click()}
            className={`bubble-dropzone p-8 sm:p-12 text-center cursor-pointer transition-all ${
              dragActive ? "drag-active border-sky-600" : ""
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="hidden"
            />
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-white border border-sky-200 flex items-center justify-center text-sky-600 shadow-sm mb-5 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-sky-600 animate-bounce" />
            </div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 mb-2">
              Select or Drop PDF to Compress
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Smart qpdf stream optimization & adaptive raster recompression. 100% in-browser.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* File Info Bar */}
            <div className="bubble-card p-5 border border-slate-200/90 flex items-center justify-between gap-4 bg-slate-50/60">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-sky-600 border border-slate-200 flex-shrink-0 shadow-sm">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-slate-900 truncate">{file.name}</h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Original File Size: <span className="text-amber-700 font-bold">{formatSize(originalSize)}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setCompressedBlobUrl(null);
                  setEngineUsed(null);
                }}
                className="text-xs px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm"
              >
                Change File
              </button>
            </div>

            {/* Target Limit Presets */}
            <div className="bubble-card p-6 border border-slate-200/90 space-y-4 bg-white">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-sky-600" />
                  Select Target Size Cap
                </label>
                <span className="text-[11px] text-slate-500">
                  Target: <strong>under {currentActiveLimit} KB</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "100 KB", value: 100, desc: "Strict Portal Limit" },
                  { label: "200 KB", value: 200, desc: "Common Form Cap" },
                  { label: "500 KB", value: 500, desc: "Application Standard" },
                  { label: "1 MB", value: 1024, desc: "Email / Web Standard" },
                ].map((tier) => (
                  <button
                    key={tier.value}
                    type="button"
                    onClick={() => {
                      setTargetSizeKb(tier.value);
                      setCustomKb("");
                    }}
                    className={`p-4 rounded-2xl text-left transition-all border ${
                      targetSizeKb === tier.value && !customKb
                        ? "bg-sky-50/80 border-sky-400 text-sky-900 shadow-sm"
                        : "bg-slate-50/70 border-slate-200 hover:border-sky-300 text-slate-600"
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold text-slate-900">
                      Under {tier.label}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">{tier.desc}</div>
                  </button>
                ))}
              </div>

              {/* Custom Size Input */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span>Custom Max Size:</span>
                  <input aria-label="Custom compression target in KB"
                    type="number"
                    min="20"
                    max="50000"
                    placeholder="e.g. 300"
                    value={customKb}
                    onChange={(e) => setCustomKb(e.target.value)}
                    className="w-24 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 focus:ring-2 focus:ring-sky-500"
                  />
                  <span className="font-bold">KB</span>
                </div>
                <p className="text-[11px] text-slate-600 italic">
                  *Always check your portal&apos;s specific requirement before submitting.
                </p>
              </div>

              {/* Compression Mode Selector */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-xs text-slate-500 font-medium block">
                  Optimization Strategy:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setCompressionMode("auto")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      compressionMode === "auto"
                        ? "bg-violet-50 border-violet-400 text-violet-900 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    Auto-Adapt (Raster fallback)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompressionMode("lossless")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      compressionMode === "lossless"
                        ? "bg-violet-50 border-violet-400 text-violet-900 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    Lossless Only (Keep Vector Text)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompressionMode("target")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      compressionMode === "target"
                        ? "bg-violet-50 border-violet-400 text-violet-900 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    Try Target Compression
                  </button>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {compressing && (
                <div className="text-xs text-sky-700 flex items-center gap-2 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600" />
                  <span>{compressStatus || "Optimizing document..."}</span>
                </div>
              )}

              <div className="w-full sm:w-auto sm:ml-auto">
                <button
                  onClick={handleCompress}
                  disabled={compressing}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-extrabold btn-bubble btn-bubble-cyan flex items-center justify-center gap-2.5 shadow-clay-pill-cyan disabled:opacity-50"
                >
                  {compressing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Compressing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Compress to Under {currentActiveLimit} KB
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div role="alert" className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Compressed Success Card */}
        {compressedBlobUrl && (
          <div className="mt-8 p-6 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shadow-sm flex-shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold text-slate-900">
                    Compression Complete!
                  </h2>
                  <p className="text-xs text-slate-600 font-mono mt-0.5">
                    Original: <span className="line-through">{formatSize(originalSize)}</span> → New:{" "}
                    <span className="text-emerald-700 font-bold">{formatSize(compressedSize)}</span>{" "}
                    ({reductionPercent}% smaller)
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <Check className="w-3 h-3 text-emerald-700" />
                      {compressedSize <= currentActiveLimit * 1024
                        ? `Meets < ${currentActiveLimit} KB Requirement`
                        : `Closest Legible Compression: ${formatSize(compressedSize)}`}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Engine: {engineUsed === "lossless" ? "qpdf WASM Structural" : "Adaptive Canvas Optimizer"}
                    </span>
                  </div>
                </div>
              </div>

              <a
                href={compressedBlobUrl}
                download={`${file?.name.replace(/\.[^/.]+$/, "")}_compressed.pdf`}
                className="w-full sm:w-auto px-7 py-3 rounded-full text-xs font-bold btn-bubble btn-bubble-emerald shadow-clay-pill-emerald flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Compressed PDF
              </a>
            </div>
          </div>
        )}
      </div>

      <AdPlaceholder slot="mid-rectangle" format="rectangle" />

      {/* Value Wrapper */}

    </fieldset></div>
  );
}
