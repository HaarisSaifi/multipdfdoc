import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { supplements, toolSources } from "@/content/tool-supplements";
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
  return <>{children}<div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10"><ValueWrapper sources={toolSources["invoice"]}
        toolName="Free Professional Invoice Generator"
        title="Official Procedural Standards: Business Invoicing, Tax Deductibility & Audit Governance"
        subtitle="Comprehensive legal and financial guidelines for freelancers, contractors, and SMBs generating valid tax invoices."
        sections={[{"heading":"Build a clear invoice from actual records","content":"Enter the issuer and customer identities, a unique invoice reference, issue date, due date and itemized descriptions. Check quantities and unit prices against the agreed work. Contact details and payment instructions should identify a genuine business and a usable payment method. Local requirements may call for additional tax identifiers, currency information or a prescribed electronic-invoicing system. This PDF generator formats your entries; it does not verify identities or certify legal compliance."},
{"heading":"Agree payment terms before invoicing","content":"State a clear due date and payment instructions consistent with the contract. Net 15 or Net 30 indicates a payment window, not a guarantee of faster collection. A late fee is not automatically enforceable because it appears on an invoice. Confirm applicable law and the agreement before adding one. Use the notes field to record a purchase-order reference or accepted milestone when relevant. Avoid putting unnecessary bank credentials or personal identifiers in a document that may be forwarded."},
{"heading":"Retain a verifiable billing trail","content":"Keep the contract, invoice, payment confirmation and relevant corrections together. An exported PDF is not proof that a customer received or paid the invoice. IRS record-retention guidance depends on circumstances and record type, with exceptions to the common three-year period; gross revenue alone does not establish a universal three-to-seven-year rule. Ask an adviser about requirements that apply to your business. Store downloaded copies safely: browser-local generation does not manage your backups, access permissions or retention schedule."}, ...supplements["invoice"]]}
        formula={{
          title: "Commercial Invoice Settlement Formula",
          formula: "Grand_Total = (Subtotal - (Subtotal * Discount_Rate)) * (1 + Tax_Rate)",
          explanation: "Calculates an estimated invoice total where discounts are applied to the gross subtotal prior to the assessment of statutory sales tax or Value Added Tax (VAT)."
        }}
        faqs={[
          {
            question: "Is this invoice generator really 100% free without watermarks?",
            answer: "The current tool has no payment gate. The exported document includes a small page-identification footer. The exported PDF is a clean, professional, itemized document suitable for corporate submissions."
          },
          {
            question: "Is my client and financial billing data saved on your servers?",
            answer: "Never. MultiPDF Doc operates exclusively inside your browser using client-side JavaScript. Neither your client names, billing rates, bank account details, nor totals are ever sent to an external server."
          },
          {
            question: "Can I generate invoices in international currencies?",
            answer: "Yes. MultiPDF Doc supports standard international currency symbols including US Dollar ($), Euro (€), British Pound (£), Indian Rupee (₹), and Canadian Dollar (C$)."
          },
          {
            question: "Are these invoices valid for official tax deductions and audits?",
            answer: "The tool formats the information you enter; it does not certify tax compliance. Check local required fields, tax treatment and electronic-invoicing obligations with an appropriate adviser."
          }
        ]}
      /></div></>;
}
