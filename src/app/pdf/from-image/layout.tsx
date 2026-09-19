import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convert JPG & PNG Images to PDF (Multi-Photo Compiler)",
  description: "Compile photos, scans, and receipts into a formatted PDF document. Adjust orientation, margins, and sequence 100% locally in browser.",
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
  return <>{children}</>;
}
