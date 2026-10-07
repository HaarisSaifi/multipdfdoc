import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { supplements, toolSources } from "@/content/tool-supplements";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Split PDF Pages & Extract Chapters (In-Browser)",
  description: "Extract specific page ranges (e.g., 1-3, 5) or separate PDF chapters with zero file uploads. 100% client-side privacy on multipdfdoc.com.",
  alternates: {
    canonical: "https://multipdfdoc.com/pdf/split",
  },
  openGraph: {
    title: "Split PDF Pages & Extract Chapters | MultiPDF Doc",
    description: "Extract page ranges and isolate individual chapters locally without server uploads.",
    url: "https://multipdfdoc.com/pdf/split",
  },
};

export default function SplitPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}<div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10"><ValueWrapper sources={toolSources["pdf/split"]}
        title="Authoritative Guide: How to Extract & Separate PDF Pages Securely"
        subtitle="Techniques for selecting specific chapters, checking page ranges and reviewing an extracted document."
        sections={[
          {
            heading: "1. Common Legal, Medical, and Academic Split Use-Cases",
            content: `Document partitioning is a fundamental workflow across high-compliance industries:

• Selected Court Exhibits: Legal counsels frequently need to isolate specific affidavits, signature pages, or evidentiary exhibits from 500-page court bundles without disclosing privileged internal memoranda.
• Medical Record Submissions: Patients and healthcare administrators must submit specific clinical lab reports or discharge summaries to insurance adjusters without releasing unrelated personal diagnostic history.
• Academic Thesis Chapters: Doctoral researchers often require single-chapter PDFs for peer-reviewed journal submission or conference presentation distribution.`
          },
          {
            heading: "2. Understanding Page Syntax: Ranges, Intervals, and Commas",
            content: `MultiPDF Doc parses standard mathematical and printer range notations:

• Single Pages: Entering '4' will extract solely the fourth page of the document.
• Continuous Spans: Entering '3-7' extracts pages 3, 4, 5, 6, and 7 inclusive.
• Discontinuous Sequences: Entering '1, 5, 8-12' extracts page 1, page 5, and the span from 8 to 12 into a single unified output document.
• Invalid or Reverse Ranges: '5-1', empty fragments and pages outside the document are rejected. Select valid ascending ranges instead. Duplicates are removed and selected pages are exported in original ascending order.`
          }
        , ...supplements["pdf/split"]]}
        formula={{
          title: "Page Extraction Algorithm Complexity",
          formula: "Output pages = Count of unique valid selected pages",
          explanation: "The JavaScript pdf-lib engine copies selected pages locally without rasterizing them. It still loads and parses the source; selecting ten percent of the pages does not imply ten percent of its memory usage. Complexity and shared resources affect the result."
        }}
        faqs={[
          {
            question: "Does extracting pages reduce the quality of text or images?",
            answer: "The tool copies page content instead of rasterizing it, so it does not deliberately reduce image resolution. Reopen the result and check text, images and any interactive features; a new PDF is not a certified identical replica."
          },
          {
            question: "Are bookmarks and hyperlinks preserved?",
            answer: "Do not assume complete preservation. Page copying does not rebuild a full document outline or guarantee that internal destinations and form relationships remain meaningful after pages are removed. Test important links and keep the original when document navigation matters."
          },
          {
            question: "Is there a page count limit on large files?",
            answer: "Browser memory and document complexity limit processing. A small document can contain large scans or complex objects, while a longer text-only document may be lighter. Start with manageable files and preserve your source if processing fails; no thousand-page capacity is promised."
          }
        ]}
      /></div></>;
}
