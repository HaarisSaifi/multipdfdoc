import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Technical & Security Team — MultiPDF Doc",
  description: "Get in touch with the MultiPDF Doc security engineering board for bug bounties, technical inquiries, or institutional feedback at multipdfdoc.com.",
  alternates: {
    canonical: "https://multipdfdoc.com/contact",
  },
  openGraph: {
    title: "Contact Technical & Security Team | MultiPDF Doc",
    description: "Submit bug bounties, technical inquiries, or institutional feedback to the MultiPDF Doc review board.",
    url: "https://multipdfdoc.com/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
