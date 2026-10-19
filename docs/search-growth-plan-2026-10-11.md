# MultiPDF Doc: evidence-based search and growth plan

Updated 11 October 2026. This extends the October 7 static release, without a backend or paid SEO subscriptions.

## What the available evidence says

The supplied GA4 screenshot shows 12 active users, 52 events, no key events, 11 Direct sessions and one Referral session for the displayed seven-day period. It is too small a sample to estimate conversion, country demand or future revenue. Direct does not prove either organic growth or bot traffic. The owner reports that Search Console currently shows no data; this does not establish that no pages are indexed. Account ownership, report filters and indexing reasons need inspection in the owner's account.

The live HTTP snapshot on October 11 found all 26 existing sitemap pages returning 200, matching apex HTTPS canonicals and one main heading each. HTTP and www redirect to HTTPS apex, missing URLs return 404, and robots.txt permits crawling. This verifies availability and basic crawl signals, not Google's indexing decisions. Reports are in `docs/reports/live-http-2026-10-11.json` and `live-pages-2026-10-11.json`.

The new local release adds three original procedural guides and three made-up public practice files, giving 29 content URLs and seven guides. Existing tools stay ahead of editorial links on the homepage. Guides connect to the relevant tool, related guides, primary references and downloadable examples. Blog cards and tool help links make discovery possible without search engines or JavaScript-only deep links.

## Focused keyword and intent map

These are qualitative search opportunities, not verified low-KD keywords. Search volume, KD, attainable position and traffic forecast are **unknown**. Public results also show competitors for these topics. The useful distinction is a precise, demonstrable workflow rather than a generic "free PDF" claim.

| Query family | User need and strongest destination | Practical differentiation |
| --- | --- | --- |
| add PDF page numbers starting on page 3; number PDF skip cover and contents | `/blog/pdf-page-numbers-skip-cover`, then `/pdf/page-numbers` | Five-page example; physical page versus printed number; no rotated-page promises |
| extract text from mixed scanned and digital PDF; OCR missing text under heading | `/blog/extract-text-mixed-scanned-pdf`, then `/pdf/to-text` | Public mixed-content sample; compare native extraction and OCR-every-page; plain TXT limitation |
| compress PDF keep text selectable; compressed PDF cannot copy text | `/blog/pdf-compression-keep-text-selectable`, then `/pdf/compress` | Explain lossless versus raster output; selectability checks and original fallback |
| compress PDF to 200 KB without uploading | Existing compression guide and `/pdf/compress` | Honest target-size tradeoffs; no universal USCIS limit claim |
| merge confidential PDFs locally without upload | `/pdf/merge` and existing privacy guide | Local engines and useful offline/privacy boundaries; no fabricated security certification |
| free invoice payment terms net 30 example | Existing invoice guide and `/invoice` | Working invoice export plus payment wording; no fake accountant endorsement |
| weighted versus unweighted GPA credit calculation | Existing GPA guide and `/calc/gpa` | Actual credit-weighted calculation and school-specific limitations |

Use one authoritative page for each distinct need. Do not create 100 KB/150 KB/200 KB near-duplicate landing pages, city pages for a nonexistent local business, or programmatic doorway pages. Expand an existing guide when the same problem appears in real queries.

## SEO, AEO and GEO actions

Implemented: server-rendered useful article text, descriptive titles/descriptions, canonical URLs, seven discoverable article cards, article publication/modification dates, matching breadcrumb schema, visible FAQ answers, section anchors, Organization/Website entities and sitemap additions. New guide bodies each exceed 1,200 words because they cover actual steps, pitfalls and checks; word count is not a Google approval requirement. Practice files are original fabricated examples, not customer documents or evidence of external certification.

Google says ordinary crawlability, indexability and helpful content remain relevant for AI features; there is no special required AI schema or text file. Do not add llms.txt as a ranking promise or invent AI citations. Clear answers, named sources, limitations and examples help readers evaluate the content. FAQ markup is retained to describe visible answers, but ordinary PDF sites should not expect Google's restricted FAQ rich results. Existing AI-assistance disclosure remains: no human-written, independently peer-reviewed or certified plagiarism-free claim is made.

Primary guidance: [Google AI features](https://developers.google.com/search/docs/appearance/ai-features), [helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [developer crawl fundamentals](https://developers.google.com/search/docs/fundamentals/get-started-developers), [FAQ rich-result restrictions](https://developers.google.com/search/blog/2023/08/howto-faq-changes). Technical references include [QPDF options](https://qpdf.readthedocs.io/en/stable/cli.html) and [Tesseract API](https://github.com/naptha/tesseract.js/blob/master/docs/api.md).

The attached operator playbook was a reference, not a mandate to post externally, buy links, contact journalists, invent a business profile or use obsolete programs. Its data-led prioritization and useful topic clusters are appropriate here; generic CTR uplift percentages, exact ranking timetables and mass landing pages are not adopted.

## Owner actions after uploading

1. Back up Hostinger files and deploy the new ZIP contents at the domain root. Purge cache. Open the three new guides and all three sample links; check tools with non-sensitive documents. Confirm no duplicate manually injected GA tag remains.
2. Finish `support@multipdfdoc.com`, verify receiving and replying yourself, and monitor it. The app prepares an email draft; it never claims server delivery.
3. In Search Console verify the correct domain/property, submit `https://multipdfdoc.com/sitemap.xml`, then inspect home, one tool and a new guide. Investigate the exact reported reason if excluded. Request indexing once for changed representative pages; repeated requests are not a growth method.
4. Configure analytics as described in `docs/analytics-setup.md`. Consent-based counts will be lower than unconditional tracking. Use Search Console for search impressions/clicks, not GA4 Direct totals.
5. Keep intrusive ad scripts off during evaluation. Review the actual publisher identity, policies and article claims; AdSense account review and regional ad consent setup remain separate. There is no required visitor minimum or guaranteed approval percentage asserted here.

## Measured routine over the next 8 weeks

Weeks 1–2: validate deployment, mailbox, Google property and sitemap. Collect data rather than churning titles. Record indexed URLs, exclusions, impressions, clicks and device/country splits when available. Test a safe sample on a real modest Android phone; desktop emulation is not a memory or touch-device guarantee.

Weeks 3–4: export Search Console Queries and Pages separately for a consistent date range. Run `python scripts/search-console-priorities.py --csv path/to/Queries.csv --output docs/query-priorities.md` and separately for Pages. The script uses observed clicks/impressions/position, does not call a network service, and does not join unrelated exports. Its 25-impression threshold and position bands are triage heuristics, not statistical certainty. Investigate query intent and page suitability before acting.

Weeks 5–8: improve a small number of pages with demonstrated demand. For positions 8–20, fix missing explanations, examples and relevant internal links. For established impressions with weak CTR, compare actual search snippets and intent before editing title/description; don't promise a percentage lift. Measure changes over comparable windows and avoid interpreting a few impressions as a trend. Add a new guide only for a distinct unresolved user task that the product can actually perform.

Sustainable discovery: share useful example workflows from your own real accounts when appropriate, without spam, fake reviews, paid link schemes or invented testimonials. No outreach or account posting was performed by this agent. Technical maintenance: check representative routes after deployments; retest tool workflows when engines change; update article dates only when substantive content changes.

Track three separate outcomes: functional tool success, search discovery, and publisher approval. A production ZIP can deliver the first foundation; Google's ranking/indexing and AdSense decisions remain external outcomes.

A fresh lab run exposed a late web-font layout shift on the homepage. The release keeps its preloads and uses optional font display: slow first visits retain readable system fallback instead of a late swap. This follows [web.dev font-loading guidance](https://web.dev/articles/preload-optional-fonts). Before/after lab files are retained; report actual final measurements rather than reuse the older scores.
