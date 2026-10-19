import { ToolBreadcrumb } from "@/components/seo/ToolBreadcrumb";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { supplements, toolSources } from "@/content/tool-supplements";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Page Numbers to PDF — Skip Cover Pages",
  description: "Add PDF page numbers locally with a chosen start value, position and cover-page offset. Review the result before printing or sharing.",
  alternates: {
    canonical: "https://multipdfdoc.com/pdf/page-numbers",
  },
  openGraph: {
    title: "Add Page Numbers to PDF — Skip Cover Pages | MultiPDF Doc",
    description: "Add PDF page numbers locally with a chosen start value, position and cover-page offset. Review the result before printing or sharing.",
    url: "https://multipdfdoc.com/pdf/page-numbers",
  },
};

export default function PageNumbersLayout({ children }: { children: React.ReactNode }) {
  return <><ToolBreadcrumb name="PDF page numbers" href="/pdf/page-numbers" />{children}<div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10"><ValueWrapper sources={toolSources["pdf/page-numbers"]}
        toolName="Add Page Numbers to PDF"
        title="Practical PDF Pagination: Page Counters, Starting Pages & Placement"
        subtitle="How to place readable page counters and compare their format with a recipient’s instructions."
        sections={[
          {
            heading: "1. Bates Numbering & Court Dossier Requirements",
            content: `Consistent identifiers can help readers refer to a document, but legal production requirements vary by matter and recipient. This tool supplies simple numeric counters; it does not implement every Bates-numbering convention, prefix, fixed-width identifier or discovery-production record. Ask the responsible professional for the required format before relying on a counter for a legal filing.

The local pagination tool adds visual numbers without uploading the selected PDF. A number identifies a page; it does not authenticate evidence, validate signatures or certify that a filing meets a court rule. Retain the unmodified source separately.`
          },
          {
            heading: "2. Academic Dissertation Guidelines: Cover Page Skipping",
            content: `Graduate schools set their own formatting rules. A title page may be counted without showing a number, and front matter may require a different numbering style. Compare your department’s current guidance with the options provided here instead of assuming a universal dissertation standard.

Set 'Start on Page' to leave earlier pages unstamped and choose the first printed number separately. The current formats use ordinary numeric counters; they do not generate Roman-numeral front matter. Preview the transition and check existing printed numbers before submission.`
          }
        , ...supplements["pdf/page-numbers"]]}
        formula={{
          title: "Pagination Coordinate Placement Formula",
          formula: "X_pos = (PageWidth / 2) - (TextWidth / 2) | Y_pos = Margin_pts",
          explanation: "Point-based coordinate mapping conforming to the PDF ISO 32000 coordinate plane where the origin (0,0) sits at the bottom-left corner."
        }}
        faqs={[
          {
            question: "Does adding page numbers modify my original PDF text?",
            answer: "No. The tool adds a vector text overlay to the existing page content stream without modifying or shifting underlying paragraphs or images."
          },
          {
            question: "Are files uploaded to a server to add numbers?",
            answer: "No. Page numbers are added locally with the JavaScript pdf-lib library. Selected file contents are not uploaded for this operation."
          }
        ]}
      /></div></>;
}
