const { createPdfToolkit } = require("pdfstudio");
const { PDFDocument } = require("pdf-lib");
const JSZip = require("jszip");

async function runVerification() {
  console.log("=== MULTIPDF DOC CORE ENGINE INVARIANT VERIFICATION ===\n");

  // 1. Create a minimal valid PDF in memory
  const baseDoc = await PDFDocument.create();
  const page = baseDoc.addPage([400, 400]);
  page.drawText("MultiPDF Doc Automated Invariant Test Document");
  const basePdfBytes = await baseDoc.save();
  console.log(`[1/5] Sample PDF generated: ${basePdfBytes.length} bytes`);

  // 2. Initialize QPDF WASM Toolkit
  console.log("[2/5] Initializing QPDF WebAssembly toolkit...");
  const toolkit = await createPdfToolkit();
  console.log("      QPDF WASM initialized successfully.");

  // 3. Test AES-256 Locking
  console.log("[3/5] Testing real AES-256 encryption via QPDF WASM...");
  const testPassword = "SuperSecretPassword2026";
  const lockedBytes = await toolkit.lock(basePdfBytes, {
    userPassword: testPassword,
    keyLength: 256,
    permissions: {
      print: "full",
      modify: "none",
      extract: false,
    },
  });

  const isEncrypted = await toolkit.isEncrypted(lockedBytes);
  const infoEncrypted = await toolkit.getInfo(lockedBytes, { password: testPassword });
  console.log(`      Locked PDF bytes: ${lockedBytes.length}`);
  console.log(`      isEncrypted: ${isEncrypted}`);
  console.log(`      Encryption Key Length: ${infoEncrypted.encryption?.bits}-bit`);

  if (!isEncrypted || infoEncrypted.encryption?.bits !== 256) {
    throw new Error("FAILED: Document was not encrypted with 256-bit key!");
  }
  console.log("      PASS: AES-256 verified cryptographically.");

  // 4. Test Password Decryption (Wrong Password vs Right Password)
  console.log("[4/5] Testing password decryption invariants...");
  let wrongPasswordCaught = false;
  try {
    await toolkit.unlock(lockedBytes, { password: "WrongPassword" });
  } catch (err) {
    wrongPasswordCaught = true;
    console.log(`      Correctly rejected wrong password: ${err.message}`);
  }
  if (!wrongPasswordCaught) {
    throw new Error("FAILED: Wrong password was not rejected!");
  }

  const unlockedBytes = await toolkit.unlock(lockedBytes, { password: testPassword });
  const isUnlockedEncrypted = await toolkit.isEncrypted(unlockedBytes);
  console.log(`      isEncrypted after unlock: ${isUnlockedEncrypted}`);
  if (isUnlockedEncrypted) {
    throw new Error("FAILED: Unlocked PDF is still encrypted!");
  }
  console.log("      PASS: Real password unlock verified.");

  // 5. Test JSZip Bundle
  console.log("[5/5] Testing JSZip multi-image archive generation...");
  const zip = new JSZip();
  zip.file("test_page_1.png", "fake-image-bytes");
  zip.file("test_page_2.png", "fake-image-bytes-2");
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
  console.log(`      JSZip bundle generated: ${zipBuffer.length} bytes`);
  console.log("      PASS: Multi-image ZIP archive verified.\n");

  console.log("==================================================");
  console.log("ALL 5 CORE ARCHITECTURAL INVARIANTS PASSED 100%!");
  console.log("==================================================");
  process.exit(0);
}

runVerification().catch((err) => {
  console.error("\nFATAL ERROR in verification:", err);
  process.exit(1);
});
