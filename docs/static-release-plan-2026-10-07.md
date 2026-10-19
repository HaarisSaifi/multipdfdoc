# Static release plan — October 7, 2026

Target: deploy MultiPDF Doc on the existing Hostinger Premium plan as HTML, CSS, JavaScript and WebAssembly. Node.js is used on the developer computer for building and testing; no Node.js runtime, VPS, Redis, paid OCR service or application backend is required on the hosting account.

1. Export every content route and metadata file. Remove request-dependent API routes and Cloud OCR controls. Generate ads.txt only for a configured genuine publisher ID. Keep ads off by default.
2. Preserve the local PDF engines and local OCR. Host the OCR worker, compatible LSTM engines and English data on the same origin, load them on demand, bound image sizes, support cancellation and explicit errors. Avoid adding an offline service worker that could retain outdated code or private documents.
3. Adapt contact to the user's email application with a clear unsent draft state, visible address and copy fallback. A real monitored support mailbox remains an operator requirement; no imaginary successful delivery.
4. Supply Hostinger .htaccess rules for HTTPS/canonical host, extensionless routes, security headers, correct worker/WASM MIME types, conservative HTML caching and immutable hashed assets. Preserve a real 404 instead of rewriting unknown URLs to the homepage.
5. Research search intents, map them to existing useful tools and improve titles, direct answers, examples and internal links. Record competition and uncertainty; do not invent keyword volume, difficulty scores, ranking dates, reviews or editorial credentials. Google AI visibility uses fundamental crawlability and helpful content, not a special guaranteed GEO schema.
6. Run regressions and browser workflows against exported files served by a static-only preview. Verify initial HTML, internal links, missing routes, same-origin assets, cancellation, unsupported inputs, keyboard behavior and no document uploads. Measure performance after testing, sequentially.
7. Package only exported public files, including .htaccess, into an upload ZIP. Exclude source code, node_modules, environment files and secrets. Document backup, upload, live checks, Search Console ownership and publisher-account steps.

Hostinger configuration, DNS/mail delivery, real-device/browser compatibility, Search Console ownership and Google's review require separate live evidence. No plan can promise universal bug-free behavior, indexing, rankings, traffic or AdSense approval.

Primary references: [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports), [Tesseract local installation](https://github.com/naptha/tesseract.js/blob/master/docs/local-installation.md), [Hostinger headers](https://www.hostinger.com/support/8052370-advanced-cdn-header-management-at-hostinger/), [Google AI features](https://developers.google.com/search/docs/appearance/ai-features).
