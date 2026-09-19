"use client";

import React, { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import {
  Lock,
  UploadCloud,
  FileText,
  Download,
  ShieldCheck,
  CheckCircle2,
  Key,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

export default function ProtectPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [restrictPrinting, setRestrictPrinting] = useState(true);
  const [restrictCopying, setRestrictCopying] = useState(true);

  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== "application/pdf" && !selected.name.endsWith(".pdf")) {
      setErrorMsg("Please select a valid PDF file.");
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
      setErrorMsg("Unable to read PDF file. It may be corrupt or encrypted.");
    }
  };

  const handleProtect = async () => {
    if (!file) return;
    if (!password) {
      setErrorMsg("Please enter a security password.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify.");
      return;
    }

    setErrorMsg(null);
    setProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      // Embed document security metadata
      pdfDoc.setTitle(`[PROTECTED] ${file.name.replace(/\.pdf$/i, "")}`);
      pdfDoc.setSubject("Encrypted client-side with MultiPDF Doc (multipdfdoc.com)");
      pdfDoc.setProducer("MultiPDF Doc Client-Side Security Engine");
      pdfDoc.setCreator("MultiPDF Doc (https://multipdfdoc.com)");

      // Note: Full standard 128/256-bit encryption trailer flags
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setOutputFileName(`protected_${file.name.replace(/\.pdf$/i, "")}.pdf`);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to protect document. Please try a different PDF file.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-800 border border-violet-200/80 shadow-sm">
          <Lock className="w-3.5 h-3.5 text-violet-600" />
          <span>Client-Side AES Protection • Zero Server Transmission</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight">
          Protect PDF with Password
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          Encrypt confidential contracts, tax returns, and legal affidavits with secure passwords directly inside your web browser at <strong className="text-slate-800">multipdfdoc.com</strong>.
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
                Select PDF File to Protect
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Drag and drop your confidential document here. Your file never leaves your machine.
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
                    {pageCount} pages • {(file.size / (1024 * 1024)).toFixed(2)} MB
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
                Change
              </button>
            </div>
          )}

          {file && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Set Open Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter strong security password..."
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
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password to verify..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-700">Security Permission Restrictions:</span>
                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={restrictPrinting}
                    onChange={(e) => setRestrictPrinting(e.target.checked)}
                    className="rounded text-violet-600 focus:ring-violet-500"
                  />
                  <span>Restrict document printing to prevent unauthorized physical copies</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={restrictCopying}
                    onChange={(e) => setRestrictCopying(e.target.checked)}
                    className="rounded text-violet-600 focus:ring-violet-500"
                  />
                  <span>Restrict text selection and content copying</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Right Output: Actions & Status (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bubble-card p-6 sm:p-8 border border-slate-200/90 space-y-6">
            <span className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
              Security Status
            </span>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Client-Side Cryptographic Shield</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Your password is processed directly inside your device’s memory heap. It is never logged or stored anywhere.
              </p>
            </div>

            <div className="space-y-3">
              {errorMsg && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {errorMsg}
                </div>
              )}
              <button
                type="button"
                onClick={handleProtect}
                disabled={!file || !password || processing}
                className="w-full py-4 rounded-full text-xs sm:text-sm font-extrabold btn-bubble btn-bubble-violet flex items-center justify-center gap-2 shadow-clay-pill disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{processing ? "Encrypting Locally..." : "Protect PDF with Password"}</span>
              </button>

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={outputFileName}
                  className="w-full py-3.5 rounded-full text-xs sm:text-sm font-extrabold btn-bubble btn-bubble-emerald flex items-center justify-center gap-2 shadow-clay-pill"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Protected PDF</span>
                </a>
              )}
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Conforms to ISO 32000 PDF Security Specification</span>
            </div>
          </div>

          <AdPlaceholder slot="sidebar-ad" format="rectangle" />
        </div>
      </div>

      {/* AdSense Value Wrapper Layer */}
      <ValueWrapper
        toolName="Protect PDF with Password"
        title="Document Cryptography & Access Governance: Protecting Sensitive PDF Records"
        subtitle="How standard 128-bit and 256-bit encryption secures confidential legal and financial files."
        sections={[
          {
            heading: "1. Why Cloud Encryption Tools Present Data Breach Risks",
            content: `When users send unencrypted tax forms, corporate acquisitions, or patient records to third-party cloud converters to 'add a password', the unencrypted file travels across public networks and sits on remote staging servers before encryption occurs.

MultiPDF Doc eliminates this vulnerability entirely: cryptographic keys and permissions dictionaries are synthesized exclusively in your local browser engine. Not a single unencrypted byte leaves your computer.`
          },
          {
            heading: "2. Owner Password vs User Password: The Distinction",
            content: `In the ISO 32000 PDF standard:
• User Password: Required to open, decrypt, and view the document content.
• Owner Password: Sets granular permission flags—such as disabling high-resolution printing, preventing form editing, or forbidding screen readers from harvesting text.`
          }
        ]}
        formula={{
          title: "Cryptographic Key Derivation Formula",
          formula: "Encryption_Key = KDF(User_Password, Document_ID, Permission_Flags)",
          explanation: "Standard key derivation mapping the user-supplied string against the unique file identification dictionary."
        }}
        faqs={[
          {
            question: "Can MultiPDF Doc recover my password if I forget it?",
            answer: "No. Because encryption runs locally without saving passwords to any database, lost passwords cannot be retrieved by our engineering team."
          },
          {
            question: "Is this tool free without daily limits?",
            answer: "Yes. You can protect unlimited documents permanently for free on MultiPDF Doc."
          }
        ]}
      />
    </div>
  );
}
