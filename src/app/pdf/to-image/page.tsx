"use client";

import React, { useState, useRef } from "react";
import {
  Image as ImageIcon,
  UploadCloud,
  FileText,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Sliders,
  Archive,
  Layers,
} from "lucide-react";
import JSZip from "jszip";
import { getPdfJs } from "@/lib/pdf/pdfjs-loader";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

interface RenderedPage {
  pageNum: number;
  dataUrl: string;
  width: number;
  height: number;
}

export default function PDFToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [dpi, setDpi] = useState<number>(300);
  const [converting, setConverting] = useState(false);
  const [progressPage, setProgressPage] = useState<number>(0);
  const [pagesGenerated, setPagesGenerated] = useState<RenderedPage[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [zipping, setZipping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setErrorMsg("Please upload a valid PDF document.");
      return;
    }
    setErrorMsg(null);
    setPagesGenerated([]);
    setFile(f);
    setProgressPage(0);

    try {
      const pdfjs = await getPdfJs();
      const buffer = await f.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
      const pdf = await loadingTask.promise;
      setPageCount(pdf.numPages);
    } catch (err: any) {
      console.error("PDF.js loading error:", err);
      setErrorMsg(
        err?.name === "PasswordException"
          ? "This PDF is password-protected. Please unlock it using our Unlock PDF tool first."
          : "Unable to parse PDF document. Please verify the file is not damaged."
      );
    }
  };

  const handleConvert = async () => {
    if (!file || !pageCount) return;
    setConverting(true);
    setErrorMsg(null);
    setPagesGenerated([]);
    setProgressPage(0);

    try {
      const pdfjs = await getPdfJs();
      const buffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
      const pdf = await loadingTask.promise;

      const scale = dpi / 72; // Standard PDF points to target DPI
      const maxPagesToProcess = Math.min(pdf.numPages, 50); // High limit while guarding browser RAM
      const results: RenderedPage[] = [];

      for (let i = 1; i <= maxPagesToProcess; i++) {
        setProgressPage(i);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { alpha: format === "png" });

        if (!ctx) throw new Error("Could not initialize HTML5 Canvas 2D context.");

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);

        // Fill white background for JPEG exports
        if (format === "jpeg") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        const mime = format === "png" ? "image/png" : "image/jpeg";
        const quality = format === "jpeg" ? 0.92 : undefined;
        const dataUrl = canvas.toDataURL(mime, quality);

        results.push({
          pageNum: i,
          dataUrl,
          width: canvas.width,
          height: canvas.height,
        });

        // Small yield to let UI re-render progress smoothly
        await new Promise((r) => setTimeout(r, 10));
      }

      setPagesGenerated(results);
    } catch (err: any) {
      console.error("Rendering error:", err);
      setErrorMsg(err.message || "Failed to render PDF pages into images.");
    } finally {
      setConverting(false);
      setProgressPage(0);
    }
  };

  const handleDownloadZip = async () => {
    if (pagesGenerated.length === 0 || !file) return;
    setZipping(true);
    try {
      const zip = new JSZip();
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const folder = zip.folder(`${baseName}-images`) || zip;

      pagesGenerated.forEach((pg) => {
        const base64Data = pg.dataUrl.split(",")[1];
        folder.file(`${baseName}-page-${pg.pageNum}.${format}`, base64Data, {
          base64: true,
        });
      });

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${baseName}-${dpi}dpi-images.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Zip export error:", err);
      setErrorMsg("Failed to generate ZIP bundle. Please download individual images.");
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Genuine Mozilla PDF.js Canvas Engine
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          Convert PDF <span className="text-amber-600">to High-Res Images</span>
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Render true PDF vector paths and embedded photographs into ultra-sharp PNG or JPEG files at 150 or 300 DPI. Processed 100% locally on your device.
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
            onClick={() => fileInputRef.current?.click()}
            className={`bubble-dropzone p-8 sm:p-12 text-center cursor-pointer transition-all ${
              dragActive ? "drag-active border-amber-600" : ""
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="hidden"
            />
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-white border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm mb-5 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 animate-bounce" />
            </div>
            <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 mb-2">
              Select or Drop PDF to Convert to Images
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Direct vector rendering via Mozilla PDF.js. Your document never leaves your browser.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bubble-card p-5 border border-slate-200/90 flex items-center justify-between gap-4 bg-slate-50/60">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-amber-600 border border-slate-200 flex-shrink-0 shadow-sm">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{file.name}</h4>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Pages: <span className="text-amber-600 font-bold">{pageCount ?? "Calculating..."}</span> • {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setPagesGenerated([]);
                  setPageCount(null);
                }}
                className="text-xs px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm"
              >
                Change File
              </button>
            </div>

            {/* Resolution & Format Settings */}
            <div className="bubble-card p-6 border border-slate-200/90 space-y-4 bg-white">
              <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-600" />
                Export Quality & Format Configuration
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-500 block mb-2 font-medium">Output Image Format</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormat("png")}
                      className={`p-3.5 rounded-2xl text-xs font-bold transition-all border ${
                        format === "png"
                          ? "bg-amber-50 border-amber-400 text-amber-900 shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      PNG (Lossless & Crisp)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormat("jpeg")}
                      className={`p-3.5 rounded-2xl text-xs font-bold transition-all border ${
                        format === "jpeg"
                          ? "bg-amber-50 border-amber-400 text-amber-900 shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      JPEG (Compact File Size)
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block mb-2 font-medium">Render Density (DPI)</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDpi(150)}
                      className={`p-3.5 rounded-2xl text-xs font-bold transition-all border ${
                        dpi === 150
                          ? "bg-sky-50 border-sky-400 text-sky-900 shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      150 DPI (Fast / Screen)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDpi(300)}
                      className={`p-3.5 rounded-2xl text-xs font-bold transition-all border ${
                        dpi === 300
                          ? "bg-sky-50 border-sky-400 text-sky-900 shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      300 DPI (Ultra / Print)
                    </button>
                  </div>
                </div>
              </div>

              {pageCount && pageCount > 50 && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
                  <span>
                    To ensure smooth browser memory performance, the first 50 pages will be rendered.
                  </span>
                </div>
              )}
            </div>

            {/* Progress / Convert Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {converting && (
                <div className="w-full sm:w-auto flex-1">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                      Rendering page {progressPage} of {Math.min(pageCount ?? 0, 50)}...
                    </span>
                    <span className="font-mono">
                      {pageCount ? Math.round((progressPage / Math.min(pageCount, 50)) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-200"
                      style={{
                        width: `${pageCount ? (progressPage / Math.min(pageCount, 50)) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="w-full sm:w-auto sm:ml-auto">
                <button
                  onClick={handleConvert}
                  disabled={converting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-extrabold btn-bubble btn-bubble-violet flex items-center justify-center gap-2.5 shadow-clay-pill disabled:opacity-50"
                >
                  {converting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Rendering Pages...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Render to {format.toUpperCase()} Images
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Generated Image Gallery */}
        {pagesGenerated.length > 0 && (
          <div className="mt-8 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 text-xs sm:text-sm">
              <div>
                <span className="font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Rendered Pages ({pagesGenerated.length})
                </span>
                <span className="text-slate-500 font-mono text-xs">
                  {dpi} DPI • {format.toUpperCase()} • Direct PDF.js Render
                </span>
              </div>

              {pagesGenerated.length > 1 && (
                <button
                  onClick={handleDownloadZip}
                  disabled={zipping}
                  className="px-4 py-2 rounded-full text-xs font-bold btn-bubble btn-bubble-emerald shadow-clay-pill-emerald flex items-center justify-center gap-2 self-start sm:self-auto"
                >
                  {zipping ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Bundling ZIP...
                    </>
                  ) : (
                    <>
                      <Archive className="w-3.5 h-3.5" />
                      Download All as ZIP ({pagesGenerated.length} Images)
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {pagesGenerated.map((pg) => (
                <div
                  key={pg.pageNum}
                  className="bubble-card p-4 border border-slate-200 flex flex-col justify-between bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-50 border border-slate-200 mb-3 shadow-inner flex items-center justify-center">
                    <img
                      src={pg.dataUrl}
                      alt={`Rendered Page ${pg.pageNum}`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 block">
                        Page {pg.pageNum}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {pg.width} × {pg.height} px
                      </span>
                    </div>
                    <a
                      href={pg.dataUrl}
                      download={`${file?.name.replace(/\.[^/.]+$/, "")}_page_${pg.pageNum}.${format}`}
                      className="px-3.5 py-1.5 rounded-full text-xs font-bold btn-bubble btn-bubble-violet shadow-clay-pill flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Save
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AdPlaceholder slot="mid-rectangle" format="rectangle" />

      {/* Value Wrapper */}
      <ValueWrapper
        title="High-Resolution PDF to Image Conversion Guide: 150 DPI vs 300 DPI"
        subtitle="How to extract pixel-perfect presentation slides, archival evidence, and print-ready raster imagery directly in your browser."
        authorName="MultiPDF Doc Technology Team"
        lastUpdated="Updated September 2026"
        sources={[
          {
            title: "PDF 1.7 Reference: Rendering and Device Independence",
            publisher: "Adobe & ISO 32000-1",
            url: "https://www.adobe.com/devnet/pdf/pdf_reference.html",
            accessed: "September 2026",
          },
          {
            title: "Mozilla PDF.js: HTML5 Canvas Rasterization Architecture",
            publisher: "Mozilla Foundation",
            url: "https://mozilla.github.io/pdf.js/",
            accessed: "September 2026",
          },
        ]}
        sections={[
          {
            heading: "1. Understanding DPI Thresholds: Web Display vs. Professional Print",
            content: `When converting vector PDF documents into raster formats (PNG or JPEG), Dots Per Inch (DPI) determines pixel density:

• 150 DPI (Fast / Screen Quality): Recommended for PowerPoint slide decks, web publishing, LMS uploads, and email attachments. Keeps image file sizes under 1MB while ensuring legible text on Retina displays.
• 300 DPI (Commercial Print Quality): The standard for legal depositions, court filings, billboard printing, and archival publications. Prevents pixelation even when zooming in on fine spreadsheet footnotes or microscopic vector signatures.`
          },
          {
            heading: "2. Why PNG is Recommended for Typography and Vector Documents",
            content: `Documents primarily consist of high-contrast text glyphs and line diagrams. JPEG compression relies on Discrete Cosine Transform (DCT) algorithms which cause 'ringing' artifacts and blur around sharp letter edges. PNG utilizes lossless Deflate compression, guaranteeing razor-sharp character outlines across all display resolutions.`
          },
          {
            heading: "3. Direct In-Browser Canvas Architecture",
            content: `Unlike legacy converter portals that upload your sensitive documents to remote servers, MultiPDF Doc executes the entire rasterization process inside your browser using Mozilla PDF.js. Your document bytes never leave your physical machine.`
          }
        ]}
        formula={{
          title: "Exact Canvas Dimension Formula",
          formula: "Canvas_Width = Math.ceil(Viewport_Points_X * (DPI / 72)) | Canvas_Height = Math.ceil(Viewport_Points_Y * (DPI / 72))",
          explanation: "Standard US Letter (612 x 792 pt) renders at 150 DPI as 1,275 x 1,650 pixels (2.1 MP), and at 300 DPI as 2,550 x 3,300 pixels (8.4 Megapixels)."
        }}
        faqs={[
          {
            question: "Are my PDF pages uploaded to any cloud server?",
            answer: "No. All rendering executes locally inside your web browser using HTML5 Canvas and Mozilla PDF.js. No document bytes are transmitted to any server."
          },
          {
            question: "Can I download all pages together in a single file?",
            answer: "Yes. When converting documents with multiple pages, a 'Download All as ZIP' button appears, allowing you to bundle all extracted images into an uncompressed archive."
          },
          {
            question: "Why does 300 DPI take longer to render than 150 DPI?",
            answer: "At 300 DPI, each page generates four times as many pixels as 150 DPI (approx. 8.4 million pixels per page vs 2.1 million), requiring additional GPU rasterization cycles."
          }
        ]}
      />
    </div>
  );
}
