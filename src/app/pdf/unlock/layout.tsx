import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unlock PDF Password & Remove Restrictions (In-Browser Decryption)",
  description: "Remove passwords and printing or copying permission restrictions from secured PDFs locally in your browser memory at multipdfdoc.com.",
  alternates: {
    canonical: "https://multipdfdoc.com/pdf/unlock",
  },
  openGraph: {
    title: "Unlock PDF Password & Remove Restrictions | MultiPDF Doc",
    description: "Instant in-browser password and permission removal without server uploads.",
    url: "https://multipdfdoc.com/pdf/unlock",
  },
};

export default function UnlockPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
