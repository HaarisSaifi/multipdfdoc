import React from "react";
import Link from "next/link";
import { UserCheck, ShieldCheck, Cpu, Code2, CheckCircle2, Github, BookOpen, Mail } from "lucide-react";

export const metadata = {
  title: "About Us & Engineering Mission — MultiPDF Doc",
  description:
    "Learn about MultiPDF Doc, our founder Haaris Saifi, our client-side WebAssembly architecture, and our commitment to zero server uploads at multipdfdoc.com.",
  alternates: {
    canonical: "https://multipdfdoc.com/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bubble-card p-8 sm:p-12 border border-slate-200/90 space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-800 border border-violet-200 mb-3 shadow-sm">
            <UserCheck className="w-4 h-4 text-violet-600" />
            <span>Engineering Mission &amp; Creator Profile</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
            About MultiPDF Doc
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Building private, zero-upload in-browser document manipulation utilities at multipdfdoc.com.
          </p>
        </div>

        {/* Section 1: The Founder & Genesis */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">
            Who Built MultiPDF Doc
          </h2>
          <p>
            MultiPDF Doc was architected and built by <strong>Haaris Saifi</strong>, a software engineer passionate about document privacy, WebAssembly performance, and open web standards.
          </p>
          <p>
            For years, the online PDF utility ecosystem has relied on an outdated model: users who simply want to merge two documents, extract a chapter, or compress a file for an immigration portal are forced to upload confidential tax records, employment contracts, and medical reports to remote third-party cloud servers.
          </p>
          <p>
            MultiPDF Doc was created to prove a better alternative: by using local JavaScript engines and WebAssembly (including <strong>QPDF v12</strong>, <strong>Mozilla PDF.js</strong>, and <strong>Tesseract.js</strong>), everyday document workflows can run entirely inside the user’s browser with <strong>zero server document uploads</strong>.
          </p>
        </section>

        {/* Section 2: Core Engineering Pillars */}
        <section className="space-y-4">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">
            Our Architectural Pillars
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                100% In-Browser Privacy
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Standard tools process document bytes locally. Some engines and language packs load on first use, so loading a page alone does not guarantee offline availability. Optional Cloud AI OCR requires a separate consent step and an internet connection.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Cpu className="w-4 h-4 text-sky-600" />
                Hardware Acceleration
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                PDF.js renders pages on canvas and QPDF performs structural operations in WebAssembly. Processing speed and supported document size depend on your device; image export is limited to 50 pages per batch.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Open Source & Code Auditing */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-600" />
            <span>Open Source Transparency &amp; Code Quality</span>
          </h2>
          <p>
            MultiPDF Doc is licensed under the MIT License and maintains a public GitHub repository. Anyone can inspect our client-side WebAssembly implementation, file validation routines, and zero-PII logging architecture:
          </p>
          <div className="p-4 rounded-2xl bg-violet-50/60 border border-violet-100 flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-slate-900 text-xs">Public GitHub Repository</p>
              <p className="text-[11px] text-slate-500">HaarisSaifi/multipdfdoc • Verified Production Build</p>
            </div>
            <a
              href="https://github.com/HaarisSaifi/multipdfdoc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-sm"
            >
              <Github className="w-3.5 h-3.5" />
              <span>View Source</span>
            </a>
          </div>
        </section>

        {/* Section 4: Editorial Standards Link */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-violet-600" />
            <span>Editorial &amp; Quality Governance</span>
          </h2>
          <p>
            We verify our technical procedural guides against authoritative specifications (including ISO 32000-1 for PDF standards, IRS Publication 463 for expense logs, and USCIS electronic filing guides).
          </p>
          <p>
            For a comprehensive breakdown of our testing methodology, primary source citations, and corrections protocol, read our full{" "}
            <Link
              href="/editorial-policy"
              className="text-violet-600 hover:text-violet-800 font-bold underline"
            >
              Editorial, Testing &amp; Corrections Policy
            </Link>
            .
          </p>
        </section>

        {/* Contact Footer */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-violet-600" />
            <span>Founder &amp; Support Contact: support@multipdfdoc.com</span>
          </div>
          <span className="font-mono text-emerald-700 font-bold">100% In-Browser Verified</span>
        </div>
      </div>
    </div>
  );
}
