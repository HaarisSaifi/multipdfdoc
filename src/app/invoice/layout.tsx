import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Invoice Generator (No Watermark, Vector PDF)",
  description: "Create professional client-side vector PDF invoices with auto tax, discounts, and multi-currency (USD, EUR, GBP, INR). 100% free with zero watermarks at multipdfdoc.com.",
  alternates: {
    canonical: "https://multipdfdoc.com/invoice",
  },
  openGraph: {
    title: "Free Invoice Generator (No Watermark, Vector PDF) | MultiPDF Doc",
    description: "Generate professional vector PDF invoices with custom tax, discounts, and multi-currency support without watermarks.",
    url: "https://multipdfdoc.com/invoice",
  },
};

export default function InvoiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
