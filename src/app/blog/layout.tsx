import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF & Document Guides: OCR, Compression and Numbering",
  description: "Learn how to skip PDF cover-page numbers, extract mixed-page OCR text and preserve selectable text. Public examples, invoice guides and GPA explanations.",
  alternates: {
    canonical: "https://multipdfdoc.com/blog",
  },
  openGraph: {
    title: "PDF & Document Guides: OCR, Compression and Numbering | MultiPDF Doc",
    description: "In-depth procedural guides, technical specifications, and security breakdowns for document management.",
    url: "https://multipdfdoc.com/blog",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
