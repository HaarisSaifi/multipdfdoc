import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial, Testing & Corrections Policy — MultiPDF Doc",
  description:
    "Comprehensive guidelines on research methodology, automated WebAssembly testing standards, primary source citations, and corrections protocol for MultiPDF Doc at multipdfdoc.com.",
  alternates: {
    canonical: "https://multipdfdoc.com/editorial-policy",
  },
  openGraph: {
    title: "Editorial, Testing & Corrections Policy | MultiPDF Doc",
    description:
      "Standards for software testing, factual verification, primary source citations, and user-reported corrections.",
    url: "https://multipdfdoc.com/editorial-policy",
  },
};

export default function EditorialPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
