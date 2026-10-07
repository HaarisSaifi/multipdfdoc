import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { supplements, toolSources } from "@/content/tool-supplements";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convert JPG & PNG Images to PDF (Multi-Photo Compiler)",
  description: "Compile photos, scans, and receipts into a formatted PDF document. Reorder JPEG, PNG and WebP images locally, with one image per PDF page.",
  alternates: {
    canonical: "https://multipdfdoc.com/pdf/from-image",
  },
  openGraph: {
    title: "Convert Images to PDF (Multi-Photo Compiler) | MultiPDF Doc",
    description: "Batch multiple photos and scans into a single formatted PDF document without server uploads.",
    url: "https://multipdfdoc.com/pdf/from-image",
  },
};

export default function FromImageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}<div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10"><ValueWrapper sources={toolSources["pdf/from-image"]}
        title="Best Practices for Compiling Image Scans into Professional PDFs"
        subtitle="Techniques for organizing scans, preserving readable detail and checking a local image-to-PDF export."
        sections={[
          {
            heading: "1. Converting Multi-Page Scans & Receipts into Audit-Ready Dossiers",
            content: `Modern business accounting, tax audits, and visa applications frequently require receipts, passport stamps, and paper contracts to be submitted as a single consolidated PDF document rather than dozens of loose image files.

MultiPDF Doc preserves native photo resolution by embedding JPEG and PNG bitstreams directly into standard ISO PDF image XObjects without applying lossy re-compression or blurring fine receipt line items.`
          },
          {
            heading: "2. Privacy Shield: Why Document Scans Must Not Be Uploaded to Cloud Converters",
            content: `Smartphone scans of driver's licenses, passports, W-2 forms, and voided bank checks contain sensitive Personal Identifiable Information (PII) including Social Security Numbers and account coordinates.

When you use MultiPDF Doc, your images are parsed solely inside your local browser tab. No temporary files are written to remote servers, and no automated data mining or model training is conducted on your photos.`
          }
        , ...supplements["pdf/from-image"]]}
        formula={{
          title: "Image to PDF Dimensional Ratio",
          formula: "Page width in points = Image width in pixels; Page height in points = Image height in pixels",
          explanation: "The current implementation maps one image pixel to one PDF point, preserving the aspect ratio with no automatic paper-size or DPI setting. One PDF point is 1/72 inch. This mapping does not certify 300 DPI print output; check physical page size in your receiving or printing application."
        }}
        faqs={[
          {
            question: "Can I combine both JPG and PNG images into the same PDF?",
            answer: "Yes. MultiPDF Doc seamlessly handles mixed image formats (JPEG, PNG, WEBP) in the same batch and compiles them into a uniform document."
          },
          {
            question: "Is there any limit to the number of photos I can compile?",
            answer: "There is no universally safe batch size. Large photos and browser memory can limit a conversion. Try a smaller batch if the device struggles, preserve your images and inspect the downloaded PDF."
          }
        ]}
      /></div></>;
}
