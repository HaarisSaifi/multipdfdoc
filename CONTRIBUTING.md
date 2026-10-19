# Contributing to MultiPDF Doc

Thank you for your interest in contributing to **MultiPDF Doc** ([https://multipdfdoc.com](https://multipdfdoc.com))!

MultiPDF Doc is an open-source, 100% client-side document utility suite. We welcome contributions that improve tool performance, enhance privacy guarantees, expand accessibility, and fix bugs.

## Core Architectural Invariants

Before submitting a Pull Request, please ensure your changes uphold our core invariants:

1. **Zero Server Uploads:** All document processing logic must remain client-side (using `pdf-lib`, WebAssembly, HTML5 Canvas, or Web Workers). No confidential document bytes may be transmitted to external servers.
2. **Light Soft Claymorphism Design:** All UI components must adhere to the design system specified in [design.prd](design.prd). No dark mode relics or jarring high-contrast borders.
3. **Graceful Error Handling:** Never use native browser `alert(...)` or `confirm(...)`. Display descriptive inline error messages.
4. **Static Pre-Rendering:** The application must build cleanly via `npm run build` as a static export (`out/`).

## Local Development Workflow

1. **Fork and Clone the Repository:**
   ```bash
   git clone https://github.com/<your-username>/multipdfdoc.git
   cd multipdfdoc
   ```

2. **Install Dependencies:**
   ```bash
   npm ci
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```

4. **Run Tests & Verify Invariants:**
   ```bash
   npm test
   npm run build
   ```

## Pull Request Guidelines

- Create a feature branch with a descriptive name (`git checkout -b feat/enhance-pdf-split`).
- Ensure all tests pass with exit code 0.
- Submit a Pull Request targeting the `main` branch with a clear summary of your changes.

For questions, reach out to **[support@multipdfdoc.com](mailto:support@multipdfdoc.com)**.
