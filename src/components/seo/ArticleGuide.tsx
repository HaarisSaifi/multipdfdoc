import type { Metadata } from "next";
import { JsonLd } from "./JsonLd";
import { ValueWrapper, type FAQItem, type SourceCitation, type SectionItem } from "./ValueWrapper";
import { AdPlaceholder } from "../ads/AdPlaceholder";

export interface ArticleContent {
  title: string;
  description: string;
  published: string;
  tool: { href: string; label: string };
  sections: SectionItem[];
  faqs: FAQItem[];
  sources: SourceCitation[];
}

export function articleMetadata(article: ArticleContent, slug: string): Metadata {
  const url = `https://multipdfdoc.com/blog/${slug}`;
  return { title: article.title, description: article.description, alternates: { canonical: url }, openGraph: { type: "article", title: article.title, description: article.description, url, publishedTime: article.published, modifiedTime: "2026-10-07", images: ["/og-image.png"] }, twitter: { card: "summary_large_image", title: article.title, description: article.description, images: ["/og-image.png"] } };
}

export function ArticleGuide({ article, slug }: { article: ArticleContent; slug: string }) {
  const words = article.sections.map((section) => section.content).join(" ").split(/\s+/).length;
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <a href="/blog" className="text-sm font-semibold text-violet-700">← All practical guides</a>
      <article>
        <header className="mt-8 space-y-5">
          <p className="text-xs font-semibold text-slate-500">Published {article.published} · Updated October 7, 2026 · {Math.ceil(words / 200)} min read</p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-tight text-slate-900">{article.title}</h1>
          <p className="text-lg text-slate-600 leading-relaxed">{article.description}</p>
          <p className="text-sm text-slate-500">Prepared with AI assistance and maintained by MultiPDF Doc. <a href="/editorial-policy" className="text-violet-700 underline">Editorial and corrections policy</a>.</p>
          <a href={article.tool.href} className="btn-bubble btn-bubble-violet px-6 py-3 whitespace-nowrap">{article.tool.label} →</a>
        </header>
        <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.description, datePublished: article.published, dateModified: "2026-10-07", author: { "@type": "Organization", name: "MultiPDF Doc", url: "https://multipdfdoc.com/about" }, publisher: { "@type": "Organization", name: "MultiPDF Doc", logo: { "@type": "ImageObject", url: "https://multipdfdoc.com/icon.svg" } }, image: "https://multipdfdoc.com/og-image.png", mainEntityOfPage: `https://multipdfdoc.com/blog/${slug}` }} />
        <ValueWrapper title="Practical guide" description="Use the workflow below, then check the linked primary sources for requirements that apply to your situation." sections={article.sections} faqs={article.faqs} sources={article.sources} lastUpdated="October 7, 2026" />
      </article>
      <AdPlaceholder slot="article-bottom" format="rectangle" />
      <div className="mt-10 border-t border-slate-200 pt-6 text-sm flex flex-wrap gap-6"><a href="/blog" className="text-violet-700">Browse more guides</a><a href="/contact" className="text-violet-700">Report a correction</a></div>
    </div>
  );
}
