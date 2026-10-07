const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const { PDFDocument } = require("pdf-lib");
const { NextRequest } = require("next/server");

// Run the actual TypeScript modules, including routes, without introducing a runner dependency.
const resolve = Module._resolveFilename;
Module._resolveFilename = function (name, ...args) {
  return resolve.call(this, name.startsWith("@/") ? path.resolve("src", name.slice(2)) : name, ...args);
};
for (const ext of [".ts", ".tsx"]) require.extensions[ext] = (mod, filename) => {
  mod._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText, filename);
};

const { formatLocalDate } = require("../src/lib/local-date.ts");
const { parsePageRange } = require("../src/lib/pdf/page-range.ts");
const { createBusinessDocument, roundMoney } = require("../src/lib/pdf/business-document.ts");
const { readLimitedBody } = require("../src/lib/security/request-body.ts");
const { checkOcrRateLimit, resetInMemoryRateLimits } = require("../src/lib/security/rate-limiter.ts");
const { getClientIp } = require("../src/lib/security/ip-utils.ts");
const contact = require("../src/app/api/contact/route.ts");
const ocr = require("../src/app/api/ocr/route.ts");
const originalFetch = global.fetch;
let checks = 0;
async function test(name, fn) { await fn(); checks++; console.log(`PASS ${name}`); }
const request = (route, body, headers = {}) => new NextRequest(`https://multipdfdoc.com/api/${route}`, {
  method: "POST", body, headers,
});
const contactBody = JSON.stringify({ name: "Test User", email: "test@example.com", subject: "Test", message: "Safe fixture message" });

(async () => {
  await test("local calendar dates preserve the selected day", () => { assert.equal(formatLocalDate(new Date(2026, 9, 7, 0, 15)), "2026-10-07"); });
  await test("strict ranges reject malformed, reversed and out-of-bounds entries", () => {
    assert.deepEqual(parsePageRange("1, 3-4, 3", 4), [0, 2, 3]);
    for (const text of ["1x", "3-1", "0", "5", "1,,2", "1-2-3", ""]) assert.throws(() => parsePageRange(text, 4));
  });
  await test("request body limit measures actual streamed bytes without a length header", async () => {
    const stream = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(6)); controller.enqueue(new Uint8Array(6)); controller.close(); } });
    await assert.rejects(readLimitedBody(new Request("https://example.com", { method: "POST", body: stream, duplex: "half" }), 10), error => error.status === 413);
    assert.equal((await readLimitedBody(new Request("https://example.com", { method: "POST", body: "1234567890" }), 10)).length, 10);
  });
  await test("spoofed forwarded headers cannot select a rate-limit identity", () => {
    delete process.env.TRUSTED_IP_HEADER; delete process.env.VERCEL;
    assert.equal(getClientIp(request("ocr", "", { "x-forwarded-for": "1.2.3.4", "cf-connecting-ip": "5.6.7.8" })), "unknown");
    process.env.TRUSTED_IP_HEADER = "x-ingress-ip";
    assert.equal(getClientIp(request("ocr", "", { "x-ingress-ip": "2001:db8::1" })), "2001:db8::1");
    delete process.env.TRUSTED_IP_HEADER;
  });
  await test("production fails closed without Redis even with legacy bypass flag", async () => {
    process.env.NODE_ENV = "production"; delete process.env.UPSTASH_REDIS_REST_URL; delete process.env.UPSTASH_REDIS_REST_TOKEN;
    process.env.ALLOW_IN_MEMORY_RATE_LIMIT = "true";
    assert.equal((await checkOcrRateLimit("test")).allowed, false);
  });
  await test("malformed Redis results fail closed and hashed buckets use atomic expiry", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://redis.test"; process.env.UPSTASH_REDIS_REST_TOKEN = "fixture";
    global.fetch = async (_, options) => {
      const commands = JSON.parse(options.body); assert.equal(commands.length, 3); assert.equal(commands[0][0], "EVAL");
      assert.ok(!options.body.includes("1.2.3.4")); return Response.json([{ result: 1 }]);
    };
    assert.equal((await checkOcrRateLimit("1.2.3.4")).allowed, false);
    delete process.env.UPSTASH_REDIS_REST_URL; delete process.env.UPSTASH_REDIS_REST_TOKEN;
    process.env.NODE_ENV = "test"; resetInMemoryRateLimits();
    for (let n = 0; n < 5; n++) assert.equal((await checkOcrRateLimit("fixture")).allowed, true);
    assert.equal((await checkOcrRateLimit("fixture")).status, 429);
    global.fetch = originalFetch;
  });
  await test("contact rejects malformed JSON, foreign origins and overlong inputs", async () => {
    assert.equal((await contact.POST(request("contact", "{", { "content-type": "application/json" }))).status, 400);
    assert.equal((await contact.POST(request("contact", contactBody, { "content-type": "application/json", origin: "https://evil.test" }))).status, 403);
    assert.equal((await contact.POST(request("contact", "x".repeat(17000), { "content-type": "application/json" }))).status, 413);
  });
  await test("contact confirms upstream acceptance and never silently succeeds on failure", async () => {
    delete process.env.RESEND_API_KEY; delete process.env.CONTACT_FROM_EMAIL;
    assert.equal((await contact.POST(request("contact", contactBody, { "content-type": "application/json" }))).status, 503);
    process.env.RESEND_API_KEY = "fixture"; process.env.CONTACT_FROM_EMAIL = "verified@example.com";
    resetInMemoryRateLimits(); global.fetch = async () => new Response("rejected", { status: 400 });
    assert.equal((await contact.POST(request("contact", contactBody, { "content-type": "application/json" }))).status, 502);
    global.fetch = async () => Response.json({ id: "test-delivery" });
    assert.equal((await contact.POST(request("contact", contactBody, { "content-type": "application/json" }))).status, 200);
  });
  await test("cloud is disabled by default; enabled route validates real PDFs and provider output", async () => {
    delete process.env.CLOUD_OCR_ENABLED;
    assert.equal((await ocr.POST(request("ocr", ""))).status, 503);
    process.env.CLOUD_OCR_ENABLED = "true"; process.env.GEMINI_API_KEY = "fixture-key";
    resetInMemoryRateLimits();
    const doc = await PDFDocument.create(); doc.addPage(); const bytes = await doc.save();
    const form = () => { const data = new FormData(); data.set("file", new File([bytes], "fixture.pdf", { type: "application/pdf" })); return data; };
    global.fetch = async (url, options) => {
      assert.ok(!url.includes("fixture-key")); assert.equal(options.headers["x-goog-api-key"], "fixture-key");
      assert.equal(JSON.parse(options.body).contents[0].parts[1].inline_data.mime_type, "application/pdf");
      return Response.json({ candidates: [{ content: { parts: [{ text: "first" }, { text: "second" }] }, finishReason: "STOP" }] });
    };
    const result = await ocr.POST(request("ocr", form())); assert.equal(result.status, 200); assert.equal((await result.json()).text, "first\nsecond");
    global.fetch = async () => Response.json({ candidates: [{ content: { parts: [{ text: "partial" }] }, finishReason: "MAX_TOKENS" }] });
    assert.equal((await ocr.POST(request("ocr", form()))).status, 502);
    assert.equal((await ocr.POST(request("ocr", "broken", { "content-type": "multipart/form-data; boundary=x" }))).status, 400);
  });
  await test("business exports paginate long descriptions and reject unsupported script explicitly", async () => {
    const data = { title: "Invoice", number: "TEST", details: ["Issuer: Fixture"], items: Array.from({ length: 35 }, (_, i) => ({ description: `ROW_${i} ` + "Long description ".repeat(20), amount: 1.01 })), totals: [{ label: "Total", amount: 35.35 }], currency: "USD", notes: ["FINAL_NOTE"] };
    const bytes = await createBusinessDocument(data); const pdf = await PDFDocument.load(bytes); assert.ok(pdf.getPageCount() > 1);
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const rendered = await pdfjs.getDocument({ data: bytes.slice(), isEvalSupported: false, standardFontDataUrl: path.resolve("node_modules/pdfjs-dist/standard_fonts") + path.sep }).promise;
    let text = ""; for (let i = 1; i <= rendered.numPages; i++) text += (await (await rendered.getPage(i)).getTextContent()).items.map(item => item.str || "").join(" ");
    await rendered.destroy(); assert.ok(text.includes("ROW_34")); assert.ok(text.includes("FINAL_NOTE"));
    await assert.rejects(createBusinessDocument({ ...data, notes: ["हिंदी"] }), /does not support/);
    assert.equal(roundMoney(1.005), 1.01);
  });
  await test("JSON-LD safely encodes closing script sequences", () => {
    const React = require("react"), { renderToStaticMarkup } = require("react-dom/server");
    const { JsonLd } = require("../src/components/seo/JsonLd.tsx");
    const html = renderToStaticMarkup(React.createElement(JsonLd, { data: { name: "</script><script>alert(1)</script>" } }));
    assert.equal((html.match(/<script/g) || []).length, 1); assert.ok(html.includes("\\u003c"));
  });
  console.log(`${checks} production regression groups passed.`);
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => { global.fetch = originalFetch; });
