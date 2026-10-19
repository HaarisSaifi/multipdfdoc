// Development-only preview of exported files; Hostinger serves the production files.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
const root = path.resolve("out"), port = Number(process.env.PORT || 3000);
const types = {".html":"text/html; charset=utf-8",".txt":"text/plain; charset=utf-8",".xml":"application/xml",".json":"application/json",".js":"text/javascript",".mjs":"text/javascript",".css":"text/css",".wasm":"application/wasm",".woff2":"font/woff2",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".webp":"image/webp",".ico":"image/x-icon",".gz":"application/octet-stream"};
http.createServer((req,res) => {
 const headers={"X-Content-Type-Options":"nosniff","X-Frame-Options":"DENY","Referrer-Policy":"strict-origin-when-cross-origin","Permissions-Policy":"camera=(), microphone=(), geolocation=()","Content-Security-Policy":"object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'"};
 let url;
 try { url = decodeURIComponent(new URL(req.url,"http://localhost").pathname); } catch {res.writeHead(400,headers);res.end();return;}
 if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405,{...headers,Allow:"GET, HEAD"});res.end();return;}
 const candidate = path.resolve(root,"."+url);
 if (!(candidate===root || candidate.startsWith(root+path.sep)) || url.split('/').some(p=>p.startsWith('.'))) {res.writeHead(404,headers);res.end();return;}
 let file=candidate;
 if (fs.existsSync(file)&&fs.statSync(file).isDirectory()) file=path.join(file,"index.html");
 if (!fs.existsSync(file)&&fs.existsSync(candidate+".html")) file=candidate+".html";
 const exists=fs.existsSync(file)&&fs.statSync(file).isFile();
 if (!exists) file=path.join(root,"404.html");
 if (!fs.existsSync(file)) {res.writeHead(503,headers);res.end("Build the static export first.");return;}
 const mime=types[path.extname(file)]||"application/octet-stream";
 const compress=/\bgzip\b/.test(req.headers['accept-encoding']||'') && /^(?:text\/|application\/(?:javascript|json|xml)|image\/svg)/.test(mime);
 res.writeHead(exists?200:404,{...headers,"Content-Type":mime,"Vary":"Accept-Encoding",...(compress?{"Content-Encoding":"gzip"}:{"Content-Length":fs.statSync(file).size}),"Cache-Control":url.startsWith('/_next/static/')?"public, max-age=31536000, immutable":"public, max-age=0, must-revalidate"});
 if(req.method==='HEAD')res.end();else{const stream=fs.createReadStream(file);if(compress)stream.pipe(zlib.createGzip()).pipe(res);else stream.pipe(res);}

}).listen(port,'127.0.0.1',()=>console.log(`Static files only: http://127.0.0.1:${port}`));
