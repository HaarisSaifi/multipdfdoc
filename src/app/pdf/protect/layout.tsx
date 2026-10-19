import { ToolBreadcrumb } from "@/components/seo/ToolBreadcrumb";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { supplements, toolSources } from "@/content/tool-supplements";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Protect PDF — Local AES-256 Encryption",
  description: "Encrypt a PDF with a password using local QPDF AES-256. Your file and entered password stay in your browser; preserve the original and remember your password.",
  alternates: {
    canonical: "https://multipdfdoc.com/pdf/protect",
  },
  openGraph: {
    title: "Password Protect PDF — Local AES-256 Encryption | MultiPDF Doc",
    description: "Encrypt a PDF with a password using local QPDF AES-256. Your file and entered password stay in your browser; preserve the original and remember your password.",
    url: "https://multipdfdoc.com/pdf/protect",
  },
};

export default function ProtectPdfLayout({ children }: { children: React.ReactNode }) {
  return <><ToolBreadcrumb name="Protect PDF" href="/pdf/protect" />{children}<div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10"><ValueWrapper sources={toolSources["pdf/protect"]}
        toolName="Protect PDF with Password"
        title="Document Cryptography & Access Governance: Protecting Sensitive PDF Records"
        subtitle="How standard 128-bit and 256-bit encryption secures confidential legal and financial files."
        sections={[{"heading":"Encryption happens in the browser","content":"This tool uses QPDF WebAssembly to apply AES-256 PDF encryption locally. The selected document and password are not uploaded for this operation. After encryption, the tool checks that QPDF reports the output as encrypted. That check does not certify a password as strong or make the surrounding device secure. Use a long, unique password, keep a recoverable original in safe storage, and verify the downloaded result in a PDF reader."},
{"heading":"Opening passwords and reader permissions","content":"The opening password is needed to decrypt the document in an ordinary reader. The exporter also generates a separate random owner password for the permission settings. Printing and copying flags rely on compatible readers honoring them. They do not prevent a person who can view the content from photographing it or using another capture method. Think about the recipient and document sensitivity before sharing, and communicate the opening password through a separate appropriate channel."}, ...supplements["pdf/protect"]]}
        formula={{
          title: "Cryptographic Key Derivation Formula",
          formula: "Encryption_Key = KDF(User_Password, Document_ID, Permission_Flags)",
          explanation: "Standard key derivation mapping the user-supplied string against the unique file identification dictionary."
        }}
        faqs={[
          {
            question: "Can MultiPDF Doc recover my password if I forget it?",
            answer: "No. Because encryption runs locally without saving passwords to any database, lost passwords cannot be retrieved by our engineering team."
          },
          {
            question: "Is this tool free without daily limits?",
            answer: "The current tool is free to use. Browser memory and file complexity can limit processing; future availability is not guaranteed."
          }
        ]}
      /></div></>;
}
