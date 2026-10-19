# Open-source engine selection

Reviewed October 7, 2026. Use tested established libraries already in the project rather than installing unrelated high-star repositories. Stars indicate attention, not file compatibility, absence of vulnerabilities or guaranteed OCR accuracy.

| Engine | Primary project | Role and reason |
| --- | --- | --- |
| PDF.js | https://github.com/mozilla/pdf.js | Read native text and render scans/images with a matching self-hosted worker. |
| pdf-lib | https://github.com/Hopding/pdf-lib | Compose, merge, split, paginate and export browser PDFs; encrypted PDFs use QPDF instead. |
| QPDF | https://github.com/qpdf/qpdf | Real encryption/decryption and structural compression, through the installed pdfstudio WASM toolkit. Encryption output is tested for AES-256 and wrong-password rejection. |
| Tesseract.js | https://github.com/naptha/tesseract.js | Local worker OCR; 7.0.0 and pinned English data are served from our own website. Digital PDFs are rendered with PDF.js before scanned-page recognition. |
| JSZip | https://github.com/Stuk/jszip | Existing dependency for ZIP image exports and the public-only hosting package. |
| axe-core | https://github.com/dequelabs/axe-core | Development accessibility checks on real rendered page and workflow states. Automated results do not establish complete accessibility. |

Source paths, package versions and English-data SHA-256 are recorded in `public/vendor/ocr/lang/source.json`. The asset-copy scripts refuse an unreviewed OCR version mismatch. Library license notices ship with the exported assets. OCR model resources may be cached; selected documents are not intentionally stored in that language cache.

A second OCR framework or AI model would increase download size and compatibility obligations without evidence that this release needs it. Keep the native-text path fast, load OCR only for scans, allow full-page recognition for mixed content, and verify output against the source. There is no claim that a popular repository makes every input work.
