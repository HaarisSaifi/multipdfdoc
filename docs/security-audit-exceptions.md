# 🛡️ Security Audit Exception & Risk Assessment: PostCSS (via Next.js)

**Assessment Date:** 2026-09-22  
**Target Component:** `node_modules/next/node_modules/postcss`  
**Current Audit State:** 2 vulnerabilities (1 moderate, 1 high)  
**Parent Framework:** `next@15.5.25`

---

## 1. Exact Security Advisories
1. **GHSA-qx2v-qp2m-jg93 (High Severity):**  
   PostCSS unescaped `</style>` tags in CSS stringify output leading to potential cross-site scripting if untrusted user input is passed directly through a server-side CSS preprocessor stringifier.
2. **GHSA-6g55-p6wh-862q / GHSA-r28c-9q8g-f849 (Moderate Severity):**  
   PostCSS path traversal / arbitrary file disclosure via attacker-controlled `sourceMappingURL` comments when processing untrusted CSS with `from` unset during source map auto-loading.

---

## 2. Root Cause Analysis
These advisories originate within `next@15.5.25`'s internal transitive dependency tree (`node_modules/next/node_modules/postcss`), which bundles PostCSS `<= 8.5.22`. Next.js 15 uses PostCSS for compile-time Tailwind CSS processing during the `next build` step.

---

## 3. Exploitability & Reachability Analysis in MultiPDF Doc

| Vector | MultiPDF Doc Implementation | Reachable / Vulnerable? |
|---|---|---|
| **Attacker-Controlled CSS Processing** | MultiPDF Doc is a client-side document processing suite. It does **NOT** accept, compile, or process user-uploaded CSS files on the server at any point. All CSS is static and authored internally. | **NO (Unreachable)** |
| **Server-Side CSS Stringification** | Next.js server-side routes (`/api/contact`, `/api/ocr`) only process JSON / FormData payloads. No server endpoint invokes PostCSS stringification on user input. | **NO (Unreachable)** |
| **Untrusted `sourceMappingURL` Parsing** | Production builds compile static CSS with standard Tailwind source maps. Source map resolution is strictly build-time, not dynamic runtime. | **NO (Unreachable)** |

**Conclusion:** The vulnerabilities reside strictly in code paths dealing with server-side processing of untrusted CSS inputs. Because MultiPDF Doc never exposes PostCSS to user input at runtime, this issue is **completely unreachable in production runtime**.

---

## 4. Remediation & Upgrade Path
- Running `npm audit fix --force` attempts to install `next@16.3.5`, which is a breaking major release with breaking changes to React 19 / App Router primitives.
- Overriding Next.js internal PostCSS with a forced `resolutions` or `overrides` block risks breaking Next.js compile-time CSS extraction.
- **Recommended Action:** Preserve pinned, stable `next@15.5.25` for current production deployment. Plan formal migration to Next.js 16 after comprehensive compatibility testing of all 32 routes.
