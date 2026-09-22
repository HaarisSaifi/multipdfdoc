import { spawn } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

console.log("=========================================================================");
console.log("   MULTIPDF DOC — REAL END-TO-END BROWSER USER WORKFLOW VERIFICATION     ");
console.log("=========================================================================\n");

const rootDir = process.cwd();
const fixturePath = path.join(rootDir, "scratch", "fixture-safe-2page.pdf");
const UNIQUE_MARKER = "UNIQUE_TEST_MARKER_987654321_PDFJS_LOCAL_VERIFIED";

// Step 0: Generate Safe Two-Page PDF Fixture
console.log("[Setup] Creating safe 2-page PDF fixture with unique marker text...");
const pdfDoc = await PDFDocument.create();
const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

const page1 = pdfDoc.addPage([600, 400]);
page1.drawText("MultiPDF Doc Verification Suite - Page 1", { x: 50, y: 350, size: 16, font, color: rgb(0.1, 0.1, 0.1) });
page1.drawText(UNIQUE_MARKER, { x: 50, y: 300, size: 14, font, color: rgb(0.2, 0.2, 0.8) });
page1.drawText("Genuine Mozilla PDF.js client-side text layer and canvas testing.", { x: 50, y: 250, size: 12, font, color: rgb(0.3, 0.3, 0.3) });

const page2 = pdfDoc.addPage([600, 400]);
page2.drawText("MultiPDF Doc Verification Suite - Page 2", { x: 50, y: 350, size: 16, font, color: rgb(0.1, 0.1, 0.1) });
page2.drawText("Second page for multi-page viewport rendering and compression loop.", { x: 50, y: 300, size: 12, font, color: rgb(0.3, 0.3, 0.3) });

const pdfBytes = await pdfDoc.save();
fs.writeFileSync(fixturePath, Buffer.from(pdfBytes));
console.log(`        Created ${fixturePath} (${pdfBytes.byteLength} bytes, 2 pages)\n`);

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9222;

const chromeProc = spawn(chromePath, [
  "--headless=new",
  `--remote-debugging-port=${port}`,
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "--user-data-dir=" + path.join(rootDir, "scratch", "chrome-e2e-profile"),
], { stdio: "ignore" });

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getWsUrl() {
  for (let i = 0; i < 25; i++) {
    await sleep(400);
    try {
      const res = await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${port}/json/version`, (r) => {
          let data = "";
          r.on("data", (chunk) => (data += chunk));
          r.on("end", () => resolve(JSON.parse(data)));
        }).on("error", reject);
      });
      return res.webSocketDebuggerUrl;
    } catch (e) {}
  }
  throw new Error("Failed to connect to Chrome DevTools port");
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
    this.eventListeners = [];
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        this.callbacks.get(msg.id)(msg);
        this.callbacks.delete(msg.id);
      } else if (msg.method) {
        for (const listener of this.eventListeners) {
          listener(msg.method, msg.params);
        }
      }
    };
  }

  send(method, params = {}, sessionId = undefined) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, (msg) => {
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      });
      const payload = { id, method, params };
      if (sessionId) payload.sessionId = sessionId;
      this.ws.send(JSON.stringify(payload));
    });
  }

  onEvent(fn) {
    this.eventListeners.push(fn);
  }

  close() {
    this.ws.close();
  }
}

try {
  const wsUrl = await getWsUrl();
  console.log("Connected to Chrome DevTools at:", wsUrl);

  const client = new CDPClient(wsUrl);
  await client.connect();

  const { targetId } = await client.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await client.send("Target.attachToTarget", { targetId, flatten: true });

  const sendPage = (method, params = {}) => client.send(method, params, sessionId);

  const networkRequests = [];
  const networkResponses = [];
  const consoleMessages = [];

  client.onEvent((method, params) => {
    if (method === "Network.requestWillBeSent") {
      networkRequests.push(params.request.url);
    } else if (method === "Network.responseReceived") {
      networkResponses.push({
        status: params.response.status,
        url: params.response.url,
        mime: params.response.mimeType,
      });
    } else if (method === "Runtime.consoleAPICalled") {
      const text = params.args.map((a) => a.value || JSON.stringify(a)).join(" ");
      consoleMessages.push({ type: params.type, text });
    }
  });

  await sendPage("Network.enable");
  await sendPage("Runtime.enable");
  await sendPage("Page.enable");
  await sendPage("DOM.enable");

  // Helper to verify global network/console invariants
  function verifyNetworkInvariants(routeLabel) {
    const cdnjs = networkRequests.filter((u) => u.includes("cdnjs.cloudflare.com"));
    const legacy = networkRequests.filter((u) => u.includes("3.11.174"));
    const pdfjsResp = networkResponses.find((r) => r.url.includes("/vendor/pdfjs/pdf.min.mjs"));
    const workerResp = networkResponses.find((r) => r.url.includes("/vendor/pdfjs/pdf.worker.min.mjs"));
    const mismatches = consoleMessages.filter((m) =>
      m.text.toLowerCase().includes("worker version") || m.text.toLowerCase().includes("mismatch")
    );

    console.log(`      [Check] cdnjs requests: ${cdnjs.length} (Expected: 0)`);
    console.log(`      [Check] 3.11.174 requests: ${legacy.length} (Expected: 0)`);
    if (pdfjsResp) console.log(`      [Check] /vendor/pdfjs/pdf.min.mjs HTTP Status: ${pdfjsResp.status}`);
    if (workerResp) console.log(`      [Check] /vendor/pdfjs/pdf.worker.min.mjs HTTP Status: ${workerResp.status}`);
    console.log(`      [Check] Worker mismatch warnings: ${mismatches.length} (Expected: 0)`);

    if (cdnjs.length > 0 || legacy.length > 0 || mismatches.length > 0) {
      throw new Error(`Invariants failed on ${routeLabel}`);
    }
  }

  // =========================================================================
  // WORKFLOW A: /pdf/to-text Real UI Upload & Local Text Extraction
  // =========================================================================
  console.log("\n-------------------------------------------------------------------------");
  console.log("WORKFLOW A: /pdf/to-text (UI File Upload + Local Extraction)");
  console.log("-------------------------------------------------------------------------");
  networkRequests.length = 0;
  networkResponses.length = 0;
  consoleMessages.length = 0;

  await sendPage("Page.navigate", { url: "http://localhost:3000/pdf/to-text" });
  await sleep(2500);

  // Set file via CDP DOM on input[type=file]
  const docToText = await sendPage("DOM.getDocument");
  const inputToText = await sendPage("DOM.querySelector", {
    nodeId: docToText.root.nodeId,
    selector: 'input[type="file"]',
  });

  await sendPage("DOM.setFileInputFiles", {
    files: [fixturePath],
    nodeId: inputToText.nodeId,
  });
  await sleep(1500);

  // Click "Start Extraction" button
  console.log("      Triggering 'Start Extraction' button in UI...");
  await sendPage("Runtime.evaluate", {
    expression: `
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find(b => b.textContent.includes('Start Extraction'));
        if (btn) btn.click();
        else throw new Error("Start Extraction button not found");
      })()
    `,
  });

  // Wait for extraction to complete (status 100%)
  let extractedSuccess = false;
  let pageTextContent = "";
  for (let i = 0; i < 20; i++) {
    await sleep(800);
    const textCheck = await sendPage("Runtime.evaluate", {
      expression: `
        (() => {
          const textarea = document.querySelector('textarea');
          return textarea ? textarea.value : '';
        })()
      `,
      returnByValue: true,
    });
    if (textCheck.result && textCheck.result.value && textCheck.result.value.includes(UNIQUE_MARKER)) {
      extractedSuccess = true;
      pageTextContent = textCheck.result.value;
      break;
    }
  }

  console.log(`      Extracted Marker Text Found in UI: ${extractedSuccess}`);
  if (!extractedSuccess) {
    throw new Error("FAILED: Marker text did not appear in /pdf/to-text textarea!");
  }
  console.log(`      Sample UI Output: "${pageTextContent.slice(0, 120)}..."`);

  // Verify NO cloud /api/ocr request occurred
  const cloudOcrRequests = networkRequests.filter((u) => u.includes("/api/ocr"));
  console.log(`      [Check] Cloud /api/ocr requests: ${cloudOcrRequests.length} (Expected: 0)`);
  if (cloudOcrRequests.length !== 0) {
    throw new Error("FAILED: Cloud /api/ocr was called during local extraction!");
  }

  verifyNetworkInvariants("/pdf/to-text");
  console.log("✅ PASS: /pdf/to-text end-to-end workflow verified 100% client-side!\n");

  // =========================================================================
  // WORKFLOW B: /pdf/to-image Real UI Upload, Canvas Rendering & Download
  // =========================================================================
  console.log("-------------------------------------------------------------------------");
  console.log("WORKFLOW B: /pdf/to-image (UI Upload, Canvas Rendering, Non-Empty Pixels)");
  console.log("-------------------------------------------------------------------------");
  networkRequests.length = 0;
  networkResponses.length = 0;
  consoleMessages.length = 0;

  await sendPage("Page.navigate", { url: "http://localhost:3000/pdf/to-image" });
  await sleep(2500);

  const docToImage = await sendPage("DOM.getDocument");
  const inputToImage = await sendPage("DOM.querySelector", {
    nodeId: docToImage.root.nodeId,
    selector: 'input[type="file"]',
  });

  await sendPage("DOM.setFileInputFiles", {
    files: [fixturePath],
    nodeId: inputToImage.nodeId,
  });
  await sleep(1500);

  // Click "Convert to Images" button
  console.log("      Triggering 'Convert to Images' button in UI...");
  await sendPage("Runtime.evaluate", {
    expression: `
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find(b => b.textContent.includes('Convert') || b.textContent.includes('Render'));
        if (btn) btn.click();
        else throw new Error("Convert button not found");
      })()
    `,
  });

  // Wait for rendering to complete (check for rendered canvas / images)
  let renderSuccess = false;
  let canvasPixelCheck = null;

  for (let i = 0; i < 20; i++) {
    await sleep(800);
    const check = await sendPage("Runtime.evaluate", {
      expression: `
        (() => {
          const imgs = Array.from(document.querySelectorAll('img[src^="data:image/"]'));
          if (imgs.length >= 2) {
            // Verify pixel data of first image
            const img = imgs[0];
            const c = document.createElement('canvas');
            c.width = 100;
            c.height = 100;
            const ctx = c.getContext('2d');
            ctx.drawImage(img, 0, 0, 100, 100);
            const p = ctx.getImageData(0, 0, 100, 100).data;
            let nonWhite = 0;
            for (let j = 0; j < p.length; j += 4) {
              if (p[j] < 240 || p[j+1] < 240 || p[j+2] < 240) nonWhite++;
            }
            return {
              count: imgs.length,
              srcLen: img.src.length,
              prefix: img.src.slice(0, 30),
              nonWhitePixels: nonWhite
            };
          }
          return null;
        })()
      `,
      returnByValue: true,
    });

    if (check.result && check.result.value) {
      renderSuccess = true;
      canvasPixelCheck = check.result.value;
      break;
    }
  }

  console.log(`      Rendered Images Count: ${canvasPixelCheck?.count} (Expected: 2)`);
  console.log(`      Image Data URL prefix: ${canvasPixelCheck?.prefix}`);
  console.log(`      Non-empty pixel count detected on canvas: ${canvasPixelCheck?.nonWhitePixels}`);

  if (!renderSuccess || !canvasPixelCheck || canvasPixelCheck.nonWhitePixels === 0) {
    throw new Error("FAILED: Canvas did not receive real non-empty pixel rendering!");
  }

  // Test ZIP download generation
  console.log("      Testing ZIP archive generation...");
  const zipResult = await sendPage("Runtime.evaluate", {
    expression: `
      (async () => {
        try {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('ZIP'));
          if (!btn) return { error: "ZIP button not found" };
          // Click and capture created blob
          let capturedBlob = null;
          const origCreateObjectURL = URL.createObjectURL;
          URL.createObjectURL = (blob) => {
            capturedBlob = blob;
            return origCreateObjectURL(blob);
          };
          btn.click();
          await new Promise(r => setTimeout(r, 1000));
          URL.createObjectURL = origCreateObjectURL;

          if (capturedBlob) {
            const buf = await capturedBlob.arrayBuffer();
            const bytes = new Uint8Array(buf);
            // Check ZIP magic signature: PK\x03\x04
            const isZip = bytes[0] === 0x50 && bytes[1] === 0x4B && bytes[2] === 0x03 && bytes[3] === 0x04;
            return { size: capturedBlob.size, isZip };
          }
          return { error: "No blob captured" };
        } catch(e) {
          return { error: e.message };
        }
      })()
    `,
    awaitPromise: true,
    returnByValue: true,
  });

  console.log("      ZIP Export Result:", zipResult.result.value);
  if (!zipResult.result.value.isZip || zipResult.result.value.size <= 0) {
    throw new Error("FAILED: Downloaded ZIP file did not have valid PK signature or was empty!");
  }

  verifyNetworkInvariants("/pdf/to-image");
  console.log("✅ PASS: /pdf/to-image end-to-end rendering and ZIP export verified!\n");

  // =========================================================================
  // WORKFLOW C: /pdf/compress Real UI Upload, Recompression & PDF Verification
  // =========================================================================
  console.log("-------------------------------------------------------------------------");
  console.log("WORKFLOW C: /pdf/compress (UI Upload, Compression, %PDF- Header Verification)");
  console.log("-------------------------------------------------------------------------");
  networkRequests.length = 0;
  networkResponses.length = 0;
  consoleMessages.length = 0;

  await sendPage("Page.navigate", { url: "http://localhost:3000/pdf/compress" });
  await sleep(2500);

  const docCompress = await sendPage("DOM.getDocument");
  const inputCompress = await sendPage("DOM.querySelector", {
    nodeId: docCompress.root.nodeId,
    selector: 'input[type="file"]',
  });

  await sendPage("DOM.setFileInputFiles", {
    files: [fixturePath],
    nodeId: inputCompress.nodeId,
  });
  await sleep(1500);

  // Trigger "Compress PDF" button in UI
  console.log("      Triggering 'Compress PDF' button in UI...");
  await sendPage("Runtime.evaluate", {
    expression: `
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find(b => b.textContent.includes('Compress') && !b.disabled);
        if (btn) btn.click();
        else throw new Error("Compress button not found");
      })()
    `,
  });

  // Wait for compressed output blob
  let compressSuccess = false;
  let compressedResult = null;

  for (let i = 0; i < 25; i++) {
    await sleep(800);
    const check = await sendPage("Runtime.evaluate", {
      expression: `
        (async () => {
          const downloadBtn = Array.from(document.querySelectorAll('a[href^="blob:"]')).find(a => a.textContent.includes('Download'));
          if (downloadBtn) {
            const blobUrl = downloadBtn.href;
            const res = await fetch(blobUrl);
            const buf = await res.arrayBuffer();
            const bytes = new Uint8Array(buf);
            const header = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3], bytes[4]);
            return {
              size: bytes.length,
              header: header,
              isPdf: header.startsWith('%PDF-')
            };
          }
          return null;
        })()
      `,
      awaitPromise: true,
      returnByValue: true,
    });

    if (check.result && check.result.value) {
      compressSuccess = true;
      compressedResult = check.result.value;
      break;
    }
  }

  console.log(`      Compressed Output Produced: ${compressSuccess}`);
  console.log(`      Compressed Output Size: ${compressedResult?.size} bytes`);
  console.log(`      Output File Header: "${compressedResult?.header}" (Expected: %PDF-)`);

  if (!compressSuccess || !compressedResult || !compressedResult.isPdf || compressedResult.size <= 0) {
    throw new Error("FAILED: Compression did not produce valid %PDF- file!");
  }

  // Re-open compressed result with patched PDF.js to verify page integrity
  console.log("      Re-opening compressed PDF with patched PDF.js to verify page count...");
  const verifyDocResult = await sendPage("Runtime.evaluate", {
    expression: `
      (async () => {
        try {
          const downloadBtn = Array.from(document.querySelectorAll('a[href^="blob:"]')).find(a => a.textContent.includes('Download'));
          const res = await fetch(downloadBtn.href);
          const buf = await res.arrayBuffer();
          const moduleUrl = new URL('/vendor/pdfjs/pdf.min.mjs', window.location.origin).href;
          const pdfjs = await import(moduleUrl);
          pdfjs.GlobalWorkerOptions.workerSrc = window.location.origin + '/vendor/pdfjs/pdf.worker.min.mjs';
          const loadingTask = pdfjs.getDocument({
            data: new Uint8Array(buf),
            isEvalSupported: false,
          });
          const pdf = await loadingTask.promise;
          return { valid: true, pages: pdf.numPages };
        } catch(e) {
          return { valid: false, error: e.message || String(e) };
        }
      })()
    `,
    awaitPromise: true,
    returnByValue: true,
  });

  console.log(`      Re-opened PDF Verification: Valid = ${verifyDocResult.result.value.valid}, Pages = ${verifyDocResult.result.value.pages} (Expected: 2)`);
  if (!verifyDocResult.result.value.valid || verifyDocResult.result.value.pages !== 2) {
    throw new Error("FAILED: Re-opened compressed PDF failed validation or page count changed!");
  }

  verifyNetworkInvariants("/pdf/compress");
  console.log("✅ PASS: /pdf/compress end-to-end compression & PDF integrity verified!\n");

  console.log("=========================================================================");
  console.log("   ALL 3 REAL END-TO-END BROWSER WORKFLOWS PASSED 100% CLEANLY!          ");
  console.log("=========================================================================");

  client.close();
} catch (err) {
  console.error("❌ BROWSER E2E TEST ERROR:", err);
  process.exit(1);
} finally {
  chromeProc.kill();
  try {
    fs.rmSync(path.join(rootDir, "scratch", "chrome-e2e-profile"), { recursive: true, force: true });
  } catch (e) {}
}
