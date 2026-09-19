"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Layers,
  Scissors,
  Minimize2,
  Image as ImageIcon,
  RotateCw,
  ShieldCheck,
  Lock,
  Zap,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  HardDrive,
  Cpu,
  Globe,
  HelpCircle,
  Receipt,
  GraduationCap,
  Hash,
  Unlock,
  Clock,
  TrendingUp,
  Percent,
} from "lucide-react";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "pdf" | "business" | "academic">("all");

  const tools = [
    // PDF Tools
    {
      id: "merge",
      category: "pdf",
      title: "Merge PDF Files",
      description: "Combine multiple PDF documents into a single organized dossier. Reorder pages visually with local in-browser execution.",
      href: "/pdf/merge",
      icon: Layers,
      iconColor: "text-violet-600",
      iconBg: "bg-violet-50 border-violet-100",
      borderHover: "hover:border-violet-300",
      badge: "MOST POPULAR",
      badgeColor: "bg-violet-50 text-violet-700 border-violet-200",
    },
    {
      id: "split",
      category: "pdf",
      title: "Split & Extract Pages",
      description: "Extract specific page spans, single chapters, or individual sheets into a standalone clean PDF document locally.",
      href: "/pdf/split",
      icon: Scissors,
      iconColor: "text-rose-600",
      iconBg: "bg-rose-50 border-rose-100",
      borderHover: "hover:border-rose-300",
      badge: "HIGH SPEED",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    },
    {
      id: "compress",
      category: "pdf",
      title: "Compress to Exact Size",
      description: "Reduce file sizes to meet 100KB, 200KB, or 500KB limits via QPDF WebAssembly structural deflating and adaptive raster recompression.",
      href: "/pdf/compress",
      icon: Minimize2,
      iconColor: "text-sky-600",
      iconBg: "bg-sky-50 border-sky-100",
      borderHover: "hover:border-sky-300",
      badge: "QPDF WASM",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    },
    {
      id: "page-numbers",
      category: "pdf",
      title: "Add Page Numbers",
      description: "Stamp custom Bates numbering, header/footer page counters, and skip cover pages with client-side vector typography.",
      href: "/pdf/page-numbers",
      icon: Hash,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50 border-indigo-100",
      borderHover: "hover:border-indigo-300",
      badge: "BATES STAMP",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    {
      id: "protect",
      category: "pdf",
      title: "Protect with Password",
      description: "Encrypt confidential PDF documents with verified 256-bit AES cryptography and granular permissions via qpdf WebAssembly.",
      href: "/pdf/protect",
      icon: Lock,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 border-purple-100",
      borderHover: "hover:border-purple-300",
      badge: "AES-256 WASM",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      id: "unlock",
      category: "pdf",
      title: "Unlock PDF Password",
      description: "Decrypt password-protected PDFs you are authorized to access using verified qpdf WebAssembly decryption.",
      href: "/pdf/unlock",
      icon: Unlock,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50 border-amber-100",
      borderHover: "hover:border-amber-300",
      badge: "QPDF UNLOCK",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      id: "to-image",
      category: "pdf",
      title: "PDF to High-Res Images",
      description: "Render document pages into true 150 or 300 DPI PNG/JPEG images via Mozilla PDF.js vector canvas with ZIP bundling.",
      href: "/pdf/to-image",
      icon: ImageIcon,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50 border-amber-100",
      borderHover: "hover:border-amber-300",
      badge: "PDF.JS 300 DPI",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      id: "from-image",
      category: "pdf",
      title: "Images to Single PDF",
      description: "Batch compile photos, scans, and documents (JPG, PNG, WEBP) into a clean, uniform PDF file directly in your browser.",
      href: "/pdf/from-image",
      icon: FileText,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-100",
      borderHover: "hover:border-emerald-300",
      badge: "BATCH COMPILER",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "to-text",
      category: "pdf",
      title: "PDF & Image to Text OCR",
      description: "Extract text from digital PDFs via PDF.js, run Tesseract.js WASM for scanned pages locally, or use optional Cloud AI Deep Scan.",
      href: "/pdf/to-text",
      icon: Sparkles,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50 border-amber-100",
      borderHover: "hover:border-amber-300",
      badge: "PDF.JS + TESSERACT",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      id: "organize",
      category: "pdf",
      title: "Rotate & Organize Pages",
      description: "Fix sideways pages with 90°/180° rotations, delete unnecessary sheets, and reorder document page sequences locally.",
      href: "/pdf/organize",
      icon: RotateCw,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 border-purple-100",
      borderHover: "hover:border-purple-300",
      badge: "VISUAL ROTATION",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    },

    // Business Suite
    {
      id: "invoice",
      category: "business",
      title: "Free Invoice Generator",
      description: "Create professional business invoices with multi-currency (USD, EUR, GBP, INR), tax calculations, and zero watermarks.",
      href: "/invoice",
      icon: FileText,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50 border-indigo-100",
      borderHover: "hover:border-indigo-300",
      badge: "HIGH VALUE",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    {
      id: "receipt",
      category: "business",
      title: "Expense Record Generator",
      description: "Generate itemized expense vouchers and tax bookkeeping records under IRS Pub. 463 guidelines. User-entered log for accounting.",
      href: "/receipt",
      icon: Receipt,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-100",
      borderHover: "hover:border-emerald-300",
      badge: "IRS PUB 463 LOG",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },

    // Academic & Calculators
    {
      id: "final-grade",
      category: "academic",
      title: "Final Grade Target Calc",
      description: "Calculate the exact exam score needed to pass or earn your target grade. Features the visual Panic vs. Chill gauge.",
      href: "/calc/final-grade",
      icon: GraduationCap,
      iconColor: "text-violet-600",
      iconBg: "bg-violet-50 border-violet-100",
      borderHover: "hover:border-violet-300",
      badge: "STUDENT HIT",
      badgeColor: "bg-violet-50 text-violet-700 border-violet-200",
    },
    {
      id: "gpa",
      category: "academic",
      title: "4.0 GPA Converter",
      description: "Convert AP (+1.0) and Honors (+0.5) classes between weighted 5.0 and unweighted 4.0 scales with US admissions guidance.",
      href: "/calc/gpa",
      icon: TrendingUp,
      iconColor: "text-sky-600",
      iconBg: "bg-sky-50 border-sky-100",
      borderHover: "hover:border-sky-300",
      badge: "COLLEGE ADMIT",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    },
    {
      id: "words-to-pages",
      category: "academic",
      title: "Words to Pages & Speech",
      description: "Convert word counts to exact double-spaced printed pages (Times New Roman 12pt) and estimate presentation speech minutes.",
      href: "/calc/words-to-pages",
      icon: Clock,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-100",
      borderHover: "hover:border-emerald-300",
      badge: "MLA / APA",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  ];

  const filteredTools = selectedCategory === "all"
    ? tools
    : tools.filter((t) => t.category === selectedCategory);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-8 pb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Client-Side In-Browser Execution • Privacy-Architected
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
          The Private Web Utility Suite for <span className="text-violet-600">Zero Data Leaks</span>
        </h1>

        <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Merge, split, compress, invoice, record expenses, and calculate directly on your device. Core tools execute locally in JavaScript &amp; WebAssembly at <strong className="text-slate-800">multipdfdoc.com</strong>.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/pdf/merge"
            className="px-8 py-4 rounded-full text-sm sm:text-base font-extrabold btn-bubble btn-bubble-violet shadow-clay-pill flex items-center gap-2.5"
          >
            <Sparkles className="w-4 h-4" />
            Launch PDF Merger
          </Link>
          <Link
            href="/invoice"
            className="px-8 py-4 rounded-full text-sm sm:text-base font-bold btn-bubble btn-bubble-secondary flex items-center gap-2 shadow-clay-pill-secondary"
          >
            Free Invoice Maker
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

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
            <span>No Paywalls • Free Forever</span>
          </div>
        </div>
      </section>

      {/* AdSense Top Banner Slot */}
      <AdPlaceholder slot="homepage-top" format="horizontal" />

      {/* Tools Bento Grid Section */}
      <section id="tools" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-violet-600 uppercase tracking-wider">
              Core Utility Suite
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 mt-1">
              Select an In-Browser Tool
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold overflow-x-auto">
            {[
              { id: "all", label: `All Tools (${tools.length})` },
              { id: "pdf", label: "PDF Tools (9)" },
              { id: "business", label: "Business (2)" },
              { id: "academic", label: "Academic (3)" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-white text-violet-700 shadow-sm border border-slate-200 font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className={`bubble-card p-8 flex flex-col justify-between group transition-all border border-slate-200/90 ${tool.borderHover}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-13 h-13 rounded-2xl border flex items-center justify-center ${tool.iconColor} ${tool.iconBg} shadow-sm group-hover:scale-105 transition-transform p-3`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-mono font-bold border ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-bold text-slate-900 group-hover:text-violet-700 transition-colors mb-2">
                    {tool.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-violet-600 font-mono group-hover:translate-x-1 transition-transform">
                  <span>Open Tool</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Comparison Matrix: MultiPDF Doc vs Cloud Converters */}
      <section className="bubble-card p-8 sm:p-12 border border-slate-200/90 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider">
            Architecture Audit
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            Why Professionals Choose Local In-Browser Processing
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Comparison between traditional cloud-hosted upload services and MultiPDF Doc&apos;s client-side isolation architecture.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-mono text-xs bg-slate-50/50">
                <th className="py-3.5 px-4 rounded-l-xl">Feature &amp; Privacy Architecture</th>
                <th className="py-3.5 px-4 text-emerald-700 font-bold bg-emerald-50/70">MultiPDF Doc (Local Engine)</th>
                <th className="py-3.5 px-4">iLovePDF / Smallpdf</th>
                <th className="py-3.5 px-4 rounded-r-xl">Adobe Acrobat Cloud</th>
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
                <td className="py-4 px-4 text-rose-600 font-semibold">Yes (Stored in Document Cloud)</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600" />
                  Task Limits &amp; Paywalls
                </td>
                <td className="py-4 px-4 text-emerald-800 font-bold bg-emerald-50/30">
                  None (Unlimited Free Forever)
                </td>
                <td className="py-4 px-4 text-slate-600">2 Tasks/Day Free</td>
                <td className="py-4 px-4 text-slate-600">$19.99 / Month Subscription</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-600" />
                  Data Retention Risk
                </td>
                <td className="py-4 px-4 text-emerald-800 font-bold bg-emerald-50/30">
                  0% (Purged on Tab Close)
                </td>
                <td className="py-4 px-4 text-slate-600">Stored 1–2 Hours on Disk</td>
                <td className="py-4 px-4 text-slate-600">Permanent Account Storage</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold flex items-center gap-2">
                  <Globe className="w-4 h-4 text-violet-600" />
                  Cloud AI Mode Disclosure
                </td>
                <td className="py-4 px-4 text-emerald-800 font-bold bg-emerald-50/30">
                  Explicitly Prompted &amp; Disclosed
                </td>
                <td className="py-4 px-4 text-slate-400">Not Disclosed</td>
                <td className="py-4 px-4 text-slate-400">Not Disclosed</td>
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
              Zero Data Retention &amp; Automatic Memory Reclamation
            </h3>
            <p>
              Because MultiPDF Doc does not utilize backend file storage or intermediate server caches for core tools, it is impossible for your documents to be retained, leaked, or indexed by third-party bots.
            </p>
            <p>
              Once your processed document is downloaded and you close or refresh your browser tab, your browser&apos;s garbage collector automatically reclaims the allocated memory heap. No files remain on any remote disk.
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
            <div className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-slate-900">Is MultiPDF Doc really free with no file limits?</h4>
              <p className="text-slate-600 leading-relaxed">
                Yes. Because core tools run locally on your device&apos;s CPU and GPU rather than on costly cloud servers, our infrastructure costs are minimal. This allows us to provide unrestricted, free access without paywalls or watermarks.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-slate-900">Are my confidential legal documents private?</h4>
              <p className="text-slate-600 leading-relaxed">
                Yes. For all standard PDF utilities (Merge, Split, Compress, Protect, Unlock, Organize, PDF to Image, Expense Log, and Calculators), files never leave your computer or phone. In the OCR tool, AI Deep Scan mode is clearly flagged before transmission.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-slate-900">What standards and formats are supported?</h4>
              <p className="text-slate-600 leading-relaxed">
                MultiPDF Doc fully supports standard ISO 32000 PDF documents (PDF 1.4 through 2.0), AES-256 encrypted documents via qpdf, as well as PNG, JPEG, and WEBP image formats.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-slate-900">Will MultiPDF Doc work on mobile devices?</h4>
              <p className="text-slate-600 leading-relaxed">
                Yes. The entire user interface is built with responsive mobile layouts, allowing seamless drag-and-drop file operations on iPhones, iPads, Android phones, and tablets.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
