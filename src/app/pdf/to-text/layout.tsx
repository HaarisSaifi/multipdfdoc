import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dual-Engine PDF & Image to Text OCR (In-Browser & AI Neural Scan)",
  description: "Extract text from scanned PDFs and handwriting using private in-browser WebAssembly or high-accuracy neural AI OCR. 100% free at multipdfdoc.com.",
  alternates: {
    canonical: "https://multipdfdoc.com/pdf/to-text",
  },
  openGraph: {
    title: "Dual-Engine PDF & Image to Text OCR | MultiPDF Doc",
    description: "Extract printed text and cursive handwriting via in-browser Wasm or AI neural OCR scan.",
    url: "https://multipdfdoc.com/pdf/to-text",
  },
};

export default function ToTextLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
