import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Expense Receipt Maker (Reimbursement Ready)",
  description: "Generate itemized expense receipts for Uber, dining, hotel stays, and office supplies with tax, tip, and barcode simulation. 100% private in-browser at multipdfdoc.com.",
  alternates: {
    canonical: "https://multipdfdoc.com/receipt",
  },
  openGraph: {
    title: "Free Expense Receipt Maker (Reimbursement Ready) | MultiPDF Doc",
    description: "Itemized receipts with tax, tip, and barcode simulation for business expense reports.",
    url: "https://multipdfdoc.com/receipt",
  },
};

export default function ReceiptLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
