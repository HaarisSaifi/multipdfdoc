import fs from "node:fs";
import path from "node:path";
import env from "@next/env";
env.loadEnvConfig(process.cwd());
const dir = path.resolve("out");
if (!fs.existsSync(path.join(dir,"index.html"))) throw Error("Static export missing.");
const publisher = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
const target = path.join(dir,"ads.txt");
if (publisher) {
 if (!/^ca-pub-\d{16}$/.test(publisher)) throw Error("Invalid AdSense publisher ID; no ads.txt was fabricated.");
 fs.writeFileSync(target,`google.com, ${publisher.replace("ca-","")}, DIRECT, f08c47fec0942fa0\n`);
} else if (fs.existsSync(target)) fs.unlinkSync(target);
if (!fs.existsSync(path.join(dir,".htaccess"))) fs.copyFileSync("public/.htaccess",path.join(dir,".htaccess"));
for (const name of ["ocr-worker.js","404.html","robots.txt","sitemap.xml","vendor/ocr/lang/eng.traineddata.gz","vendor/ocr/7.0.0/worker.min.js"]) if (!fs.existsSync(path.join(dir,name))) throw Error("Missing public export asset: "+name);
console.log("Static release ready in out/: no application server needed on hosting.");
