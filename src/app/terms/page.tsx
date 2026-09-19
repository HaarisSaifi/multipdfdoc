import React from "react";
import { FileText, ShieldAlert, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Terms of Service — MultiPDF Doc",
  description: "Terms and conditions governing the use of MultiPDF Doc in-browser document utilities on multipdfdoc.com.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bubble-card p-8 sm:p-12 border border-slate-200/90 space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200 mb-3 shadow-sm">
            <FileText className="w-4 h-4 text-sky-600" />
            <span>Standard Public Service Terms</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Effective Date: September 19, 2026
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or utilizing the MultiPDF Doc web application (accessible via multipdfdoc.com), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you disagree with any portion of these terms, you are prohibited from using our services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">
            2. Nature of Software & Local Execution
          </h2>
          <p>
            MultiPDF Doc provides browser-based mathematical and PDF document manipulation utilities. All computational workloads execute locally within your device’s browser client. MultiPDF Doc acts solely as a client-side execution framework and does not host, curate, or monitor your document contents.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">
            3. Disclaimer of Warranties & Limitation of Liability
          </h2>
          <p>
            The tools and utilities provided on MultiPDF Doc are delivered on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied. While our algorithms undergo strict algorithmic regression testing, users are encouraged to verify converted files prior to critical institutional submissions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">
            4. Prohibited Uses
          </h2>
          <p>
            You agree not to use MultiPDF Doc for any unlawful purpose, including attempting to reverse-engineer unauthorized proprietary assets, injecting malicious payloads into web workers, or interfering with automated security controls.
          </p>
        </section>

        <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Legal Inquiries: legal@multipdfdoc.com</span>
          <span className="font-mono text-violet-700 font-bold">Version 2.0.0</span>
        </div>
      </div>
    </div>
  );
}
