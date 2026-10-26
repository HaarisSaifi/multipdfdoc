import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Haaris Saifi — Systems Architect & Founder | Jamia Hamdard CSE Graduate",
  description:
    "Official profile of Haaris Saifi (Haaris), Computer Science & Engineering (CSE) graduate from Jamia Hamdard University, software engineer, systems architect, and founder of MultiPDF Doc. Creator of client-side WebAssembly systems, LegalZoo, Umazah Care, and high-performance digital platforms.",
  alternates: {
    canonical: "https://multipdfdoc.com/author/haaris-saifi",
  },
  openGraph: {
    type: "profile",
    title: "Haaris Saifi — Systems Architect & Founder | Jamia Hamdard CSE Graduate",
    description:
      "Official profile of Haaris Saifi. Jamia Hamdard University CSE engineer, founder of MultiPDF Doc, and architect of privacy-first WebAssembly suites, LegalZoo, and Umazah Care.",
    url: "https://multipdfdoc.com/author/haaris-saifi",
    siteName: "MultiPDF Doc",
    images: [
      {
        url: "https://multipdfdoc.com/images/author/haaris-saifi.jpg",
        width: 800,
        height: 800,
        alt: "Haaris Saifi — Systems Architect & Founder, Jamia Hamdard University CSE Graduate",
      },
      {
        url: "https://multipdfdoc.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "MultiPDF Doc — Haaris Saifi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Haaris Saifi — Systems Architect & Jamia Hamdard CSE Graduate",
    description:
      "Official profile of Haaris Saifi, creator of MultiPDF Doc, open-source engineer, and Jamia Hamdard CSE graduate.",
    images: ["https://multipdfdoc.com/images/author/haaris-saifi.jpg"],
  },
};

export default function AuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
