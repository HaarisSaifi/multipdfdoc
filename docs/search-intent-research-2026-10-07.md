# Search intent and discovery research — October 7, 2026

Research method: public web searches of specific task phrases, inspection of the existing 15 working tools and primary Google guidance. This is qualitative search-result evidence, not paid keyword-volume/KD data. Search results vary by location and time. No claim of an easy ranking, low competition, indexation date or traffic forecast is justified by this sample. Search Console data is not accessible in this session.

## Observed competition and prioritization

| Query cluster | Existing destination | Observed evidence and useful differentiation |
| --- | --- | --- |
| merge PDF without uploading | /pdf/merge | Multiple dedicated tools and guides, including keptlocal, private-pdf and Love2PDF. Crowded intent. Demonstrate actual no-upload processing, explain file ordering and limitations; avoid generic privacy superlatives. |
| compress PDF to 200KB / under 200KB without uploading | /pdf/compress | Multiple specialist size-target pages including Wandfile, Crafex and PDF Tools Base. Target the practical failure case: when a readable file cannot meet the cap, how to split and verify instead. No “any PDF in seconds” claim. |
| extract text from scanned PDF locally / English OCR | /pdf/to-text | Browser OCR competitors such as FileSwift already exist. Clear supported-language and mixed-page controls, self-hosted resources, cancellation, editable full transcript and real native-text fallback are useful task distinctions. |
| split PDF selected pages / ranges without uploading | /pdf/split | OfflinePDF, FWD Tools and PDFHarbor show established tools. Explain valid ranges, physical-page numbering versus printed labels and a real one-page extraction example. |
| invoice generator no signup no watermark | /invoice | Numerous established pages including Portant, Billia and InvoiceWithMe. Treat this as competitive. Focus on complete multipage exports, honest character support, rounded currency and usable payment notes. |
| final exam score needed / GPA with course credits | /calc/final-grade, /calc/gpa | Target the concrete calculation and show formulas. Zero-credit exclusion and targets above 100% are helpful edges; do not invent college admissions matches or official GPA conversions. |
| PDF page numbers skip cover / PNG 300 DPI | /pdf/page-numbers, /pdf/to-image | Narrow task variants match existing controls. Check live search impressions before making more pages; describe page offset and actual pixel output rather than universal court/print compliance. |
| words to pages double spaced / speech duration | /calc/words-to-pages | Heuristic planning intent. Give visible density/rate assumptions and one worked example, not an “exact pages” promise. |

Research samples: [merge](https://keptlocal.com/tools/merge-pdf/), [compression](https://wandfile.com/compress-pdf/under-200kb/), [OCR](https://www.fileswift.app/pdf-ocr), [splitting](https://fwdtools.com/pdf-splitter/), [invoice](https://www.portant.co/invoice-generator/). These are competitor-owned pages used to observe positioning, not sources for implementation correctness or copied content.

## Keyword-to-page map

Keep one canonical route per tool. Use variants naturally in instructions and FAQs; do not create 100KB/200KB/500KB clones merely to multiply inventory.

| Route | Primary task | Useful secondary intent |
| --- | --- | --- |
| /pdf/merge | merge PDF without uploading | combine PDF files, reorder input files |
| /pdf/split | extract selected PDF pages | split page range, save one page |
| /pdf/compress | compress PDF to 200KB | custom KB target, cannot meet file-size limit |
| /pdf/to-image | PDF to PNG or JPG | 150/300 DPI, download pages as ZIP |
| /pdf/from-image | JPG PNG WebP to PDF | reorder receipt photos, page size |
| /pdf/organize | reorder rotate delete PDF pages | normalize page rotation |
| /pdf/protect | password protect PDF locally | AES-256 PDF encryption |
| /pdf/unlock | unlock PDF with known password | remove authorized password protection |
| /pdf/page-numbers | add page numbers to PDF | skip cover page, start numbering offset |
| /pdf/to-text | PDF to text local OCR | scanned English PDF text, mixed-page recognition |
| /invoice | free invoice generator no signup | PDF invoice no added watermark, payment notes |
| /receipt | expense record generator | self-entered bookkeeping log; not a forged receipt |
| /calc/final-grade | final grade calculator | required final exam score, impossible target |
| /calc/gpa | GPA calculator with credits | weighted versus unweighted, zero-credit course |
| /calc/words-to-pages | words to pages calculator | double spaced page estimate, speech time |

## Implemented editorial and technical approach

Titles and descriptions reflect the actual task and limitation. Visible page content and FAQ answers must agree with structured data. Static HTML exposes procedural text without waiting for client hydration. Breadcrumbs, the tool directory, guide-to-tool links, sitemap and one canonical hostname create clear discovery paths. Structured FAQs remain useful answers; they are not a promise of FAQ rich results. Avoid aggregate ratings, testimonials, professional certifications and review signatures without evidence.

Google says AI Overviews and AI Mode use foundational SEO and have no extra special markup requirement. Clear direct answers, accurate examples, accessible HTML and primary citations also help readers and answer engines understand the page. Do not represent llms.txt, “GEO scores”, schema stuffing or bots submitting every URL as a ranking mechanism.

## Free measurement loop after deployment

1. Verify the domain in Search Console and submit the sitemap. Inspect homepage, compressor, text extractor and one guide. Check actual response, canonical, indexability and worker files; do not promise instant discovery.
2. Record impressions/clicks/query-page pairs after data arrives. Prioritize relevant queries with impressions, weak titles or incomplete task answers. A zero-impression query is not proof of zero demand or low difficulty.
3. Fix completion failures before adding inventory. Keep safe worked examples, verify saved output, and compare the result against the question the searcher actually asked.
4. Share a truthful demonstration only through owner-authorized channels and communities that allow it. No link spam, artificial traffic, bought clicks, invented reviews or automated outreach.
5. Re-check source requirements and dependency advice periodically. The existing 30-day plan records assumptions, measurements and corrections instead of revenue forecasts.

Primary guidance: [SEO essentials](https://developers.google.com/search/docs/essentials), [AI search features](https://developers.google.com/search/docs/appearance/ai-features), [helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [FAQ changes](https://developers.google.com/search/blog/2023/08/howto-faq-changes), [AdSense readiness](https://support.google.com/adsense/answer/7299563?hl=en).
