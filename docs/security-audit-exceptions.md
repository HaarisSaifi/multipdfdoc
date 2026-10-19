# Dependency security assessment

Audit date: October 7, 2026. Next.js is pinned to 15.5.27. Its PostCSS is overridden to 8.5.29 and postcss-selector-parser to 7.1.6. The production build and regression suite verify compatibility with these changes.

`npm audit --omit=dev` currently reports **0 advisories**. The full audit reports **5 high entries**: braces and its affected Tailwind build-time dependency chain (chokidar, micromatch, fast-glob and tailwindcss). These are multiple dependency entries for a shared underlying advisory, not five independent application vulnerabilities.

The remaining issue is [GHSA-vfj7-8cjw-p6xm / CVE-2026-93687](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): deeply nested untrusted brace patterns can exhaust the call stack. The advisory lists braces <=3.0.3 as affected and no patched version at the audit date.

## Application-specific reachability assessment

Tailwind uses repository-authored content globs during development/build. The API routes do not accept glob patterns, invoke Tailwind, or run brace expansion on submitted files. The residual tree is a development/build dependency; the production-only npm audit does not include it. This is a scope assessment, not a claim that vulnerable code is safe for arbitrary callers.

Build only reviewed repository inputs in isolated CI. Never expose a build service that accepts arbitrary pattern/configuration input. Treat contributions changing globs or build configuration as executable code requiring review.

A Tailwind 4 migration is the npm suggested major upgrade. It needs dedicated CSS, plugin and all-page visual compatibility verification; blindly forcing it during this release would trade a bounded build-time exception for unreviewed UI behavior. Re-check this advisory before release and schedule the migration or a maintained upstream fix. No unsupported fake patched version or local node_modules edit was applied.

The earlier PostCSS exception document is superseded: those affected dependencies were upgraded rather than leaving the old exception in place. Audit counts are time-specific and do not certify all package behavior or future releases.

## Static release scope

The Hostinger Premium release exports public HTML/JS/WASM files. Next.js is a build dependency on the developer machine, not a runtime on Hostinger. Cloud OCR/contact API routes and their rate-limit/body helpers were removed. No server secrets are required by the export. Browser library behavior still requires testing; static hosting does not make client-side security issues disappear. The existing Tailwind build-input exception remains applicable to trusted local/CI builds.
