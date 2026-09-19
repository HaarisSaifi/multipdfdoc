"use client";

import React, { useState } from "react";
import {
  FileText,
  Clock,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Mic,
  AlignLeft,
  Type,
  Maximize2,
} from "lucide-react";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";

export default function WordsToPagesCalculatorPage() {
  const [text, setText] = useState(
    "Academic researchers, students, and legal professionals frequently face strict page constraints when submitting grant proposals, term papers, and conference proceedings. Because different font metrics and line spacing drastically alter how many words occupy a printed page, understanding exact typography conversions is essential for meeting submission deadlines without disqualification."
  );

  const [fontFamily, setFontFamily] = useState<"times" | "arial" | "calibri">("times");
  const [spacing, setSpacing] = useState<"single" | "one_half" | "double">("double");
  const [manualWordCount, setManualWordCount] = useState<number | null>(null);

  // Live text metrics
  const cleanWords = text.trim() ? text.trim().split(/\s+/).filter(Boolean) : [];
  const calculatedWords = cleanWords.length;
  const wordCount = manualWordCount !== null ? manualWordCount : calculatedWords;
  const charCountWithSpaces = text.length;
  const charCountNoSpaces = text.replace(/\s+/g, "").length;
  const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length;
  const paragraphCount = text.split(/\n\s*\n/).filter(Boolean).length;

  // Words Per Page constants (Standard Letter 8.5x11, 1-inch margins, 12pt font)
  // Times New Roman: Single = 500, 1.5 = 375, Double = 250
  // Arial: Single = 450, 1.5 = 340, Double = 225 (Arial is wider)
  // Calibri: Single = 520, 1.5 = 390, Double = 260 (Calibri is slightly more compact)
  const WORDS_PER_PAGE: Record<string, Record<string, number>> = {
    times: { single: 500, one_half: 375, double: 250 },
    arial: { single: 450, one_half: 340, double: 225 },
    calibri: { single: 520, one_half: 390, double: 260 },
  };

  const wordsPerPageConstant = WORDS_PER_PAGE[fontFamily][spacing];
  const pagesCalculated = wordCount > 0 ? (wordCount / wordsPerPageConstant) : 0;

  // Speech timing (words per minute)
  const slowSpeechMinutes = wordCount / 110;
  const avgSpeechMinutes = wordCount / 130;
  const fastSpeechMinutes = wordCount / 150;

  const formatMinutes = (totalMins: number) => {
    const mins = Math.floor(totalMins);
    const secs = Math.round((totalMins - mins) * 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-800 border border-violet-200/80 shadow-sm">
          <FileText className="w-3.5 h-3.5 text-violet-600" />
          <span>MLA & APA Standards • 100% In-Browser Analysis</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight">
          Words to Pages & Speech Time Calculator
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          Convert raw word counts into exact printed pages for Times New Roman, Arial, and Calibri fonts. Calculate accurate speaking presentation minutes at <strong className="text-slate-800">multipdfdoc.com</strong>.
        </p>
      </div>

      {/* Main Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 bubble-card p-6 sm:p-8 border border-slate-200/90 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="font-display font-bold text-base text-slate-900">Document Text & Typography</h2>
            <button
              onClick={() => {
                setText("");
                setManualWordCount(null);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Clear Text
            </button>
          </div>

          {/* Textarea */}
          <div className="space-y-1.5">
            <textarea
              rows={8}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setManualWordCount(null);
              }}
              placeholder="Paste your essay, article, speech transcript, or legal brief here..."
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 outline-none focus:border-violet-500 focus:bg-white transition-all leading-relaxed"
            />
          </div>

          {/* Typography Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-violet-600" />
                <span>Font Family (12pt Standard)</span>
              </label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none"
              >
                <option value="times">Times New Roman 12pt (MLA / APA)</option>
                <option value="arial">Arial 11pt / 12pt (Wider)</option>
                <option value="calibri">Calibri 11pt (MS Word Default)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <AlignLeft className="w-3.5 h-3.5 text-emerald-600" />
                <span>Line Spacing</span>
              </label>
              <select
                value={spacing}
                onChange={(e) => setSpacing(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none"
              >
                <option value="double">Double Spaced (~250 words/page)</option>
                <option value="one_half">1.5 Spaced (~375 words/page)</option>
                <option value="single">Single Spaced (~500 words/page)</option>
              </select>
            </div>
          </div>

          {/* Quick Word Count Presets */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-600">Quick Word Count Benchmarks:</span>
            <div className="flex flex-wrap gap-1.5">
              {[250, 500, 750, 1000, 1500, 2000, 2500, 5000].map((count) => (
                <button
                  key={count}
                  onClick={() => setManualWordCount(count)}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                    wordCount === count && manualWordCount !== null
                      ? "bg-violet-600 text-white shadow-sm"
                      : "bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/70"
                  }`}
                >
                  {count.toLocaleString()} words
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output: Scorecards (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Page Count Card */}
          <div className="bubble-card p-6 sm:p-8 border border-slate-200/90 space-y-6 text-center">
            <span className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
              Estimated Document Pages
            </span>

            <div className="py-2">
              <div className="text-5xl sm:text-6xl font-display font-extrabold text-violet-700 tracking-tight">
                {pagesCalculated.toFixed(1)}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                Standard 8.5 x 11 in US Letter pages (1-inch margins)
              </p>
            </div>

            {/* Live Text Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Words</span>
                <div className="text-lg font-display font-bold text-slate-900">{wordCount.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Characters</span>
                <div className="text-lg font-display font-bold text-slate-900">{charCountWithSpaces.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Sentences</span>
                <div className="text-lg font-display font-bold text-slate-900">{sentenceCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Paragraphs</span>
                <div className="text-lg font-display font-bold text-slate-900">{paragraphCount}</div>
              </div>
            </div>

            {/* Speech Time Widget */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <Mic className="w-4 h-4 text-emerald-600" />
                <span>Speech Delivery Presentation Time</span>
              </div>
              <div className="space-y-1 text-xs text-emerald-800">
                <div className="flex justify-between">
                  <span>Conversational (130 wpm):</span>
                  <span className="font-mono font-bold">{formatMinutes(avgSpeechMinutes)}</span>
                </div>
                <div className="flex justify-between text-[11px] opacity-85">
                  <span>Slow Lecture (110 wpm):</span>
                  <span className="font-mono">{formatMinutes(slowSpeechMinutes)}</span>
                </div>
                <div className="flex justify-between text-[11px] opacity-85">
                  <span>Fast Presentation (150 wpm):</span>
                  <span className="font-mono">{formatMinutes(fastSpeechMinutes)}</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Conforms to standard MLA & APA manuscript format</span>
            </div>
          </div>

          <AdPlaceholder slot="sidebar-ad" format="rectangle" />
        </div>
      </div>

      {/* AdSense Value Wrapper Layer */}
      <ValueWrapper
        toolName="Words to Pages & Speech Time Calculator"
        title="Official Academic Standards: Word Density, Typography & Speech Delivery Timing"
        subtitle="Comprehensive guidelines for converting manuscripts into standard printed pages and presentation timelines."
        sections={[
          {
            heading: "1. The Standard 250-Word Academic Rule (MLA & APA Double-Spaced)",
            content: `In standard academic publishing and university coursework (governed by the Modern Language Association [MLA] and American Psychological Association [APA] style manuals), a standard printed page is defined under strict typographic metrics:
• 8.5 x 11 inch US Letter or ISO 216 A4 Paper
• 1-inch (2.54 cm) margins on all four sides
• 12-point Times New Roman or 11-point Calibri font
• Double line spacing (2.0 line height)

Under these exact parameters, one standard page contains approximately 250 words. Therefore, a mandatory 10-page research paper translates directly into 2,500 words.`
          },
          {
            heading: "2. How Font Choice Influences Physical Page Footprint",
            content: `Different typefaces exhibit distinct 'glyph widths' and 'x-heights':
• Times New Roman (12pt): A traditional serif font optimized for compact newspaper and book printing (~250 words double spaced).
• Arial (11pt / 12pt): A modern sans-serif typeface with wider horizontal character tracking (~225 words double spaced; takes up 10% more physical page space than Times New Roman).
• Calibri (11pt): Microsoft Word's default corporate font with condensed proportional spacing (~260 words double spaced).`
          },
          {
            heading: "3. Speech Timing: The 130 Words-Per-Minute Benchmark",
            content: `When delivering a conference paper, thesis defense, or commercial pitch, speaking pace determines clarity:
• 110 WPM (Slow & Deliberate): Recommended for complex technical topics, keynote addresses, and foreign-language audiences.
• 130 WPM (Standard Conversational): The golden standard for US classroom presentations and TED-style lectures.
• 150 WPM (Fast Paced): Typical for competitive debates, auctioneers, or rapid-fire podcast discussions.`
          }
        ]}
        formula={{
          title: "Page & Speech Estimation Formula",
          formula: "Pages = Words / WordsPerPage(Font, Spacing) | Speech_Minutes = Words / WPM",
          explanation: "Calculates the exact physical sheet requirement based on typographical character tracking and the required delivery timeline based on vocal cadence."
        }}
        faqs={[
          {
            question: "How many pages is 1,000 words?",
            answer: "In standard double-spaced Times New Roman 12pt with 1-inch margins, 1,000 words equals exactly 4 printed pages. If single-spaced, it equals approximately 2 pages."
          },
          {
            question: "How long does it take to give a 5-minute speech?",
            answer: "At a standard comfortable speaking pace of 130 words per minute, a 5-minute speech requires approximately 650 words."
          },
          {
            question: "Is my text analyzed on external servers?",
            answer: "No. MultiPDF Doc executes all word, character, and sentence counting locally in your web browser. Your text is never stored or uploaded."
          }
        ]}
      />
    </div>
  );
}
