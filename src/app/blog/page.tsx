"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MasterShell } from "@/components/layout/MasterShell";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  GraduationCap,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default function BlogIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const articles = [
{
    "slug": "pdf-page-numbers-skip-cover",
    "title": "Add PDF Page Numbers Starting on Page 3",
    "description": "Skip the cover and contents, choose the first visible number, and verify a five-page practice file.",
    "category": "PDF Workflows",
    "readTime": "7 min read",
    "date": "October 11, 2026",
    "badge": "PDF WORKFLOW",
    "badgeColor": "bg-violet-50 text-violet-700 border-violet-200",
    "featuredTool": "Page Numbers",
    "featuredToolHref": "/pdf/page-numbers"
},
{
    "slug": "extract-text-mixed-scanned-pdf",
    "title": "Extract Text from Mixed Digital and Scanned PDFs",
    "description": "Recover image text hidden below native headings, choose full-page OCR, and review a public sample.",
    "category": "PDF Workflows",
    "readTime": "7 min read",
    "date": "October 11, 2026",
    "badge": "PDF WORKFLOW",
    "badgeColor": "bg-violet-50 text-violet-700 border-violet-200",
    "featuredTool": "PDF to Text",
    "featuredToolHref": "/pdf/to-text"
},
{
    "slug": "pdf-compression-keep-text-selectable",
    "title": "Compress PDF While Keeping Text Selectable",
    "description": "Compare lossless and raster results, inspect a real text layer, and choose a readable size target.",
    "category": "PDF Workflows",
    "readTime": "7 min read",
    "date": "October 11, 2026",
    "badge": "PDF WORKFLOW",
    "badgeColor": "bg-violet-50 text-violet-700 border-violet-200",
    "featuredTool": "Compress PDF",
    "featuredToolHref": "/pdf/compress"
},
    {
      slug: "compress-pdf-200kb-uscis-passport-guide",
      title: "Compress a PDF for Government Portals: When a 200KB Target Makes Sense",
      description:
        "Check actual portal limits, choose a realistic target, and verify readable evidence before submission.",
      category: "Immigration & Legal",
      readTime: "7 min read",
      date: "September 18, 2026",
      badge: "GOVERNMENT PORTALS",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      featuredTool: "Compress PDF",
      featuredToolHref: "/pdf/compress",
    },
    {
      slug: "freelance-invoice-payment-terms-guide",
      title: "Freelance Invoices: Clear Payment Terms, Accurate Totals and Better Records",
      description:
        "Learn how US and international freelancers structure Net 15/30 payment terms, handle IRS Form 1099 thresholds, and keep a clear billing record.",
      category: "Business & Finance",
      readTime: "7 min read",
      date: "September 16, 2026",
      badge: "TAX & INVOICING",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      featuredTool: "Invoice Generator",
      featuredToolHref: "/invoice",
    },
    {
      slug: "weighted-vs-unweighted-gpa-college-admissions",
      title: "Weighted and Unweighted GPA: Calculate from Courses, Then Check College Rules",
      description:
        "Understand the critical differences between a 4.0 unweighted GPA and a 5.0 weighted GPA, including AP/IB honor boosts and institution-specific calculation rules.",
      category: "Academics",
      readTime: "7 min read",
      date: "September 14, 2026",
      badge: "COLLEGE ADMISSIONS",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      featuredTool: "GPA Converter",
      featuredToolHref: "/calc/gpa",
    },
    {
      slug: "zero-knowledge-pdf-privacy-cloud-converter-risks",
      title: "Local PDF Processing and Cloud Uploads: How to Check the Privacy Boundary",
      description:
        "An engineering security breakdown of why uploading NDA agreements, medical records, and tax returns to cloud PDF converters introduces third-party data risks.",
      category: "Security & Privacy",
      readTime: "7 min read",
      date: "September 12, 2026",
      badge: "DATA PRIVACY",
      badgeColor: "bg-violet-50 text-violet-700 border-violet-200",
      featuredTool: "Private PDF Merger",
      featuredToolHref: "/pdf/merge",
    },
  ];

  const categories = [
    { id: "all", label: "All Articles" },
    { id: "PDF Workflows", label: "PDF Workflows" },
    { id: "Immigration & Legal", label: "Immigration & Legal" },
    { id: "Business & Finance", label: "Business & Finance" },
    { id: "Academics", label: "Academics" },
    { id: "Security & Privacy", label: "Security & Privacy" },
  ];

  const filteredArticles =
    selectedCategory === "all"
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  return (
    <MasterShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header Banner */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-100 shadow-clay-badge mb-4">
            <BookOpen className="w-4 h-4 text-violet-600" />
            <span className="text-xs font-semibold text-violet-800 tracking-wide uppercase">
              MultiPDF Doc Research &amp; Guides
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Practical PDF &amp;{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Document Guides
            </span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Clear workflows, public practice files and primary references for PDF tasks, invoice records and GPA calculations.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              aria-pressed={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                selectedCategory === cat.id
                  ? "bg-slate-900 text-white border-slate-900 shadow-clay-card"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
          {filteredArticles.map((article) => (
            <article
              key={article.slug}
              className="bubble-card bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-clay-card flex flex-col justify-between hover:border-violet-200 transition-all group"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${article.badgeColor}`}
                  >
                    {article.badge}
                  </span>
                  <span className="text-xs text-slate-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-violet-600 transition-colors leading-snug mb-2.5">
                  <Link href={`/blog/${article.slug}`}>
                    {article.title}
                  </Link>
                </h2>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-6">
                  {article.description}
                </p>
              </div>

              {/* Bottom Footer & Tool CTA */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-600" />
                  <span>{article.date}</span>
                </div>

                <Link
                  href={`/blog/${article.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-800 transition"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Ad Placeholder */}
        <div className="my-10">
          <AdPlaceholder slot="blog-index-bottom" format="rectangle" />
        </div>
      </div>
    </MasterShell>
  );
}
