import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Split PDF Pages & Extract Chapters (In-Browser WebAssembly)",
  description: "Extract specific page ranges (e.g., 1-3, 5) or separate PDF chapters with zero file uploads. 100% client-side privacy on multipdfdoc.com.",
  alternates: {
    canonical: "https://multipdfdoc.com/pdf/split",
  },
  openGraph: {
    title: "Split PDF Pages & Extract Chapters | MultiPDF Doc",
    description: "Extract page ranges and isolate individual chapters locally without server uploads.",
    url: "https://multipdfdoc.com/pdf/split",
  },
};

export default function SplitPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
