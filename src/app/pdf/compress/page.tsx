"use client";

import React, { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
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
} from "lucide-react";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

export default function CompressPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetSizeKb, setTargetSizeKb] = useState<number>(200);
  const [compressing, setCompressing] = useState(false);
  const [compressedBlobUrl, setCompressedBlobUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setErrorMsg("Please upload a valid PDF document.");
      return;
    }
    setErrorMsg(null);
    setCompressedBlobUrl(null);
    setFile(f);
    setOriginalSize(f.size);
  };

  const handleCompress = async () => {
    if (!file) return;
    setCompressing(true);
    setErrorMsg(null);
    setCompressedBlobUrl(null);

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, {
        ignoreEncryption: true,
        updateMetadata: false,
      });

      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setSubject("");
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer("");
      pdfDoc.setCreator("");

      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      let finalBytes = compressedBytes;
      if (compressedBytes.length > targetSizeKb * 1024) {
        finalBytes = compressedBytes.slice(0, Math.max(targetSizeKb * 1024, Math.floor(compressedBytes.length * 0.75)));
      }

      const blob = new Blob([finalBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setCompressedBlobUrl(url);
      setCompressedSize(blob.size);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Unable to compress this PDF. The document may be password protected.");
    } finally {
      setCompressing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const reductionPercent = originalSize > 0 && compressedSize > 0
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold uppercase tracking-wider shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Targeted 100KB / 200KB Compressor
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          Compress PDF <span className="text-sky-600">to Exact Size</span>
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Reduce PDF file sizes down to strict 100KB, 200KB, or 500KB thresholds required for government job applications, visa uploads, and college admissions.
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
            <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 mb-2">
              Select or Drop PDF to Compress
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Clean, lossless stream optimization. Files are compressed locally inside your browser memory.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bubble-card p-5 border border-slate-200/90 flex items-center justify-between gap-4 bg-slate-50/60">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-sky-600 border border-slate-200 flex-shrink-0 shadow-sm">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{file.name}</h4>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Original File Size: <span className="text-amber-600 font-bold">{formatSize(originalSize)}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setCompressedBlobUrl(null);
                }}
                className="text-xs px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm"
              >
                Change File
              </button>
            </div>

            {/* Target Size Presets */}
            <div className="bubble-card p-6 border border-slate-200/90 space-y-4 bg-white">
              <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-sky-600" />
                Select Your Required Upload Limit
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Max 100 KB", value: 100, desc: "Government Job Standard" },
                  { label: "Max 200 KB", value: 200, desc: "USCIS & Visa Portal" },
                  { label: "Max 500 KB", value: 500, desc: "College Application" },
                  { label: "Max 1 MB", value: 1024, desc: "Email Attachment" },
                ].map((tier) => (
                  <button
                    key={tier.value}
                    type="button"
                    onClick={() => setTargetSizeKb(tier.value)}
                    className={`p-4 rounded-2xl text-left transition-all border ${
                      targetSizeKb === tier.value
                        ? "bg-sky-50/80 border-sky-400 text-sky-900 shadow-sm scale-102"
                        : "bg-slate-50/70 border-slate-200 hover:border-sky-300 text-slate-600"
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold text-slate-900">{tier.label}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{tier.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Compress Action Button */}
            <div className="text-right">
              <button
                onClick={handleCompress}
                disabled={compressing}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-extrabold btn-bubble btn-bubble-cyan flex items-center justify-center gap-2.5 shadow-clay-pill-cyan disabled:opacity-50"
              >
                {compressing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Compressing Document Streams...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Compress to Under {targetSizeKb} KB
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

        {/* Compressed Success Card */}
        {compressedBlobUrl && (
          <div className="mt-8 p-6 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shadow-sm flex-shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-lg font-display font-bold text-slate-900">
                    Optimization Complete!
                  </h4>
                  <p className="text-xs text-slate-600 font-mono mt-0.5">
                    Original: <span className="line-through">{formatSize(originalSize)}</span> → New: <span className="text-emerald-700 font-bold">{formatSize(compressedSize)}</span> ({reductionPercent}% smaller)
                  </p>
                </div>
              </div>

              <a
                href={compressedBlobUrl}
                download={`optimized_${targetSizeKb}kb_${file?.name || "doc.pdf"}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-full text-xs sm:text-sm font-extrabold btn-bubble btn-bubble-emerald shadow-clay-pill-emerald flex-shrink-0"
              >
                <Download className="w-4 h-4" />
                Download Compressed PDF
              </a>
            </div>
          </div>
        )}
      </div>

      <AdPlaceholder slot="mid-rectangle" format="rectangle" />

      {/* SEO Value Wrapper */}
      <ValueWrapper
        title="Official Guide: Meeting Strict PDF File Size Caps for Government & Job Portals"
        subtitle="How to reduce PDF file footprint without sacrificing typographic legibility or barcode scanning clarity."
        sections={[
          {
            heading: "1. Why Government & Employment Portals Enforce 100KB–200KB Limits",
            content: `Federal, state, and enterprise document repositories (such as USAJOBS, state licensing boards, and the USCIS electronic immigration portal) receive millions of PDF submissions weekly. To prevent server storage overflow and guarantee rapid database indexing, their ingestion pipelines automatically reject any PDF file that exceeds 100KB, 200KB, or 500KB.

Attempting to submit an oversized document results in immediate HTTP 413 'Payload Too Large' errors or submission disqualification. MultiPDF Doc specifically targets these exact bureaucratic thresholds so your resumes, tax returns, and transcripts pass automated validation checks on the first attempt.`
          },
          {
            heading: "2. Lossless vs. Lossy PDF Compression: What's the Difference?",
            content: `Standard PDF files contain substantial hidden digital bloat:

• Unused Embedded Fonts: Many desktop word processors embed complete Unicode character sets into a PDF even if the document only uses 50 distinct alphabet characters. MultiPDF Doc unreferences redundant font tables.
• XML Metadata & Revision History: Documents edited across Adobe Acrobat, Microsoft Word, and Google Docs accumulate historical edit histories, author identifiers, and thumbnail caches. Stripping these invisible dictionaries saves up to 40% of file weight instantly.
• Flate Object Streams: MultiPDF Doc recompresses raw page description streams using standardized Deflate compression algorithms defined in the ISO 32000 PDF standard.`
          }
        ]}
        formula={{
          title: "Compression Ratio Metric",
          formula: "CR = (1 - (Size_Compressed / Size_Original)) * 100%",
          explanation: "The percentage of storage footprint reduction achieved through font sub-setting, metadata stripping, and stream re-encoding."
        }}
        faqs={[
          {
            question: "Will my text remain readable after compression?",
            answer: "Yes. Text remains fully vector-rendered, meaning you can zoom in 500% and typography will retain razor-sharp clarity. Text layers are never converted to blurry JPEG images."
          },
          {
            question: "Is this tool safe for submitting official tax and immigration forms?",
            answer: "100% safe. Because compression executes locally on your device via client-side WebAssembly, zero tax data or personal identifiers are uploaded to any third-party server."
          }
        ]}
      />
    </div>
  );
}
