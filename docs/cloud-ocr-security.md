# Cloud AI OCR Security & Infrastructure Specifications
*MultiPDF Doc (`multipdfdoc.com`) — Security Architecture Documentation*
*Checkpointed: September 2026 | Version 2.0 Production Hardening*

---

## 1. Executive Summary & Zero-Server First Principle

MultiPDF Doc is architected as an in-browser document processing suite. All primary tools (`/pdf/merge`, `/pdf/split`, `/pdf/compress`, `/pdf/to-image`, `/pdf/from-image`, `/pdf/organize`, `/pdf/protect`, `/pdf/unlock`, `/pdf/page-numbers`) execute **100% client-side** using WebAssembly (`pdfstudio` qpdf v12, Mozilla PDF.js v4.10.38, `pdf-lib`, and Tesseract.js). Documents processed via these tools never leave the user's browser memory.

For advanced Optical Character Recognition (e.g., non-standard handwriting, degraded historical scans, multi-column research papers), MultiPDF Doc provides an optional **Cloud AI Deep Scan** mode powered by Google Gemini Vision API via route handler `/api/ocr`.

This document defines the production security controls, rate limiting, payload validation, and privacy safeguards governing `/api/ocr`.

---

## 2. Request Size Limits & Hosting Provider Hierarchy

### A. Effective Upload Limit
The effective upload limit for Cloud AI OCR is defined as:
$$\text{Effective Limit} = \min(\text{Application Limit (10MB)}, \text{Hosting Provider Request Limit})$$

1. **Application-Level Enforcement:**
   - **Early Header Check:** Inspects `Content-Length` header before parsing multipart form data. Requests exceeding 10MB (+ 8KB multipart boundary margin) are immediately rejected with **HTTP 413 (Payload Too Large)** without consuming server memory.
   - **Post-Parse Verification:** Inspects `file.size` immediately after multipart parsing. The `Content-Length` header is never solely trusted, preventing spoofed header bypasses.
   - **Page Cap:** PDF documents are parsed in memory using `pdf-lib` to inspect the page tree. Documents exceeding **20 pages** are rejected with **HTTP 413**.

2. **Hosting-Provider Limits:**
   - **Vercel Serverless Function:** 4.5MB request body limit on standard tiers.
   - **Cloudflare Workers / Pages:** 100MB body limit.
   - **AWS Lambda / API Gateway:** 6MB synchronous payload limit.
   - *Technical Note on App Router:* Next.js App Router does **not** recognize the legacy Pages Router configuration (`export const config = { api: { bodyParser: ... } }`). Adding such configuration in App Router route handlers is ineffective. Upload ceilings are strictly governed by application stream checks and host-level ingress proxies.

---

## 3. Strict File Magic Bytes & Signature Validation

File extension and declared MIME types are user-controlled strings and cannot be trusted for security gating. The `/api/ocr` endpoint strictly verifies the file's binary magic bytes before passing data to upstream services:

| Format | Magic Bytes (Hex) | ASCII / Signature | Gating Status |
| :--- | :--- | :--- | :--- |
| **PDF** | `25 50 44 46` | `%PDF` | Accepted (up to 20 pages) |
| **PNG** | `89 50 4E 47 0D 0A 1A 0A` | `\x89PNG\r\n\x1a\n` | Accepted |
| **JPEG** | `FF D8 FF` | `ÿØÿ` | Accepted |
| **WebP** | `52 49 46 46 ... 57 45 42 50` | `RIFF....WEBP` | Accepted |

### MIME Mismatch & Masking Protection
If an uploaded file contains an executable, shell script, or binary payload masquerading as a document (e.g. `malware.exe` renamed to `scan.pdf`), the magic byte validator fails and the route returns **HTTP 415 (Unsupported Media Type)**. Similarly, if the declared MIME conflicts with the detected signature, the request is rejected immediately.

---

## 4. Distributed Rate Limiting & Fail-Closed Policy

To prevent abuse, quota exhaustion, and financial denial-of-service, `/api/ocr` enforces distributed rate limiting:

- **Client Hourly Limit:** Maximum **5 requests / hour** per client IP.
- **Client Daily Limit:** Maximum **20 requests / day** per client IP.
- **Global Daily Safeguard:** Maximum **500 requests / day** across all clients globally.

### Production Fail-Closed Rule
In production (`NODE_ENV === "production"`):
- Rate limiting is backed by an atomic **Upstash Redis pipeline** (`INCR` + `EXPIRE NX`).
- If Redis credentials (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`) are missing, or if the Redis cluster is unreachable, the system **fails closed**:
  - The endpoint returns **HTTP 503 (Service Unavailable)**.
  - The error response directs users to the free, unlimited 100% In-Browser Local Extraction tool.
  - No unguarded calls to the AI provider are permitted.
- In local development and automated CI testing, in-memory rate limiting is permitted only when `ALLOW_IN_MEMORY_RATE_LIMIT=true` or when running outside production.

---

## 5. Documented Trusted-Proxy IP Extraction

Client IP addresses are extracted in [src/lib/security/ip-utils.ts](file:///d:/adsense/src/lib/security/ip-utils.ts) using strict reverse-proxy precedence:

1. **Configured `TRUSTED_IP_HEADER`:** If specified in the environment (e.g., for custom Cloudflare or AWS deployments), this header takes top priority.
2. **`cf-connecting-ip`:** Injected by Cloudflare Edge proxies; cannot be spoofed by downstream clients when proxied through Cloudflare.
3. **`x-vercel-forwarded-for`:** Injected by Vercel edge infrastructure.
4. **`x-real-ip`:** Standard Nginx / AWS Application Load Balancer single-proxy header.
5. **Sanitized `x-forwarded-for`:** The first syntactically valid IPv4 or IPv6 address is selected.
6. **Fallback:** Defaults to `127.0.0.1`.

Blind trust of arbitrary client-sent headers is strictly avoided.

---

## 6. Upstream AI Provider Protection & Timeout

1. **20-Second Upstream Timeout:**
   All calls to the upstream Gemini Vision API use `AbortController` bound to `setTimeout(..., 20000)`. If the upstream provider does not complete transcription within 20 seconds, the abort signal triggers and the route terminates with **HTTP 504 (Gateway Timeout)**.
2. **Key Rotation Pool & Failover:**
   Multiple API keys can be supplied via `GEMINI_API_KEYS` (comma-delimited). If a key encounters rate limits (HTTP 429), the handler fails over to the next key in the pool.
3. **Clean HTTP Status Codes:**
   - `400 Bad Request`: Missing file or malformed request.
   - `413 Payload Too Large`: File > 10MB or PDF > 20 pages.
   - `415 Unsupported Media Type`: Invalid magic bytes, corrupted PDF, or MIME mismatch.
   - `429 Too Many Requests`: Client hourly (5) or daily (20) rate limit exceeded.
   - `502 Bad Gateway`: Upstream provider unreachable or key pool capacity exhausted.
   - `503 Service Unavailable`: Distributed security infrastructure unconfigured or global quota (500) exceeded.
   - `504 Gateway Timeout`: Upstream AI provider timed out (20s cap).

---

## 7. Zero-PII Logging Guarantee

The route handler strictly follows zero-PII logging standards:
- **Never Logged:** Uploaded document binary streams, Base64 chunks, extracted document text, document file names, client IP addresses, or Gemini API keys.
- **Sanitized Telemetry:**
  ```json
  {
    "durationMs": 1420,
    "pageCount": 1,
    "mime": "application/pdf",
    "keyIndex": 1
  }
  ```

---

## 8. Explicit UI Consent Modal

Prior to dispatching any file to `/api/ocr`, the user interface displays a modal requiring explicit confirmation. The modal discloses:
- That the document is being transmitted over HTTPS to our backend and Google Gemini Vision.
- The 10MB and 20-page processing constraints.
- An immediate one-click option to cancel and switch to the **100% In-Browser Local Extraction** tool.

Unverified compliance claims (e.g. "zero retention", "HIPAA certified", "GDPR certified") are strictly excluded from all user-facing copy.

---

## 9. Required Environment Variables

To activate Cloud AI OCR in production, configure the following environment variables:

| Variable | Description | Required in Production |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` or `GEMINI_API_KEYS` | Google Gemini API key(s), comma-separated for rotation pool | **Yes** |
| `GEMINI_MODEL` | Target multimodal model (defaults to `gemini-2.5-flash`) | Optional |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint for distributed rate limiting | **Yes** |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST bearer token | **Yes** |
| `TRUSTED_IP_HEADER` | Hosting provider specific IP header (e.g., `cf-connecting-ip`) | Optional |
| `ALLOW_IN_MEMORY_RATE_LIMIT` | Allow in-memory limiter fallback (test/dev only, must NOT be true in prod) | Test/Dev Only |
