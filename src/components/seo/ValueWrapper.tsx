"use client";

import React, { useState } from "react";
import { ChevronDown, BookOpen, Calculator, HelpCircle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { JsonLd } from "./JsonLd";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SectionItem {
  heading: string;
  content: string;
}

export interface FormulaSpec {
  title: string;
  formula: string;
  explanation: string;
}

export interface ValueWrapperProps {
  title?: string;
  subtitle?: string;
  sections?: SectionItem[];
  formula?: FormulaSpec;

  toolName?: string;
  howToSteps?: string[];
  formulaTitle?: string;
  formulaCode?: string;
  formulaExplanation?: string;
  tableTitle?: string;
  tableHeaders?: string[];
  tableRows?: string[][];

  faqs: FAQItem[];
  authorName?: string;
  reviewedDate?: string;
}

export function ValueWrapper({
  title,
  subtitle = "Authoritative technical procedural guide and compliance specifications.",
  sections = [],
  formula,
  toolName,
  howToSteps = [],
  formulaTitle,
  formulaCode,
  formulaExplanation,
  tableTitle,
  tableHeaders = [],
  tableRows = [],
  faqs = [],
  authorName = "MultiPDF Doc Security & Engineering Review Board",
  reviewedDate = "September 2026",
}: ValueWrapperProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const displayTitle = title || `Technical Security & Procedural Standards: ${toolName || "Document Utility"}`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="mt-16 pt-10 border-t border-slate-200 space-y-10">
      <JsonLd data={faqSchema} />

      {/* Header & Peer Review Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
            {displayTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs w-fit font-bold flex-shrink-0 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Peer Reviewed ({reviewedDate})</span>
        </div>
      </div>

      {/* Structured Sections (In-Depth E-E-A-T Content) */}
      {sections.length > 0 && (
        <div className="space-y-6">
          {sections.map((sec, idx) => (
            <div
              key={idx}
              className="bubble-card p-6 sm:p-8 border border-slate-200/90 space-y-3"
            >
              <h3 className="text-base sm:text-lg font-display font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-violet-100 text-violet-700 text-xs font-mono font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                {sec.heading}
              </h3>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {sec.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Steps Support */}
      {howToSteps.length > 0 && (
        <div className="bubble-card p-6 sm:p-8 border border-slate-200/90 space-y-4">
          <div className="flex items-center gap-2.5 text-sky-700 font-display font-bold text-sm">
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>Step-by-Step Instructions</span>
          </div>
          <ol className="space-y-3 text-xs sm:text-sm text-slate-600">
            {howToSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs font-black flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="pt-0.5 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Algorithmic / Formula Model */}
      {(formula || formulaTitle) && (
        <div className="bubble-card p-6 sm:p-8 border border-slate-200/90 space-y-4">
          <div className="flex items-center gap-2.5 text-violet-700 font-display font-bold text-sm">
            <Calculator className="w-4 h-4 text-violet-600" />
            <span>{formula?.title || formulaTitle}</span>
          </div>
          {(formula?.formula || formulaCode) && (
            <div className="p-4 rounded-2xl bg-slate-900 text-sky-300 font-mono text-xs shadow-inner overflow-x-auto">
              <code>{formula?.formula || formulaCode}</code>
            </div>
          )}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {formula?.explanation || formulaExplanation}
          </p>
        </div>
      )}

      {/* Reference Data Table */}
      {tableHeaders.length > 0 && (
        <div className="bubble-card p-6 sm:p-8 border border-slate-200/90 overflow-hidden">
          <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 mb-4">
            {tableTitle || "Standard Reference Specifications"}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-mono">
                <tr>
                  {tableHeaders.map((header, idx) => (
                    <th key={idx} className="py-3 px-4 font-bold text-slate-800">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {tableRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-3 px-4">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interactive FAQ Accordion */}
      {faqs.length > 0 && (
        <div className="bubble-card p-6 sm:p-8 border border-slate-200/90 space-y-5">
          <div className="flex items-center gap-2.5 text-slate-900 font-display font-bold text-sm sm:text-base">
            <HelpCircle className="w-4 h-4 text-violet-600" />
            <span>Frequently Asked Questions</span>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/90 bg-slate-50/50 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-slate-900 hover:text-violet-700 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? "rotate-180 text-violet-600" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3.5 bg-white">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Institutional Editorial Audit Footer */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified & Maintained by <strong className="text-slate-900">{authorName}</strong></span>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Last Compliance Audit: {reviewedDate}
        </div>
      </div>
    </section>
  );
}
