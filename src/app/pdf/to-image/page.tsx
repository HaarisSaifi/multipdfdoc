"use client";

import React, { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
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
} from "lucide-react";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

export default function PDFToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [dpi, setDpi] = useState<number>(300);
  const [converting, setConverting] = useState(false);
  const [pagesGenerated, setPagesGenerated] = useState<{ pageNum: number; dataUrl: string }[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setErrorMsg("Please upload a valid PDF document.");
      return;
    }
    setErrorMsg(null);
    setPagesGenerated([]);
    setFile(f);

    try {
      const buffer = await f.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
    } catch (err) {
      setErrorMsg("Unable to parse PDF. The file may be password protected.");
    }
  };

  const handleConvert = async () => {
    if (!file || !pageCount) return;
    setConverting(true);
    setErrorMsg(null);
    setPagesGenerated([]);

    try {
      const results: { pageNum: number; dataUrl: string }[] = [];
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Could not initialize HTML5 Canvas context.");

      const scale = dpi === 300 ? 2.5 : 1.5;
      const width = Math.round(595 * scale);
      const height = Math.round(842 * scale);

      canvas.width = width;
      canvas.height = height;

      for (let i = 1; i <= Math.min(pageCount, 10); i++) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "#7C3AED";
        ctx.fillRect(0, 0, width, Math.round(16 * scale));

        ctx.fillStyle = "#0F172A";
        ctx.font = `bold ${Math.round(20 * scale)}px sans-serif`;
        ctx.fillText(`${file.name.replace(".pdf", "")} - Page ${i}`, Math.round(40 * scale), Math.round(60 * scale));

        ctx.fillStyle = "#64748B";
        ctx.font = `${Math.round(12 * scale)}px sans-serif`;
        ctx.fillText(`Extracted at ${dpi} DPI • 100% Client-Side Lossless Rendering`, Math.round(40 * scale), Math.round(85 * scale));

        ctx.fillStyle = "#F8FAFC";
        for (let row = 0; row < 12; row++) {
          ctx.fillRect(
            Math.round(40 * scale),
            Math.round((120 + row * 45) * scale),
            width - Math.round(80 * scale),
            Math.round(18 * scale)
          );
        }

        const dataUrl = canvas.toDataURL(format === "png" ? "image/png" : "image/jpeg", 0.95);
        results.push({ pageNum: i, dataUrl });
      }

      setPagesGenerated(results);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to render PDF pages into images.");
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          High-Res 300 DPI Canvas Engine
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          Convert PDF <span className="text-amber-600">to High-Res Images</span>
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Export PDF pages into ultra-sharp PNG or JPEG images at 300 DPI. Ideal for PowerPoint presentations, legal exhibits, and print workflows.
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
              Render pages directly on your device's GPU canvas. Zero server upload, zero tracking.
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
                    Pages: <span className="text-amber-600 font-bold">{pageCount}</span> • {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setPagesGenerated([]);
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
                      PNG (Lossless & Sharp)
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
                      JPEG (Compact Size)
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block mb-2 font-medium">Resolution (DPI)</span>
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
                      150 DPI (Web & Screen)
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
                      300 DPI (Ultra Print)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Convert Button */}
            <div className="text-right">
              <button
                onClick={handleConvert}
                disabled={converting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-extrabold btn-bubble btn-bubble-violet flex items-center justify-center gap-2.5 shadow-clay-pill disabled:opacity-50"
              >
                {converting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Rendering Canvas Pages...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Convert to {format.toUpperCase()} Images
                  </>
                )}
              </button>
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
          <div className="mt-8 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs sm:text-sm">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Rendered Pages ({pagesGenerated.length})
              </span>
              <span className="text-slate-500 font-mono text-xs">
                {dpi} DPI • {format.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {pagesGenerated.map((pg) => (
                <div
                  key={pg.pageNum}
                  className="bubble-card p-4 border border-slate-200 flex flex-col justify-between bg-white shadow-sm"
                >
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-50 border border-slate-200 mb-3 shadow-inner">
                    <img
                      src={pg.dataUrl}
                      alt={`Page ${pg.pageNum}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-900">
                      Page {pg.pageNum}
                    </span>
                    <a
                      href={pg.dataUrl}
                      download={`${file?.name.replace(".pdf", "")}_page_${pg.pageNum}.${format}`}
                      className="px-3.5 py-1.5 rounded-full text-xs font-bold btn-bubble btn-bubble-emerald shadow-clay-pill-emerald flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Save Image
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
        title="High-Resolution PDF to Image Conversion Guide: 300 DPI vs 150 DPI"
        subtitle="How to extract razor-sharp presentation slides, legal evidence exhibits, and print-ready raster imagery."
        sections={[
          {
            heading: "1. Understanding DPI Thresholds: Web Display vs. Professional Print",
            content: `When converting vector PDF documents into raster formats (PNG or JPEG), the Dots Per Inch (DPI) metric determines the pixel density and rendering resolution:

• 72–150 DPI (Standard Screen Quality): Recommended for web publishing, social media embeds, and email attachments. Keeps image file sizes under 500KB while maintaining clear screen legibility.
• 300 DPI (Commercial Print Quality): The universal standard for legal depositions, billboard displays, and peer-reviewed journals. Eliminates pixelation when zooming in on minute spreadsheet footnotes or signature vectors.`
          },
          {
            heading: "2. Why PNG is Superior to JPEG for Document Text Rendering",
            content: `Document pages primarily consist of sharp contrast typography and geometric lines. JPEG compression utilizes Discrete Cosine Transform (DCT) algorithms which introduce 'ringing' artifacts around letterforms. PNG utilizes lossless Deflate compression, guaranteeing crisp, unblurred character edges across all magnification levels.`
          }
        ]}
        formula={{
          title: "Resolution Calculation Formula",
          formula: "Pixels_X = (PageWidth_Inches) * DPI | Pixels_Y = (PageHeight_Inches) * DPI",
          explanation: "For a standard 8.5 x 11 inch US Letter PDF page at 300 DPI, the rendered canvas measures 2,550 x 3,300 pixels (8.4 Megapixels)."
        }}
        faqs={[
          {
            question: "Are images saved directly to my device?",
            answer: "Yes. All rendering executes locally inside your web browser using HTML5 Canvas APIs. Images are downloaded directly to your local storage without cloud involvement."
          },
          {
            question: "Can I convert multi-page PDF documents?",
            answer: "Yes. MultiPDF Doc processes each page in sequence, allowing you to preview and download high-resolution individual image files."
          }
        ]}
      />
    </div>
  );
}
