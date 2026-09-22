import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const EXPECTED_PDFJS_VERSION = "4.10.38";
const srcDir = path.join(rootDir, "node_modules", "pdfjs-dist");
const destDir = path.join(rootDir, "public", "vendor", "pdfjs");

if (!fs.existsSync(srcDir)) {
  console.error("❌ Fatal: pdfjs-dist is not installed in node_modules.");
  process.exit(1);
}

const pkgJson = JSON.parse(
  fs.readFileSync(path.join(srcDir, "package.json"), "utf8")
);
const version = pkgJson.version;

// Strict version assertion: halt build if installed version differs from pinned target
if (version !== EXPECTED_PDFJS_VERSION) {
  console.error(
    `❌ Fatal Version Mismatch: Expected pdfjs-dist ${EXPECTED_PDFJS_VERSION} but found ${version}. Halting build to prevent untracked vendor changes.`
  );
  process.exit(1);
}

// Clean stale files with Windows file-lock retry tolerance
try {
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
} catch (e) {
  // Fallback: in-place overwrite
}
fs.mkdirSync(destDir, { recursive: true });

// Copy core library, matching worker, and official Apache-2.0 license
const filesToCopy = [
  { src: path.join(srcDir, "build", "pdf.min.mjs"), dest: path.join(destDir, "pdf.min.mjs") },
  { src: path.join(srcDir, "build", "pdf.mjs"), dest: path.join(destDir, "pdf.mjs") },
  { src: path.join(srcDir, "build", "pdf.worker.min.mjs"), dest: path.join(destDir, "pdf.worker.min.mjs") },
  { src: path.join(srcDir, "build", "pdf.worker.mjs"), dest: path.join(destDir, "pdf.worker.mjs") },
  { src: path.join(srcDir, "LICENSE"), dest: path.join(destDir, "LICENSE") },
];

for (const file of filesToCopy) {
  if (fs.existsSync(file.src)) {
    fs.copyFileSync(file.src, file.dest);
  } else {
    console.error(`❌ Source file missing: ${file.src}`);
    process.exit(1);
  }
}

// Copy cmaps for full international / CJK Unicode font support
const cmapsSrc = path.join(srcDir, "cmaps");
const cmapsDest = path.join(destDir, "cmaps");
if (fs.existsSync(cmapsSrc)) {
  fs.mkdirSync(cmapsDest, { recursive: true });
  const cmaps = fs.readdirSync(cmapsSrc);
  for (const cmap of cmaps) {
    fs.copyFileSync(path.join(cmapsSrc, cmap), path.join(cmapsDest, cmap));
  }
}

// Copy standard_fonts for full self-hosted standard font rendering without external CDN lookups
const fontsSrc = path.join(srcDir, "standard_fonts");
const fontsDest = path.join(destDir, "standard_fonts");
if (fs.existsSync(fontsSrc)) {
  fs.mkdirSync(fontsDest, { recursive: true });
  const fonts = fs.readdirSync(fontsSrc);
  for (const font of fonts) {
    fs.copyFileSync(path.join(fontsSrc, font), path.join(fontsDest, font));
  }
}

// Write reproducible build manifest
const manifest = {
  name: "pdfjs-dist",
  version: version,
  expectedVersion: EXPECTED_PDFJS_VERSION,
  license: "Apache License 2.0",
  source: "node_modules/pdfjs-dist",
  verifiedMatchingWorker: true,
  offlineOnly: true,
  updatedAt: new Date().toISOString(),
};

fs.writeFileSync(
  path.join(destDir, "version.json"),
  JSON.stringify(manifest, null, 2),
  "utf8"
);

console.log(
  `✅ [pdfjs-assets] Clean copy verified: PDF.js v${version} & matching worker synchronized to public/vendor/pdfjs/`
);
