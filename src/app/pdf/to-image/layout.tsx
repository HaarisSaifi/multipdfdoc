import { ToolBreadcrumb } from "@/components/seo/ToolBreadcrumb";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { supplements, toolSources } from "@/content/tool-supplements";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to PNG or JPG — 150 & 300 DPI Export",
  description: "Render PDF pages to PNG or JPG locally at 150 or 300 DPI. Download individual images or a ZIP without uploading your PDF.",
  alternates: {
    canonical: "https://multipdfdoc.com/pdf/to-image",
  },
  openGraph: {
    title: "PDF to PNG or JPG — 150 & 300 DPI Export | MultiPDF Doc",
    description: "Render PDF pages to PNG or JPG locally at 150 or 300 DPI. Download individual images or a ZIP without uploading your PDF.",
    url: "https://multipdfdoc.com/pdf/to-image",
  },
};

export default function ToImageLayout({ children }: { children: React.ReactNode }) {
  return <><ToolBreadcrumb name="PDF to image" href="/pdf/to-image" />{children}<div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10"><ValueWrapper
        title="High-Resolution PDF to Image Conversion Guide: 150 DPI vs 300 DPI"
        subtitle="How to render presentation slides and document pages as local images, with resolution and format checks."
        authorName="MultiPDF Doc"
        lastUpdated="October 7, 2026"
        sources={[
          {
            title: "PDF 1.7 Reference: Rendering and Device Independence",
            publisher: "Adobe & ISO 32000-1",
            url: "https://www.adobe.com/devnet/pdf/pdf_reference.html",
            accessed: "September 2026",
          },
          {
            title: "Mozilla PDF.js: HTML5 Canvas Rasterization Architecture",
            publisher: "Mozilla Foundation",
            url: "https://mozilla.github.io/pdf.js/",
            accessed: "September 2026",
          },
        ]}
        sections={[{"heading":"Choose resolution for the destination","content":"150 DPI produces fewer pixels and usually requires less processing than 300 DPI. Higher resolution can show more detail in vector content, but cannot recreate information missing from a low-resolution scan. Output size depends on page dimensions, document content and encoding; neither preset guarantees a file below one megabyte. Start at 150 DPI for screen use and try 300 DPI when the destination benefits from finer detail. Oversized canvases are rejected to limit memory pressure."},
{"heading":"Choose PNG or JPEG deliberately","content":"PNG preserves the raster pixels without JPEG compression artifacts and is often suitable for text and diagrams. JPEG usually suits photographic content with a smaller encoded result, but can introduce artifacts around fine text. Both formats are images: selectable PDF text, hyperlinks, fields and document tags are not present in an image export. The resulting pixel dimensions do not independently certify a physical print size or compliance with a court or archive specification."},
{"heading":"Review an entire batch before sharing","content":"Rendering runs locally with Mozilla PDF.js. Check orientation, clipping and small text on the resulting images. A separate output is generated for each page, and a ZIP groups those images for convenient download. This exporter supports up to fifty pages per batch and tells you to split a larger document first. It does not silently discard later pages. Keep the original PDF if you need to retain its text layer, signatures or accessible structure."}, ...supplements["pdf/to-image"]]}
        formula={{
          title: "Exact Canvas Dimension Formula",
          formula: "Canvas_Width = Math.ceil(Viewport_Points_X * (DPI / 72)) | Canvas_Height = Math.ceil(Viewport_Points_Y * (DPI / 72))",
          explanation: "Standard US Letter (612 x 792 pt) renders at 150 DPI as 1,275 x 1,650 pixels (2.1 MP), and at 300 DPI as 2,550 x 3,300 pixels (8.4 Megapixels)."
        }}
        faqs={[
          {
            question: "Are my PDF pages uploaded to any cloud server?",
            answer: "No. All rendering executes locally inside your web browser using HTML5 Canvas and Mozilla PDF.js. No document bytes are transmitted to any server."
          },
          {
            question: "Can I download all pages together in a single file?",
            answer: "Yes. When converting documents with multiple pages, a 'Download All as ZIP' button appears, allowing you to bundle all extracted images into an uncompressed archive."
          },
          {
            question: "Why does 300 DPI take longer to render than 150 DPI?",
            answer: "At 300 DPI, each page generates four times as many pixels as 150 DPI (approx. 8.4 million pixels per page vs 2.1 million), requiring additional GPU rasterization cycles."
          }
        ]}
      /></div></>;
}
