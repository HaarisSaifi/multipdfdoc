import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
const root = process.cwd();
const getVersion = name => JSON.parse(fs.readFileSync(path.join(root,"node_modules",name,"package.json"),"utf8")).version;
if (getVersion("tesseract.js") !== "7.0.0" || getVersion("tesseract.js-core") !== "7.0.0") throw Error("Review the local OCR asset versions before upgrading.");
const dest = path.join(root,"public/vendor/ocr/7.0.0"); fs.mkdirSync(dest,{recursive:true});
for (const [source,name] of [["tesseract.js/dist/worker.min.js","worker.min.js"],["tesseract.js/dist/worker.min.js.LICENSE.txt","worker.min.js.LICENSE.txt"],["tesseract.js/LICENSE.md","TESSERACT_JS_LICENSE"],["tesseract.js-core/LICENSE","CORE_LICENSE"]]) fs.copyFileSync(path.join(root,"node_modules",source),path.join(dest,name));
for (const variant of ["lstm","simd-lstm","relaxedsimd-lstm"]) for (const suffix of ["wasm.js","wasm"]) {
 const name = `tesseract-core-${variant}.${suffix}`; fs.copyFileSync(path.join(root,"node_modules/tesseract.js-core",name),path.join(dest,name));
}
const lang = path.join(root,"public/vendor/ocr/lang/eng.traineddata.gz");
const manifest = JSON.parse(fs.readFileSync(path.join(root,"public/vendor/ocr/lang/source.json"),"utf8"));
if (crypto.createHash("sha256").update(fs.readFileSync(lang)).digest("hex") !== manifest.sha256) throw Error("OCR language asset checksum mismatch.");
console.log("Local OCR assets verified: Tesseract 7.0.0, LSTM CPU variants and pinned English data.");
