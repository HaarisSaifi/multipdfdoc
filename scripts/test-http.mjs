import fs from 'node:fs';
import path from 'node:path';
const origin=process.env.TEST_ORIGIN||'http://localhost:3000';
const xml=await(await fetch(origin+'/sitemap.xml')).text();
const urls=[...xml.matchAll(/<loc>https:\/\/multipdfdoc.com([^<]*)<\/loc>/g)].map(x=>x[1]||'/');
const pages=[], links=new Set(), assets=[];
for(const url of urls){
 const res=await fetch(origin+url),html=await res.text();
 if(res.status!==200)throw Error(url+' status '+res.status);
 if(res.headers.get('x-content-type-options')!=='nosniff')throw Error('Missing security headers '+url);
 const canonical=html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
 if(!canonical||new URL(canonical).href!==new URL('https://multipdfdoc.com'+url).href)throw Error('Wrong canonical '+url);
 if(html.includes('/api/ocr')||html.includes('/api/contact'))throw Error('Server endpoint leaked into static HTML '+url);
 if((html.match(/<h1(?:\s|>)/g)||[]).length!==1)throw Error('Expected one primary heading '+url);
 if(/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html))throw Error('Unexpected noindex '+url);
 const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
 for(const m of html.matchAll(/href="#(guide-section-[^"]+)"/g))if(!ids.has(m[1]))throw Error('Broken guide anchor '+url+'#'+m[1]);
 const schemas=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1]));
 for(const schema of schemas){if(schema['@type']==='Article'&&(schema.dateModified<schema.datePublished||schema.dateModified>'2026-10-11'))throw Error('Invalid editorial dates '+url);}
 for(const m of html.matchAll(/href="([^"#]+)"/g)){const href=m[1].replaceAll('&amp;','&');if(href.startsWith('/')&&!href.startsWith('//'))links.add(new URL(href,origin).pathname);}
 pages.push({url,status:res.status,bytes:Buffer.byteLength(html),canonical});
}
for(const link of links){const res=await fetch(origin+link,{method:'HEAD'});if(!res.ok)throw Error('Broken internal link '+link+' '+res.status);}
for(const [asset,type] of [['/ocr-worker.js','javascript'],['/vendor/pdfjs/pdf.min.mjs','javascript'],['/vendor/pdfjs/pdf.worker.min.mjs','javascript'],['/vendor/ocr/7.0.0/worker.min.js','javascript'],['/vendor/ocr/7.0.0/tesseract-core-lstm.wasm','application/wasm'],['/vendor/ocr/lang/eng.traineddata.gz','application/octet-stream']]){
 const res=await fetch(origin+asset,{method:'HEAD'});if(!res.ok||!res.headers.get('content-type')?.includes(type))throw Error('Missing or wrong MIME asset '+asset);assets.push({asset,status:res.status,mime:res.headers.get('content-type')});
}
const missing=await fetch(origin+'/missing-audit-page');if(missing.status!==404)throw Error('404 status incorrect');
const endpoints=[];for(const route of ['/api/contact','/api/ocr']){const res=await fetch(origin+route);if(res.status!==404)throw Error('Server route still exposed');endpoints.push({route,status:res.status});}
if(fs.existsSync('out/api'))throw Error('API directory in export');
const forbidden=[];function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())walk(p);else if(/(?:^\.env|\.pem$|package(?:-lock)?\.json$)/.test(entry.name))forbidden.push(p);}}walk('out');if(forbidden.length)throw Error('Private files in export');
const secretValues=[];
if(fs.existsSync('.env.local')) for(const line of fs.readFileSync('.env.local','utf8').split(/\r?\n/)){
 const match=line.match(/^([A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD)[A-Z0-9_]*)\s*=\s*(.*)$/);
 if(match){const value=match[2].trim().replace(/^["']|["']$/g,'');if(value.length>8)secretValues.push(Buffer.from(value));}
}
let checkedTextAssets=0;
function scanCredentials(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())scanCredentials(p);else if(/\.(js|html|txt|json)$/.test(p)){const bytes=fs.readFileSync(p);checkedTextAssets++;if(secretValues.some(secret=>bytes.includes(secret)))throw Error('Private credential in public export; details suppressed');}}}
scanCredentials('out');
fs.writeFileSync('docs/reports/static-export-security.json',JSON.stringify({privateCredentialMatches:0,checkedTextAssets,privateFiles:forbidden,documentApiDirectory:false},null,2));
fs.writeFileSync('docs/reports/static-http-audit.json',JSON.stringify({pages,internalLinksChecked:links.size,assets,notFound:missing.status,absentServerEndpoints:endpoints,privateFiles:forbidden},null,2));
console.log('PASS STATIC HTTP:',pages.length,'sitemap pages,',links.size,'internal links, worker/WASM MIME, 404 and absent server endpoints');
