import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Resource Center & Compliance Guides",
  description: "Authoritative procedural guides on USCIS 200KB compression, freelance invoice payment terms, college GPA admissions, and zero-knowledge PDF security.",
  alternates: {
    canonical: "https://multipdfdoc.com/blog",
  },
  openGraph: {
    title: "Editorial Resource Center & Compliance Guides | MultiPDF Doc",
    description: "In-depth procedural guides, technical specifications, and security breakdowns for document management.",
    url: "https://multipdfdoc.com/blog",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
