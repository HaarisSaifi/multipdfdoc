# MultiPDF Doc

Private document utilities at https://multipdfdoc.com. The Next.js app has fifteen tools and four practical articles. Core document processing runs in the browser. Optional Cloud OCR uploads a selected file only after consent and is disabled by default.

## Run and verify

```powershell
npm ci
npm run dev
npm run build
npm run start
node scripts/test-production.cjs
node scratch/test-core-invariants.js
# With the production server running and Chrome installed:
node scripts/test-http.mjs
npm run test:browser
```

The browser suite uses axe-core and a separate headless Chrome profile; set `CHROME_PATH` if needed.

Use a supported Node.js LTS release (this audit used Node 22). Copy `.env.example` to `.env.local` and configure only the services you intend to operate. Never commit API keys. The contact API needs a verified email sender and Redis in production. Local PDF tools do not require those services.

## Architecture

- Next.js 15.5.27 / React 19 / TypeScript / Tailwind 3; bright soft claymorphism.
- pdf-lib for document composition; QPDF WebAssembly through pdfstudio for AES-256 protection and structural compression.
- Locally hosted PDF.js 4.10.38 with its matching worker and font/cmap assets. Engines load on demand.
- Tesseract.js local English OCR for scanned pages and images; engine/language downloads may be needed on first use.
- Server-rendered editorial guides and native FAQ disclosures; original articles disclose AI assistance.
- `/api/contact` confirms email-provider acceptance. `/api/ocr` is bounded, rate-limited and opt-in.
- Ads are off by default. A valid publisher ID creates verification metadata and `/ads.txt`; it does not alone activate ads or prove approval.

## Release status

The current audited release and remaining owner/deployment requirements are recorded in [the production readiness audit](docs/production-readiness-audit-2026-10-07.md). [propermonth.md](propermonth.md) contains the measured 30-day growth plan. Older brainstorming and checkpoint documents describe historical plans, not verified current behavior.

Production dependencies currently have no npm advisories. Five advisory entries remain in the Tailwind build-time dependency tree; see [the security assessment](docs/security-audit-exceptions.md). A build pass does not certify arbitrary PDFs, every device, provider configuration or AdSense acceptance.

`oracle-backend/` is a disabled, unused prototype. It is not called by the current website and must not be deployed as part of this release. See its README.
