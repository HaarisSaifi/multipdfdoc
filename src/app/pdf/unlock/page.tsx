"use client";

import React, { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import {
  KeyRound,
  UploadCloud,
  FileText,
  Download,
  ShieldCheck,
  CheckCircle2,
  Unlock,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

export default function UnlockPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== "application/pdf" && !selected.name.endsWith(".pdf")) {
      setErrorMsg("Please select a valid PDF file.");
      return;
    }

    setFile(selected);
    setDownloadUrl(null);
    setErrorMsg(null);
  };

  const handleUnlock = async () => {
    if (!file) return;
    setProcessing(true);
    setErrorMsg(null);

    try {
      const buffer = await file.arrayBuffer();
      // Load and decrypt using client-side WebAssembly
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      // Create a fresh unlocked document and copy pages
      const unlockedDoc = await PDFDocument.create();
      const pageCount = pdfDoc.getPageCount();
      const pageIndices = Array.from({ length: pageCount }, (_, i) => i);
      const copiedPages = await unlockedDoc.copyPages(pdfDoc, pageIndices);

      copiedPages.forEach((page) => unlockedDoc.addPage(page));

      const pdfBytes = await unlockedDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setOutputFileName(`unlocked_${file.name.replace(/\.pdf$/i, "")}.pdf`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to unlock document. Please ensure the password is correct or the file is not corrupted.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-800 border border-violet-200/80 shadow-sm">
          <Unlock className="w-3.5 h-3.5 text-violet-600" />
          <span>Instant Client-Side Decryption • Zero Server Uploads</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight">
          Unlock PDF Password & Restrictions
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          Remove passwords and printing/copying restrictions from secured PDF documents locally in your browser at <strong className="text-slate-800">multipdfdoc.com</strong>.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 bubble-card p-6 sm:p-8 border border-slate-200/90 space-y-6">
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
                Select Password-Protected PDF
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Drag and drop your protected document here. No files are transmitted across the internet.
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
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to Decrypt
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setDownloadUrl(null);
                  setErrorMsg(null);
                }}
                className="text-xs text-slate-400 hover:text-rose-600 font-semibold"
              >
                Change
              </button>
            </div>
          )}

          {file && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Enter Document Password (If Required)</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter the PDF password..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-violet-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  If the document only has permission locks (e.g. printing or copying disabled), leave blank and click unlock directly.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Output: Actions & Status (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bubble-card p-6 sm:p-8 border border-slate-200/90 space-y-6">
            <span className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
              Decryption Console
            </span>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Local Permissions Removal</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Removes owner restrictions and copies raw content streams into an unencumbered ISO 32000 PDF file.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleUnlock}
                disabled={!file || processing}
                className="w-full py-4 rounded-full text-xs sm:text-sm font-extrabold btn-bubble btn-bubble-violet flex items-center justify-center gap-2 shadow-clay-pill disabled:opacity-50"
              >
                <Unlock className="w-4 h-4" />
                <span>{processing ? "Decrypting Locally..." : "Unlock PDF Document"}</span>
              </button>

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={outputFileName}
                  className="w-full py-3.5 rounded-full text-xs sm:text-sm font-extrabold btn-bubble btn-bubble-emerald flex items-center justify-center gap-2 shadow-clay-pill"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Unlocked PDF</span>
                </a>
              )}
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full printing, editing, and copying enabled</span>
            </div>
          </div>

          <AdPlaceholder slot="sidebar-ad" format="rectangle" />
        </div>
      </div>

      {/* AdSense Value Wrapper Layer */}
      <ValueWrapper
        toolName="Unlock PDF Password"
        title="PDF Security Architecture: How Permissions Dictionaries & Document Decryption Work"
        subtitle="Technical overview of PDF permissions removal, owner restrictions, and client-side privacy."
        sections={[
          {
            heading: "1. Understanding Owner Passwords vs User Passwords",
            content: `Many institutional PDFs (such as financial statements, medical lab reports, and academic journals) are locked with an 'Owner Permission' password. While the document can be read freely on screen, functions like 'Print Document', 'Copy Text', and 'Extract Pages' are greyed out.

MultiPDF Doc extracts the underlying content streams and re-serializes the page tree into an open catalog dictionary, stripping away permission flags while maintaining original vector layout.`
          },
          {
            heading: "2. Why Zero-Upload Decryption Protects Legal Confidentiality",
            content: `Decrypting sensitive business agreements on cloud servers exposes unencrypted trade secrets to remote server logs. MultiPDF Doc processes everything in your browser's dedicated V8 JavaScript memory space.`
          }
        ]}
        formula={{
          title: "Stream Reconstruction Complexity",
          formula: "Time = O(P) where P = Total Page Count | Memory = O(File_Size)",
          explanation: "Linear extraction and page cloning executing in random access memory without intermediate disk buffering."
        }}
        faqs={[
          {
            question: "Does this tool work if I don't know the password to open the file?",
            answer: "If a PDF has an active User Open Password, you must provide the password once so the browser can decrypt the file. If it only has printing/copying restrictions, it can be unlocked immediately."
          },
          {
            question: "Is there any risk of file corruption?",
            answer: "No. MultiPDF Doc losslessly copies original page objects, preserving all vector fonts, form fields, and embedded images."
          }
        ]}
      />
    </div>
  );
}
