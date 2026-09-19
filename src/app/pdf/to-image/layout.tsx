import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convert PDF to Images (300 DPI Ultra-Print & 150 DPI Web)",
  description: "Render and export PDF pages to high-resolution JPEG and PNG images locally using hardware-accelerated Canvas. No files sent to cloud servers.",
  alternates: {
    canonical: "https://multipdfdoc.com/pdf/to-image",
  },
  openGraph: {
    title: "Convert PDF to High-Res Images (300 DPI) | MultiPDF Doc",
    description: "Export PDF pages to crisp PNG or JPEG images with 300 DPI print quality locally in your browser.",
    url: "https://multipdfdoc.com/pdf/to-image",
  },
};

export default function ToImageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
