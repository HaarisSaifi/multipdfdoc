# Optional Cloud OCR: deployment contract

Updated October 7, 2026. Actual implementation: `src/app/api/ocr/route.ts` and `src/lib/security/`.

Cloud OCR is disabled unless `CLOUD_OCR_ENABLED=true`. The client option separately requires `NEXT_PUBLIC_CLOUD_OCR_ENABLED=true`. Before enabling, review the current [Gemini API terms](https://ai.google.dev/gemini-api/terms), paid/unpaid data handling, audience/age restrictions, regional eligibility, provider billing and privacy disclosures. Do not submit sensitive information to unpaid services. Local extraction remains available.

## Enforced boundaries

- Multipart body: actual stream bytes bounded to 4 MiB plus 8 KiB envelope; file itself at most 4 MiB. A dishonest or absent length header does not bypass the bound.
- PDF/PNG/JPEG/WebP signatures and declared MIME are checked. PDFs must parse, be unencrypted and have at most twenty pages. Signatures are format checks, not malware certifications.
- Malformed multipart bodies return 400. Unsupported content types return 415. Foreign Origin headers return 403.
- Production requires Redis. No legacy environment flag can enable a production in-memory bypass. Unavailable or malformed Redis responses fail closed.
- Quotas: five hourly and twenty daily requests per identity, five hundred daily per scope globally. Each bucket increment and expiry uses an atomic Redis script. Raw IP addresses are not stored as bucket keys; hashes are still pseudonymous identifiers, not guaranteed anonymous data.
- Trust only a proxy-overwritten ingress header. Vercel selects `x-vercel-forwarded-for`; other hosting requires a verified `TRUSTED_IP_HEADER`. Unknown identities share a conservative bucket. Never expose the origin directly while trusting a user-settable header.
- Provider credentials are sent in a header, never a query URL. Model name is validated. The upstream failover pool shares a total twenty-second deadline, including response body parsing. This is an upstream deadline, not a guarantee for the full client upload time.
- Empty or token-truncated results return 502. Transcriptions need comparison with originals. Telemetry logs omit text, filenames and credentials.

## What the code cannot establish

An in-memory server handler does not establish zero provider retention, absence of platform logs, contractual compliance or a certified health-data workflow. The operator must verify the actual provider account and hosting configuration. Enabling a feature flag is not a substitute for those checks. Browser consent uses a native modal with a local alternative.

The contact API separately validates bounded JSON, requires a verified Resend sender and production Redis, and reports success only after the provider returns a delivery identifier. An accepted message is not a guarantee of inbox delivery. Confirm the support mailbox manually.

Regression checks are in `scripts/test-production.cjs`; they execute real route handlers with safe fixtures and mocked external providers. No real document or email was sent during these tests.
