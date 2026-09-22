/**
 * Live HTTP Integration Test Suite for Phase 2: Cloud AI OCR Route Handler
 * MultiPDF Doc (multipdfdoc.com)
 */

import http from "node:http";
import { PDFDocument } from "pdf-lib";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

/**
 * Sends a raw HTTP request using node:http to test headers like Content-Length without client-side validation
 */
function sendRawRequest(options, bodyBuffer) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {}
        resolve({ status: res.statusCode, headers: res.headers, body: data, json });
      });
    });

    req.on("error", reject);
    if (bodyBuffer) {
      req.write(bodyBuffer);
    }
    req.end();
  });
}

async function runLiveHttpTests() {
  console.log("================================================================================");
  console.log(`🌐 RUNNING LIVE HTTP INTEGRATION TESTS AGAINST ${BASE_URL}`);
  console.log("================================================================================\n");

  // 1. Early Content-Length Gate: Send request with declared Content-Length > 10MB
  console.log("▶ [HTTP Test 1] Early Content-Length Rejection (>10MB)");
  try {
    const url = new URL(`${BASE_URL}/api/ocr`);
    const rawRes = await sendRawRequest({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: "POST",
      headers: {
        "content-length": "15728640", // 15MB
        "content-type": "multipart/form-data; boundary=----Boundary",
      },
    });

    assert(rawRes.status === 413, `Rejected oversized Content-Length with HTTP 413 (got ${rawRes.status})`);
    assert(rawRes.json?.error?.includes("exceeds 10MB"), `Correct error message returned: "${rawRes.json?.error}"`);
  } catch (err) {
    assert(false, `Test 1 threw error: ${err.message}`);
  }

  // 2. Missing File Payload: Empty POST -> HTTP 400
  console.log("\n▶ [HTTP Test 2] Missing File Payload Handling");
  try {
    const emptyForm = new FormData();
    const res = await fetch(`${BASE_URL}/api/ocr`, {
      method: "POST",
      body: emptyForm,
    });
    const data = await res.json().catch(() => ({}));
    assert(res.status === 400, `Rejected missing file with HTTP 400 (got ${res.status})`);
    assert(data.error?.includes("No document or image file provided"), `Correct 400 error message: "${data.error}"`);
  } catch (err) {
    assert(false, `Test 2 threw network error: ${err.message}`);
  }

  // 3. Magic Bytes Enforcement: Executable binary disguised as PDF -> HTTP 415
  console.log("\n▶ [HTTP Test 3] Magic Bytes Rejection (Fake PDF / Executable)");
  try {
    const fakeExeBytes = new Uint8Array(64);
    fakeExeBytes[0] = 0x4d; // 'M'
    fakeExeBytes[1] = 0x5a; // 'Z'
    const fakeFile = new Blob([fakeExeBytes], { type: "application/pdf" });
    const formData = new FormData();
    formData.append("file", fakeFile, "malicious.pdf");

    const res = await fetch(`${BASE_URL}/api/ocr`, {
      method: "POST",
      headers: {
        "cf-connecting-ip": "203.0.113.3",
      },
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    assert(res.status === 415, `Rejected executable masquerading as PDF with HTTP 415 (got ${res.status})`);
    assert(data.error?.includes("Unsupported file signature"), `Clear 415 error message: "${data.error}"`);
  } catch (err) {
    assert(false, `Test 3 threw network error: ${err.message}`);
  }

  // 4. Page Cap Enforcement: 25-page PDF -> HTTP 413
  console.log("\n▶ [HTTP Test 4] PDF 20-Page Cap Enforcement");
  try {
    const largeDoc = await PDFDocument.create();
    for (let i = 0; i < 25; i++) {
      largeDoc.addPage();
    }
    const pdfBytes = await largeDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
    const formData = new FormData();
    formData.append("file", pdfBlob, "large_document_25pages.pdf");

    const res = await fetch(`${BASE_URL}/api/ocr`, {
      method: "POST",
      headers: {
        "cf-connecting-ip": "203.0.113.4",
      },
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    assert(res.status === 413, `Rejected 25-page PDF with HTTP 413 (got ${res.status})`);
    assert(data.error?.includes("20-page Cloud AI limit"), `Clear 413 error message: "${data.error}"`);
  } catch (err) {
    assert(false, `Test 4 threw network error: ${err.message}`);
  }

  // 5. Rate Limiting Live Enforcement: 5 scans allowed per hour, 6th triggers HTTP 429
  console.log("\n▶ [HTTP Test 5] Live Rate Limiting Enforcement (Client IP)");
  try {
    const singlePageDoc = await PDFDocument.create();
    singlePageDoc.addPage();
    const validBytes = await singlePageDoc.save();

    let rateLimited = false;
    let attempts = 0;
    const testIp = "203.0.113.88";

    // Send requests with a simulated client IP
    for (let i = 1; i <= 7; i++) {
      attempts++;
      const validBlob = new Blob([validBytes], { type: "application/pdf" });
      const formData = new FormData();
      formData.append("file", validBlob, "test_sample.pdf");

      const res = await fetch(`${BASE_URL}/api/ocr`, {
        method: "POST",
        headers: {
          "cf-connecting-ip": testIp,
        },
        body: formData,
      });

      if (res.status === 429) {
        rateLimited = true;
        const data = await res.json().catch(() => ({}));
        assert(true, `Rate limiter triggered on request #${attempts} with HTTP 429: "${data.error}"`);
        break;
      }
    }

    assert(rateLimited, "Rate limiter successfully engaged and rejected excess request with HTTP 429");
  } catch (err) {
    assert(false, `Test 5 threw network error: ${err.message}`);
  }

  console.log("\n================================================================================");
  console.log(`🏁 LIVE HTTP TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("================================================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runLiveHttpTests().catch((err) => {
  console.error("Live HTTP testing failed:", err);
  process.exit(1);
});
