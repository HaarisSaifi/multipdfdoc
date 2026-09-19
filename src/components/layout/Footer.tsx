import React from "react";
import Link from "next/link";
import { ShieldCheck, FileText, UserCheck, Mail, Lock, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white font-display font-black text-sm shadow-clay-pill">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-display font-extrabold text-lg text-slate-900 tracking-tight">
                MultiPDF <span className="text-violet-600">Doc</span>
              </span>
            </div>
            <p className="text-slate-600 max-w-sm leading-relaxed text-xs">
              The privacy-first document and productivity suite engineered for businesses, freelancers, and students. Built with 100% client-side WebAssembly: all document and calculation operations execute locally inside your browser with zero server data transmissions at multipdfdoc.com.
            </p>
            <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Compliant with Google AdSense, GDPR, CCPA, and HIPAA client-side data isolation standards.</span>
            </div>
          </div>

          {/* Quick PDF & Document Tools */}
          <div>
            <h3 className="font-display font-bold text-sm text-slate-900 mb-3 tracking-wide">
              PDF & Document Tools
            </h3>
            <ul className="space-y-2.5 text-slate-600">
              <li>
                <Link href="/pdf/merge" className="hover:text-violet-600 transition-colors">
                  Merge PDF Documents
                </Link>
              </li>
              <li>
                <Link href="/pdf/split" className="hover:text-violet-600 transition-colors">
                  Split & Extract Pages
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
                  Clean Receipt Maker
                </Link>
              </li>
              <li>
                <Link href="/pdf/organize" className="hover:text-violet-600 transition-colors">
                  Rotate & Organize Pages
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h3 className="font-display font-bold text-sm text-slate-900 mb-3 tracking-wide">
              Security & Legal
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
                  <UserCheck className="w-3.5 h-3.5 text-amber-600" /> Editorial & Technical Mission
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
