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
    default: "MultiPDF Doc — 100% Private In-Browser PDF & Document Suite",
    template: "%s | MultiPDF Doc",
  },
  description:
    "Merge, split, compress, invoice, log expenses, and calculate with zero server uploads. 100% client-side WebAssembly execution for absolute privacy at multipdfdoc.com.",
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
  openGraph: {
    title: "MultiPDF Doc — 100% Private In-Browser PDF & Document Suite",
    description:
      "Your files NEVER leave your computer. Merge, compress, invoice, and calculate with 100% in-browser WebAssembly.",
    url: "https://multipdfdoc.com",
    siteName: "MultiPDF Doc",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://multipdfdoc.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "MultiPDF Doc — 100% Private In-Browser Document Suite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MultiPDF Doc — 100% Private In-Browser PDF & Document Suite",
    description: "Zero server uploads. 100% client-side document processing in your browser.",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
