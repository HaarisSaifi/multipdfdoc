import React from "react";
import { ShieldCheck, Lock, Eye, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — MultiPDF Doc",
  description: "Comprehensive privacy policy detailing client-side WebAssembly isolation, zero server uploads, Google AdSense cookies, GDPR, and CCPA compliance on multipdfdoc.com.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bubble-card p-8 sm:p-12 border border-slate-200/90 space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>GDPR & CCPA Compliant • Zero Server Storage</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Last Updated & Security Audited: September 19, 2026
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">
            1. Core Architectural Privacy: Zero Server File Uploads
          </h2>
          <p>
            At MultiPDF Doc (accessible from multipdfdoc.com), privacy is not an afterthought—it is the foundational architecture of our platform. Unlike conventional cloud PDF converters that require users to transmit confidential files to remote servers, MultiPDF Doc executes 100% of document processing locally in your client device’s web browser via WebAssembly and typed array memory buffers.
          </p>
          <p className="font-semibold text-slate-800">
            We never upload, inspect, store, or transmit your PDF files, document text, images, or metadata to any external server or third-party database. Once you close your browser tab, all temporary memory allocations are automatically purged.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-violet-600" />
            <span>2. Google AdSense & Third-Party Advertising Cookies</span>
          </h2>
          <p>
            Google is a third-party advertising vendor on our website. Google uses cookies, known as DART cookies, to serve advertisements to site visitors based on their visit to multipdfdoc.com and other websites across the internet.
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Third-party vendors, including Google, use cookies to serve ads based on prior user visits to this website or other web properties.
            </li>
            <li>
              Google’s use of advertising cookies enables it and its certified advertising network partners to serve contextual advertisements.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting Google Ads Settings (https://www.google.com/settings/ads) or through the Network Advertising Initiative opt-out portal (https://www.aboutads.info).
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">
            3. California Consumer Privacy Act (CCPA) Rights
          </h2>
          <p>
            Under the CCPA, California consumers maintain the right to request disclosure of categories and specific pieces of personal data collected, request deletion of personal information, and opt out of the sale of personal information. Because MultiPDF Doc does not collect, sell, or retain your document files or personal identification data, no confidential document data exists to be disclosed or sold.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">
            4. General Data Protection Regulation (GDPR) Compliance
          </h2>
          <p>
            For users residing within the European Economic Area (EEA), we ensure strict compliance with all GDPR mandates. The processing of document files occurs exclusively under client-side execution, meaning no international data transfer occurs when you merge, split, or compress documents on MultiPDF Doc.
          </p>
        </section>

        <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Security & Data Protection Officer: dpo@multipdfdoc.com</span>
          <span className="font-mono text-emerald-700 font-bold">100% Client-Side Verified</span>
        </div>
      </div>
    </div>
  );
}
