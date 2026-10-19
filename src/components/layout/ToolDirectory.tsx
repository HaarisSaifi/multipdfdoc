"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Layers, Scissors, Minimize2, Image as ImageIcon, RotateCw, Lock, Sparkles, ArrowRight, Receipt, GraduationCap, Hash, Unlock, Clock, TrendingUp } from "lucide-react";

export function ToolDirectory() {
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
      badge: "COMBINE FILES",
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
      title: "Compress to Target Size",
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
      description: "Add header/footer page counters, and skip cover pages with client-side vector typography.",
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
      description: "Copy digital PDF text or recognize printed English scans locally. Search the transcript, copy it, or download a text file.",
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
      badge: "NO WATERMARK",
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
      badge: "GRADE PLANNING",
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
      badge: "COURSE CREDITS",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    },
    {
      id: "words-to-pages",
      category: "academic",
      title: "Words to Pages & Speech",
      description: "Convert word counts to estimated double-spaced printed pages (Times New Roman 12pt) and estimate presentation speech minutes.",
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
              { id: "pdf", label: `PDF Tools (${tools.filter((tool) => tool.category === "pdf").length})` },
              { id: "business", label: "Business (2)" },
              { id: "academic", label: "Academic (3)" },
            ].map((cat) => (
              <button
                key={cat.id}
                aria-pressed={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(cat.id as typeof selectedCategory)}
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
              <Link prefetch={false}
                key={tool.id}
                href={tool.href}
                className={`bubble-card p-8 flex flex-col justify-between group transition-all border border-slate-200/90 ${tool.borderHover}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-13 h-13 rounded-2xl border flex items-center justify-center ${tool.iconColor} ${tool.iconBg} shadow-sm group-hover:scale-105 transition-transform p-3`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap font-mono font-bold border ${tool.badgeColor}`}>
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
  );
}
