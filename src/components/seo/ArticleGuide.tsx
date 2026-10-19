import type { Metadata } from "next";
import { JsonLd } from "./JsonLd";
import { ValueWrapper, type FAQItem, type SourceCitation, type SectionItem } from "./ValueWrapper";
import { AdPlaceholder } from "../ads/AdPlaceholder";

export interface ArticleContent {
  title: string;
  description: string;
  published: string;
  updated?: string;
  resources?: { href: string; label: string }[];
  related?: { href: string; label: string }[];
  tool: { href: string; label: string };
  sections: SectionItem[];
  faqs: FAQItem[];
  sources: SourceCitation[];
}

export function articleMetadata(article: ArticleContent, slug: string): Metadata {
  const url = `https://multipdfdoc.com/blog/${slug}`;
  return { title: article.title, description: article.description, alternates: { canonical: url }, openGraph: { type: "article", title: article.title, description: article.description, url, publishedTime: article.published, modifiedTime: article.updated || "2026-10-07", images: ["/og-image.png"] }, twitter: { card: "summary_large_image", title: article.title, description: article.description, images: ["/og-image.png"] } };
}

export function ArticleGuide({ article, slug }: { article: ArticleContent; slug: string }) {
  const updated = article.updated || "2026-10-07";
  const updatedLabel = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(updated + "T00:00:00Z"));
  const words = article.sections.map((section) => section.content).join(" ").split(/\s+/).length;
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-sm text-slate-600"><a href="/" className="underline whitespace-nowrap">Home</a><span aria-hidden="true">/</span><a href="/blog" className="underline whitespace-nowrap">Guides</a><span aria-hidden="true">/</span><span aria-current="page">{article.title}</span></nav>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://multipdfdoc.com/" }, { "@type": "ListItem", position: 2, name: "Guides", item: "https://multipdfdoc.com/blog" }, { "@type": "ListItem", position: 3, name: article.title, item: `https://multipdfdoc.com/blog/${slug}` }] }} />
      <article>
        <header className="mt-8 space-y-5">
          <p className="text-xs font-semibold text-slate-500">Published {article.published} · Updated {updatedLabel} · {Math.ceil(words / 200)} min read</p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-tight text-slate-900">{article.title}</h1>
          <p className="text-lg text-slate-600 leading-relaxed">{article.description}</p>
          <p className="text-sm text-slate-500">Prepared with AI assistance and maintained by MultiPDF Doc. <a href="/editorial-policy" className="text-violet-700 underline">Editorial and corrections policy</a>.</p>
          <a href={article.tool.href} className="btn-bubble btn-bubble-violet px-6 py-3 whitespace-nowrap">{article.tool.label} →</a>
        </header>
        <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.description, datePublished: article.published, dateModified: updated, author: { "@type": "Organization", name: "MultiPDF Doc", url: "https://multipdfdoc.com/about" }, publisher: { "@type": "Organization", name: "MultiPDF Doc", logo: { "@type": "ImageObject", url: "https://multipdfdoc.com/icon.svg" } }, image: "https://multipdfdoc.com/og-image.png", mainEntityOfPage: `https://multipdfdoc.com/blog/${slug}` }} />
        <nav aria-label="On this page" className="bubble-card my-8 p-6"><h2 className="font-bold text-slate-900 mb-3">On this page</h2><ol className="list-decimal pl-5 space-y-2 text-sm">{article.sections.map((section, i) => <li key={section.heading}><a href={`#guide-section-${i + 1}`} className="text-violet-700 underline">{section.heading}</a></li>)}</ol></nav>
        <div className="bubble-card p-6 my-8 bg-gradient-to-r from-violet-50/80 via-white to-sky-50/80 border border-violet-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-slate-900 text-base sm:text-lg">Try this operation in your browser</h2>
            <p className="text-sm text-slate-600 mt-1">100% private, client-side processing with zero server uploads.</p>
          </div>
          <a href={article.tool.href} className="btn-bubble btn-bubble-violet px-5 py-2.5 text-sm whitespace-nowrap shadow-md">
            {article.tool.label} →
          </a>
        </div>
        {article.resources?.length ? <section className="bubble-card p-6 my-8" aria-label="Public practice files"><h2 className="font-bold text-slate-900 mb-3">Try it with public examples</h2><p className="text-sm text-slate-600 mb-3">These files contain made-up demonstration content, not customer documents. Keep the original and compare your downloaded result.</p><ul className="space-y-2 text-sm">{article.resources.map(resource => <li key={resource.href}><a href={resource.href} download className="text-violet-700 underline">{resource.label}</a></li>)}</ul></section> : null}
        <ValueWrapper title="Practical guide" description="Use the workflow below, then check the linked primary sources for requirements that apply to your situation." sections={article.sections} faqs={article.faqs} sources={article.sources} lastUpdated={updatedLabel} />
      </article>
      {article.related?.length ? <aside className="bubble-card mt-8 p-6"><h2 className="font-bold text-slate-900 mb-3">Continue this workflow</h2><ul className="space-y-3 text-sm">{article.related.map(link => <li key={link.href}><a href={link.href} className="text-violet-700 underline">{link.label}</a></li>)}</ul></aside> : null}
      <AdPlaceholder slot="article-bottom" format="rectangle" />
      <div className="mt-10 border-t border-slate-200 pt-6 text-sm flex flex-wrap gap-6"><a href="/blog" className="text-violet-700">Browse more guides</a><a href="/contact" className="text-violet-700">Report a correction</a></div>
    </div>
  );
}
