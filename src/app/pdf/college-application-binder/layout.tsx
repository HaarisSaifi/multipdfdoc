import { ToolBreadcrumb } from "@/components/seo/ToolBreadcrumb";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { toolSources } from "@/content/tool-supplements";
import type { Metadata } from "next";

const title = "College Application PDF Binder — Combine Documents Under 2MB";
const description = "Combine a resume, essays, certificates and scans into one application PDF with a contents page and a live 1.9MB / 2MB upload-limit gauge. Runs in your browser.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://multipdfdoc.com/pdf/college-application-binder" },
  openGraph: { title: `${title} | MultiPDF Doc`, description, url: "https://multipdfdoc.com/pdf/college-application-binder" },
};

export default function ApplicationBinderLayout({ children }: { children: React.ReactNode }) {
  return <><ToolBreadcrumb name="College application PDF binder" href="/pdf/college-application-binder" />{children}<div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10"><ValueWrapper sources={toolSources["pdf/college-application-binder"]}
    toolName="College Application PDF Binder"
    title="Application Packet Guide: Who Uploads What, Size Limits and a Clean Page Order"
    subtitle="How to assemble application documents into one readable PDF without breaking portal rules, and when you should not combine them at all."
    sections={[
      {
        heading: "Check who is supposed to submit each document",
        content: `Before combining anything, read the portal's instructions for each field. In the Common App and similar systems, many documents are not uploaded by the student at all. School counselors normally send the official transcript, school report and mid-year report; teachers and other recommenders submit their letters directly through their own accounts. A copy of a recommendation letter that you bundle yourself is not a substitute for the recommender's submission, and an unofficial transcript copy is not an official transcript.

This binder is therefore for the situations where one combined PDF is genuinely requested or useful: a scholarship portal with a single "supporting documents" upload, a homeschool counselor assembling a transcript with course descriptions, an internship or summer-program application, a graduate program that asks for one file, or your own archive copy of everything you sent. If a portal provides separate fields for separate documents, use those fields. Combining documents that were meant to be submitted separately can make a reviewer's job harder or cause the file to be rejected.`
      },
      {
        heading: "Step-by-step: build a packet in the right order",
        content: `Step 1: Collect final versions. Export your resume and essays to PDF from your word processor so the text stays sharp and selectable. Photograph or scan paper certificates in good light, flat on a dark surface, with all four edges visible.

Step 2: Add the files. Drop PDFs and photos into the dropzone. Each PDF is read locally to count its pages; a password-protected or damaged file is rejected with a message rather than silently skipped.

Step 3: Label and order. Each file receives a section label guessed from its name, such as Resume or Essay. Change the label if it is wrong, then drag the cards or use the arrows to put them in the order the instructions ask for. If the instructions give no order, a common sequence is a short cover or contents page, resume or activities list, writing, transcript copy, then certificates and supporting material.

Step 4: Choose the limit. Pick 1.9 MB, 2 MB, 5 MB, 10 MB or enter the exact figure from the upload field. The gauge first shows an estimate from your source files, then the measured size once you build.

Step 5: Build and inspect. Download the packet, open it in a PDF reader, and check the first and last page of every section. Confirm that small print in scanned transcripts and certificate seals is still readable.`
      },
      {
        heading: "Why the size gauge matters and how to stay under it",
        content: `Upload fields reject files above their stated maximum, and limits differ by portal and field. For example, Overgrad's documentation for sending documents to the Common App instructs schools to resave files to meet a 1.9 MB maximum. Scholarship and graduate portals commonly use 2 MB, 5 MB or 10 MB, but you should always use the figure printed beside the upload field you are using rather than a number from a guide.

This tool measures size in binary megabytes (1 MB = 1,048,576 bytes). Some portals count 1 MB as 1,000,000 bytes, which is about 4.6% smaller, so the gauge warns you when the packet is within 10% of the limit. Photos are usually the reason a packet is too large: a single modern phone photo can exceed 3 MB. With "Downscale photos" enabled, each image is re-encoded through a canvas with its long edge capped at 1,700 pixels, which is roughly 170 DPI across the printable area of a letter-size page and readable for most certificates. Lowering the photo quality slider reduces size further. PDFs you add are copied page by page without recompression, so a heavy scanned PDF may still need the target-size compressor after building.`
      },
      {
        heading: "What the contents page does and does not do",
        content: `When enabled, the binder inserts a first page titled Application Packet, followed by your optional name and a list of each section label, file name and page range. Because the contents page is page one, the first document begins on page two. The page numbers in the list refer to the physical PDF pages a reader's page counter shows, which helps a reviewer jump to the right section.

The contents page uses a standard PDF font that supports English and Western European characters. Characters outside that set, such as Devanagari or Chinese, are replaced with a question mark on the contents page only; the pages inside your documents are copied unchanged. The contents page is not a set of clickable bookmarks. If a reviewer will print the packet, tick "Add Page X of Y footers": every page after the contents page gets a small centered footer using the same physical numbering as the contents list. Pages that carry a rotation flag are left unnumbered and reported, so a number is never stamped sideways; fix their orientation in the organizer first. For Bates-style or custom positions, use the dedicated page-number tool instead. Turn the contents page off when a portal specifies that the first page must be a particular form.`
      },
      {
        heading: "Privacy, signatures and file integrity",
        content: `Transcripts, test reports and identity documents contain personal information. The binder reads and combines files with the pdf-lib library inside your browser; the selected documents are not uploaded to a server for processing. The finished packet is held in browser memory until you download it or leave the page. Closing the tab releases that memory, but the downloaded file stays in your downloads folder, so delete or move it on a shared computer.

Copying pages into a new PDF creates a new document. Digitally signed PDFs lose their signature validation when they are combined, because the signature covers the original file's exact bytes. Fillable form fields, bookmarks and accessibility tags may not carry over. Keep your original files, submit signed or certified documents in their original form when that is required, and never alter the content of an official record. A combined packet is a convenience copy: it does not certify that its contents are genuine, complete or official.`
      }
    ]}
    formula={{
      title: "Packet size and page arithmetic",
      formula: "Pages_out = Σ PDF_pages + Image_count + (Contents ? 1 : 0)   |   Headroom = Limit_bytes − Packet_bytes",
      explanation: "Each image becomes exactly one page. Positive headroom means the packet fits the stated limit in binary units; keep at least 5% headroom when a portal may count megabytes in decimal units."
    }}
    faqs={[
      { question: "Can I combine my transcript and recommendation letters into one PDF for the Common App?", answer: "Usually not. In the Common App, counselors submit transcripts and school reports, and recommenders submit their own letters. Use this binder for fields that ask you for one combined file, such as a scholarship or program portal, or for your own archive copy." },
      { question: "What is the Common App file size limit?", answer: "Limits are set per field and can change, so check the field you are using. Overgrad's guidance for schools sending documents to the Common App cites a 1.9 MB maximum, which is why 1.9 MB is a preset here." },
      { question: "Are my documents uploaded to a server?", answer: "No. Files are read and combined in your browser with pdf-lib. Website code and libraries download to your device, but the documents you select are not sent anywhere for processing." },
      { question: "My packet is over 2 MB. What should I do?", answer: "Lower the photo quality, keep photo downscaling on, remove any duplicate pages, or open the packet in the PDF compressor with a 1.9 MB or 2 MB target. Reopen the result and confirm small text is still readable." },
      { question: "Will a password-protected PDF work?", answer: "Not directly. Remove the open password with permission using the Unlock PDF tool, then add the unlocked copy to the binder." }
    ]}
  /></div></>;
}
