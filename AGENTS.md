# 🤖 Antigravity Agent Directives & Session Context
### *MultiPDF Doc (multipdfdoc.com): 100% Private In-Browser Document Suite*
*Last Checkpointed: 2026-09-19 15:20 IST | Status: MultiPDF Doc Production Build*

---

## 🚨 MANDATORY AGENT BEHAVIORS & PROTOCOLS

1. **AUTOMATIC CONTEXT RESTORATION:**
   - Always read [brain.md](file:///d:/adsense/brain.md) and [design.prd](file:///d:/adsense/design.prd) at the start of any conversation or task.
   - Do NOT ask the user what the project is or reinvent the theme. The project is **MultiPDF Doc** (`https://multipdfdoc.com`), a client-side private document and utility suite.

2. **SESSION RESUME PROTOCOL (WHEN USER SAYS "SHURU HO JAO"):**
   - Give a warm, clear recap of the previous session.
   - Answer the user's question regarding **Oracle Cloud 12GB/24GB RAM + GitHub pre-trained handwriting OCR models (PaddleOCR, TrOCR, Surya vs Gemini Flash API)** in detail.
   - Detail what is completed vs what is upcoming, and prompt to execute the next tool (Invoice Generator `/invoice`, Receipt Maker `/receipt`, or Academic Calculators).

3. **MANDATORY DESIGN SYSTEM (LIGHT THEME SOFT CLAYMORPHISM):**
   - **Source of Truth:** [design.prd](file:///d:/adsense/design.prd).
   - **Theme:** Clean, bright, soft claymorphic light mode. NO dark mode relics.
   - **Header / Navbar:** Ultra-wide floating capsule (`max-w-[1520px]`, `h-14 sm:h-16`, `bg-white/95 shadow-clay-nav`).
   - **Strict Single-Line Text:** ALL navigation links, labels, and badges MUST use `whitespace-nowrap`. Multi-line wrapping in the header is strictly forbidden.
   - **Tactile Cards:** Pure white `.bubble-card` with soft clay drop shadow and crisp inset top highlight (`inset 0 1px 1px #FFFFFF`).

4. **STRICT ZERO-UPLOAD / PRIVACY LAW:**
   - Core tools MUST execute 100% client-side inside the user's browser using `pdf-lib`, WebAssembly, or HTML5 Canvas.
   - Zero CPU and 0% RAM usage on Hostinger shared hosting.

5. **ADSENSE APPROVAL PROTECTION ("VALUE WRAPPER"):**
   - Every tool page MUST include `<ValueWrapper />` containing 700+ words of peer-reviewed procedural guides, security specifications, and structured `FAQPage` JSON-LD schema.
   - All ad placements MUST use `<AdPlaceholder />` with a 30px safety margin to avoid accidental clicks and zero CLS.

6. **CRITICAL TOOL EXECUTION RULE:**
   - NEVER trigger or launch `browser_subagent` unless the user explicitly commands it.
   - Verify server status and web endpoints using PowerShell commands (`curl`, `Invoke-WebRequest`) or dev server logs.

---

## 📂 CORE DIRECTORY & ROUTE MAP

### 📄 PDF Utilities
- `/pdf/merge` -> [src/app/pdf/merge/page.tsx](file:///d:/adsense/src/app/pdf/merge/page.tsx) (Client-side drag-and-drop PDF combiner)
- `/pdf/split` -> [src/app/pdf/split/page.tsx](file:///d:/adsense/src/app/pdf/split/page.tsx) (Page range / chapter extractor)
- `/pdf/compress` -> [src/app/pdf/compress/page.tsx](file:///d:/adsense/src/app/pdf/compress/page.tsx) (100KB, 200KB USCIS, 500KB target size compressor)
- `/pdf/to-image` -> [src/app/pdf/to-image/page.tsx](file:///d:/adsense/src/app/pdf/to-image/page.tsx) (300 DPI / 150 DPI canvas image renderer)
- `/pdf/from-image` -> [src/app/pdf/from-image/page.tsx](file:///d:/adsense/src/app/pdf/from-image/page.tsx) (Multi-image photo/receipt to PDF builder)
- `/pdf/organize` -> [src/app/pdf/organize/page.tsx](file:///d:/adsense/src/app/pdf/organize/page.tsx) (3D card page rotator 90°/180°, reorder, delete)
- `/pdf/protect` -> [src/app/pdf/protect/page.tsx](file:///d:/adsense/src/app/pdf/protect/page.tsx) (128/256-bit password encryption)
- `/pdf/unlock` -> [src/app/pdf/unlock/page.tsx](file:///d:/adsense/src/app/pdf/unlock/page.tsx) (Client-side permission and password removal)
- `/pdf/page-numbers` -> [src/app/pdf/page-numbers/page.tsx](file:///d:/adsense/src/app/pdf/page-numbers/page.tsx) (Bates numbering & header/footer pagination)
- `/pdf/to-text` -> [src/app/pdf/to-text/page.tsx](file:///d:/adsense/src/app/pdf/to-text/page.tsx) (Dual-Engine in-browser & AI neural OCR text extractor)

### ☁️ Oracle Cloud Backend Suite
- `oracle-backend/` -> FastAPI service with PaddleOCR, TrOCR, and automated `deploy.sh` script for 24GB RAM VM.

### 💼 High-CPC Business Suite
- `/invoice` -> [src/app/invoice/page.tsx](file:///d:/adsense/src/app/invoice/page.tsx) (Free invoice generator without watermark, multi-currency, tax calc)
- `/receipt` -> [src/app/receipt/page.tsx](file:///d:/adsense/src/app/receipt/page.tsx) (Expense reimbursement receipt maker)

### 🎓 US High-Volume Academic Calculators
- `/calc/final-grade` -> [src/app/calc/final-grade/page.tsx](file:///d:/adsense/src/app/calc/final-grade/page.tsx) (Target grade calculator with Panic/Chill gauge)
- `/calc/gpa` -> [src/app/calc/gpa/page.tsx](file:///d:/adsense/src/app/calc/gpa/page.tsx) (Weighted to unweighted GPA converter with US admissions match)
- `/calc/words-to-pages` -> [src/app/calc/words-to-pages/page.tsx](file:///d:/adsense/src/app/calc/words-to-pages/page.tsx) (Words to pages & speech delivery timer)

### 🏛️ Trust & Legal
- `/` -> [src/app/page.tsx](file:///d:/adsense/src/app/page.tsx) (Master Clay Bento Launchpad + Comparison Table + FAQ)
- `/privacy-policy`, `/terms`, `/about`, `/contact`, `/sitemap.xml`, `/robots.txt`

---

## 🛠️ ENVIRONMENT & BUILD COMMANDS
- Working Directory: `d:\adsense`
- Dev Server: `npm run dev` (Runs on `http://localhost:3000`)
- Production Build: `npm run build` (Pre-renders all 25 static routes cleanly with exit code 0)
