# Current release evidence: October 11, 2026

See ../seo-release-audit-2026-10-11.md for the current ZIP and measured results. seo-browser-2026-10-11.json covers 145 page/width checks and 27 workflows; seo-http-2026-10-11.json covers 29 public pages. analytics-consent-2026-10-11.json uses a mocked loader, not real Google collection. static-package-verification-2026-10-11.json verifies all 362 ZIP files against the export. live-http/live-pages-2026-10-11.json describe the previous live 26-page version, not deployment of the new release. Generic static-browser/static-http/static-package reports are refreshed with current results. Older Lighthouse files remain dated October 7 lab evidence unless a new dated report explicitly says otherwise.

---

# Release evidence — October 7, 2026

The current deployment target is the static export for Hostinger Premium. Earlier `production-*` and `lighthouse-*-local.json` reports describe the prior local Next.js server build. They remain historical evidence and are not the current static release's live scores.

Current artifacts:

- `static-browser-audit.json`: all public routes at five widths, initial WCAG/best-practice scans and fixture workflows, including local OCR cancellation, mixed-page recognition, malformed input, blocked-engine recovery and draft contact. Network monitoring includes workers. No real user documents or emails are used.
- `static-http-audit.json`: all sitemap pages, internal links, canonical URLs, defensive headers, worker/WASM MIME, absent API endpoints, 404 and public-file checks. The preview simulates essential static hosting behavior; Hostinger .htaccess still needs live verification.
- `lighthouse-*-static.json`: sequential local Lighthouse mobile samples of the exported files. They are lab measurements, not live Core Web Vitals or an accessibility certification.
- `static-package.json`: public-file ZIP size, checksum and .htaccess inclusion.
- `dependency-audit-production.json` and `dependency-audit-full.json`: npm advisory responses; review the documented build-time exception.

Read `../hostinger-static-deployment.md`, `../static-release-plan-2026-10-07.md` and `../search-intent-research-2026-10-07.md`. A prepared ZIP does not establish DNS/SSL/mail delivery, Search Console ownership, publisher approval or live deployment.
