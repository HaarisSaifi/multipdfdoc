import { ToolBreadcrumb } from "@/components/seo/ToolBreadcrumb";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { supplements, toolSources } from "@/content/tool-supplements";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expense Record Generator — Local PDF Log",
  description: "Create a self-entered expense record for your bookkeeping. Add descriptions and amounts, then download a PDF; this is not a merchant-issued receipt.",
  alternates: {
    canonical: "https://multipdfdoc.com/receipt",
  },
  openGraph: {
    title: "Expense Record Generator — Local PDF Log | MultiPDF Doc",
    description: "Create a self-entered expense record for your bookkeeping. Add descriptions and amounts, then download a PDF; this is not a merchant-issued receipt.",
    url: "https://multipdfdoc.com/receipt",
  },
};

export default function ReceiptLayout({ children }: { children: React.ReactNode }) {
  return <><ToolBreadcrumb name="Expense record" href="/receipt" />{children}<div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10"><ValueWrapper sources={toolSources["receipt"]} sections={supplements["receipt"]}
        title="IRS Publication 463 & Business Expense Recordkeeping Guide"
        description="Comprehensive technical and procedural guide for self-employed professionals, independent contractors, and small business owners on contemporaneous expense tracking, deductible business expenses, and documentary proof standards."
        authorName="MultiPDF Doc"
        lastUpdated="October 7, 2026"
        readingTime="9 min read"
        tableOfContents={[
          { id: "irs-requirements", title: "1. IRS Publication 463 Statutory Recordkeeping Rules" },
          { id: "contemporaneous-records", title: "2. The Legal Meaning of Contemporaneous Records" },
          { id: "the-75-dollar-rule", title: "3. The IRS $75 Documentary Evidence Threshold" },
          { id: "travel-and-meals", title: "4. Business Travel, Meals & Transportation Deductions" },
          { id: "step-by-step-guide", title: "5. How to Compile an Audit-Compliant Expense Log" },
          { id: "faq", title: "6. Frequently Asked Questions (FAQ)" },
        ]}
        faqItems={[
          {
            question: "Can I use an expense voucher as proof of purchase for tax deductions?",
            answer: "Under IRS Publication 463, a contemporaneous expense log or account book serves as legal proof of elements such as date, location, amount, and business purpose. For expenses of $75 or more (and all lodging expenses regardless of amount), the IRS also requires documentary evidence (such as a canceled check, credit card statement, or formal receipt).",
          },
          {
            question: "Are my expense records processed or stored on MultiPDF Doc servers?",
            answer: "No. MultiPDF Doc generates all PDF byte sequences 100% locally inside your browser using client-side JavaScript. No expense data, payee names, or financial numbers are ever uploaded or transmitted across the internet.",
          },
          {
            question: "What information must be recorded to substantiate a business travel deduction?",
            answer: "The IRS requires four core elements for travel deductions: (1) Amount of each separate expense, (2) Dates of departure and return, (3) Destination city or town, and (4) Business reason for the travel or business benefit derived.",
          },
        ]}
      >
        <div className="space-y-8 text-slate-700 leading-relaxed text-sm">
          <section id="irs-requirements" className="space-y-3">
            <h2 className="text-xl font-display font-bold text-slate-900">
              1. IRS Publication 463 Statutory Recordkeeping Rules
            </h2>
            <p>
              United States tax law under Section 274(d) of the Internal Revenue Code strictly disallows deductions for business travel, gifts, and entertainment unless the taxpayer substantiates the expense with adequate contemporaneous records. IRS Publication 463 establishes the evidentiary standards that self-employed individuals, independent contractors (1099 recipients), and corporate employees must maintain.
            </p>
          </section>

          <section id="contemporaneous-records" className="space-y-3">
            <h2 className="text-xl font-display font-bold text-slate-900">
              2. The Legal Meaning of Contemporaneous Records
            </h2>
            <p>
              A contemporaneous record is one recorded at or near the time of the expenditure. The IRS gives significantly higher probative weight to logs, diaries, and vouchers recorded while the taxpayer has full, immediate knowledge of each element of the expenditure. Reconstructing expense logs months later during an audit is frequently rejected by the tax court.
            </p>
          </section>

          <section id="the-75-dollar-rule" className="space-y-3">
            <h2 className="text-xl font-display font-bold text-slate-900">
              3. The IRS $75 Documentary Evidence Threshold
            </h2>
            <p>
              Under Treasury Regulation § 1.274-5(c)(2)(iii), documentary evidence (such as an itemized invoice, bill, or receipt) is required for any business expense of <strong>$75 or more</strong>, with two strict exceptions: (1) Lodging expenses require documentary evidence regardless of amount, and (2) Transportation charges where documentary evidence is not readily available (such as metered public transit). For items under $75, a detailed contemporaneous expense log stating date, amount, vendor, and business purpose fulfills statutory requirements.
            </p>
          </section>
        </div>
      </ValueWrapper></div></>;
}
