import React from "react";
import { UserCheck, ShieldCheck, Cpu, Code2, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "About Us & Engineering Mission — MultiPDF Doc",
  description: "Learn about the MultiPDF Doc document security engineering team, our open client-side architecture, and E-E-A-T editorial standards at multipdfdoc.com.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bubble-card p-8 sm:p-12 border border-slate-200/90 space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-800 border border-violet-200 mb-3 shadow-sm">
            <UserCheck className="w-4 h-4 text-violet-600" />
            <span>Editorial Standards & Engineering Board</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
            About MultiPDF Doc
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Building the next generation of private, in-browser document manipulation utilities at multipdfdoc.com.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">
            Our Architectural Mission
          </h2>
          <p>
            For more than a decade, the online document utility market has operated under an outdated paradigm: users who need to perform basic operations—such as combining two PDFs, rotating an upside-down page, or compressing a file for an immigration portal—are forced to upload sensitive tax forms, medical records, and bank statements to remote cloud servers.
          </p>
          <p>
            MultiPDF Doc was founded with a single technical mandate: <strong className="text-slate-900">eliminate cloud server document uploads entirely</strong>. By harnessing client-side WebAssembly (WASM), modern browser TypedArray primitives, and hardware-accelerated Canvas rendering, every document operation executes exclusively in your device’s local memory heap.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">
            Our Engineering Pillars
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Zero-Upload Isolation
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Files are never transmitted across the network. Disconnect your Wi-Fi after loading, and our tools continue to process documents locally.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Cpu className="w-4 h-4 text-sky-600" />
                Local Hardware Acceleration
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Multi-threaded WebAssembly compilation ensures multi-hundred-page documents compile in seconds without queueing delays.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">
            E-E-A-T Quality Governance
          </h2>
          <p>
            Every tool on MultiPDF Doc is authored and audited by our Document Engineering Board. Our comprehensive technical guides break down file stream mathematics, ISO 32000 standards, and compliance procedures to ensure students, researchers, and legal professionals execute official filings with absolute confidence.
          </p>
        </section>

        <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Editorial Governance: editorial@multipdfdoc.com</span>
          <span className="font-mono text-emerald-700 font-bold">100% In-Browser Verified</span>
        </div>
      </div>
    </div>
  );
}
