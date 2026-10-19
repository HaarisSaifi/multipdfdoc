# Cloud OCR removed from the static release

October 7, 2026: the budget-constrained Hostinger Premium release removes Cloud OCR, its API route, credentials, provider calls and consent controls. Local PDF.js/Tesseract.js extraction remains. There is no Redis or paid model requirement.

Older server/API reports are historical. Do not enable a stale feature flag or upload the legacy backend. Reintroducing any external document processing would require a new architecture, account/terms review, real consent disclosures and security validation; it is outside this static release.

See `hostinger-static-deployment.md`, `static-release-plan-2026-10-07.md` and the local OCR worker code. Browser fixtures monitor uploads and external requests; actual devices and production resource responses need live testing.
