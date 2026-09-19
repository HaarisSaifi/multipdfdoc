"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Layers,
  Scissors,
  Minimize2,
  Image as ImageIcon,
  RotateCw,
  ShieldCheck,
  Search,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Lock,
  Receipt,
  Calculator,
  Key,
  Hash,
  GraduationCap,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const mainTools = [
    { name: "Merge PDF", href: "/pdf/merge", icon: Layers, color: "text-violet-600", hoverBg: "hover:bg-violet-50 hover:text-violet-700" },
    { name: "Split & Extract", href: "/pdf/split", icon: Scissors, color: "text-rose-600", hoverBg: "hover:bg-rose-50 hover:text-rose-700" },
    { name: "Compress (200KB)", href: "/pdf/compress", icon: Minimize2, color: "text-sky-600", hoverBg: "hover:bg-sky-50 hover:text-sky-700" },
    { name: "Invoice Maker", href: "/invoice", icon: FileText, color: "text-indigo-600", hoverBg: "hover:bg-indigo-50 hover:text-indigo-700" },
    { name: "Receipt Maker", href: "/receipt", icon: Receipt, color: "text-emerald-600", hoverBg: "hover:bg-emerald-50 hover:text-emerald-700" },
    { name: "Organize", href: "/pdf/organize", icon: RotateCw, color: "text-purple-600", hoverBg: "hover:bg-purple-50 hover:text-purple-700" },
  ];

  const searchable = [
    { title: "Merge PDF Files", desc: "Combine multiple PDFs into one document locally", href: "/pdf/merge", badge: "POPULAR" },
    { title: "Split PDF Pages", desc: "Extract specific page spans or single chapters", href: "/pdf/split", badge: "FAST" },
    { title: "Compress PDF to 200KB / 100KB", desc: "Reduce file size for government and job portals", href: "/pdf/compress", badge: "TARGET" },
    { title: "Invoice Generator (No Watermark)", desc: "Create professional client-side PDF invoices instantly", href: "/invoice", badge: "FREE" },
    { title: "Expense Receipt Maker", desc: "Reimbursement receipts for Uber, hotels, and dining", href: "/receipt", badge: "INSTANT" },
    { title: "Convert PDF to Images", desc: "High-resolution 300 DPI canvas image exporter", href: "/pdf/to-image", badge: "300 DPI" },
    { title: "Images to PDF Compiler", desc: "Batch photos and receipts into a single PDF", href: "/pdf/from-image", badge: "BATCH" },
    { title: "Rotate & Organize PDF", desc: "Rotate pages 90°/180° and reorder sequences", href: "/pdf/organize", badge: "VISUAL" },
    { title: "Protect PDF (Password Lock)", desc: "Client-side AES encryption for confidential documents", href: "/pdf/protect", badge: "AES" },
    { title: "Unlock PDF Password", desc: "Locally remove passwords from secured PDFs", href: "/pdf/unlock", badge: "DECRYPT" },
    { title: "Add Page Numbers to PDF", desc: "Stamp custom Bates header/footer pagination", href: "/pdf/page-numbers", badge: "PAGINATE" },
    { title: "Final Exam Grade Target Calculator", desc: "Panic vs Chill simulator for required final exam score", href: "/calc/final-grade", badge: "STUDENT" },
    { title: "Weighted to Unweighted GPA Converter", desc: "Convert AP/IB credits to 4.0 scale with college cutoffs", href: "/calc/gpa", badge: "COLLEGE" },
    { title: "Words to Pages & Speech Timer", desc: "Exact page and speech minutes calculation", href: "/calc/words-to-pages", badge: "PAGES" },
  ];

  const filtered = searchQuery.trim() === ""
    ? searchable
    : searchable.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <header className="sticky top-3.5 z-50 px-3 sm:px-6 w-full max-w-[1520px] mx-auto transition-all">
      {/* Sleek, Wide Floating Claymorphic Capsule Navbar */}
      <div className="rounded-full bg-white/95 backdrop-blur-2xl border border-white/90 shadow-clay-nav px-3.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 lg:gap-4 transition-all">
        
        {/* Brand Identity - Single Line Compact Layout */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 p-0.5 shadow-clay-pill flex items-center justify-center text-white group-hover:scale-105 transition-transform flex-shrink-0">
            <FileText className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
              MultiPDF <span className="text-violet-600">Doc</span>
            </span>
            <span className="hidden xl:inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80 shadow-sm">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              100% In-Browser
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Tools Strip - Single Line (whitespace-nowrap) */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-slate-100/80 border border-slate-200/60 overflow-x-auto">
          {mainTools.map((tool) => {
            const Icon = tool.icon;
            const active = pathname === tool.href;
            return (
              <Link
                key={tool.name}
                href={tool.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? "bg-white text-violet-700 shadow-sm border border-slate-200/90 font-bold scale-102"
                    : `text-slate-600 ${tool.hoverBg}`
                }`}
              >
                <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? "text-violet-600" : tool.color}`} />
                <span>{tool.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Search & Actions - Sleek Slim Layout */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 text-slate-600 hover:text-slate-900 transition-all shadow-sm"
          >
            <Search className="w-3.5 h-3.5 text-violet-600" />
            <span className="hidden md:inline whitespace-nowrap">Search tools...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-white border border-slate-200 text-slate-500 shadow-sm">
              ⌘K
            </kbd>
          </button>

          <Link
            href="/pdf/merge"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold btn-bubble btn-bubble-violet shadow-clay-pill whitespace-nowrap flex-shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Launch Merger</span>
            <span className="sm:hidden">Merge</span>
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 p-3.5 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl space-y-1.5 animate-in slide-in-from-top-2 duration-150">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1">
            PDF Utilities
          </div>
          {mainTools.map((tool) => {
            const Icon = tool.icon;
            const active = pathname === tool.href;
            return (
              <Link
                key={tool.name}
                href={tool.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  active
                    ? "bg-violet-50 text-violet-700 border border-violet-200 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${tool.color}`} />
                  <span>{tool.name}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            );
          })}
        </div>
      )}

      {/* Quick Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <Search className="w-5 h-5 text-violet-600" />
              <input
                type="text"
                autoFocus
                placeholder="Search PDF tools (e.g. merge, split, compress 200kb)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder-slate-400 font-medium"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 font-bold"
              >
                ESC
              </button>
            </div>

            <div className="mt-4 max-h-80 overflow-y-auto space-y-2">
              {filtered.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSearchOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 hover:bg-violet-50/60 border border-transparent hover:border-violet-200 group transition-all"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900 group-hover:text-violet-700 flex items-center gap-2">
                      <span>{item.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-mono font-bold">
                        {item.badge}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {item.desc}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-violet-600 font-mono">
                    Open →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
