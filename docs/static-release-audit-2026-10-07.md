# Static release audit — October 7, 2026

MultiPDF Doc is prepared and tested locally as a static Hostinger Premium release. All fifteen tools remain available. No application backend, VPS, Redis, paid OCR API or hosting Node runtime is required. Ordinary web hosting still serves the public HTML, JavaScript, WebAssembly and model resources. No live deployment, DNS change, account submission or promotional message was performed.

## Deliverable

`artifacts/multipdfdoc-hostinger.zip` contains 349 public files (15,418,172 bytes, 14.7 MiB), including `.htaccess`, static pages, local engines, licenses and the English OCR model. ZIP CRC, root layout, file count and SHA-256 were verified. Directory records are additional ZIP entries, not public-file count. Private environment files and application API handlers are absent.

SHA-256: `4900f62f34607e5622548182a2e85150f8b158de7a78e2216460b3c12ecc16b7`

Upload the archive contents into the correct website document root after backing up the existing site. Follow [Hostinger deployment instructions](hostinger-static-deployment.md); actual hosting directives require live verification.

## Changes and reasons

- Next.js static export replaces hosting runtime/API requirements. Robots and sitemap are generated at build time. The release produces 31 Next build entries, including metadata/fallback routes, and 26 public content URLs; these counts describe different things.
- Cloud OCR and contact APIs are removed. Contact creates an explicitly unsent draft with a reply address, clipboard fallback and an optional email-app link. It never claims that the website sent a message.
- Local OCR retains digital-text extraction first, English scanned-image recognition and explicit full-page recognition for mixed PDFs. Assets are self-hosted and version-pinned; cancellation, bounded initialization/recognition, worker cleanup and friendly failure/retry paths are implemented. The language model is approximately 2.8 MiB. Handwriting, other languages, low-memory devices and dense tables remain limitations; text must be reviewed.
- Fifteen tool titles, descriptions, visible breadcrumbs and corresponding schema reflect real tasks. Tool guides contain 813–994 rendered words in tested pages; four articles contain 1,494–1,660. FAQ markup agrees with visible answers. Primary citations and limitations replace unsupported guarantees and fabricated review credentials. Content is AI-assisted, not certified human-written or plagiarism-certified.
- The light clay interface, navigation/search, direct tool access, native input labels, error feedback and exported-output handling were checked. Mobile hero buttons now explicitly stack, preventing a font-load wrapping shift.
- Hosting rules supply extensionless pages, real 404 responses, MIME types, security headers, textual gzip and hashed asset caching. The local preview simulates essential behavior; it does not certify Hostinger's `.htaccess` support.
- Ads remain disabled. Only a genuine configured publisher ID emits ads.txt and verification metadata. Ads, consent and approval are separate owner configuration steps.

## Verification

- Final `npm run build`: exit 0; compilation, lint and TypeScript checks pass, all static entries generated.
- Final `npm test`: five production regression groups plus five real QPDF/ZIP invariant groups pass. Tests include strict page ranges, calendar dates, OCR cancellation/timeout, multipage business exports and safely encoded JSON-LD; real AES-256 encryption rejects a wrong password and decrypts with the correct one.
- Final full browser suite: 130 route/viewport checks across 320, 375, 768, 1024 and 1440 px; 24 successful workflows covering all fifteen tools, search, downloads and failure recovery. No detected overflow, missing images, unlabeled inputs, uncaught JavaScript exceptions, document POSTs or external requests in those runs, including worker monitoring.
- Axe WCAG 2/2.1 A/AA and best-practice checks: 52 initial page states and 21 completed workflow states, with no detected violations. This is bounded automated evidence, not complete accessibility certification.
- HTTP suite: all 26 sitemap pages and 33 internal links pass; canonical URLs, worker/WASM/model MIME types, absent API endpoints and real missing-route status checked. Export scan checks 137 text assets with zero private credential matches and no private files/API directory.
- Textual gzip is verified; precompressed English model bytes are served without accidental HTTP double encoding.
- npm production advisory response: zero advisories. Full dependency audit retains five high build/development entries in the shared Tailwind/braces chain. See [the documented exception](security-audit-exceptions.md). Do not claim all dependencies are advisory-free.

## Sequential mobile Lighthouse samples

| Exported page | Performance | Accessibility | Best practices | SEO | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| Homepage | 92 | 100 | 100 | 100 | 0 |
| PDF compressor | 95 | 100 | 100 | 100 | 0 |
| PDF to text / OCR landing | 93 | 100 | 100 | 100 | 0 |
| Compression guide article | 92 | 100 | 100 | 100 | 0 |

Samples use Lighthouse 13.5.0, local Chrome and the static preview with textual compression. They measure page loading, not OCR throughput or deployed field Core Web Vitals. OCR resources load on demand after a scan is selected. Scores vary with device, network and hosting.

The preserved initial static baseline measured homepage performance 68 and CLS 0.22, compressor performance 77. The final homepage resolves an observed mobile font-wrap defect. Preview gzip was also enabled to match the supplied hosting configuration, so the before/after score difference includes that environment correction and must not be attributed entirely to product code.

## Discovery and AdSense work

[Search-intent research](search-intent-research-2026-10-07.md) records observed competition and a route-to-keyword map. Research is qualitative; paid volume/difficulty metrics and Search Console account data were unavailable. Useful narrow tasks are prioritized without thin cloned landing pages. Static HTML, canonical URLs, internal links, sources and coherent schema support crawling and reader comprehension. Google's AI search guidance does not require special GEO/AEO markup. Nothing here guarantees indexation, rankings, traffic, FAQ rich results or AdSense approval.

## Remaining owner/live steps

1. Deploy the ZIP on the actual Hostinger website; verify SSL, canonical redirects, 26 public URLs, true 404 status, security/cache headers and engine resources there. Test saved results and OCR on real phones as well as desktop.
2. Confirm a monitored receiving email. `support@multipdfdoc.com` remains the existing address, but mailbox delivery is unverified; a free monitored address is an acceptable replacement once the owner supplies it. Draft generation is tested; mail delivery is not.
3. Verify domain ownership in Search Console, submit the sitemap and use actual query/indexing data to improve useful pages. These account changes were not performed.
4. Configure only a real AdSense publisher ID; complete applicable certified CMP/consent setup and actual ad placement checks before serving ads. Approval is Google's decision.

Automatic approval review rejected the optional 21st CLI source review because it could transmit private contact-page source to an external service. No retry or bypass was performed. Local code review, axe scans and browser tests supplied verification instead; this did not block the static release work.
