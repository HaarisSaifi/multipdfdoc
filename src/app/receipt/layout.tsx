import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal Expense Voucher & Bookkeeping Log Generator | MultiPDF Doc",
  description:
    "Generate contemporaneous personal expense vouchers and business reimbursement logs under IRS Publication 463 guidelines. 100% private in-browser document generation.",
  alternates: {
    canonical: "https://multipdfdoc.com/receipt",
  },
  openGraph: {
    title: "Personal Expense Voucher & Bookkeeping Log Generator | MultiPDF Doc",
    description:
      "Itemized personal expense vouchers and contemporaneous business recordkeeping logs under IRS Pub. 463 rules.",
    url: "https://multipdfdoc.com/receipt",
  },
};

export default function ReceiptLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
