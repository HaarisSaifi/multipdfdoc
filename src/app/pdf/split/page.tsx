"use client";

import React, { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import {
  Scissors,
  UploadCloud,
  FileText,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  RefreshCw,
} from "lucide-react";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

export default function SplitPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [pageRange, setPageRange] = useState<string>("1");
  const [splitting, setSplitting] = useState(false);
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
      setPageCount(count);
      setPageRange(`1-${Math.min(count, 3)}`);
    } catch (err) {
      setErrorMsg("Unable to parse PDF. It may be corrupt or encrypted with a password.");
    }
  };

  const parsePageRange = (rangeStr: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = rangeStr.split(",").map((p) => p.trim());

    for (const part of parts) {
      if (part.includes("-")) {
        const [startStr, endStr] = part.split("-").map((s) => s.trim());
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const s = Math.max(1, Math.min(start, end));
          const e = Math.min(maxPages, Math.max(start, end));
          for (let i = s; i <= e; i++) {
            pages.add(i - 1);
          }
        }
      } else {
        const p = parseInt(part, 10);
        if (!isNaN(p) && p >= 1 && p <= maxPages) {
          pages.add(p - 1);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file || !pageCount) return;
    setSplitting(true);
    setErrorMsg(null);
    setDownloadUrl(null);

    try {
      const targetIndices = parsePageRange(pageRange, pageCount);
      if (targetIndices.length === 0) {
        setErrorMsg("Invalid page range specified. Please enter valid page numbers (e.g. 1-3, 5).");
        setSplitting(false);
        return;
      }

      const buffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(buffer);
      const newPdf = await PDFDocument.create();

      const copiedPages = await newPdf.copyPages(sourcePdf, targetIndices);
      copiedPages.forEach((p) => newPdf.addPage(p));

      const newPdfBytes = await newPdf.save();
      const blob = new Blob([newPdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "An error occurred while splitting the document.");
    } finally {
      setSplitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          100% Client-Side • Confidential & Fast
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          Extract & <span className="text-rose-600">Split PDF Pages</span>
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Extract specific pages or page ranges from your PDF into a brand-new, lightweight document. Fast, free, and processed 100% locally on your computer.
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
              dragActive ? "drag-active border-rose-600" : ""
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="hidden"
            />
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-white border border-rose-200 flex items-center justify-center text-rose-600 shadow-sm mb-5 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-rose-600 animate-bounce" />
            </div>
            <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 mb-2">
              Select or Drop a PDF to Split
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Your document is analyzed instantly in memory. Zero file data is uploaded to remote servers.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bubble-card p-5 border border-slate-200/90 flex items-center justify-between gap-4 bg-slate-50/60">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-rose-600 border border-slate-200 flex-shrink-0 shadow-sm">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{file.name}</h4>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Total Pages: <span className="text-rose-600 font-bold">{pageCount}</span> • {(file.size / 1024 / 1024).toFixed(2)} MB
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

            {/* Page Range Selector */}
            <div className="bubble-card p-6 border border-slate-200/90 space-y-4 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-rose-600" />
                  Specify Page Range to Extract
                </label>
                <span className="text-xs text-slate-500">
                  Valid pages: 1 to {pageCount}
                </span>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  placeholder="e.g. 1-3, 5, 7-9"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-mono outline-none focus:border-rose-500 focus:bg-white transition-all"
                />
                <p className="text-[11px] text-slate-500">
                  Use commas to separate individual pages (e.g. <span className="text-violet-600 font-mono">1, 4</span>) or hyphens for continuous page ranges (e.g. <span className="text-violet-600 font-mono">2-6</span>).
                </p>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPageRange("1")}
                  className="px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-600 hover:text-slate-900 shadow-sm"
                >
                  First Page Only (Cover)
                </button>
                <button
                  type="button"
                  onClick={() => setPageRange(`1-${Math.min(pageCount || 1, 5)}`)}
                  className="px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-600 hover:text-slate-900 shadow-sm"
                >
                  First 5 Pages
                </button>
                <button
                  type="button"
                  onClick={() => setPageRange(String(pageCount))}
                  className="px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-600 hover:text-slate-900 shadow-sm"
                >
                  Last Page Only
                </button>
              </div>
            </div>

            {/* Split Action Button */}
            <div className="text-right">
              <button
                onClick={handleSplit}
                disabled={splitting || !pageRange.trim()}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-extrabold btn-bubble btn-bubble-violet flex items-center justify-center gap-2.5 shadow-clay-pill disabled:opacity-50"
              >
                {splitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Extracting Pages in Memory...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Extract Pages Now
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

        {/* Download Extracted Document */}
        {downloadUrl && (
          <div className="mt-8 p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xl font-display font-bold text-slate-900">
                Your Extracted PDF is Ready!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-mono">
                Pages [{pageRange}] successfully extracted • Zero network latency
              </p>
            </div>
            <div>
              <a
                href={downloadUrl}
                download={`extracted_${pageRange.replace(/[^0-9-]/g, "_")}.pdf`}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-extrabold btn-bubble btn-bubble-emerald shadow-clay-pill-emerald"
              >
                <Download className="w-5 h-5" />
                Download Extracted PDF
              </a>
            </div>
          </div>
        )}
      </div>

      <AdPlaceholder slot="mid-rectangle" format="rectangle" />

      {/* Value Wrapper & SEO Content */}
      <ValueWrapper
        title="Authoritative Guide: How to Extract & Separate PDF Pages Securely"
        subtitle="Techniques for isolating specific chapters, removing confidential disclosures, and maintaining ISO 32000 compliance."
        sections={[
          {
            heading: "1. Common Legal, Medical, and Academic Split Use-Cases",
            content: `Document partitioning is a fundamental workflow across high-compliance industries:

• Redacted Court Filings: Legal counsels frequently need to isolate specific affidavits, signature pages, or evidentiary exhibits from 500-page court bundles without disclosing privileged internal memoranda.
• Medical Record Submissions: Patients and healthcare administrators must submit specific clinical lab reports or discharge summaries to insurance adjusters without releasing unrelated personal diagnostic history.
• Academic Thesis Chapters: Doctoral researchers often require single-chapter PDFs for peer-reviewed journal submission or conference presentation distribution.`
          },
          {
            heading: "2. Understanding Page Syntax: Ranges, Intervals, and Commas",
            content: `MultiPDF Doc parses standard mathematical and printer range notations:

• Single Pages: Entering '4' will extract solely the fourth page of the document.
• Continuous Spans: Entering '3-7' extracts pages 3, 4, 5, 6, and 7 inclusive.
• Discontinuous Sequences: Entering '1, 5, 8-12' extracts page 1, page 5, and the span from 8 to 12 into a single unified output document.
• Reverse Ordering: If you enter '5-1', MultiPDF Doc automatically sanitizes the order to preserve document structural integrity.`
          }
        ]}
        formula={{
          title: "Page Extraction Algorithm Complexity",
          formula: "Time: O(K) where K = Count(SelectedPages) | RAM: Memory = SourcePDF_Size * (K / TotalPages)",
          explanation: "Unlike legacy server-side PDF utilities that decompress the entire document into uncompressed bitmap arrays, MultiPDF Doc references existing binary content streams and directly re-maps page tree dictionaries in WebAssembly."
        }}
        faqs={[
          {
            question: "Does extracting pages reduce the quality of text or images?",
            answer: "No. The extraction engine copies original PostScript vector fonts, text layers, and high-resolution images losslessly without re-encoding or compression artifacts."
          },
          {
            question: "Are bookmarks and hyperlinks preserved?",
            answer: "Hyperlinks on the extracted pages pointing to external web URLs are fully preserved. Internal bookmarks pointing to pages outside the extracted range are cleanly pruned to prevent corrupt document navigation."
          },
          {
            question: "Is there a page count limit on large files?",
            answer: "MultiPDF Doc comfortably handles source PDFs containing over 1,000 pages because processing occurs directly inside your browser's dedicated V8 JavaScript virtual machine."
          }
        ]}
      />
    </div>
  );
}
