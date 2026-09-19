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
      slug: "compress-pdf-200kb-uscis-passport-guide",
      title: "How to Compress PDF to Exactly 200KB for USCIS, Visa & Passport Portals",
      description:
        "A complete walkthrough for immigration applicants, foreign workers, and attorneys navigating strict 240KB government portal file limits without blurry scans.",
      category: "Immigration & Legal",
      readTime: "6 min read",
      date: "September 18, 2026",
      badge: "HIGH INTENT",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      featuredTool: "Compress PDF",
      featuredToolHref: "/pdf/compress",
    },
    {
      slug: "freelance-invoice-payment-terms-guide",
      title: "Freelance Invoice Compliance: Payment Terms, Tax Rules & Legally Binding Templates",
      description:
        "Learn how US and international freelancers structure Net 15/30 payment terms, handle IRS Form 1099 thresholds, and eliminate non-payment disputes.",
      category: "Business & Finance",
      readTime: "7 min read",
      date: "September 16, 2026",
      badge: "BUSINESS CPC",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      featuredTool: "Invoice Generator",
      featuredToolHref: "/invoice",
    },
    {
      slug: "weighted-vs-unweighted-gpa-college-admissions",
      title: "Weighted vs. Unweighted GPA: How Top 50 US Colleges Recalculate Your High School Transcript",
      description:
        "Understand the critical differences between a 4.0 unweighted GPA and a 5.0 weighted GPA, including AP/IB honor boosts and holistic admissions cutoffs.",
      category: "Academics",
      readTime: "8 min read",
      date: "September 14, 2026",
      badge: "VIRAL VOLUME",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      featuredTool: "GPA Converter",
      featuredToolHref: "/calc/gpa",
    },
    {
      slug: "zero-knowledge-pdf-privacy-cloud-converter-risks",
      title: "Zero-Knowledge In-Browser PDF Processing: Why Cloud Converters Expose Sensitive Contracts",
      description:
        "An engineering security breakdown of why uploading NDA agreements, medical records, and tax returns to cloud PDF converters violates GDPR and HIPAA standards.",
      category: "Security & Privacy",
      readTime: "6 min read",
      date: "September 12, 2026",
      badge: "SECURITY E-E-A-T",
      badgeColor: "bg-violet-50 text-violet-700 border-violet-200",
      featuredTool: "Private PDF Merger",
      featuredToolHref: "/pdf/merge",
    },
  ];

  const categories = [
    { id: "all", label: "All Articles" },
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
              MultiPDF Doc Research & Guides
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Document Engineering &{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Compliance Guides
            </span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            In-depth procedural guides, document format breakdowns, and calculation manuals prepared by the MultiPDF Doc Technology & Editorial Team.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
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
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${article.badgeColor}`}
                  >
                    {article.badge}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
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
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
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
