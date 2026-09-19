import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Developer & Support Team — MultiPDF Doc",
  description: "Get in touch with the MultiPDF Doc development and technical support team for inquiries, feedback, or format assistance at multipdfdoc.com.",
  alternates: {
    canonical: "https://multipdfdoc.com/contact",
  },
  openGraph: {
    title: "Contact Developer & Support Team | MultiPDF Doc",
    description: "Submit technical inquiries, bug reports, or feature feedback to the MultiPDF Doc team.",
    url: "https://multipdfdoc.com/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
