import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress PDF to 200KB / 100KB (USCIS & Passport Size Presets)",
  description: "Reduce PDF file sizes to exact 100KB, 200KB, or 500KB limits required for government visa portals and job applications without server uploads.",
  alternates: {
    canonical: "https://multipdfdoc.com/pdf/compress",
  },
  openGraph: {
    title: "Compress PDF to 200KB / 100KB (Exact Target Presets) | MultiPDF Doc",
    description: "Targeted 100KB, 200KB USCIS, and 500KB compression presets. ISO-32000 compliant client-side processing.",
    url: "https://multipdfdoc.com/pdf/compress",
  },
};

export default function CompressPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
