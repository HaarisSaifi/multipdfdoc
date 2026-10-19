import { ToolBreadcrumb } from "@/components/seo/ToolBreadcrumb";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { supplements, toolSources } from "@/content/tool-supplements";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress PDF to 200KB, 100KB or Custom Size",
  description: "Try a 100KB, 200KB, 500KB or custom PDF size target locally. Keep the original, review readability, and get a clear message if the target cannot be met.",
  alternates: {
    canonical: "https://multipdfdoc.com/pdf/compress",
  },
  openGraph: {
    title: "Compress PDF to 200KB, 100KB or Custom Size | MultiPDF Doc",
    description: "Try a 100KB, 200KB, 500KB or custom PDF size target locally. Keep the original, review readability, and get a clear message if the target cannot be met.",
    url: "https://multipdfdoc.com/pdf/compress",
  },
};

export default function CompressPdfLayout({ children }: { children: React.ReactNode }) {
  return <><ToolBreadcrumb name="Compress PDF" href="/pdf/compress" />{children}<div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10"><ValueWrapper
        title="PDF File Size Optimization Guide: 100KB, 200KB & 500KB Thresholds"
        subtitle="Technical principles of lossless Flate stream deflating, object deduplication, and adaptive raster recompression."
        authorName="MultiPDF Doc"
        lastUpdated="October 7, 2026"
        sources={[
          {
            title: "ISO 32000-1: Document Management — Portable Document Format (PDF)",
            publisher: "International Organization for Standardization",
            url: "https://www.iso.org/standard/51502.html",
            accessed: "September 2026",
          },
          {
            title: "QPDF Architecture: Object Streams and Stream Compression",
            publisher: "QPDF Manual",
            url: "https://qpdf.readthedocs.io/",
            accessed: "September 2026",
          },
          {
            title: "USCIS Filing Guidance: File Size and Document Submission Standards",
            publisher: "U.S. Citizenship and Immigration Services",
            url: "https://www.uscis.gov/file-online",
            accessed: "September 2026",
          },
        ]}
        sections={[{"heading":"Start with structural optimization","content":"Lossless mode first tries QPDF object and stream optimization in WebAssembly. If that cannot initialize, the tool attempts a pdf-lib rebuild of an unencrypted document. Already optimized files may gain little or no reduction; there is no fixed percentage saving. The tool keeps the original bytes if the structural result is larger. Keep the source separately, especially when signatures, attachments or form behavior matter, and inspect the exported copy in the receiving workflow."},
{"heading":"Adaptive mode changes document structure","content":"Automatic and target modes may render each page into a JPEG-backed replacement PDF if structural processing cannot meet the requested limit. This is a bounded search over image quality and resolution. It may fail to reach a tiny target. The tool reports that failure instead of claiming that an oversized result succeeded. Rendering removes selectable text, editable fields and links. It cannot preserve a cryptographic signature merely by keeping a visible signature image. Check readability before submission and use lossless mode if these structures must remain."},
{"heading":"Use the actual receiving instructions","content":"A size preset is a convenience, not an agency requirement. The upload field for your specific form controls the accepted size, format and grouping. Department of State NVC scanning guidance specifies a 4MB maximum per document and asks for readable color scans. USCIS workflows can have different requirements; do not transfer a number from another form or another agency. If a document already fits and looks clear, leaving it unchanged may be preferable. Check every downloaded page and keep a margin below a stated byte limit."}, ...supplements["pdf/compress"]]}
        formula={{
          title: "Adaptive Raster Size Convergence Formula",
          formula: "Render_Scale = DPI / 72",
          explanation: "PDF points use 72 units per inch. The bounded compression trials do not guarantee a target can be reached."
        }}
        faqs={[
          {
            question: "Does compressing a PDF delete text or hyperlinks?",
            answer: "Lossless mode is intended to preserve page content, but inspect the result and retain the source. When Adaptive Raster mode is required to hit very small limits (such as 100KB on a photo-heavy document), pages are re-rendered to compact raster images to satisfy the byte ceiling."
          },
          {
            question: "Are my confidential documents uploaded to an external server?",
            answer: "No. All compression algorithms—including qpdf WASM and PDF.js canvas rendering—execute entirely on your local computer or phone. Zero document data is sent over the network."
          },
          {
            question: "What should I do if 100KB makes my 20-page document unreadable?",
            answer: "Use a larger target or fewer pages. The bounded raster search cannot certify readability or always reach a tiny limit. If no candidate fits within its allowed trials, the tool reports the limitation rather than presenting an oversized file as success. Inspect small text in any fitting result."
          }
        ]}
      /></div></>;
}
