# MultiPDF Doc production readiness audit

Audit date: October 7, 2026. Workspace: `D:/adsense`. Scope: the Next.js app, every public sitemap page, shared layout, document engines, API routes, content, metadata, deployment configuration, dependency graph and the legacy backend directory.

## Release decision

This is a locally prepared release, not confirmation that these changes are deployed to multipdfdoc.com or approved by Google. AdSense approval, zero bugs, universal compatibility and guaranteed growth cannot be certified. The operator-owned launch gates below remain required. The live homepage was reachable during this audit; it still represents the deployed revision until a new release is published.

No real document was uploaded to a provider, no email or promotional message was sent, and no hosting/account setting was changed. Browser tests use generated fixtures and localhost. API provider responses are mocked in the regression suite.

## Important findings and repairs

| Area | Observed problem | Prepared repair |
| --- | --- | --- |
| Contact | Success could be returned even when email was unconfigured or failed | Bounded validated JSON, verified sender requirement, production distributed quotas, timeout and confirmed provider identifier |
| Cloud OCR | Weak body limits, spoofable proxy identity, unsafe failure behavior and misleading privacy claims | Actual stream cap, format/MIME checks, production fail-closed Redis, header-based key transport, shared upstream deadline, rejection of empty/truncated results, honest consent and default-off feature |
| PDF selection | Invalid range fragments were silently interpreted; unreadable merge inputs could be counted as one page | Strict range grammar and bounds; invalid PDF errors instead of fabricated counts |
| Encryption | Reader restrictions could share the opening password | Separate random owner password, AES-256 verification and accurate limitations of printing/copying flags |
| Compression | An oversized trial could replace a fitting candidate and appear successful | Retain fitting candidates; fail honestly when the bounded target search cannot fit; preserve original if lossless output grows; explain raster losses |
| Image conversion | WebP was accepted but not supported by the embedding path | Decode WebP locally to PNG; explicit supported formats and preview URL cleanup |
| PDF image export | Files above the batch limit could lose later pages silently; stale format labels | Reject oversized batches explicitly; clear generated images after format/DPI changes; bound canvas pixels and clean worker resources |
| Local OCR | Repeated/missing pages, short native text skipped, limited batches and errors in output | Page-by-page native extraction, OCR only empty-text pages, ordered transcript, explicit errors, worker cleanup and read-only filtered view |
| Invoice/expense | One-page overflow, truncation, character deletion, misleading proof claims, stale exports | Shared paginated document generator; retain every description and note; reject unsupported scripts explicitly; rounded money, input checks, honest voucher disclaimer and output invalidation |
| Calculators | Fake college cutoffs, zero-credit miscalculation, invalid weight substitution and overconfident estimates | Course-level assumptions, no admissions prediction, exclude zero-credit courses, no bonus for failing grades, editable course credits, invalid-input feedback and normalized speech time |
| Content | Universal USCIS 200KB claim, invented invoicing statistics, inaccurate retention/compliance claims | Four original practical articles, route-specific guides, primary references, worked examples and transparent AI-assistance disclosure; also corrected legacy merging/splitting claims, universal court/university rules, arbitrary timing and memory-erasure promises |
| Accessibility | Pointer-only file areas, unnamed fields, missing focus feedback and nonmodal search | Keyboard pickers, useful control names, visible focus, native dialogs, one main landmark, sequential heading levels, skip link and reduced motion |
| Delivery | Missing defensive headers, script-closing injection risk in JSON-LD, inherited canonical and weak recovery pages | Basic security headers, escaped structured data, correct terms metadata, native FAQ content, useful 404 and recoverable error page; homepage FAQ and WebSite schema match visible content |
| Ads | Dummy identifiers and blank ad inventory risk | Default-off real-ad configuration, reserved spacing only when enabled, valid publisher metadata and dynamic ads.txt without fabricated IDs |
| Performance | Editorial text and large PDF libraries on the initial client path; external font import | Server-rendered guides, native FAQs, lazy document/OCR/ZIP engines, locally hosted licensed WOFF2 fonts and stable asset manifest; avoid loading unrelated route scripts speculatively while retaining navigation hover/touch prefetch |
| Repository hygiene | Outdated Oracle/dependency/growth claims presented as current | Updated README, cloud/security docs and measured growth plan; unused backend and deploy script stop by default |

## Verification evidence

- `npm run build` passes lint/type checks and generates all 33 static entries. `npm test` passes 11 production regression groups and 5 engine invariant groups. The HTTP smoke suite passes all 26 public sitemap URLs, security headers, custom 404 and safe API error cases. These are reproducible local checks, not account/deployment verification.
- TypeScript checks and a complete Next.js production build pass. The build lists twenty-six public content pages plus API, metadata and fallback routes; historical “32 routes” and generated-page counts are not interchangeable metrics.
- Real QPDF WebAssembly verifies AES-256, rejects a wrong opening password and produces an unencrypted result with the correct password. ZIP construction is also checked.
- `scripts/test-production.cjs` exercises actual helper modules and actual API handlers: strict page ranges, streamed body limits, trusted identity, production rate-limit failure, malformed Redis output, contact success/failure, Cloud OCR gating and truncation, multipage business PDFs and safe JSON-LD. External providers are mocked; this does not verify provider-account configuration or mailbox delivery.
- The browser suite passes 130 page/viewport checks: all 26 public pages at widths 320, 375, 768, 1024 and 1440. It passes 18 workflow checks, including all 15 tools plus search, native PDF text extraction and recovery navigation. Axe WCAG 2/2.1 A/AA and best-practice checks report no detected violations on 52 initial page states and 15 completed tool states. No uncaught JavaScript exceptions or document-upload POST requests occurred in these fixture workflows. These automated checks do not establish complete accessibility or universal file support. Details are in `reports/production-browser-audit.json`.
- Local guides and articles are server rendered so procedural content and FAQ answers remain available in HTML. Rendered tool guides contain 813–994 words; independent article bodies contain 1,301–1,342 words. Word counts implement the project’s editorial brief, not a Google acceptance rule. Four article bodies were rewritten with original workflows and source-grounded factual summaries; they are AI-assisted and not independently peer-reviewed or exhaustively checked against every publication. Limited quoted-phrase web searches sampled the four new articles and did not identify an exact matching passage in the returned results; unrelated results and incomplete search indexing mean this is not an exhaustive plagiarism scan or an authorship certificate.
- Large PDF-tool initial bundles decreased from approximately 283–285 kB in the intermediate build to approximately 108–110 kB by deferring engines. Website fonts no longer require Google Fonts requests. These are build measurements, not live Core Web Vitals. A separate local Lighthouse lab report is saved with its environment and metrics; its scores do not certify the live deployment.
- Current production-only dependency audit: zero advisories. Full audit: five high entries in the Tailwind build-time chain, documented in `security-audit-exceptions.md`. No untested forced major migration was performed.

## Reproduce the local checks

Use Node 22 with `npm ci`, then `npm run build`. Run `npm start` in a separate terminal. Run `npm test`, `node scripts/test-http.mjs` and `npm run test:browser`. The browser suite uses an isolated Chrome profile and generated fixtures; set `CHROME_PATH` if Chrome is installed elsewhere. It does not submit the contact form to a real provider or enable Cloud OCR.

Audit runtime dependencies with `npm audit --omit=dev`; compare the full audit with the documented build exception. Lighthouse lab results use temporary-cache Google Lighthouse 13.5.0 against the local production server, with default mobile simulation. No Lighthouse dependency was added to the project.

## Owner/deployment gates before claiming launch readiness

| Gate | Required evidence | Current boundary |
| --- | --- | --- |
| Publish the revision | Reviewed deployment, tested live URLs and correct canonical host redirects | Local changes prepared; no new live deployment confirmed |
| Reliable contact | Verified Resend sender, monitored support mailbox, production Redis, safe test message received | Code tested with mock provider; Resend/Redis configuration is missing locally. Public MX lookup returned no mail exchanger on October 7; mailbox routing remains unverified |
| Domain discovery | Search Console ownership, sitemap submission and representative URL inspection | Requires the owner’s account or DNS access |
| Publisher verification | Real AdSense account/site status and verification method; genuine publisher ID | No publisher ID or approval has been fabricated |
| Ads and consent | Relevant certified CMP, regional privacy messages, live placement/resizing checks before enablement | Ads remain off by default; a feature flag is not consent management |
| Optional Cloud OCR | Provider account/terms, audience restrictions, regional eligibility, billing and truthful retention disclosures | Off by default until operator review; the standard tools function locally |
| Editorial signoff | Owner review of tax/immigration/admissions statements and corrections contact | AI-assistance disclosed; no human-authorship/plagiarism certificate claimed |
| Device coverage | Representative real phone, Safari/Firefox checks and low-memory cases | Desktop Chrome responsive tests are evidence for those conditions only |
| Residual build advisory | Review trusted CI inputs and scheduled Tailwind/upstream remediation | Documented development/build exception remains |

## Submission strategy

Google’s [readiness guidance](https://support.google.com/adsense/answer/7299563?hl=en) emphasizes distinctive useful content and usable navigation. Do not mistake a successful build, a fixed page count or a fixed word target for approval. Check the live site as a visitor and ensure every advertised workflow actually produces a usable output or a clear limitation.

Before enabling ads, apply the [placement policies](https://support.google.com/adsense/answer/1346295?hl=en) and [regional consent requirements](https://support.google.com/adsense/answer/13554020?hl=en). Keep ads away from upload, export and navigation controls and verify layout stability when an ad fills or fails. The current 32px spacing is a product safeguard, not an independent Google certification.

Maintain content according to [people-first guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content). Avoid keyword-generated near-duplicate tools, fabricated credentials, false statistics, invented testimonials and guarantees about immigration, taxes, admissions or data erasure. The updated `propermonth.md` defines a thirty-day plan around measured user completion and search evidence, rather than promised traffic and revenue.

## Remaining product limitations

Raster compression removes text/link/form/tag structures and may not meet tiny targets. Image exports contain raster pixels, not preserved PDF semantics. OCR can misread or omit mixed image content and needs human checking. Built-in invoice/expense fonts support Latin text; unsupported scripts produce an error instead of being removed. Page numbering currently asks users to normalize rotated pages first and rejects a stamp that cannot fit within a page. File complexity and device memory can still prevent processing; preserve originals.

A repository audit does not establish secure memory erasure, provider zero retention, tax compliance, universal file support, accessibility certification or an exhaustive plagiarism guarantee. Those are deliberately absent from the revised product claims.
