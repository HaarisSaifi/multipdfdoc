import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Final Exam Grade Target Calculator (Panic vs Chill Simulator)",
  description: "Calculate the exact grade you need on your final exam to pass or get an A. Supports syllabus category weighting and professor curves at multipdfdoc.com.",
  alternates: {
    canonical: "https://multipdfdoc.com/calc/final-grade",
  },
  openGraph: {
    title: "Final Exam Grade Target Calculator | MultiPDF Doc",
    description: "The Panic vs Chill Simulator. Find out the exact minimum percentage you need on your final exam.",
    url: "https://multipdfdoc.com/calc/final-grade",
  },
};

export default function FinalGradeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
