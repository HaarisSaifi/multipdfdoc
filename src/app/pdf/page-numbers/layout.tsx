import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Page Numbers to PDF (Bates Numbering & Custom Pagination)",
  description: "Stamp headers, footers, Bates numbers, and custom pagination (Page X of Y) onto PDF documents. Skip cover page with 100% in-browser privacy.",
  alternates: {
    canonical: "https://multipdfdoc.com/pdf/page-numbers",
  },
  openGraph: {
    title: "Add Page Numbers & Bates Numbering to PDF | MultiPDF Doc",
    description: "Stamp custom header/footer page numbers and Bates indexing onto PDF documents locally.",
    url: "https://multipdfdoc.com/pdf/page-numbers",
  },
};

export default function PageNumbersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
