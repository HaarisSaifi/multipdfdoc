import React from "react";
import { ShieldCheck, FileText, UserCheck, Mail, Lock, CheckCircle2, BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white font-display font-black text-sm shadow-clay-pill">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-display font-extrabold text-lg text-slate-900 tracking-tight">
                MultiPDF <span className="text-violet-600">Doc</span>
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              The privacy-first document and utility suite engineered for businesses, freelancers, and students. Core tools process documents locally. PDF and scanned-text OCR tools run in your browser without document uploads.
            </p>
            <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Engineered for client-side privacy with local in-browser document processing.</span>
            </div>
            <div className="pt-2">
              <a
                href="https://www.saashub.com/multipdf-doc?utm_source=badge&utm_campaign=badge&utm_content=multipdf-doc&badge_variant=color&badge_kind=approved"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:opacity-90 transition"
                title="MultiPDFDoc Approved on SaaSHub"
              >
                <img
                  src="https://cdn-b.saashub.com/img/badges/approved-color.png?v=1"
                  alt="MultiPDFDoc badge"
                  width={140}
                  height={38}
                  style={{ maxWidth: "140px" }}
                  className="h-auto"
                  loading="lazy"
                />
              </a>
            </div>
          </div>

          {/* Quick PDF & Document Tools */}
          <div>
            <h2 className="font-display font-bold text-sm text-slate-900 mb-3 tracking-wide">
              Document &amp; Utility Suite
            </h2>
            <ul className="space-y-2 text-slate-600">
              <li>
                <a href="/pdf/merge" className="hover:text-violet-600 transition-colors">
                  Merge PDF Files
                </a>
              </li>
              <li>
                <a href="/pdf/compress" className="hover:text-violet-600 transition-colors">
                  Compress to 200KB / 100KB
                </a>
              </li>
              <li>
                <a href="/invoice" className="hover:text-violet-600 transition-colors font-medium text-violet-700">
                  Free Invoice Generator
                </a>
              </li>
              <li>
                <a href="/receipt" className="hover:text-violet-600 transition-colors font-medium text-emerald-700">
                  Expense Voucher &amp; Log
                </a>
              </li>
              <li>
                <a href="/pdf/to-text" className="hover:text-violet-600 transition-colors font-medium text-amber-700">
                  Dual-Engine OCR to Text
                </a>
              </li>
              <li>
                <a href="/calc/final-grade" className="hover:text-violet-600 transition-colors">
                  Final Exam Grade Calculator
                </a>
              </li>
              <li>
                <a href="/calc/gpa" className="hover:text-violet-600 transition-colors">
                  Weighted GPA Converter
                </a>
              </li>
            </ul>
          </div>

          {/* Editorial & Research Pillar Guides */}
          <div>
            <h2 className="font-display font-bold text-sm text-slate-900 mb-3 tracking-wide flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-violet-600" />
              <span>Practical Guides</span>
            </h2>
            <ul className="space-y-2 text-slate-600">
              <li>
                <a href="/blog" className="hover:text-violet-600 transition-colors font-semibold text-violet-700">
                  All Guides &amp; Articles
                </a>
              </li>
              <li>
                <a href="/blog/compress-pdf-200kb-uscis-passport-guide" className="hover:text-violet-600 transition-colors line-clamp-1">
                  Government PDF Upload Guide
                </a>
              </li>
              <li>
                <a href="/blog/freelance-invoice-payment-terms-guide" className="hover:text-violet-600 transition-colors line-clamp-1">
                  Freelance Invoice Rules
                </a>
              </li>
              <li>
                <a href="/blog/weighted-vs-unweighted-gpa-college-admissions" className="hover:text-violet-600 transition-colors line-clamp-1">
                  Weighted vs Unweighted GPA
                </a>
              </li>
              <li>
                <a href="/blog/zero-knowledge-pdf-privacy-cloud-converter-risks" className="hover:text-violet-600 transition-colors line-clamp-1">
                  Zero-Knowledge PDF Privacy
                </a>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h2 className="font-display font-bold text-sm text-slate-900 mb-3 tracking-wide">
              Security &amp; Legal
            </h2>
            <ul className="space-y-2.5 text-slate-600">
              <li>
                <a href="/privacy-policy" className="hover:text-violet-600 transition-colors flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" /> Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-violet-600 transition-colors flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-sky-600" /> Terms of Service
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-violet-600 transition-colors flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-amber-600" /> About &amp; Mission
                </a>
              </li>
              <li>
                <a href="/author/haaris-saifi" className="hover:text-violet-600 transition-colors flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-violet-600" /> Founder: Haaris Saifi
                </a>
              </li>
              <li>
                <a href="/editorial-policy" className="hover:text-violet-600 transition-colors flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Editorial &amp; Testing Policy
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-violet-600 transition-colors flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-rose-600" /> Contact &amp; Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} MultiPDF Doc. Architected by <a href="/author/haaris-saifi" className="hover:text-violet-700 underline font-medium text-slate-600">Haaris Saifi</a>. Core document tools run locally in your browser.</p>
          <p className="flex items-center gap-1.5 font-medium text-slate-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Free Core Tools • No Account Required</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
