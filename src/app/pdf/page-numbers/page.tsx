"use client";

import React, { useState, useRef } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import {
  Hash,
  UploadCloud,
  FileText,
  Download,
  CheckCircle2,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sliders,
  Settings,
} from "lucide-react";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

export default function PageNumbersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [position, setPosition] = useState<"bottom-center" | "bottom-right" | "bottom-left" | "top-center" | "top-right">("bottom-center");
  const [format, setFormat] = useState<"page-n-of-total" | "n" | "dash-n-dash">("page-n-of-total");
  const [startPage, setStartPage] = useState<number>(1); // e.g. skip cover page
  const [startNumber, setStartNumber] = useState<number>(1);
  const [fontSize, setFontSize] = useState<number>(10);
  const [margin, setMargin] = useState<number>(30); // points from edge

  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== "application/pdf" && !selected.name.endsWith(".pdf")) {
      setErrorMsg("Please select a valid PDF document.");
      return;
    }

    setErrorMsg(null);
    setFile(selected);
    setDownloadUrl(null);

    try {
      const buffer = await selected.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setPageCount(pdfDoc.getPageCount());
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not parse PDF. File may be encrypted or corrupted.");
    }
  };

  const stampPageNumbers = async () => {
    if (!file) return;
    setProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const totalPages = pdfDoc.getPageCount();

      const textColor = rgb(0.2, 0.25, 0.35); // Slate 600

      for (let i = 0; i < totalPages; i++) {
        const pageNumberOneBased = i + 1;
        if (pageNumberOneBased < startPage) continue;

        const page = pdfDoc.getPage(i);
        const { width, height } = page.getSize();

        const currentNum = startNumber + (i - (startPage - 1));
        let textToDraw = `${currentNum}`;
        if (format === "page-n-of-total") {
          textToDraw = `Page ${currentNum} of ${totalPages - (startPage - 1)}`;
        } else if (format === "dash-n-dash") {
          textToDraw = `- ${currentNum} -`;
        }

        const textWidth = font.widthOfTextAtSize(textToDraw, fontSize);
        let x = width / 2 - textWidth / 2;
        let y = margin;

        if (position === "bottom-center") {
          x = width / 2 - textWidth / 2;
          y = margin;
        } else if (position === "bottom-right") {
          x = width - margin - textWidth;
          y = margin;
        } else if (position === "bottom-left") {
          x = margin;
          y = margin;
        } else if (position === "top-center") {
          x = width / 2 - textWidth / 2;
          y = height - margin - fontSize;
        } else if (position === "top-right") {
          x = width - margin - textWidth;
          y = height - margin - fontSize;
        }

        page.drawText(textToDraw, {
          x,
          y,
          size: fontSize,
          font,
          color: textColor,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setOutputFileName(`numbered_${file.name.replace(/\.pdf$/i, "")}.pdf`);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to stamp page numbers onto PDF. File structure may be unsupported.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-800 border border-violet-200/80 shadow-sm">
          <Hash className="w-3.5 h-3.5 text-violet-600" />
          <span>Bates Numbering & Academic Pagination • 100% In-Browser</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight">
          Add Page Numbers to PDF
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          Stamp custom headers, footers, and page counters onto legal briefs, manuscripts, and reports. Zero uploads at <strong className="text-slate-800">multipdfdoc.com</strong>.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Dropzone & Settings (7 Cols) */}
        <div className="lg:col-span-7 bubble-card p-6 sm:p-8 border border-slate-200/90 space-y-6">
          {/* Dropzone */}
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-violet-500 rounded-3xl p-10 text-center cursor-pointer transition-all hover:bg-violet-50/30 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform shadow-sm mb-3">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-1">
                Select PDF File to Number
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Drag and drop your document here, or click to browse. Files never leave your browser.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700 font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 truncate max-w-xs">{file.name}</div>
                  <div className="text-[10px] text-slate-500">
                    {pageCount} total pages • {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setDownloadUrl(null);
                }}
                className="text-xs text-slate-400 hover:text-rose-600 font-semibold"
              >
                Change File
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {file && (
            <div className="space-y-5 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Settings className="w-4 h-4 text-violet-600" />
                <span>Pagination & Placement Options</span>
              </div>

              {/* Position Grid */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Stamp Position</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: "bottom-center", label: "Bottom Center" },
                    { id: "bottom-right", label: "Bottom Right" },
                    { id: "bottom-left", label: "Bottom Left" },
                    { id: "top-center", label: "Top Center" },
                    { id: "top-right", label: "Top Right" },
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => setPosition(pos.id as any)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        position === pos.id
                          ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number Format */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Display Format</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: "page-n-of-total", label: "Page 1 of 10" },
                    { id: "n", label: "1, 2, 3..." },
                    { id: "dash-n-dash", label: "- 1 -, - 2 -" },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setFormat(fmt.id as any)}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        format === fmt.id
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Page (Skip Cover) & First Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Start on Page (e.g. 2 to skip cover)</label>
                  <input
                    type="number"
                    min="1"
                    max={pageCount || 1}
                    value={startPage}
                    onChange={(e) => setStartPage(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">First Number to Stamp</label>
                  <input
                    type="number"
                    min="1"
                    value={startNumber}
                    onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Font Size & Margin */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-700">Font Size:</span>
                    <span className="font-mono font-bold text-slate-900">{fontSize} pt</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="16"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-700">Edge Margin:</span>
                    <span className="font-mono font-bold text-slate-900">{margin} pt</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    value={margin}
                    onChange={(e) => setMargin(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Output: Actions & Status (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bubble-card p-6 sm:p-8 border border-slate-200/90 space-y-6">
            <span className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
              Document Pagination Status
            </span>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
              <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>Active Format:</span>
                <span className="font-mono text-violet-700">
                  {format === "page-n-of-total" ? "Page X of Y" : format === "n" ? "Plain Numbers" : "- X -"}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>Position:</span>
                <span className="capitalize text-slate-700">{position.replace("-", " ")}</span>
              </div>
              <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>Cover Page Skipped:</span>
                <span className="text-slate-700">{startPage > 1 ? `Yes (Starts p.${startPage})` : "No (Numbered all)"}</span>
              </div>
            </div>

            <div className="space-y-3">
              {errorMsg && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {errorMsg}
                </div>
              )}
              <button
                type="button"
                onClick={stampPageNumbers}
                disabled={!file || processing}
                className="w-full py-4 rounded-full text-xs sm:text-sm font-extrabold btn-bubble btn-bubble-violet flex items-center justify-center gap-2 shadow-clay-pill disabled:opacity-50"
              >
                <Hash className="w-4 h-4" />
                <span>{processing ? "Stamping Vector Numbers..." : "Apply Page Numbers to PDF"}</span>
              </button>

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={outputFileName}
                  className="w-full py-3.5 rounded-full text-xs sm:text-sm font-extrabold btn-bubble btn-bubble-emerald flex items-center justify-center gap-2 shadow-clay-pill"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Numbered PDF</span>
                </a>
              )}
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Vector PostScript typography • Zero rasterization</span>
            </div>
          </div>

          <AdPlaceholder slot="sidebar-ad" format="rectangle" />
        </div>
      </div>

      {/* AdSense Value Wrapper Layer */}
      <ValueWrapper
        toolName="Add Page Numbers to PDF"
        title="Official Legal & Academic Pagination Standards: Bates Numbering & Thesis Guidelines"
        subtitle="Comprehensive procedural standards for numbering legal filings, court exhibits, and academic dissertations."
        sections={[
          {
            heading: "1. Bates Numbering & Court Dossier Requirements",
            content: `In legal discovery, arbitration, and civil filings across federal and state jurisdictions, court rules (such as Federal Rule of Civil Procedure 34) require all evidentiary documents to feature sequential identification marks known as Bates Numbering.

Our client-side pagination tool allows paralegals and legal counsel to stamp sequential numbers onto documents without uploading sensitive evidentiary exhibits to third-party servers.`
          },
          {
            heading: "2. Academic Dissertation Guidelines: Cover Page Skipping",
            content: `University graduate schools universally mandate that thesis title pages and abstract cover sheets omit page numbers while remaining accounted for in the cumulative page tally.

By specifying 'Start on Page 2' or 'Start on Page 3', MultiPDF Doc preserves proper academic pagination structure without disrupting Roman numeral front-matter.`
          }
        ]}
        formula={{
          title: "Pagination Coordinate Placement Formula",
          formula: "X_pos = (PageWidth / 2) - (TextWidth / 2) | Y_pos = Margin_pts",
          explanation: "Point-based coordinate mapping conforming to the PDF ISO 32000 coordinate plane where the origin (0,0) sits at the bottom-left corner."
        }}
        faqs={[
          {
            question: "Does adding page numbers modify my original PDF text?",
            answer: "No. The tool adds a vector text overlay to the existing page content stream without modifying or shifting underlying paragraphs or images."
          },
          {
            question: "Are files uploaded to a server to add numbers?",
            answer: "Never. All page numbering executes 100% locally in your browser memory via WebAssembly."
          }
        ]}
      />
    </div>
  );
}
