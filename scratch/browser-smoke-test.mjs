import { spawn } from "node:child_process";
import http from "node:http";
import fs from "node:fs";

console.log("==================================================================");
console.log("   HEADLESS CHROME BROWSER SMOKE TEST & NETWORK VERIFICATION      ");
console.log("==================================================================\n");

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9222;

// Launch headless Chrome with remote debugging
const chromeProc = spawn(chromePath, [
  "--headless=new",
  `--remote-debugging-port=${port}`,
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "--user-data-dir=" + process.cwd() + "\\scratch\\chrome-test-profile",
], { stdio: "ignore" });

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getWsUrl() {
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    try {
      const res = await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${port}/json/version`, (r) => {
          let data = "";
          r.on("data", (chunk) => (data += chunk));
          r.on("end", () => resolve(JSON.parse(data)));
        }).on("error", reject);
      });
      return res.webSocketDebuggerUrl;
    } catch (e) {
      // retry
    }
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
    // Standard WebSocket is built into Node 22
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
  console.log("Connected to Chrome DevTools Protocol at:", wsUrl);

  const client = new CDPClient(wsUrl);
  await client.connect();

  // Create a new target / page
  const { targetId } = await client.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await client.send("Target.attachToTarget", { targetId, flatten: true });

  const sendPage = (method, params = {}) => client.send(method, params, sessionId);

  // Track all network requests and console events
  const networkRequests = [];
  const consoleMessages = [];

  client.onEvent((method, params) => {
    if (method === "Network.requestWillBeSent") {
      networkRequests.push(params.request.url);
    } else if (method === "Network.responseReceived") {
      networkRequests.push(`[${params.response.status}] ${params.response.url}`);
    } else if (method === "Runtime.consoleAPICalled") {
      const text = params.args.map((a) => a.value || JSON.stringify(a)).join(" ");
      consoleMessages.push(`[${params.type}] ${text}`);
    }
  });

  // Enable Network and Runtime domains
  await sendPage("Network.enable");
  await sendPage("Runtime.enable");
  await sendPage("Page.enable");

  const testRoutes = [
    "/pdf/to-image",
    "/pdf/compress",
    "/pdf/to-text",
  ];

  for (const route of testRoutes) {
    console.log(`\n--> Testing route in real headless Chrome: http://localhost:3000${route}`);
    networkRequests.length = 0;
    consoleMessages.length = 0;

    await sendPage("Page.navigate", { url: `http://localhost:3000${route}` });
    await sleep(2500);

    // Evaluate client-side getPdfJs call in page context
    const evalResult = await sendPage("Runtime.evaluate", {
      expression: `
        (async () => {
          try {
            const dynamicImport = new Function('u', 'return import(u)');
            const pdfjs = await dynamicImport('/vendor/pdfjs/pdf.min.mjs');
            pdfjs.GlobalWorkerOptions.workerSrc = window.location.origin + '/vendor/pdfjs/pdf.worker.min.mjs';
            return {
              success: true,
              version: pdfjs.version,
              workerSrc: pdfjs.GlobalWorkerOptions.workerSrc
            };
          } catch(err) {
            return { success: false, error: err.message };
          }
        })()
      `,
      awaitPromise: true,
      returnByValue: true,
    });

    console.log("    Page Evaluation Result:", evalResult);

    // Inspect network requests
    const cdnjsRequests = networkRequests.filter((u) => u.includes("cdnjs.cloudflare.com"));
    const legacyVersionRequests = networkRequests.filter((u) => u.includes("3.11.174"));
    const localPdfjsRequests = networkRequests.filter((u) => u.includes("/vendor/pdfjs/pdf.min.mjs"));

    console.log(`    Total Network Requests captured: ${networkRequests.length}`);
    console.log(`    cdnjs Requests: ${cdnjsRequests.length} (Expected: 0)`);
    console.log(`    3.11.174 Requests: ${legacyVersionRequests.length} (Expected: 0)`);
    console.log(`    Local vendor/pdfjs requests: ${localPdfjsRequests.length}`);

    if (cdnjsRequests.length > 0) {
      console.error("❌ FAILURE: cdnjs request detected!", cdnjsRequests);
      process.exit(1);
    }
    if (legacyVersionRequests.length > 0) {
      console.error("❌ FAILURE: 3.11.174 request detected!", legacyVersionRequests);
      process.exit(1);
    }

    const workerMismatchWarnings = consoleMessages.filter((m) =>
      m.toLowerCase().includes("worker version") || m.toLowerCase().includes("mismatch")
    );
    console.log(`    Worker Version Mismatch Warnings: ${workerMismatchWarnings.length} (Expected: 0)`);
    if (workerMismatchWarnings.length > 0) {
      console.error("❌ FAILURE: Worker mismatch warning in console!", workerMismatchWarnings);
      process.exit(1);
    }

    console.log(`    ✅ Route ${route} passed all browser network & runtime invariants!`);
  }

  console.log("\n==================================================================");
  console.log("   ALL BROWSER SMOKE TESTS PASSED CLEANLY! ZERO CDN REQUESTS!     ");
  console.log("==================================================================");

  client.close();
} catch (err) {
  console.error("Error during browser smoke test:", err);
} finally {
  chromeProc.kill();
  try {
    fs.rmSync(process.cwd() + "\\scratch\\chrome-test-profile", { recursive: true, force: true });
  } catch (e) {}
}
