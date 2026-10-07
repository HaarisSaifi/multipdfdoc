import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { supplements, toolSources } from "@/content/tool-supplements";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organize, Rotate & Delete PDF Pages (Visual 3D Editor)",
  description: "Rotate individual PDF pages 90° or 180°, reorder thumbnails, and delete unwanted pages with zero server transmission at multipdfdoc.com.",
  alternates: {
    canonical: "https://multipdfdoc.com/pdf/organize",
  },
  openGraph: {
    title: "Organize, Rotate & Delete PDF Pages | MultiPDF Doc",
    description: "Visual card reordering, page rotation, and single-click deletion in your browser memory.",
    url: "https://multipdfdoc.com/pdf/organize",
  },
};

export default function OrganizePdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}<div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10"><ValueWrapper sources={toolSources["pdf/organize"]}
        title="Restructuring PDF Sequences: Professional Orientation & Page Management"
        subtitle="Techniques for fixing upside-down scanner feeds, aligning mixed portrait/landscape spreadsheets, and pruning blank filler pages."
        sections={[
          {
            heading: "1. Correcting Orientation Glitches from Multi-Function Office Scanners",
            content: `Automatic Document Feeder (ADF) scanners frequently invert alternating pages or scan landscape accounting ledger sheets in portrait mode. When submitted to digital record vaults, these inverted pages trigger automated optical processing failures.

MultiPDF Doc allows you to rotate individual pages in 90-degree increments to ensure all charts, signature fields, and footnotes conform to standard reading orientation.`
          },
          {
            heading: "2. Pruning Blank Separator Pages without Breaking Document Catalogues",
            content: `Scanning double-sided contracts often produces blank reverse pages that artificially inflate file sizes. Deleting these superfluous pages directly in MultiPDF Doc cleans up your final submission while preserving internal font and metadata integrity.`
          }
        , ...supplements["pdf/organize"]]}
        formula={{
          title: "Page Coordinate Matrix Rotation",
          formula: "R(θ) = [cos θ, -sin θ; sin θ, cos θ] where θ ∈ {0°, 90°, 180°, 270°}",
          explanation: "MultiPDF Doc modifies the internal /Rotate attribute within the PDF page dictionary object, adjusting viewport dimensions without modifying raster pixel streams."
        }}
        faqs={[
          {
            question: "Does rotating pages alter the document's text searchability?",
            answer: "Rotation updates the page’s viewing rotation instead of deliberately rasterizing its content. Existing digital text should remain available, but rotation does not add OCR to an image-only scan. Check searching, copying and interactive features in the exported file."
          },
          {
            question: "Can I undo page deletions before downloading?",
            answer: "There is no per-action undo history. Re-select the unmodified source to start over and restore its pages. Keep that source until you have checked the exported result."
          }
        ]}
      /></div></>;
}
