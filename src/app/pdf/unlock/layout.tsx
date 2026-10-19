import { ToolBreadcrumb } from "@/components/seo/ToolBreadcrumb";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { supplements, toolSources } from "@/content/tool-supplements";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unlock PDF With Your Password — No Upload",
  description: "Remove PDF password protection when you know the correct password and have permission. Decrypt locally without sending your PDF or password to a server.",
  alternates: {
    canonical: "https://multipdfdoc.com/pdf/unlock",
  },
  openGraph: {
    title: "Unlock PDF With Your Password — No Upload | MultiPDF Doc",
    description: "Remove PDF password protection when you know the correct password and have permission. Decrypt locally without sending your PDF or password to a server.",
    url: "https://multipdfdoc.com/pdf/unlock",
  },
};

export default function UnlockPdfLayout({ children }: { children: React.ReactNode }) {
  return <><ToolBreadcrumb name="Unlock PDF" href="/pdf/unlock" />{children}<div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10"><ValueWrapper sources={toolSources["pdf/unlock"]}
        toolName="Unlock PDF Password"
        title="PDF Security Architecture: How Permissions Dictionaries & Document Decryption Work"
        subtitle="Technical overview of PDF permissions removal, owner restrictions, and client-side privacy."
        sections={[
          {
            heading: "1. Understanding Owner Passwords vs User Passwords",
            content: `Many institutional PDFs (such as financial statements, medical lab reports, and academic journals) are locked with an 'Owner Permission' password. While the document can be read freely on screen, functions like 'Print Document', 'Copy Text', and 'Extract Pages' are greyed out.

MultiPDF Doc extracts the underlying content streams and re-serializes the page tree into an open catalog dictionary, stripping away permission flags while maintaining original vector layout.`
          },
          {
            heading: "2. Why Zero-Upload Decryption Protects Legal Confidentiality",
            content: `Decrypting sensitive business agreements on cloud servers exposes unencrypted trade secrets to remote server logs. MultiPDF Doc processes everything in your browser's dedicated V8 JavaScript memory space.`
          }
        , ...supplements["pdf/unlock"]]}
        formula={{
          title: "Stream Reconstruction Complexity",
          formula: "Time = O(P) where P = Total Page Count | Memory = O(File_Size)",
          explanation: "Linear extraction and page cloning executing in random access memory without intermediate disk buffering."
        }}
        faqs={[
          {
            question: "Does this tool work if I don't know the password to open the file?",
            answer: "If a PDF has an active User Open Password, you must provide the password once so the browser can decrypt the file. If it only has printing/copying restrictions, it can be unlocked immediately."
          },
          {
            question: "Is there any risk of file corruption?",
            answer: "No. MultiPDF Doc losslessly copies original page objects, preserving all vector fonts, form fields, and embedded images."
          }
        ]}
      /></div></>;
}
