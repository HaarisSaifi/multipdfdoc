import { JsonLd } from "./JsonLd";

const guides: Record<string, { href: string; label: string }[]> = {
  "/pdf/page-numbers": [{ href: "/blog/pdf-page-numbers-skip-cover", label: "Start numbering after the cover" }],
  "/pdf/to-text": [{ href: "/blog/extract-text-mixed-scanned-pdf", label: "Recover missing text from a mixed PDF" }],
  "/pdf/compress": [
    { href: "/blog/compress-pdf-200kb-uscis-passport-guide", label: "Check portal file-size requirements & USCIS limits" },
    { href: "/blog/pdf-compression-keep-text-selectable", label: "Keep text selectable when compressing" }
  ],
  "/pdf/merge": [{ href: "/blog/zero-knowledge-pdf-privacy-cloud-converter-risks", label: "Check how local PDF processing works" }],
  "/pdf/split": [{ href: "/blog/pdf-compression-keep-text-selectable", label: "Choose splitting or compression for a size limit" }],
  "/pdf/organize": [{ href: "/blog/pdf-page-numbers-skip-cover", label: "Finish page order before numbering" }],
  "/pdf/protect": [{ href: "/blog/zero-knowledge-pdf-privacy-cloud-converter-risks", label: "Understand the document privacy boundary" }],
  "/pdf/unlock": [{ href: "/blog/zero-knowledge-pdf-privacy-cloud-converter-risks", label: "Understand local document handling" }],
  "/pdf/to-image": [{ href: "/blog/pdf-compression-keep-text-selectable", label: "Understand what changes when pages become images" }],
  "/pdf/from-image": [{ href: "/blog/extract-text-mixed-scanned-pdf", label: "Extract a transcript from printed-English images" }],
  "/invoice": [{ href: "/blog/freelance-invoice-payment-terms-guide", label: "Write clear invoice payment terms & 1099-NEC rules" }],
  "/receipt": [{ href: "/blog/freelance-invoice-payment-terms-guide", label: "Keep invoices and expense records distinct" }],
  "/calc/gpa": [{ href: "/blog/weighted-vs-unweighted-gpa-college-admissions", label: "Compare weighted and unweighted GPA rules" }],
  "/calc/final-grade": [{ href: "/blog/weighted-vs-unweighted-gpa-college-admissions", label: "Understand grading scales and admissions thresholds" }],
  "/calc/words-to-pages": [{ href: "/blog/freelance-invoice-payment-terms-guide", label: "Estimating document length for project billing" }]
};

export function ToolBreadcrumb({ name, href }: { name: string; href: string }) {
  const fullUrl = "https://multipdfdoc.com" + href;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://multipdfdoc.com/" },
      { "@type": "ListItem", position: 2, name, item: fullUrl }
    ]
  };

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${name} — MultiPDF Doc`,
    url: fullUrl,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript and modern browser support",
    offers: {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    featureList: "100% In-Browser Local Processing, Zero Server Uploads, Complete File Privacy",
    publisher: {
      "@type": "Organization",
      name: "MultiPDF Doc",
      url: "https://multipdfdoc.com"
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <a href="/" className="underline whitespace-nowrap">Home</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{name}</span>
      </nav>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={softwareAppSchema} />
      {guides[href] && (
        <p className="mt-3 text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-2">
          <span>Practical help:</span>
          {guides[href].map(guide => (
            <a key={guide.href} href={guide.href} className="text-violet-700 underline">
              {guide.label}
            </a>
          ))}
        </p>
      )}
    </div>
  );
}

