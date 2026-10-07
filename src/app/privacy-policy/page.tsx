import React from "react";
import { ShieldCheck, Lock, Eye, CheckCircle2, Server, Cpu } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — MultiPDF Doc",
  description:
    "Transparent privacy policy detailing local in-browser document processing, optional cloud AI OCR disclosures, and Google AdSense cookie guidelines on multipdfdoc.com.",
  alternates: {
    canonical: "https://multipdfdoc.com/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bubble-card p-8 sm:p-12 border border-slate-200/90 space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Privacy-By-Design • Client-Side Document Isolation</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Last updated: October 7, 2026
          </p>
        </div>

        {/* Section 1: Local Tools */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-600" />
            <span>1. Core Document Utilities: 100% Local In-Browser Processing</span>
          </h2>
          <p>
            At MultiPDF Doc (accessible at <strong className="text-slate-800">multipdfdoc.com</strong>), we architect our core tools to minimize document data transmission. For all standard document operations—including Merge, Split, Compress, Protect, Unlock, Organize, Page Numbers, PDF to Image, Images to PDF, Invoice Generation, Expense Log, and Academic Calculators:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Zero File Uploads:</strong> Document bytes are processed entirely within your device&apos;s local browser memory using JavaScript and WebAssembly (QPDF and Mozilla PDF.js).
            </li>
            <li>
              <strong>No Intermediate Storage:</strong> Files never touch an external server or cloud bucket.
            </li>
            <li>
              <strong>Local lifecycle:</strong> Download links are released when replaced or when you leave the tool. Browser memory is managed by the browser; we cannot promise secure memory erasure. Downloaded files remain on your device until you delete them.
            </li>
          </ul>
        </section>

        {/* Section 2: Cloud AI OCR */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <Server className="w-4 h-4 text-violet-600" />
            <span>2. Optional AI Deep Scan / Cloud OCR Processing</span>
          </h2>
          <p>
            Our PDF to Text tool offers two distinct processing options:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Local Extraction Mode (Default):</strong> Operates 100% inside your browser via Mozilla PDF.js (for digital text) and Tesseract.js WebAssembly (for scanned pages). No document data is sent across the network.
            </li>
            <li>
              <strong>AI Deep Scan Mode (Optional, when enabled):</strong> After consent, your selected file is sent over HTTPS to our API and Google Gemini. Our application processes it in memory and does not intentionally save document contents to a database or log them. Google’s data use and retention depend on the provider terms and account configuration. We do not promise zero retention or exclude provider review. Do not submit confidential or personal information to unpaid Gemini services. See the <a href="https://ai.google.dev/gemini-api/terms" className="text-violet-700 underline">Gemini API terms</a>. Cloud OCR is disabled by default pending deployment and provider review.
            </li>
          </ul>
        </section>

        {/* Section 3: AdSense & Cookies */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-violet-600" />
            <span>3. Advertising Cookies &amp; Third-Party Partners</span>
          </h2>
          <p>
            Advertising is disabled in the default build. If Google AdSense is enabled, Google and its advertising partners may use cookies and identifiers to serve, measure and personalize advertisements based on prior visits to this and other websites. Ads do not require access to document contents. Regional consent messages and privacy options must be configured before advertising is activated; a Google-certified CMP is required for relevant traffic in the EEA, UK and Switzerland. See <a href="https://policies.google.com/technologies/ads" className="text-violet-700 underline">Google’s advertising privacy information</a>.
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Third-party advertising partners serve ads based on non-personally identifiable visit signals. Document contents are never accessed, analyzed, or shared for advertising purposes.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-600 underline font-semibold"
              >
                Google Ads Settings
              </a>{" "}
              or through the{" "}
              <a
                href="https://www.aboutads.info"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-600 underline font-semibold"
              >
                Digital Advertising Alliance
              </a>.
            </li>
          </ul>
        </section>

        {/* Section 4: Data Subject Rights */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">Website requests, external resources and contact messages</h2>
          <p>Local document processing does not mean visiting the website creates no network activity. Hosting and security services receive ordinary request information such as IP address, browser headers, URL and time. Fonts and PDF.js assets are locally hosted. OCR engine and language downloads may involve third-party resource requests; these do not include your selected document. Hosting providers set their own operational log retention.</p>
          <p>If you submit our contact form, your name, email, subject and message are sent through our API to our email provider and support mailbox. Please omit document contents and sensitive identifiers. Messages remain in the support mailbox until the operator deletes them; ask support about access or deletion. The form reports success only when the email provider accepts the message. Delivery to an inbox is not guaranteed.</p>
          <p>API abuse protection uses a hashed network identifier in a rate-limit store with expiry of up to 24 hours. This is pseudonymous operational data, not a claim of anonymity. We do not sell document contents. Do not include file contents in URLs or support reports.</p>
        </section>
        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">
            4. User Privacy Rights (GDPR, CCPA &amp; Global Standards)
          </h2>
          <p>
            Under regulations such as GDPR (EEA/UK) and CCPA (California), users have specific rights regarding data access, disclosure, and deletion. Because our core tools do not transmit or store your files on external databases, MultiPDF Doc does not maintain personal document repositories to inspect, share, or sell.
          </p>
        </section>

        {/* Section 5: Contact */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">
            5. Questions and Inquiries
          </h2>
          <p>
            If you have questions regarding this Privacy Policy or our technical architecture, please contact our support team at{" "}
            <a
              href="mailto:support@multipdfdoc.com"
              className="text-violet-600 font-semibold underline"
            >
              support@multipdfdoc.com
            </a>.
          </p>
        </section>

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>Inquiries: support@multipdfdoc.com</span>
          <span className="font-mono text-emerald-700 font-bold">Privacy Architected</span>
        </div>
      </div>
    </div>
  );
}
