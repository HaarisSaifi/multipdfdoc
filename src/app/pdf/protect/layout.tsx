import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Protect PDF (Client-Side AES Encryption)",
  description: "Encrypt sensitive PDF documents with standard 128/256-bit password protection. Restrict printing and copying with zero server transmission.",
  alternates: {
    canonical: "https://multipdfdoc.com/pdf/protect",
  },
  openGraph: {
    title: "Password Protect PDF (Client-Side Encryption) | MultiPDF Doc",
    description: "Lock PDF documents with passwords and owner permission restrictions with zero cloud upload.",
    url: "https://multipdfdoc.com/pdf/protect",
  },
};

export default function ProtectPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
