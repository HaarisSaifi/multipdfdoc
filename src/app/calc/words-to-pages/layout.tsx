import { ToolBreadcrumb } from "@/components/seo/ToolBreadcrumb";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { supplements, toolSources } from "@/content/tool-supplements";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Words to Pages & Speech Time Calculator",
  description: "Estimate page count from word count and spacing, or speech duration from speaking rate. Results are planning estimates, not guaranteed formatted page counts.",
  alternates: {
    canonical: "https://multipdfdoc.com/calc/words-to-pages",
  },
  openGraph: {
    title: "Words to Pages & Speech Time Calculator | MultiPDF Doc",
    description: "Estimate page count from word count and spacing, or speech duration from speaking rate. Results are planning estimates, not guaranteed formatted page counts.",
    url: "https://multipdfdoc.com/calc/words-to-pages",
  },
};

export default function WordsToPagesLayout({ children }: { children: React.ReactNode }) {
  return <><ToolBreadcrumb name="Words to pages calculator" href="/calc/words-to-pages" />{children}<div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10"><ValueWrapper sources={toolSources["calc/words-to-pages"]}
        toolName="Words to Pages & Speech Time Calculator"
        title="Word Density, Typography & Speech Delivery Estimates"
        subtitle="Comprehensive guidelines for converting manuscripts into standard printed pages and presentation timelines."
        sections={[
          {
            heading: "1. The Standard 250-Word Academic Rule (MLA & APA Double-Spaced)",
            content: `For a rough academic-paper estimate, begin with a consistent layout and then check the actual document. The following common settings describe a useful example, rather than a universal MLA or APA word-count rule:
• 8.5 x 11 inch US Letter or ISO 216 A4 Paper
• 1-inch (2.54 cm) margins on all four sides
• 12-point Times New Roman or 11-point Calibri font
• Double line spacing (2.0 line height)

Under these exact parameters, one standard page contains approximately 250 words. Therefore, a 10-page paper may be around 2,500 words, but headings, citations and layout change the result.`
          },
          {
            heading: "2. How Font Choice Influences Physical Page Footprint",
            content: `Different typefaces exhibit distinct 'glyph widths' and 'x-heights':
• Times New Roman (12pt): A traditional serif font optimized for compact newspaper and book printing (~250 words double spaced).
• Arial (11pt / 12pt): The calculator uses a lower assumed word density than Times New Roman. Actual line breaks depend on text, size and layout; this is a heuristic, not a measured ten-percent rule.
• Calibri (11pt): The calculator uses a slightly higher assumed word density. Check the final manuscript in the application and template you will actually submit; software defaults and institutional rules vary.`
          },
          {
            heading: "3. Speech Timing: The 130 Words-Per-Minute Benchmark",
            content: `When delivering a conference paper, thesis defense, or commercial pitch, speaking pace determines clarity:
• 110 WPM (Slow & Deliberate): Recommended for complex technical topics, keynote addresses, and foreign-language audiences.
• 130 WPM (Standard Conversational): A useful example for estimating a talk, not a prescribed classroom or conference standard. Rehearse with pauses and slides to check your own pace.
• 150 WPM (Fast Paced): Typical for competitive debates, auctioneers, or rapid-fire podcast discussions.`
          }
        , ...supplements["calc/words-to-pages"]]}
        formula={{
          title: "Page & Speech Estimation Formula",
          formula: "Pages = Words / WordsPerPage(Font, Spacing) | Speech_Minutes = Words / WPM",
          explanation: "Estimates the physical page requirement based on typographical character tracking and the required delivery timeline based on vocal cadence."
        }}
        faqs={[
          {
            question: "How many pages is 1,000 words?",
            answer: "In standard double-spaced Times New Roman 12pt with 1-inch margins, 1,000 words is often around 4 printed pages. If single-spaced, it equals approximately 2 pages."
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
      /></div></>;
}
