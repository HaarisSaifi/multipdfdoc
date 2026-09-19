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
      description: "Combine multiple PDF documents into a single organized dossier. Reorder pages visually with zero upload latency.",
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
      description: "Extract specific page spans, single chapters, or individual sheets into a standalone clean PDF document.",
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
      description: "Reduce file sizes down to strict 100KB, 200KB, or 500KB limits required for government and job portal submissions.",
      href: "/pdf/compress",
      icon: Minimize2,
      iconColor: "text-sky-600",
      iconBg: "bg-sky-50 border-sky-100",
      borderHover: "hover:border-sky-300",
      badge: "200KB PRESETS",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    },
    {
      id: "page-numbers",
      category: "pdf",
      title: "Add Page Numbers",
      description: "Stamp custom Bates numbering, header/footer page counters, and skip cover pages with vector typography.",
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
      description: "Encrypt confidential PDF documents with client-side passwords and restrict unauthorized printing and copying.",
      href: "/pdf/protect",
      icon: Lock,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 border-purple-100",
      borderHover: "hover:border-purple-300",
      badge: "AES LOCK",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      id: "unlock",
      category: "pdf",
      title: "Unlock PDF Password",
      description: "Remove passwords and printing/copying restrictions from secured PDF documents locally in your browser memory.",
      href: "/pdf/unlock",
      icon: Unlock,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50 border-amber-100",
      borderHover: "hover:border-amber-300",
      badge: "UNRESTRICT",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      id: "to-image",
      category: "pdf",
      title: "PDF to High-Res Images",
      description: "Render and extract document pages as razor-sharp 300 DPI PNG or compact JPEG files on your device's GPU.",
      href: "/pdf/to-image",
      icon: ImageIcon,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50 border-amber-100",
      borderHover: "hover:border-amber-300",
      badge: "300 DPI PRINT",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      id: "from-image",
      category: "pdf",
      title: "Images to Single PDF",
      description: "Batch compile photos, scans, and receipts (JPG, PNG, WEBP) into an audit-ready, uniform PDF document.",
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
      description: "Extract printed text and handwritten notes from documents with in-browser WebAssembly and neural AI deep scanning.",
      href: "/pdf/to-text",
      icon: Sparkles,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50 border-amber-100",
      borderHover: "hover:border-amber-300",
      badge: "AI & WASM OCR",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      id: "organize",
      category: "pdf",
      title: "Rotate & Organize Pages",
      description: "Fix sideways ADF scanner pages with 90° rotations, delete blank pages, and rearrange page sequences visually.",
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
      title: "Clean Receipt Maker",
      description: "Itemized expense reimbursement receipts for Uber, hotels, dining, and office supplies. Conforms to IRS rules.",
      href: "/receipt",
      icon: Receipt,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-100",
      borderHover: "hover:border-emerald-300",
      badge: "EXPENSE AUDIT",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },

    // Academic & Calculators
    {
      id: "final-grade",
      category: "academic",
      title: "Final Grade Target Calc",
      description: "Calculate the exact exam score needed to pass or earn an A. Features the visual Panic vs. Chill speedometer.",
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
      description: "Convert AP (+1.0) and Honors (+0.5) classes between weighted 5.0 and unweighted 4.0 scales with college cutoffs.",
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
          Zero Server Uploads • 100% In-Browser Privacy
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
          The Private Web Utility Suite for <span className="text-violet-600">Zero Data Leaks</span>
        </h1>

        <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Merge, split, compress, invoice, receipt, and calculate with zero server uploads. Powered by client-side WebAssembly at <strong className="text-slate-800">multipdfdoc.com</strong>.
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

        {/* Live Privacy Metrics Strip */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-600" />
            <span>Local Device RAM Execution</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>0 Bytes Uploaded to Internet</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>No Daily Limits • 100% Free Forever</span>
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
            Why Professionals Are Leaving Cloud PDF Converters
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Comparison between traditional cloud-hosted converters and MultiPDF Doc's client-side isolation engine.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-mono text-xs bg-slate-50/50">
                <th className="py-3.5 px-4 rounded-l-xl">Feature & Privacy Policy</th>
                <th className="py-3.5 px-4 text-emerald-700 font-bold bg-emerald-50/70">MultiPDF Doc (In-Browser)</th>
                <th className="py-3.5 px-4">iLovePDF / Smallpdf</th>
                <th className="py-3.5 px-4 rounded-r-xl">Adobe Acrobat Cloud</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              <tr>
                <td className="py-4 px-4 font-bold flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-sky-600" />
                  Where Files Are Processed
                </td>
                <td className="py-4 px-4 text-emerald-800 font-bold bg-emerald-50/30">
                  100% In Device RAM (Local)
                </td>
                <td className="py-4 px-4 text-slate-600">Remote Cloud Hosting</td>
                <td className="py-4 px-4 text-slate-600">Remote AWS/Azure Datacenters</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Server Upload Required?
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
                  Task Limits & Paywalls
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
                  Works Offline / Airplane Mode
                </td>
                <td className="py-4 px-4 text-emerald-800 font-bold bg-emerald-50/30">
                  Yes (Cached in PWA/ServiceWorker)
                </td>
                <td className="py-4 px-4 text-slate-400">No</td>
                <td className="py-4 px-4 text-slate-400">No</td>
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
            Technical Specification: In-Browser Cryptographic Isolation
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            How MultiPDF Doc protects corporate trade secrets, legal dossiers, and personal tax records from third-party server exposure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="bubble-card p-8 border border-slate-200/90 space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-violet-600" />
              How Client-Side WebAssembly Operates
            </h3>
            <p>
              Traditional web applications send user documents to remote cloud infrastructure using standard HTTP POST payloads. Once on the remote server, third-party backend processes decompile the document into disk caches.
            </p>
            <p>
              MultiPDF Doc replaces remote backend servers with WebAssembly (WASM) and typed byte arrays compiled straight into your local browser engine. When you select a document, the binary byte stream is mapped directly into local RAM using JavaScript’s ArrayBuffer and Uint8Array primitives. The PDF cross-reference tables and page content dictionaries are synthesized directly by your machine’s CPU.
            </p>
          </div>

          <div className="bubble-card p-8 border border-slate-200/90 space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Zero Data Retention & Automated Memory Purges
            </h3>
            <p>
              Because MultiPDF Doc does not utilize backend file storage databases or temporary bucket caches, it is physically impossible for user documents to be leaked, intercepted, or indexed by web scrapers.
            </p>
            <p>
              Once your merged or compressed document is downloaded and you close or refresh your browser tab, the local JavaScript garbage collector automatically reclaims the memory heap. No temporary files or residual cookies remain on your operating system.
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
              <h4 className="font-bold text-slate-900">Is MultiPDF Doc really 100% free with no limits?</h4>
              <p className="text-slate-600 leading-relaxed">
                Yes. Traditional cloud PDF services must pay thousands of dollars in cloud server bandwidth and CPU costs for every file upload. Because MultiPDF Doc utilizes your device's local CPU, our operating costs are negligible, allowing us to offer permanent, unrestricted free access without paywalls or watermarks.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-slate-900">Are my confidential legal files safe from data leaks?</h4>
              <p className="text-slate-600 leading-relaxed">
                Completely safe. You can even disconnect your Wi-Fi or turn on Airplane mode after loading MultiPDF Doc, and all tools (Merge, Split, Compress, Organize) will continue to function flawlessly because all code resides in your browser cache.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-slate-900">What file formats are supported?</h4>
              <p className="text-slate-600 leading-relaxed">
                MultiPDF Doc fully supports standard ISO 32000 PDF documents (versions 1.4 through 2.0), as well as standard raster image formats including PNG, JPEG, and WEBP.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-slate-900">Will MultiPDF Doc work on mobile devices?</h4>
              <p className="text-slate-600 leading-relaxed">
                Yes. The entire user interface is built with responsive 60 FPS mobile layouts, allowing seamless drag-and-drop file organization on iPhones, iPads, Android phones, and tablets.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
