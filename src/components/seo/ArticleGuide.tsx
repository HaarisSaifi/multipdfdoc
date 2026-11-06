import type { Metadata } from "next";
import { JsonLd } from "./JsonLd";
import { ValueWrapper, type FAQItem, type SourceCitation, type SectionItem } from "./ValueWrapper";
import { AdPlaceholder } from "../ads/AdPlaceholder";

export interface ArticleContent {
  title: string;
  description: string;
  published: string;
  updated?: string;
  /** Direct 40–50 word answer rendered under the H1 for featured snippets and AI answer engines. */
  quickAnswer?: { question: string; answer: string; note?: string };
  /** At-a-glance comparison table rendered as real HTML table markup (snippet-friendly for "X vs Y" queries). */
  comparison?: { heading: string; intro?: string; headers: string[]; rows: string[][]; note?: string };
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
          {article.quickAnswer ? (
            <section id="quick-answer" aria-labelledby="quick-answer-heading" className="bubble-card relative overflow-hidden p-5 sm:p-6 bg-gradient-to-br from-violet-50/90 via-white to-emerald-50/70 border border-violet-100">
              <span aria-hidden="true" className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-violet-500 to-emerald-500" />
              <p className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-violet-200 text-violet-700 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap shadow-sm">Quick definition</p>
              <h2 id="quick-answer-heading" className="mt-3 font-display text-lg sm:text-xl font-bold text-slate-900">{article.quickAnswer.question}</h2>
              <p className="quick-answer-text mt-2 text-base sm:text-lg text-slate-700 leading-relaxed">{article.quickAnswer.answer}</p>
              {article.quickAnswer.note ? <p className="mt-3 text-xs text-slate-500">{article.quickAnswer.note}</p> : null}
            </section>
          ) : null}
          <p className="text-lg text-slate-600 leading-relaxed">{article.description}</p>
          <div className="flex items-center gap-3 py-1">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-violet-200 shadow-sm bg-slate-900">
              <img
                src="/images/author/haaris-saifi.jpg"
                alt="Haaris Saifi — Founder & Systems Architect"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="text-xs">
              <p className="font-bold text-slate-900">
                Written &amp; Maintained by{" "}
                <a href="/author/haaris-saifi" className="text-violet-700 hover:underline">
                  Haaris Saifi
                </a>
              </p>
              <p className="text-slate-500 text-[11px]">
                Founder &amp; Systems Architect • <a href="/editorial-policy" className="text-slate-600 underline">Editorial &amp; Testing Governance</a>
              </p>
            </div>
          </div>
          <a href={article.tool.href} className="btn-bubble btn-bubble-violet px-6 py-3 whitespace-nowrap">{article.tool.label} →</a>
        </header>
        <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.description, datePublished: article.published, dateModified: updated, author: { "@type": "Person", name: "Haaris Saifi", jobTitle: "Founder & Lead Systems Architect", url: "https://multipdfdoc.com/author/haaris-saifi", sameAs: ["https://github.com/HaarisSaifi", "https://www.saashub.com/multipdf-doc"] }, publisher: { "@type": "Organization", name: "MultiPDF Doc", logo: { "@type": "ImageObject", url: "https://multipdfdoc.com/icon.svg" } }, image: "https://multipdfdoc.com/og-image.png", mainEntityOfPage: `https://multipdfdoc.com/blog/${slug}`, ...(article.quickAnswer ? { speakable: { "@type": "SpeakableSpecification", cssSelector: ["#quick-answer-heading", ".quick-answer-text"] } } : {}) }} />
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
        {article.comparison ? (
          <section id="comparison" aria-labelledby="comparison-heading" className="bubble-card p-6 sm:p-8 my-8 border border-slate-200/90 scroll-mt-28">
            <h2 id="comparison-heading" className="font-display text-xl sm:text-2xl font-bold text-slate-900">{article.comparison.heading}</h2>
            {article.comparison.intro ? <p className="mt-2 text-sm text-slate-600 leading-relaxed">{article.comparison.intro}</p> : null}
            <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[560px] text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>{article.comparison.headers.map((h) => <th key={h} scope="col" className="py-3 px-4 font-bold whitespace-nowrap">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {article.comparison.rows.map((row) => (
                    <tr key={row[0]} className="hover:bg-violet-50/40 transition-colors">
                      {row.map((cell, i) => i === 0
                        ? <th key={i} scope="row" className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">{cell}</th>
                        : <td key={i} className="py-3 px-4">{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {article.comparison.note ? <p className="mt-3 text-xs text-slate-500">{article.comparison.note}</p> : null}
          </section>
        ) : null}
        {article.resources?.length ? <section className="bubble-card p-6 my-8" aria-label="Public practice files"><h2 className="font-bold text-slate-900 mb-3">Try it with public examples</h2><p className="text-sm text-slate-600 mb-3">These files contain made-up demonstration content, not customer documents. Keep the original and compare your downloaded result.</p><ul className="space-y-2 text-sm">{article.resources.map(resource => <li key={resource.href}><a href={resource.href} download className="text-violet-700 underline">{resource.label}</a></li>)}</ul></section> : null}
        <ValueWrapper title="Practical guide" description="Use the workflow below, then check the linked primary sources for requirements that apply to your situation." sections={article.sections} faqs={article.faqs} sources={article.sources} lastUpdated={updatedLabel} />
      </article>
      {article.related?.length ? <aside className="bubble-card mt-8 p-6"><h2 className="font-bold text-slate-900 mb-3">Continue this workflow</h2><ul className="space-y-3 text-sm">{article.related.map(link => <li key={link.href}><a href={link.href} className="text-violet-700 underline">{link.label}</a></li>)}</ul></aside> : null}
      <AdPlaceholder slot="article-bottom" format="rectangle" />
      <div className="mt-10 border-t border-slate-200 pt-6 text-sm flex flex-wrap gap-6"><a href="/blog" className="text-violet-700">Browse more guides</a><a href="/contact" className="text-violet-700">Report a correction</a></div>
    </div>
  );
}
