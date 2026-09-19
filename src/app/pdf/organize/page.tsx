"use client";

import React, { useState, useRef } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import {
  RotateCw,
  RotateCcw,
  Trash2,
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  FileText,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

interface PageItem {
  pageIndex: number;
  displayNum: number;
  rotation: number;
}

export default function OrganizePDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setErrorMsg("Please upload a valid PDF document.");
      return;
    }
    setErrorMsg(null);
    setDownloadUrl(null);
    setFile(f);

    try {
      const buffer = await f.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = doc.getPageCount();

      const initialPages: PageItem[] = [];
      for (let i = 0; i < count; i++) {
        const page = doc.getPage(i);
        initialPages.push({
          pageIndex: i,
          displayNum: i + 1,
          rotation: page.getRotation().angle || 0,
        });
      }
      setPages(initialPages);
    } catch (err) {
      setErrorMsg("Unable to parse PDF. It may be password protected.");
    }
  };

  const rotatePage = (index: number, angle: number) => {
    setPages((prev) =>
      prev.map((p, idx) =>
        idx === index ? { ...p, rotation: (p.rotation + angle + 360) % 360 } : p
      )
    );
    setDownloadUrl(null);
  };

  const deletePage = (index: number) => {
    if (pages.length <= 1) {
      setErrorMsg("A PDF document must retain at least one page.");
      return;
    }
    setPages((prev) => prev.filter((_, idx) => idx !== index));
    setDownloadUrl(null);
  };

  const movePage = (index: number, direction: "left" | "right") => {
    if (
      (direction === "left" && index === 0) ||
      (direction === "right" && index === pages.length - 1)
    ) {
      return;
    }
    const target = direction === "left" ? index - 1 : index + 1;
    const newPages = [...pages];
    const temp = newPages[index];
    newPages[index] = newPages[target];
    newPages[target] = temp;
    setPages(newPages);
    setDownloadUrl(null);
  };

  const handleSave = async () => {
    if (!file || pages.length === 0) return;
    setSaving(true);
    setErrorMsg(null);
    setDownloadUrl(null);

    try {
      const buffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(buffer);
      const newPdf = await PDFDocument.create();

      for (const item of pages) {
        const [copiedPage] = await newPdf.copyPages(sourcePdf, [item.pageIndex]);
        copiedPage.setRotation(degrees(item.rotation));
        newPdf.addPage(copiedPage);
      }

      const newBytes = await newPdf.save();
      const blob = new Blob([newBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "Failed to reorder and save PDF.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold uppercase tracking-wider shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Visual Page Organizer & Rotation Studio
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          Rotate & Organize <span className="text-violet-600">PDF Pages</span>
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Rotate sideways scans 90°, delete blank or unnecessary pages, and rearrange page sequences visually in your browser with zero data uploads.
        </p>
      </div>

      <AdPlaceholder slot="top-leaderboard" format="horizontal" />

      {/* Main Interactive Console */}
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
              dragActive ? "drag-active border-violet-600" : ""
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="hidden"
            />
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-white border border-violet-200 flex items-center justify-center text-violet-600 shadow-sm mb-5 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-violet-600 animate-bounce" />
            </div>
            <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 mb-2">
              Select or Drop PDF to Organize
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Inspect all document pages. Reorder, rotate, and delete pages entirely in memory.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bubble-card p-5 border border-slate-200/90 flex items-center justify-between gap-4 bg-slate-50/60">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-violet-600 border border-slate-200 flex-shrink-0 shadow-sm">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{file.name}</h4>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Active Pages: <span className="text-violet-600 font-bold">{pages.length}</span> • {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setDownloadUrl(null);
                }}
                className="text-xs px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm"
              >
                Change File
              </button>
            </div>

            {/* Interactive Visual Page Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {pages.map((item, idx) => (
                <div
                  key={`${item.pageIndex}-${idx}`}
                  className="bubble-card p-3 border border-slate-200 flex flex-col justify-between bg-white shadow-sm group"
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center p-4">
                    <div
                      style={{ transform: `rotate(${item.rotation}deg)` }}
                      className="w-full h-full bg-white rounded-lg shadow-sm border border-slate-200/80 flex flex-col items-center justify-center p-2 text-slate-800 transition-transform duration-300 select-none"
                    >
                      <div className="w-full h-1 bg-slate-100 rounded mb-1.5" />
                      <div className="w-3/4 h-1 bg-slate-100 rounded mb-1.5" />
                      <div className="w-full h-1 bg-slate-100 rounded mb-3" />
                      <span className="font-display font-black text-xl text-slate-700">
                        {item.displayNum}
                      </span>
                    </div>

                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 border border-slate-200 shadow-sm text-[10px] font-mono font-bold text-slate-700">
                      Pos: {idx + 1}
                    </span>

                    {item.rotation !== 0 && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-violet-600 text-[10px] font-mono font-bold text-white shadow-sm">
                        {item.rotation}°
                      </span>
                    )}
                  </div>

                  {/* Card Controls */}
                  <div className="flex items-center justify-between gap-1 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => rotatePage(idx, -90)}
                        title="Rotate Left 90°"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => rotatePage(idx, 90)}
                        title="Rotate Right 90°"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => movePage(idx, "left")}
                        disabled={idx === 0}
                        title="Move Left"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-600 hover:text-slate-900"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => movePage(idx, "right")}
                        disabled={idx === pages.length - 1}
                        title="Move Right"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-600 hover:text-slate-900"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => deletePage(idx)}
                      title="Delete Page"
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 font-medium">
                {pages.length} pages ready to be compiled in new sequence.
              </div>

              <button
                onClick={handleSave}
                disabled={saving || pages.length === 0}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-extrabold btn-bubble btn-bubble-violet flex items-center justify-center gap-2.5 shadow-clay-pill disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saving Document Structure...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Apply Changes & Download
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

        {/* Ready Download Card */}
        {downloadUrl && (
          <div className="mt-8 p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xl font-display font-bold text-slate-900">
                Your Organized PDF is Ready!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-mono">
                Document restructured with {pages.length} pages • Zero server upload
              </p>
            </div>
            <div>
              <a
                href={downloadUrl}
                download={`organized_${file?.name || "document.pdf"}`}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-extrabold btn-bubble btn-bubble-emerald shadow-clay-pill-emerald"
              >
                <Download className="w-5 h-5" />
                Download Restructured PDF
              </a>
            </div>
          </div>
        )}
      </div>

      <AdPlaceholder slot="mid-rectangle" format="rectangle" />

      {/* SEO Value Wrapper */}
      <ValueWrapper
        title="Restructuring PDF Sequences: Professional Orientation & Page Management"
        subtitle="Techniques for fixing upside-down scanner feeds, aligning mixed portrait/landscape spreadsheets, and pruning blank filler pages."
        sections={[
          {
            heading: "1. Correcting Orientation Glitches from Multi-Function Office Scanners",
            content: `Automatic Document Feeder (ADF) scanners frequently invert alternating pages or scan landscape accounting ledger sheets in portrait mode. When submitted to digital record vaults, these inverted pages trigger automated optical processing failures.

MultiPDF Doc allows you to rotate individual pages in 90-degree increments to ensure all charts, signature fields, and footnotes conform to standard reading orientation.`
          },
          {
            heading: "2. Pruning Blank Separator Pages without Breaking Document Catalogues",
            content: `Scanning double-sided contracts often produces blank reverse pages that artificially inflate file sizes. Deleting these superfluous pages directly in MultiPDF Doc cleans up your final submission while preserving internal font and metadata integrity.`
          }
        ]}
        formula={{
          title: "Page Coordinate Matrix Rotation",
          formula: "R(θ) = [cos θ, -sin θ; sin θ, cos θ] where θ ∈ {0°, 90°, 180°, 270°}",
          explanation: "MultiPDF Doc modifies the internal /Rotate attribute within the PDF page dictionary object, adjusting viewport dimensions without modifying raster pixel streams."
        }}
        faqs={[
          {
            question: "Does rotating pages alter the document's text searchability?",
            answer: "No. The underlying OCR and text coordinate streams remain 100% searchable and copy-pasteable. Only the viewing transformation matrix is updated."
          },
          {
            question: "Can I undo page deletions before downloading?",
            answer: "Yes. All operations occur in browser memory. You can re-upload your document at any time to restore deleted pages."
          }
        ]}
      />
    </div>
  );
}
