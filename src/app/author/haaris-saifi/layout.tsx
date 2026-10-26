import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Haaris Saifi — Founder, Systems Architect & Software Engineer",
  description:
    "Official profile of Haaris Saifi (Haaris), software engineer, systems architect, and founder of MultiPDF Doc. Discover his work in client-side WebAssembly, privacy engineering, LegalTech, and digital systems.",
  alternates: {
    canonical: "https://multipdfdoc.com/author/haaris-saifi",
  },
  openGraph: {
    type: "profile",
    title: "Haaris Saifi — Founder & Systems Architect",
    description:
      "Official profile of Haaris Saifi. Pioneer of zero-upload client-side document processing, WebAssembly performance, and cross-industry digital platform engineering.",
    url: "https://multipdfdoc.com/author/haaris-saifi",
    siteName: "MultiPDF Doc",
    images: [
      {
        url: "https://multipdfdoc.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Haaris Saifi — Systems Architect & Founder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Haaris Saifi — Founder & Systems Architect",
    description:
      "Official profile of Haaris Saifi, creator of MultiPDF Doc, open-source engineer, and digital systems architect.",
    images: ["https://multipdfdoc.com/og-image.png"],
  },
};

export default function AuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
