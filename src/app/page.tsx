import { ShieldCheck, Lock, Zap, Sparkles, ArrowRight, HardDrive, Cpu, Globe, HelpCircle } from "lucide-react";
import { ToolDirectory } from "@/components/layout/ToolDirectory";
import { JsonLd } from "@/components/seo/JsonLd";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

const homeFaqs = [
  {
    "question": "Is MultiPDF Doc free, and are there file limits?",
    "answer": "The current tools have no payment requirement or added watermark. Processing capacity depends on the device, document complexity and the tool. Some tools have explicit batch limits; preserve your sources and try smaller files if processing fails."
  },
  {
    "question": "Are my documents uploaded for standard tools?",
    "answer": "Standard PDF tools process selected document contents locally in your browser. Engine assets may load over the network. Optional Cloud OCR, when enabled, requires a separate disclosure and consent before the document is sent to the provider."
  },
  {
    "question": "What files can I process?",
    "answer": "The tools work with supported PDF documents and JPEG, PNG or WebP images where indicated. QPDF handles password encryption and decryption. Support for forms, signatures, links and complex PDF features varies by operation; reopen each result and verify the features you need."
  },
  {
    "question": "Will the tools work on a phone?",
    "answer": "The interface adapts to small screens and offers native file selection. Processing depends on browser features and available memory, so large files can fail on a phone. Save your original and try a smaller batch when necessary."
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: "MultiPDF Doc", url: "https://multipdfdoc.com/" }} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: homeFaqs.map(({ question, answer }) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) }} />
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-8 pb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Core tools run locally
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
          The Private Web Utility Suite for <span className="text-violet-600">Everyday Documents</span>
        </h1>

        <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Merge, split, compress, invoice, record expenses, and calculate directly on your device. Core tools execute locally in JavaScript &amp; WebAssembly at <strong className="text-slate-800">multipdfdoc.com</strong>.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/pdf/merge"
            className="px-8 py-4 rounded-full text-sm sm:text-base font-extrabold btn-bubble btn-bubble-violet shadow-clay-pill flex items-center gap-2.5"
          >
            <Sparkles className="w-4 h-4" />
            Launch PDF Merger
          </a>
          <a
            href="/invoice"
            className="px-8 py-4 rounded-full text-sm sm:text-base font-bold btn-bubble btn-bubble-secondary flex items-center gap-2 shadow-clay-pill-secondary"
          >
            Free Invoice Maker
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <p className="text-sm text-slate-500">Optional Cloud AI OCR sends your selected file only after you approve the notice.</p>
        {/* Live Architecture Metrics Strip */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-600" />
            <span>Local Browser RAM Execution</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>0 Bytes Uploaded for Core Tools</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>Free core tools • No signup</span>
          </div>
        </div>
      </section>

      {/* AdSense Top Banner Slot */}
      <AdPlaceholder slot="homepage-top" format="horizontal" />

      <ToolDirectory />

      {/* Comparison Matrix: MultiPDF Doc vs Cloud Converters */}
      <section className="bubble-card p-8 sm:p-12 border border-slate-200/90 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
            Architecture Audit
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Why Professionals Choose Local In-Browser Processing
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Comparison between traditional cloud-hosted upload services and MultiPDF Doc&apos;s client-side isolation architecture.
          </p>
        </div>

        <div tabIndex={0} role="region" aria-label="Processing and privacy comparison" className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-mono text-xs bg-slate-50/50">
                <th className="py-3.5 px-4 rounded-l-xl">Feature &amp; Privacy Architecture</th>
                <th className="py-3.5 px-4 text-emerald-700 font-bold bg-emerald-50/70">MultiPDF Doc (Local Engine)</th>
                <th className="py-3.5 px-4">Upload-based converter</th>
                <th className="py-3.5 px-4 rounded-r-xl">Optional Cloud AI OCR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              <tr>
                <td className="py-4 px-4 font-bold flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-sky-600" />
                  Where Core Processing Occurs
                </td>
                <td className="py-4 px-4 text-emerald-800 font-bold bg-emerald-50/30">
                  100% In Browser Memory (Local)
                </td>
                <td className="py-4 px-4 text-slate-600">Remote Cloud Hosting</td>
                <td className="py-4 px-4 text-slate-600">Remote Datacenters</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Server Upload for Standard Tools?
                </td>
                <td className="py-4 px-4 text-emerald-800 font-bold bg-emerald-50/30">
                  NO (0 Bytes Uploaded)
                </td>
                <td className="py-4 px-4 text-rose-600 font-semibold">Yes (Full File Transferred)</td>
                <td className="py-4 px-4 text-rose-600 font-semibold">Yes, after explicit consent</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600" />
                  Task Limits &amp; Paywalls
                </td>
                <td className="py-4 px-4 text-emerald-800 font-bold bg-emerald-50/30">
                  Free; device memory limits apply
                </td>
                <td className="py-4 px-4 text-slate-600">Provider-specific limits</td>
                <td className="py-4 px-4 text-slate-600">5 requests/hour, 20/day</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-600" />
                  Where copies may remain
                </td>
                <td className="py-4 px-4 text-emerald-800 font-bold bg-emerald-50/30">
                  Local processing; manage downloaded copies
                </td>
                <td className="py-4 px-4 text-slate-600">Check the provider’s retention policy</td>
                <td className="py-4 px-4 text-slate-600">Depends on Google service configuration</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold flex items-center gap-2">
                  <Globe className="w-4 h-4 text-violet-600" />
                  Cloud AI Mode Disclosure
                </td>
                <td className="py-4 px-4 text-emerald-800 font-bold bg-emerald-50/30">
                  Explicitly Prompted &amp; Disclosed
                </td>
                <td className="py-4 px-4 text-slate-600">Check provider disclosures</td>
                <td className="py-4 px-4 text-slate-600">Check provider disclosures</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Deep Dive Security Whitepaper */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold text-violet-600 uppercase tracking-wider">
            Client-Side Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Technical Specification: In-Browser Memory Isolation
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            How MultiPDF Doc protects sensitive documents, tax filings, and legal contracts from third-party server exposure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="bubble-card p-8 border border-slate-200/90 space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-violet-600" />
              How Client-Side Execution Operates
            </h3>
            <p>
              Traditional web applications send user documents to remote cloud infrastructure using HTTP POST payloads. Once on the remote server, third-party backend processes write the document to temporary disk storage.
            </p>
            <p>
              MultiPDF Doc replaces remote server processing with client-side JavaScript, HTML5 Canvas, and WebAssembly (qpdf &amp; Tesseract) running directly inside your browser engine. When you select a document, the byte stream is mapped into your local device&apos;s RAM using ArrayBuffer primitives. Document parsing, encryption, and rendering happen on your local CPU and GPU.
            </p>
          </div>

          <div className="bubble-card p-8 border border-slate-200/90 space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Client-Side In-Memory Execution &amp; Automatic Memory Reclamation
            </h3>
            <p>
              Because MultiPDF Doc does not utilize backend file storage or intermediate server caches for core tools, core documents are processed locally instead of being uploaded to our servers. Your browser, extensions, shared-device settings, and downloaded copies still need appropriate protection.
            </p>
            <p>
              Closing or refreshing the tab releases application resources, but browser cleanup does not certify secure memory erasure. Downloaded files remain on your device. Optional Cloud OCR follows separate provider processing terms disclosed before consent.
            </p>
          </div>
        </div>

        {/* Interactive FAQ Accordion Style */}
        <div className="bubble-card p-8 sm:p-10 border border-slate-200/90 space-y-6">
          <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-violet-600" />
            Frequently Asked Questions (FAQ)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
            {homeFaqs.map(({ question, answer }) => (
              <div key={question} className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="font-bold text-slate-900">{question}</h4>
                <p className="text-slate-600 leading-relaxed">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
