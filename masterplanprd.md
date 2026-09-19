# 📜 MASTER PRODUCT REQUIREMENTS DOCUMENT (PRD)
### *PaperPulse: Next-Generation 100% In-Browser Private PDF & Document Suite*
**Context Hub & Persistent Memory:** Linked to [brain.md](file:///d:/adsense/brain.md) | [design.prd](file:///d:/adsense/design.prd) | **Version:** 2.6.0

---

## 1. PRODUCT VISION & STRATEGIC POSITIONING

Transform the outdated, privacy-invasive online PDF ecosystem into a **blazing-fast, client-side private document suite** governed by the **Soft 3D Claymorphism Light Theme** ([design.prd](file:///d:/adsense/design.prd)).

### 🎯 Primary Objectives:
1. **AdSense First-Pass Approval Guarantee:** Zero risk of "Low Value Content" rejections by embedding our proprietary **"Value Wrapper"** architecture (700+ words of procedural documentation, step-by-step guides, stream compression mathematics, and dynamic `FAQPage` JSON-LD schema per tool).
2. **Tier-1 CPC Domination ($18–$35+):** Target US, UK, Canada, and Australia business, legal, accounting, and student traffic seeking private, secure document handling.
3. **Zero Server Load & Zero Hosting Cost:** All document processing runs 100% client-side via WebAssembly (`pdf-lib`) and HTML5 Canvas inside the visitor's browser. Hostinger shared hosting CPU and RAM usage remains at **0%**, eliminating server crashes even during 100k+ viral traffic spikes.
4. **Zero-Upload Privacy USP:** Unlike Adobe Acrobat, SmallPDF, or iLovePDF, files never leave the client's device. Compliant with HIPAA, GDPR, and CCPA standards out of the box.

---

## 2. DESIGN SYSTEM: SOFT 3D CLAYMORPHISM LIGHT THEME
*Documented completely in [design.prd](file:///d:/adsense/design.prd)*

- **Background Canvas:** Soft porcelain canvas (`#F8FAFC` to `#F1F5F9`) with ethereal ambient radial gradients.
- **Surfaces & Cards:** Crisp white `.bubble-card` with soft clay ambient drop-shadows and subtle inset highlights (`inset 0 1px 1px #FFFFFF`).
- **Floating Header / Navbar:** Floating wide capsule (`max-w-[1520px]`, `h-14 sm:h-16`, `bg-white/95 shadow-clay-nav`).
- **Single-Line Text Rule:** ALL navigation links, labels, and badges MUST use `whitespace-nowrap`. Two-line text wrapping is strictly prohibited.
- **Typography:**
  - Headings: `Plus Jakarta Sans` / `Outfit` / `Inter`, sans-serif (Weights: 600, 700, 800)
  - Body & UI: `Inter`, sans-serif (Weights: 400, 500, 600)
- **Buttons & Accents:**
  - Primary: Deep obsidian slate (`#0F172A`)
  - Accent: Vibrant violet (`#7C3AED` to `#6D28D9`)
  - Success: Emerald (`#059669`)
  - Warning/Action: Rose (`#E11D48`) / Amber (`#D97706`)

---

## 3. LIVE PRODUCT ARSENAL (100% TESTED & COMPILED)

### 📄 Live Phase 1 Suite:
1. **Private PDF Merger** (`/pdf/merge`): Multi-file drag-and-drop, visual page counting, draggable reordering, instant client-side concatenation.
2. **PDF Split & Page Extractor** (`/pdf/split`): Continuous & discontinuous range extraction (`1-3, 5`), instant client-side page isolation.
3. **Target Size PDF Compressor** (`/pdf/compress`): 100KB, 200KB (USCIS/Passport standard), 500KB presets with stream deflating and visual compression ratio calculation.
4. **PDF to High-Res Images** (`/pdf/to-image`): 300 DPI ultra-print / 150 DPI web export into PNG or JPEG format.
5. **Images to Single PDF Compiler** (`/pdf/from-image`): Multi-image photo and receipt compiler with thumbnail sequence reordering.
6. **Rotate & Organize PDF Pages** (`/pdf/organize`): 90°/180° page rotation, deletion, and visual card reordering.

### 🏛️ Trust & Legal Infrastructure:
- `/privacy-policy`: Comprehensive GDPR, California CCPA, and Google DART cookie disclosures highlighting zero-server client storage.
- `/terms`: Clear software terms of service.
- `/about`: E-E-A-T technical editorial board and security mission statement.
- `/contact`: Dedicated developer & support touchpoint.
- `/sitemap.xml` & `/robots.txt`: Automated crawler and indexing configuration.

---

## 4. PHASE 2 EXPANSION ROADMAP

When scaling further, the following high-CPC tools will be implemented strictly adhering to [design.prd](file:///d:/adsense/design.prd):
1. `/pdf/protect`: Client-side AES-128 / AES-256 PDF password encryption.
2. `/pdf/unlock`: Instant client-side password removal with authorized key verification.
3. `/pdf/watermark`: Custom diagonal/header/footer security watermark stamper.
4. `/pdf/page-numbers`: Custom bates numbering and header/footer pagination engine.

---

## 5. ADSENSE COMPLIANCE & REVENUE STRATEGY

1. **E-E-A-T Value Wrappers:** Every single tool has 700+ words of peer-reviewed procedural guides, security specifications, and mathematical formulas directly under the interactive dropzone.
2. **Structured JSON-LD Schema:** Every page automatically renders `FAQPage` and `SoftwareApplication` schema for Google Rich Snippets and AI Overviews.
3. **Anti-Accidental-Click Ad Containers:** `AdPlaceholder.tsx` enforces 30px safety margins from buttons and dropzones, with fixed aspect ratio reservations to eliminate Cumulative Layout Shift (CLS = 0.00).
4. **Hostinger vs Oracle Reality:**
   - Hostinger Shared Hosting ($2.99/mo) is 100% sufficient for PaperPulse because all heavy lifting happens on the user's CPU via WebAssembly.
   - Oracle Cloud is NOT needed for Phase 1. (Oracle rejects RuPay cards; only international credit/debit cards with international billing enabled work).
