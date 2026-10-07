# Local release evidence — October 7, 2026

These reports were generated against the Next.js production server on localhost, with ads and Cloud OCR disabled. They do not establish that multipdfdoc.com serves the same revision or that Google has approved the site.

- `production-browser-audit.json`: 26 public pages at five widths, initial WCAG and best-practice checks at two widths, plus real fixture workflows for all 15 tools, native text extraction, search and 404 recovery. API uploads are monitored; no real user documents are used.
- `production-http-audit.json`: sitemap URLs, security headers, custom 404 and disabled/malformed API responses.
- `dependency-audit-production.json`: production-only npm advisory service response.
- `dependency-audit-full.json`: complete response, including the documented Tailwind build-time advisory chain.
- `ui-review-before.json`: retained initial UI findings for comparison.
- `lighthouse-*-local.json`: temporary-cache Google Lighthouse 13.5.0, default mobile simulation against the local production server. These are lab samples; scores vary with conditions. They are neither live Core Web Vitals nor a complete accessibility certification.

Build/regression commands and launch gates are in `../production-readiness-audit-2026-10-07.md`. Credentials, account verification, mailbox delivery, DNS and the actual deployment must be checked independently.
