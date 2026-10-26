import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  RefreshCw,
  Cpu,
  Mail,
  Scale,
  Sparkles,
  BookOpen,
} from "lucide-react";

export default function EditorialPolicyPage() {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="bubble-card p-8 sm:p-12 border border-slate-200/90 space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
        {/* Header Badge & Title */}
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-800 border border-violet-200 mb-3 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-violet-600" />
            <span>Transparency, E-E-A-T & Quality Assurance</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
            Editorial, Testing &amp; Corrections Policy
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Published September 2026 • Maintained by{" "}
            <a href="/author/haaris-saifi" className="text-violet-700 hover:underline font-semibold">
              Haaris Saifi
            </a>{" "}
            (Founder &amp; Principal Engineer)
          </p>
        </div>

        {/* Section 1: Editorial Mission */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-violet-600" />
            <span>1. Our Editorial &amp; Technical Mission</span>
          </h2>
          <p>
            MultiPDF Doc (<strong>multipdfdoc.com</strong>) was built to provide free, high-performance, and privacy-preserving document manipulation utilities. Alongside our tools, we publish comprehensive procedural guides and calculators to help students, freelancers, and business professionals solve real document filing problems.
          </p>
          <p>
            We adhere to strict standards of technical accuracy, actionable instructions, and editorial honesty. We do not publish thin, superficial, or AI-generated filler articles designed solely to manipulate search engines. Every guide is written to resolve a specific procedural challenge with verified technical specifications.
          </p>
        </section>

        {/* Section 2: Software Testing & Verification */}
        <section className="space-y-4">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-600" />
            <span>2. Software Verification &amp; Testing Methodology</span>
          </h2>
          <p>
            Core tools on MultiPDF Doc execute 100% locally in the user’s browser via WebAssembly (QPDF v12, Mozilla PDF.js v4.10, and Tesseract.js) and HTML5 Canvas APIs. Before code changes are deployed to production, they undergo systematic testing:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Cryptographic Invariants
              </div>
              <p className="text-slate-600 text-xs">
                Encryption algorithms are validated via programmatic round-trip checks: locking a document with 256-bit AES via QPDF WebAssembly and verifying password-authenticated decryption.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                Browser Sandboxing
              </div>
              <p className="text-slate-600 text-xs">
                Browser workflow tests check that generated fixture documents are processed locally without document-upload POST requests. Engine assets can still load over the network. These tests do not certify every browser, document or future change.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Primary Sources & Fact-Checking */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-sky-600" />
            <span>3. Primary Source Fact-Checking &amp; Citations</span>
          </h2>
          <p>
            All factual claims, regulatory limits, and technical requirements in our guides are anchored in primary authority documentation:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Government &amp; Immigration Rules:</strong> Document upload limits and formatting requirements are verified against official portals such as the USCIS Electronic Immigration System (ELIS) and Department of State CEAC documentation.
            </li>
            <li>
              <strong>Tax &amp; Financial Standards:</strong> Invoicing terms and expense recordkeeping guidance reflect published guidelines from IRS Publication 463 (Travel, Gift, and Car Expenses) and IRS Form 1099-NEC instructions.
            </li>
            <li>
              <strong>Document File Standards:</strong> PDF structure specifications comply with the published ISO 32000-1 document management standard.
            </li>
          </ul>
        </section>

        {/* Section 4: AI & Machine Learning Transparency */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>4. Use of AI Assistance &amp; Human Governance</span>
          </h2>
          <p>
            AI assistance is used for research, drafting, editing and software development. We distinguish automated verification from human editorial review and independent peer review. Content revised with AI assistance is not represented as wholly human-written. The publisher is responsible for reviewing changes before release; publication dates and test results do not certify independent expert review.
          </p>
          <p>
            Our checks cover reproducible examples and documented edge cases. They cannot prove that every possible document, browser or institutional rule is supported. Report a problem with the tool name, browser version and steps to reproduce it; do not send sensitive files or identifiers.
          </p>
        </section>

        {/* Section 5: Corrections & Feedback Protocol */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-rose-600" />
            <span>5. Corrections &amp; Updates Policy</span>
          </h2>
          <p>
            We welcome constructive feedback, bug reports, and corrections from users and industry experts. If an institutional portal changes its upload limits or if a browser update affects WebAssembly execution:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>We review reported errors against primary documentation and reproducible test cases.</li>
            <li>If verified, we update the article or release a patch to the repository immediately.</li>
            <li>A revised &ldquo;Last Updated&rdquo; date is recorded on the modified page for full reader transparency.</li>
          </ol>
          <p className="pt-1">
            To submit a correction or report a bug, email:{" "}
            <a href="mailto:support@multipdfdoc.com" className="text-violet-600 font-bold underline">
              support@multipdfdoc.com
            </a>
          </p>
        </section>

        {/* Section 6: Commercial Independence & Advertising */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-600" />
            <span>6. Commercial Independence &amp; Advertising</span>
          </h2>
          <p>
            MultiPDF Doc does not accept sponsored reviews, undisclosed affiliate placements, or paid articles to bias our tool recommendations. Standard utilities are completely free to use without requiring user account creation or subscription fees.
          </p>
          <p>
            Website maintenance and static hosting costs may be offset by standard contextual advertising (e.g. Google AdSense). Advertisements are clearly separated from editorial content and tool operational controls to ensure an uncluttered, safe user experience.
          </p>
        </section>

        {/* Footer info */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>Direct Inquiries: support@multipdfdoc.com</span>
          <Link
            href="/about"
            className="text-violet-600 hover:text-violet-800 font-bold underline"
          >
            Read About MultiPDF Doc Architecture &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
