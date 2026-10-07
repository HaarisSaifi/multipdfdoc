# Legacy OCR prototype — disabled

This historical FastAPI/PaddleOCR/TrOCR prototype is not used by the current Next.js website. The browser defaults to local PDF.js/Tesseract processing; the optional Next route uses Gemini only when explicitly enabled and reviewed.

The prototype and deploy script now stop by default unless `ENABLE_LEGACY_OCR_BACKEND=true` is explicitly set. That flag is not a security certification. Do not include this directory in the website deployment.

Before any independent revival, replace the unauthenticated endpoint design, add authentication and distributed quotas, bound decoded body bytes and image dimensions, limit inference concurrency and duration, remove fabricated confidence defaults, pin/audit Python/model dependencies, review provider/model licenses, and test the exact model versions on the target hardware. The previous RAM, confidence and availability claims were not validated by this website audit.

No VM, model download, service deployment or anti-idle job was run during the current audit. The included deployment commands are historical material and require a separate infrastructure review before use.
