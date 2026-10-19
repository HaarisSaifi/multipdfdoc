import React from "react";
import { ShieldCheck, Lock, Eye, CheckCircle2, Server, Cpu } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — MultiPDF Doc",
  description:
    "Transparent privacy policy detailing local in-browser document processing, local English OCR downloads, and Google AdSense cookie guidelines on multipdfdoc.com.",
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
            Last updated: October 11, 2026
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

        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">2. Local Text Extraction and Scanned OCR</h2>
          <p>PDF.js reads selectable digital text. Tesseract.js recognizes printed English scans in browser workers. This static release has no Cloud OCR service, document-upload API, user account database or server-side document processor.</p>
          <p>OCR workers, WebAssembly engines and English language data are served from this website and download when required. The OCR library may cache language resources in browser storage; the application does not intentionally put selected documents or transcripts in that cache. Clearing site data removes cached resources and may require another download. Private browsing or storage restrictions can also affect caching.</p>
          <p>OCR can misread names, amounts, handwriting, columns and unfamiliar languages. Review results against the original. Cancel stops extraction without altering the original file; browser-managed memory cleanup is not secure erasure.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">Optional visit analytics</h2>
          <p>When configured, Google Analytics loads only after you choose Allow analytics in the footer. Choosing No thanks leaves it unloaded. You can reopen Analytics choices on any page. Withdrawing permission disables measurement, removes accessible first-party Google Analytics cookies and reloads the page to unload the script. Your preference is stored locally; blocked browser storage can prevent it from persisting.</p>
          <p>Our explicit visit events contain the page path and title, with query strings and fragments excluded. They do not include selected file names, document bytes, passwords, invoice fields or OCR transcripts. Google receives ordinary connection and device information when analytics loads, and may use identifiers and cookies under its policies. See <a href="https://policies.google.com/privacy" className="text-violet-700 underline">Google's privacy policy</a>. Already transmitted measurement data is not deleted simply by withdrawing consent; contact support with a privacy request.</p>
          <p>This optional analytics preference is separate from advertising consent. Advertising remains disabled in the default release; this control is not a Google-certified advertising CMP.</p>
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
              If enabled, advertising partners may process identifiers, device information and visit signals under their policies and applicable consent choices. Document contents are never accessed, analyzed, or shared for advertising purposes.
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
          <p>Local document processing does not mean visiting the website creates no network activity. Hosting and security services receive ordinary request information such as IP address, browser headers, URL and time. Fonts and PDF.js assets are locally hosted. OCR worker, engine and English language files are also served from this website; these resource requests do not include your selected document. Hosting providers set their own operational log retention.</p>
          <p>The contact page prepares an email draft on your device. It does not submit a message to a website API or confirm delivery. If you open your email application and send the message, your email provider and the receiving mailbox process the details you include. Please omit document contents, passwords and sensitive identifiers. Messages may remain in the support mailbox until the operator deletes them; ask support about access or deletion.</p>
          <p>The static application does not use a Redis rate-limit store, cloud OCR provider or document telemetry. Hosting access logs and any separately enabled advertising have their own handling and retention policies. Do not include private document contents in URLs or support reports.</p>
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
