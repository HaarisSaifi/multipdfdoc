import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F8FAFC",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://multipdfdoc.com"),
  title: {
    default: "MultiPDF Doc — Private PDF Tools & Document Suite",
    template: "%s | MultiPDF Doc",
  },
  description:
    "Free PDF tools, invoices, expense records and calculators. Core tools process files locally in your browser. Optional Cloud OCR requires your consent.",
  alternates: {
    canonical: "https://multipdfdoc.com",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  keywords: [
    "multipdf doc",
    "multipdfdoc",
    "merge pdf without uploading",
    "private pdf merger offline",
    "compress pdf to 200kb online",
    "split pdf pages free no watermark",
    "invoice generator free without watermark",
    "expense voucher recordkeeping log",
    "final exam grade target calculator",
    "weighted to unweighted gpa converter",
    "words to pages calculator double spaced",
    "convert pdf to 300 dpi image",
    "rotate pdf pages online free",
  ],
  authors: [{ name: "Haaris Saifi", url: "https://multipdfdoc.com/about" }],
  creator: "Haaris Saifi",
  publisher: "MultiPDF Doc",
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  ...(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && /^ca-pub-\d{16}$/.test(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID)
    ? { other: { "google-adsense-account": process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID } }
    : {}),
  openGraph: {
    title: "MultiPDF Doc — Private PDF Tools & Document Suite",
    description:
      "Merge, compress, invoice and calculate locally in your browser. Optional Cloud AI OCR uploads only after your consent.",
    url: "https://multipdfdoc.com",
    siteName: "MultiPDF Doc",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://multipdfdoc.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "MultiPDF Doc — Private PDF Tools & Document Suite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MultiPDF Doc — Private PDF Tools & Document Suite",
    description: "Core PDF tools process files locally. Optional Cloud OCR requires consent.",
    images: ["https://multipdfdoc.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/local-4.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/local-7.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <Navbar />
          <main id="main-content" tabIndex={-1} className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
