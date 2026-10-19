# Security Policy

MultiPDF Doc is built on a **Zero-Knowledge, Client-Side Architecture**. We treat document confidentiality and cryptographic security as core invariants.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security & Privacy Model

MultiPDF Doc executes all standard document processing operations inside the user's browser using JavaScript and WebAssembly (WASM):
- **Zero Server Uploads:** Your PDF, image, and text files are processed in local volatile RAM and are never uploaded to any remote server or persistent storage.
- **Cryptographic Encryption:** When using the [Password Protect Tool](https://multipdfdoc.com/pdf/protect), encryption is performed locally via QPDF WebAssembly using industry-standard 256-bit AES algorithms. Passwords never travel across the internet.
- **Local OCR:** Text recognition on scanned pages utilizes Tesseract.js WebAssembly models loaded locally within a Web Worker.

## Reporting a Vulnerability

If you discover a potential security vulnerability, memory leak, or data handling concern in MultiPDF Doc:

1. **Do not disclose the issue publicly** (via GitHub Issues or social media).
2. Email full technical details and reproduction steps to **[support@multipdfdoc.com](mailto:support@multipdfdoc.com)**.
3. Include information on the affected browser, operating system, and file fixtures used.

We will acknowledge receipt within 48 hours and work with you on timely mitigation.

For full details on data collection and user rights, please consult our [Privacy Policy](https://multipdfdoc.com/privacy-policy) and [Editorial Policy](https://multipdfdoc.com/editorial-policy).
