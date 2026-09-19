import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merge PDF Files Online (100% Private, Zero Server Upload)",
  description: "Combine multiple PDF documents into a single file locally in your browser memory. Fast drag-and-drop with visual card reordering at multipdfdoc.com.",
  alternates: {
    canonical: "https://multipdfdoc.com/pdf/merge",
  },
  openGraph: {
    title: "Merge PDF Files Online (Zero Server Upload) | MultiPDF Doc",
    description: "Combine multiple PDFs locally in your browser memory. 100% private, zero file uploads.",
    url: "https://multipdfdoc.com/pdf/merge",
  },
};

export default function MergePdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
