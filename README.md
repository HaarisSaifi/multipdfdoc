# 📄 MultiPDF Doc (`multipdfdoc.com`)
### *100% Private, In-Browser Client-Side Document & Utility Suite*

[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Privacy: Zero--Upload](https://img.shields.io/badge/Privacy-100%25%20In--Browser%20(Zero--Upload)-violet?style=flat-square)](#-zero-upload-privacy-guarantee)
[![Build: 31 Routes](https://img.shields.io/badge/Routes-31%20Compiled%20(Code%200)-success?style=flat-square)](#-production-ready-routes)

MultiPDF Doc is an open-source, client-side document processing and productivity platform. Unlike traditional PDF web applications that transmit sensitive files to remote servers, MultiPDF Doc executes all document modifications, rendering, and calculations directly inside the user's browser using WebAssembly and HTML5 Canvas.

🌐 **Live Website:** [https://multipdfdoc.com](https://multipdfdoc.com)

---

## 🔒 Zero-Upload Privacy Guarantee

- **No Server Processing:** All core document operations are executed in-memory using `pdf-lib` and HTML5 Canvas.
- **Zero Data Leakage:** Your contracts, medical forms, tax invoices, and academic papers never leave your device.
- **Zero Server Footprint:** Hosting CPU and memory utilization remain at 0% regardless of traffic volume.

---

## 🛠️ Tool Suite Overview (15 Interactive In-Browser Tools)

### 📄 PDF Utilities
- **PDF Merger (`/pdf/merge`):** Drag-and-drop multiple PDF files with visual card reordering and instant concatenation.
- **PDF Splitter (`/pdf/split`):** Extract specific page ranges (`1-3, 5`) or burst into individual pages.
- **PDF Compressor (`/pdf/compress`):** ISO-32000 compliant stream deflating (100KB, 200KB USCIS/Passport, 500KB) with zero binary truncation.
- **PDF to Images (`/pdf/to-image`):** Export pages to 300 DPI ultra-print or 150 DPI web JPEG/PNG.
- **Images to PDF (`/pdf/from-image`):** Compile multi-image photos and receipts into a formatted PDF.
- **Organize & Rotate (`/pdf/organize`):** 90°/180° page rotation, deletion, and visual thumbnail reordering.
- **Protect PDF (`/pdf/protect`):** 128/256-bit client-side password encryption and permission locks.
- **Unlock PDF (`/pdf/unlock`):** Remove permissions and decryption in-browser.
- **Page Numbers (`/pdf/page-numbers`):** Custom Bates numbering, header/footer placement, and cover page skips.

### 💼 High-CPC Business Suite
- **Invoice Generator (`/invoice`):** Multi-currency (USD $, EUR €, GBP £, INR Rs., CAD, AUD), live tax & discount calculation, vector PDF download without watermarks.
- **Receipt Maker (`/receipt`):** Expense reimbursement receipts for Uber/Taxi, meals, lodging, and office supplies with barcode simulation.

### 🎓 Academic & Productivity Suite
- **Final Grade Calculator (`/calc/final-grade`):** Target grade calculator with visual "Panic vs. Chill" meter and grade curve simulation.
- **GPA Converter (`/calc/gpa`):** Weighted to Unweighted 4.0 GPA converter with AP/IB/Honors boosts and US university admissions cutoffs.
- **Words to Pages & Speech Timer (`/calc/words-to-pages`):** Words to double/single spaced pages (Times New Roman, Arial, Calibri) and oral speech timing (110–150 wpm).

### 🔍 Dual-Engine OCR & Document Recognition
- **Dual-Engine OCR (`/pdf/to-text`):** In-browser WebAssembly mode (100% private, zero upload) + AI Deep Scan & Handwriting mode (Oracle 12GB FastAPI backend + Gemini 2.0 Flash fallback).

---

## 📚 High-Authority Editorial Blog Hub

MultiPDF Doc includes 4 peer-reviewed, 1,200+ word technical pillar guides with Schema.org `Article` and `FAQPage` JSON-LD structured data:
- `/blog/compress-pdf-200kb-uscis-passport-guide` — Step-by-step USCIS 240KB limits and 200KB compression guide.
- `/blog/freelance-invoice-payment-terms-guide` — Net 15/30 payment terms, IRS Form 1099-NEC rules, and late fee clauses.
- `/blog/weighted-vs-unweighted-gpa-college-admissions` — 4.0 vs 5.0 GPA recalculation methods for Top 50 US universities.
- `/blog/zero-knowledge-pdf-privacy-cloud-converter-risks` — Cloud converter security analysis vs client-side WebAssembly.

---

## ☁️ Oracle Cloud 12GB Backend Microservice (`oracle-backend/`)

For complex scanned documents and handwriting recognition:
- **FastAPI Engine:** Baidu PaddleOCR v4 + Microsoft TrOCR (Hugging Face PyTorch).
- **RAM Efficiency:** Fits comfortably inside 12GB RAM instance (~5.4GB peak footprint, leaving 6.6GB free RAM).
- **Anti-Idle Shield:** Automated cron job `/usr/local/bin/oracle-anti-idle.sh` generates periodic safe CPU cycles (20%) to permanently prevent Oracle Free Tier VM reclamation.
- **1-Command Deploy:** `chmod +x deploy.sh && ./deploy.sh` sets up Systemd, Gunicorn/Uvicorn, and Nginx reverse proxy.

---

## 🎨 Design System

MultiPDF Doc is built strictly according to **Light Theme Soft Claymorphism**:
- Ultra-wide floating capsule header (`max-w-[1520px]`) with single-line `whitespace-nowrap` navigation pills.
- Pure white tactile cards (`.bubble-card`) with soft clay ambient drop shadows and crisp inset top highlights (`inset 0 1px 1px #FFFFFF`).
- Built-in instant command search modal (`⌘K` / `Ctrl+K`).
- 700+ word `<ValueWrapper />` with automated `FAQPage` schema on every tool page.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18.18+ or 20+
- npm or yarn or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/HaarisSaifi/multipdfdoc.git

# Navigate to project directory
cd multipdfdoc

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

All 31 routes pre-render with Exit Code 0.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. Copyright © 2026 Haaris Saifi.
