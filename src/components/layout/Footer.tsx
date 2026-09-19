import React from "react";
import Link from "next/link";
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
              The privacy-first document and utility suite engineered for businesses, freelancers, and students. Built with 100% client-side WebAssembly: all document operations execute locally in your browser memory with zero server uploads at multipdfdoc.com.
            </p>
            <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Compliant with GDPR, CCPA, and HIPAA zero-transmission data standards.</span>
            </div>
          </div>

          {/* Quick PDF & Document Tools */}
          <div>
            <h3 className="font-display font-bold text-sm text-slate-900 mb-3 tracking-wide">
              Document &amp; Utility Suite
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li>
                <Link href="/pdf/merge" className="hover:text-violet-600 transition-colors">
                  Merge PDF Files
                </Link>
              </li>
              <li>
                <Link href="/pdf/compress" className="hover:text-violet-600 transition-colors">
                  Compress to 200KB / 100KB
                </Link>
              </li>
              <li>
                <Link href="/invoice" className="hover:text-violet-600 transition-colors font-medium text-violet-700">
                  Free Invoice Generator
                </Link>
              </li>
              <li>
                <Link href="/receipt" className="hover:text-violet-600 transition-colors font-medium text-emerald-700">
                  Expense Receipt Maker
                </Link>
              </li>
              <li>
                <Link href="/pdf/to-text" className="hover:text-violet-600 transition-colors font-medium text-amber-700">
                  Dual-Engine OCR to Text
                </Link>
              </li>
              <li>
                <Link href="/calc/final-grade" className="hover:text-violet-600 transition-colors">
                  Final Exam Grade Calculator
                </Link>
              </li>
              <li>
                <Link href="/calc/gpa" className="hover:text-violet-600 transition-colors">
                  Weighted GPA Converter
                </Link>
              </li>
            </ul>
          </div>

          {/* Editorial & Research Pillar Guides */}
          <div>
            <h3 className="font-display font-bold text-sm text-slate-900 mb-3 tracking-wide flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-violet-600" />
              <span>Compliance Guides</span>
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li>
                <Link href="/blog" className="hover:text-violet-600 transition-colors font-semibold text-violet-700">
                  All Guides &amp; Articles
                </Link>
              </li>
              <li>
                <Link href="/blog/compress-pdf-200kb-uscis-passport-guide" className="hover:text-violet-600 transition-colors line-clamp-1">
                  USCIS 200KB PDF Guide
                </Link>
              </li>
              <li>
                <Link href="/blog/freelance-invoice-payment-terms-guide" className="hover:text-violet-600 transition-colors line-clamp-1">
                  Freelance Invoice Rules
                </Link>
              </li>
              <li>
                <Link href="/blog/weighted-vs-unweighted-gpa-college-admissions" className="hover:text-violet-600 transition-colors line-clamp-1">
                  Weighted vs Unweighted GPA
                </Link>
              </li>
              <li>
                <Link href="/blog/zero-knowledge-pdf-privacy-cloud-converter-risks" className="hover:text-violet-600 transition-colors line-clamp-1">
                  Zero-Knowledge PDF Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h3 className="font-display font-bold text-sm text-slate-900 mb-3 tracking-wide">
              Security &amp; Legal
            </h3>
            <ul className="space-y-2.5 text-slate-600">
              <li>
                <Link href="/privacy-policy" className="hover:text-violet-600 transition-colors flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" /> Zero-Server Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-violet-600 transition-colors flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-sky-600" /> Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-violet-600 transition-colors flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-amber-600" /> Editorial Mission
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-violet-600 transition-colors flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-rose-600" /> Contact Security Team
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} MultiPDF Doc (multipdfdoc.com). All file operations execute 100% locally on your machine.</p>
          <p className="flex items-center gap-1.5 font-medium text-slate-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero Tracking • No Uploads • 100% Free Forever</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
