"use client";

import { useDownloadUrl } from "@/lib/use-download-url";
import React, { useState, useRef } from "react";
import {
  Layers,
  UploadCloud,
  FileText,
  ArrowUp,
  ArrowDown,
  Trash2,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  Plus,
  RefreshCw,
} from "lucide-react";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

interface PDFFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number | null;
  loading: boolean;
}

export default function MergePDFPage() {
  const [files, setFiles] = useState<PDFFileItem[]>([]);
  const [merging, setMerging] = useState(false);
  const [downloadUrl, setDownloadUrl] = useDownloadUrl();
  const [mergedFileName, setMergedFileName] = useState<string>("merged_document.pdf");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse and add files
  const handleFiles = async (newFileList: FileList | null) => {
    if (merging) return;
    if (!newFileList || newFileList.length === 0) return;
    setErrorMsg(null);
    setDownloadUrl(null);

    const validFiles: File[] = [];
    for (let i = 0; i < newFileList.length; i++) {
      const f = newFileList[i];
      if (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")) {
        validFiles.push(f);
      }
    }

    if (validFiles.length === 0) {
      setErrorMsg("Please upload valid PDF files only.");
      return;
    }

    const newItems: PDFFileItem[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      name: file.name,
      size: file.size,
      pageCount: null,
      loading: true,
    }));

    setFiles((prev) => [...prev, ...newItems]);

    // Inspect page counts asynchronously in browser
    for (const item of newItems) {
      try {
        const buffer = await item.file.arrayBuffer();
        const { PDFDocument } = await import("pdf-lib");
        const doc = await PDFDocument.load(buffer);
        const count = doc.getPageCount();
        setFiles((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, pageCount: count, loading: false } : f))
        );
      } catch (err) {
        setErrorMsg(`Could not read ${item.name}. Unlock encrypted PDFs first; damaged files cannot be merged.`);
        setFiles((prev) =>
          prev.filter((f) => f.id !== item.id)
        );
      }
    }
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === files.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIndex];
    newFiles[targetIndex] = temp;
    setFiles(newFiles);
    setDownloadUrl(null);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setDownloadUrl(null);
  };

  // 100% Client-Side PDF Merging Engine using pdf-lib
  const handleMerge = async () => {
    if (files.length < 2) {
      setErrorMsg("Please add at least 2 PDF files to combine.");
      return;
    }

    setMerging(true);
    setErrorMsg(null);
    setDownloadUrl(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const buffer = await item.file.arrayBuffer();
        const { PDFDocument } = await import("pdf-lib");
        const pdf = await PDFDocument.load(buffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setMergedFileName(`multipdfdoc_merged_${Date.now().toString().slice(-5)}.pdf`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err?.message || "Failed to merge PDF files. One of the documents may be password protected."
      );
    } finally {
      setMerging(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const totalPages = files.reduce((acc, f) => acc + (f.pageCount || 0), 0);
  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"><fieldset disabled={merging} className="contents" aria-busy={merging}>
      {/* Hero Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold uppercase tracking-wider shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          100% In-Browser • Zero Server Uploads
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          Private <span className="text-violet-600">PDF Merger</span>
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Combine multiple PDF documents into a single organized file in seconds. All processing occurs locally inside your browser—your confidential files never leave your computer.
        </p>
      </div>

      <AdPlaceholder slot="top-leaderboard" format="horizontal" />

      {/* Main Interactive Tool Console */}
      <div className="mt-8 bubble-card p-6 sm:p-10 border border-slate-200/90">
        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
          }}
          role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInputRef.current?.click(); } }}
              onClick={() => fileInputRef.current?.click()}
          className={`bubble-dropzone p-8 sm:p-12 text-center cursor-pointer transition-all ${
            dragActive ? "drag-active border-violet-600" : ""
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,application/pdf"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />

          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-white border border-violet-200 flex items-center justify-center text-violet-600 shadow-sm mb-5 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-violet-600 animate-bounce" />
          </div>

          <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 mb-2">
            Drag & Drop PDF files here, or <span className="text-violet-600 underline">browse</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Select 2 or more PDF documents. Files are processed entirely client-side via WebAssembly for absolute privacy.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div role="alert" className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Selected Files List */}
        {files.length > 0 && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs sm:text-sm">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-600" />
                Selected Documents ({files.length})
              </span>
              <span className="text-slate-500 font-mono text-xs">
                Total: {totalPages} Pages • {formatFileSize(totalSize)}
              </span>
            </div>

            {/* Draggable Reorderable Card List */}
            <div className="space-y-3">
              {files.map((item, idx) => (
                <div
                  key={item.id}
                  className="bubble-card p-4 flex items-center justify-between gap-4 border border-slate-200 hover:border-violet-300 transition-all bg-white"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-slate-700 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-2 font-mono mt-0.5">
                        <span>{formatFileSize(item.size)}</span>
                        <span>•</span>
                        <span>
                          {item.loading ? "Counting..." : `${item.pageCount} ${item.pageCount === 1 ? "page" : "pages"}`}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Actions (Reorder & Remove) */}
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <button
                      onClick={() => moveFile(idx, "up")}
                      disabled={idx === 0}
                      title="Move Up"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-600 hover:text-slate-900 border border-slate-200 transition-all"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveFile(idx, "down")}
                      disabled={idx === files.length - 1}
                      title="Move Down"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-600 hover:text-slate-900 border border-slate-200 transition-all"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFile(item.id)}
                      title="Remove"
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons Bar */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInputRef.current?.click(); } }}
              onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold btn-bubble btn-bubble-secondary flex items-center justify-center gap-2 shadow-clay-pill-secondary"
              >
                <Plus className="w-4 h-4" />
                Add More PDFs
              </button>

              <button
                onClick={handleMerge}
                disabled={merging || files.length < 2}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-extrabold btn-bubble btn-bubble-violet flex items-center justify-center gap-2.5 shadow-clay-pill disabled:opacity-50"
              >
                {merging ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Combining Pages Locally...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Merge {files.length} PDFs Now
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Success Download Card */}
        {downloadUrl && (
          <div className="mt-8 p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900">
                Your Merged PDF is Ready!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-mono">
                {files.length} files merged into {totalPages} pages • 0 bytes uploaded to internet
              </p>
            </div>
            <div>
              <a
                href={downloadUrl}
                download={mergedFileName}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-extrabold btn-bubble btn-bubble-emerald shadow-clay-pill-emerald"
              >
                <Download className="w-5 h-5" />
                Download Merged Document
              </a>
            </div>
          </div>
        )}

        {/* Privacy Assurance Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero Server Uploads</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>Local Browser Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-violet-600" />
            <span>Device Memory Limits Apply</span>
          </div>
        </div>
      </div>

      <AdPlaceholder slot="mid-rectangle" format="rectangle" />

      {/* Value Wrapper & SEO Content */}

    </fieldset></div>
  );
}
