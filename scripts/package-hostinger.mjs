import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import JSZip from "jszip";
const root=path.resolve("out");
if (!fs.existsSync(path.join(root,"index.html"))||!fs.existsSync(path.join(root,".htaccess")))throw Error("Run npm run build first.");
const zip=new JSZip(),files=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const absolute=path.join(dir,entry.name),relative=path.relative(root,absolute).split(path.sep).join('/');
 if(entry.isSymbolicLink())throw Error("Unexpected symlink in export.");
 if(entry.isDirectory())walk(absolute);else{if(/(^|\/)(?:\.env[^/]*|package(?:-lock)?\.json|node_modules)(?:$|\/)/.test(relative))throw Error("Private deployment file blocked.");zip.file(relative,fs.readFileSync(absolute));files.push(relative);}}
}
walk(root);
const bytes=await zip.generateAsync({type:"nodebuffer",compression:"DEFLATE",compressionOptions:{level:6}});
fs.mkdirSync("artifacts",{recursive:true});const output="artifacts/multipdfdoc-hostinger.zip";fs.writeFileSync(output,bytes);
fs.writeFileSync("docs/reports/static-package.json",JSON.stringify({artifact:output,files:files.length,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),containsHtaccess:files.includes('.htaccess'),includesApplicationServer:false},null,2));
console.log(`Hostinger ZIP: ${files.length} public files, ${(bytes.length/1048576).toFixed(1)}MB, .htaccess included.`);
