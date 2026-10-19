const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const { PDFDocument } = require("pdf-lib");

// Run the actual TypeScript modules, without introducing a runner dependency.
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
let checks = 0;
async function test(name, fn) { await fn(); checks++; console.log(`PASS ${name}`); }
(async () => {
  await test("local calendar dates preserve the selected day", () => { assert.equal(formatLocalDate(new Date(2026, 9, 7, 0, 15)), "2026-10-07"); });
  await test("strict ranges reject malformed, reversed and out-of-bounds entries", () => {
    assert.deepEqual(parsePageRange("1, 3-4, 3", 4), [0, 2, 3]);
    for (const text of ["1x", "3-1", "0", "5", "1,,2", "1-2-3", ""]) assert.throws(() => parsePageRange(text, 4));
  });
  await test("local OCR cancellation and timeout do not leave a pending operation", async () => {
    const { waitForOcr } = require("../src/lib/pdf/local-ocr.ts");
    const controller = new AbortController();
    const pending = waitForOcr(new Promise(() => {}), controller.signal, 1000);
    controller.abort(); await assert.rejects(pending, error => error.name === "AbortError");
    await assert.rejects(waitForOcr(new Promise(() => {}), new AbortController().signal, 5), /too long/);
    assert.equal(await waitForOcr(Promise.resolve("ready"), new AbortController().signal), "ready");
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
})().catch(error => { console.error(error); process.exitCode = 1; });
