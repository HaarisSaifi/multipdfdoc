# Hostinger Premium static deployment

This release requires a web host that serves HTML/CSS/JavaScript/WebAssembly and applies the supplied Apache/LiteSpeed-compatible .htaccess rules. It does not require a VPS, Node.js application, PHP document processor, Redis, Resend or Gemini account. Node.js is used on the developer computer to build the files. Hosting still serves web requests; “no server” here means no application backend you need to buy or manage.

## Prepare locally

1. Install dependencies with `npm ci` using Node 22. Keep `.env.local` on the developer computer. The static build needs no API key. Leave ads disabled.
2. Run `npm run build`, `npm start`, `npm test`, `node scripts/test-http.mjs` and `npm run test:browser`. The exported routes and resources are in `out/`.
3. Run `npm run package:hostinger`. The ZIP is `artifacts/multipdfdoc-hostinger.zip`; its checksum and size are recorded in `docs/reports/static-package.json`.

## Publish through hPanel

1. Confirm the correct hosting website and document root for multipdfdoc.com. Download a backup of the current live public files and existing .htaccess before replacing anything. Do not delete another website's folder or mail data.
2. Upload the ZIP into the correct document root, usually `public_html`, and extract its contents there. The root should directly contain `index.html`, `.htaccess`, `404.html`, `_next`, `vendor`, fonts, robots.txt and sitemap.xml, rather than a nested `out` folder. File Manager may hide dotfiles; verify `.htaccess` is present. After backing up, remove only obsolete files belonging to this website, especially stale PHP/API handlers or a fabricated old ads.txt; uploading new files alone does not remove leftovers. Retain a real existing publisher ads.txt only if it matches the verified account and current build configuration.
3. Ensure the active domain has a valid SSL certificate before applying the HTTPS redirect. The supplied canonical host is `https://multipdfdoc.com`; the www hostname must have working DNS/SSL for redirects from HTTPS www to work. Do not point DNS to an unverified hosting account or overwrite mail records.
4. Apply the provided .htaccess with care if the live account has existing required rules. It serves extensionless routes from exported .html files, sets correct JS/WASM MIME types and headers, caches hashed chunks long-term and keeps HTML revalidated. Unknown routes return the custom 404 with a 404 status; there is no catch-all homepage rewrite.
5. Purge any hosting cache after replacement and test with a fresh browser profile. Keep the previous `_next/static` directory available through a short rollback window when possible, since a visitor with an old open page may still request its old chunks. Never combine an old index.html with a new chunk set.

## Verify on the actual domain

- Check all 26 sitemap URLs return 200, each canonical points to the intended public URL and missing routes return 404. Confirm no robots/noindex block was added by hosting.
- Verify `/vendor/pdfjs/pdf.worker.min.mjs`, OCR worker, `.wasm` files and English `.traineddata.gz` load with the appropriate MIME types. A server must not present gzipped model bytes as a download error or HTML page.
- Confirm .htaccess security headers and caching on live HTTP responses. The local static preview simulates essential behavior; it does not prove Hostinger applies those directives. If a 500 response occurs, restore the backup and use the hosting error log to identify an unsupported directive.
- Test one small merge, encryption/decryption, image conversion, invoice and scanned OCR on a real phone. The first OCR scan downloads its resources; subsequent engine-language caches may reduce loading. Low-memory devices can still need smaller batches.
- Confirm the support address receives mail. A mailto link and local draft are not evidence that the receiving mailbox exists. Free monitored webmail can be configured instead of buying another service.

## Search and advertising

Use the owner's Search Console account to verify the domain and submit `https://multipdfdoc.com/sitemap.xml`. Inspect representative tool/article URLs after publishing. Submission cannot guarantee indexing or ranking.

When the AdSense account provides a real publisher ID, set `NEXT_PUBLIC_ADSENSE_CLIENT_ID` on the developer computer and rebuild. This emits genuine verification metadata and ads.txt. Do not use sample IDs. Keep ad serving off until approval, applicable certified CMP/consent settings and actual placement tests. Existing static pages can serve ad scripts later; an application backend is not required for that integration.

Sources: [Next.js static export](https://nextjs.org/docs/app/guides/static-exports), [Hostinger header configuration](https://www.hostinger.com/support/8052370-advanced-cdn-header-management-at-hostinger/), [AdSense readiness](https://support.google.com/adsense/answer/7299563?hl=en), [Google AI search features](https://developers.google.com/search/docs/appearance/ai-features).
