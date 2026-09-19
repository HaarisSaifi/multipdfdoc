# PaperPulse Permanent Session Memory & Operational Rules

## 1. Project Overview & Identity
- **Name:** PaperPulse (100% In-Browser Private PDF & Document Suite).
- **Core Value Proposition:** All documents process client-side in WebAssembly. Zero server uploads.
- **Hosting Strategy:** Hostinger Shared Hosting (0% CPU / 0% RAM usage). Oracle Cloud is optional for Phase 2 AI OCR.
- **Monetization Target:** Google AdSense Tier-1 (US, UK, CA, AU) with high CPC ($18 - $45+).

## 2. Session Resume Directive (When user says "shuru ho jao"):
- Give a warm, concise recap of the previous chat.
- Deliver the full, detailed answer about **Oracle Cloud (12GB/24GB RAM, 200GB storage) + GitHub Pre-Trained Handwriting OCR Models (TrOCR, PaddleOCR, Surya)** vs Gemini API.
- Provide status on completed tools vs upcoming roadmap, then proceed to build.

## 3. Design System: Soft 3D Claymorphic Light Mode
- **Master PRD:** [design.prd](file:///d:/adsense/design.prd).
- **Theme:** Soft porcelain canvas (`#F8FAFC`), crisp white `.bubble-card` surfaces with soft ambient drop-shadows and subtle inset highlights (`inset 0 1px 1px #FFFFFF`).
- **Navbar / Header:** Floating wide capsule (`max-w-[1520px]`, `h-14 sm:h-16`, `bg-white/95 shadow-clay-nav`). All navigation links, labels, and badges MUST use `whitespace-nowrap`. Multi-line wrapping is strictly forbidden.
- **Buttons & Accents:** Tactile `.bubble-btn-primary` (deep obsidian slate `#0F172A`), `.bubble-btn-accent` (vibrant violet `#7C3AED`), `.bubble-btn-success` (emerald `#059669`).

## 4. Completed Tools vs Upcoming Roadmap:
- **Completed (16/16 routes):** `/`, `/pdf/merge`, `/pdf/split`, `/pdf/compress`, `/pdf/to-image`, `/pdf/from-image`, `/pdf/organize`, and legal suite (`/privacy-policy`, `/terms`, `/about`, `/contact`, `/sitemap.xml`, `/robots.txt`).
- **Upcoming Roadmap:**
  - Suite 1: Free Invoice Generator (`/invoice`), Expense Receipt Maker (`/receipt`), Document Signer & Watermark (`/pdf/sign`, `/pdf/watermark`).
  - Suite 2: Final Exam Target Grade Calculator (`/calc/final-grade`), Weighted GPA Converter (`/calc/gpa`), Words to Pages Timer (`/calc/words-to-pages`).
  - Dual-Engine OCR: `/pdf/to-text` (Tesseract WASM + Gemini AI Deep Scan).
