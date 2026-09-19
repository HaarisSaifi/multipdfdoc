import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weighted to Unweighted GPA Converter (4.0 Scale & College Cutoffs)",
  description: "Convert high school AP, IB, and Honors courses to standard unweighted 4.0 GPA scale. Compare your score with Top 50 US college admissions benchmarks.",
  alternates: {
    canonical: "https://multipdfdoc.com/calc/gpa",
  },
  openGraph: {
    title: "Weighted to Unweighted GPA Converter | MultiPDF Doc",
    description: "Convert weighted grades to standard 4.0 scale with AP/IB honors boosts and US university admissions match.",
    url: "https://multipdfdoc.com/calc/gpa",
  },
};

export default function GpaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
