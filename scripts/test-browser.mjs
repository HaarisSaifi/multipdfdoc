import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import { spawn } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

console.log("=========================================================================");
console.log("   MULTIPDF DOC — REAL END-TO-END BROWSER USER WORKFLOW VERIFICATION     ");
console.log("=========================================================================\n");

const rootDir = process.cwd();
const origin = process.env.TEST_ORIGIN || "http://localhost:3000";
const fixturePath = path.join(rootDir, "scratch", "fixture-production-2page.pdf");
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

const smallPagePath = path.join(rootDir, "scratch", "fixture-small-page.pdf");
const smallPage = await PDFDocument.create(); smallPage.addPage([20, 20]);
fs.writeFileSync(smallPagePath, Buffer.from(await smallPage.save()));

const chromePath = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9223;

const chromeProc = spawn(chromePath, [
  "--headless=new",
  `--remote-debugging-port=${port}`,
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "--user-data-dir=" + path.join(rootDir, "scratch", "chrome-production-profile"),
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
      const timer = setTimeout(() => { this.callbacks.delete(id); reject(new Error("CDP command timed out: " + method)); }, 15000);
      const finish = this.callbacks.get(id);
      this.callbacks.set(id, (message) => { clearTimeout(timer); finish(message); });
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

const results = { target: "static export", pages: [], workflows: [], exceptions: [], postRequests: [], externalRequests: [] };
try {
 const client = new CDPClient(await getWsUrl()); await client.connect();
 const {targetId}=await client.send('Target.createTarget',{url:'about:blank'});
 const {sessionId}=await client.send('Target.attachToTarget',{targetId,flatten:true});
 const send=(m,p={})=>client.send(m,p,sessionId);
 await send('Page.enable');await send('Runtime.enable');await send('DOM.enable');await send('Network.enable');
 client.onEvent((m,p)=>{if(m==='Runtime.exceptionThrown')results.exceptions.push(p.exceptionDetails.text+' '+(p.exceptionDetails.exception?.description||''));if(m==='Network.requestWillBeSent'){if(p.request.method==='POST')results.postRequests.push(p.request.url);if(/^https?:/.test(p.request.url)&&new URL(p.request.url).hostname!=='localhost'&&new URL(p.request.url).hostname!=='127.0.0.1')results.externalRequests.push(p.request.url)}});
 let blockOcrCore = false;
 client.onEvent((method,params)=>{if(method==='Target.attachedToTarget'){
  const blocked = blockOcrCore;
  client.send('Network.enable',{},params.sessionId)
   .then(()=>blocked?client.send('Network.setBlockedURLs',{urls:['*tesseract-core*.wasm.js']},params.sessionId):undefined)
   .then(()=>client.send('Runtime.runIfWaitingForDebugger',{},params.sessionId)).catch(()=>{});
 }});
 await send('Target.setAutoAttach',{autoAttach:true,waitForDebuggerOnStart:false,flatten:true});
 async function evaluate(expression){const value=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(value.exceptionDetails)throw Error(value.exceptionDetails.exception?.description||value.exceptionDetails.text);return value.result?.value}
 async function navigate(route){const navigation=await send('Page.navigate',{url:origin+route});if(navigation.errorText)throw Error('Navigation failed: '+route+' '+navigation.errorText);await sleep(650);let ready=false;for(let i=0;i<100;i++){if(await evaluate('document.readyState === "complete" && !!document.querySelector("h1")')){ready=true;break}await sleep(200)}if(!ready)throw Error('Page did not finish loading: '+route);await sleep(350)}
 const sitemap=await (await fetch(origin+'/sitemap.xml')).text();
 const routes=[...sitemap.matchAll(/<loc>https:\/\/multipdfdoc.com([^<]*)<\/loc>/g)].map(x=>x[1]||'/');
 for(const width of process.env.SKIP_PAGE_AUDIT ? [] : [320,375,768,1024,1440]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
  for(const route of routes){
   await navigate(route);
   const state=await evaluate(`(()=>{const guide=document.querySelector('[data-guide]');return {h1:document.querySelectorAll('h1').length,title:document.title,canonical:document.querySelector('link[rel=canonical]')?.href,overflow:document.documentElement.scrollWidth>innerWidth+1,guideWords:guide?.innerText.trim().split(/\\s+/).length||0,jsonLd:[...document.querySelectorAll('script[type="application/ld+json"]')].map(x=>{try{return JSON.parse(x.textContent)['@type']}catch{return 'INVALID'}}),unlabeled:[...document.querySelectorAll('input:not([type=file]):not([type=hidden]),select,textarea,button')].filter(x=>x.getClientRects().length&&!x.getAttribute('aria-label')&&!x.getAttribute('aria-labelledby')&&!x.getAttribute('title')&&!x.labels?.length&&!x.textContent.trim()).map(x=>x.outerHTML.slice(0,180)),missingImages:[...document.images].filter(x=>x.complete&&x.naturalWidth===0).map(x=>x.src)}})()`);
   if(width===375||width===1440){await evaluate(fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8'));state.accessibility=await evaluate('(async()=>{const r=await axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa","best-practice"]}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))})()')}results.pages.push({route,width,...state});console.log(width,route,'overflow='+state.overflow,'guideWords='+state.guideWords,'labels='+state.unlabeled.length);
   if(route==='/'&&(width===375||width===1440)){const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(rootDir,'scratch',`homepage-${width}.png`),Buffer.from(shot.data,'base64'))}
  }
 }
 await navigate('/');
 await evaluate(`document.querySelector('button[aria-label="Search tools"]').click()`);await sleep(200);
 const opened=await evaluate(`document.querySelector('dialog')?.open && document.activeElement?.tagName==='INPUT'`);if(!opened)throw Error('Search focus not initialized');
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await sleep(100);
 if(!await evaluate(`!document.querySelector('dialog')?.open`))throw Error('Search did not close on Escape');results.workflows.push('Search opens with focus and closes with Escape');
 await navigate('/pdf/to-text');
 const doc=await send('DOM.getDocument');const input=await send('DOM.querySelector',{nodeId:doc.root.nodeId,selector:'input[type=file]'});await send('DOM.setFileInputFiles',{nodeId:input.nodeId,files:[fixturePath]});await sleep(800);
 await evaluate(`(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('Start Extraction'));if(!b)throw Error('Missing extraction control');b.click()})()`);
 let found=false;for(let i=0;i<50;i++){await sleep(250);found=await evaluate(`document.querySelector('textarea')?.value.includes(${JSON.stringify(UNIQUE_MARKER)})`);if(found)break}if(!found)throw Error('Local native PDF extraction failed');results.workflows.push('Real two-page PDF.js native text extraction');
 if(results.postRequests.length)throw Error('Unexpected POST during local workflow: '+results.postRequests.join(','));
 await navigate('/does-not-exist');if(!await evaluate(`document.querySelector('h1').textContent.includes('Find your next')`))throw Error('Custom 404 absent');results.workflows.push('Useful custom 404');

 async function setInput(selector,value,index=0){await evaluate('(()=>{const el=document.querySelectorAll('+JSON.stringify(selector)+')['+index+'];if(!el)throw Error("Missing field "+'+JSON.stringify(selector)+');const setter=Object.getOwnPropertyDescriptor(el.tagName==="TEXTAREA"?HTMLTextAreaElement.prototype:el.tagName==="SELECT"?HTMLSelectElement.prototype:HTMLInputElement.prototype,"value").set;setter.call(el,'+JSON.stringify(value)+');el.dispatchEvent(new Event("input",{bubbles:true}));el.dispatchEvent(new Event("change",{bubbles:true}));})()');await sleep(70)}
 async function clickText(text){await evaluate('(()=>{const el=[...document.querySelectorAll("button")].find(x=>x.textContent.includes('+JSON.stringify(text)+'));if(!el)throw Error("Missing button "+'+JSON.stringify(text)+');if(el.disabled)throw Error("Disabled button "+'+JSON.stringify(text)+');el.click()})()')}
 async function upload(files=[fixturePath]){const doc=await send('DOM.getDocument');const input=await send('DOM.querySelector',{nodeId:doc.root.nodeId,selector:'input[type=file]'});await send('DOM.setFileInputFiles',{nodeId:input.nodeId,files});await sleep(1000)}
 async function waitFor(expression){for(let i=0;i<100;i++){if(await evaluate(expression))return;await sleep(200)}throw Error('Timed out: '+expression+' toolLinks: '+await evaluate("document.querySelectorAll('#tools a').length")+' body: '+await evaluate('document.body.innerText.slice(0,1600)'))}
 async function downloadPdf(){await waitFor('!!document.querySelector("a[download][href^=blob]")');const raw=await evaluate('(async()=>{const link=document.querySelector("a[download][href^=blob]");return [...new Uint8Array(await (await fetch(link.href)).arrayBuffer())]})()');return new Uint8Array(raw)}
 async function workflow(name,fn){try{await fn();await evaluate(fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8'));const a11y=await evaluate('(async()=>{const r=await axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa","best-practice"]}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))})()');if(a11y.length){results.workflowAccessibility||=[];results.workflowAccessibility.push({name,violations:a11y});throw Error('Accessibility violations: '+a11y.map(v=>v.id).join(','))}results.workflows.push(name);console.log('PASS workflow',name)}catch(error){results.workflowFailures||=[];results.workflowFailures.push({name,error:error.message});console.error('FAIL workflow',name,error.message);process.exitCode=1}}
 const {createPdfToolkit}=await import('pdfstudio');const toolkit=await createPdfToolkit();let encryptedFixture;
 await workflow('Analytics decline persists and keyboard focus follows choices',async()=>{
  await navigate('/');await evaluate('localStorage.removeItem("multipdfdoc-analytics-choice-v1")');await navigate('/');
  await clickText('No thanks');await waitFor('document.activeElement?.textContent.includes("Analytics choices")');
  if(await evaluate('!!document.querySelector("script[src*=googletagmanager]")'))throw Error('Analytics loaded without permission');
  await navigate('/blog');await waitFor('document.body.innerText.includes("Analytics choices — off")');
  await clickText('Analytics choices');await waitFor('document.activeElement?.textContent==="No thanks"');await clickText('No thanks');
 });
 await workflow('Published practice files exercise full-page OCR and native extraction',async()=>{
  await navigate('/pdf/to-text');await upload([path.join(rootDir,'public/samples/mixed-text-and-scan-demo.pdf')]);await clickText('Start Extraction');
  await waitFor('document.querySelector("textarea")?.value.includes("NATIVE TEXT SAMPLE")');
  if(await evaluate('document.querySelector("textarea").value.includes("DEMO-104")'))throw Error('Native extraction incorrectly read scanned pixels');
  await evaluate('document.querySelector("input[type=checkbox]").click()');await clickText('Start Extraction');
  await waitFor('document.querySelector("textarea")?.value.includes("DEMO-104")');
  if(!await evaluate('document.querySelector("textarea").value.includes("42.00")'))throw Error('Sample amount not recognized');
 });
 await workflow('Published numbering sample skips first two pages',async()=>{
  await navigate('/pdf/page-numbers');await upload([path.join(rootDir,'public/samples/five-page-numbering-demo.pdf')]);
  await setInput('input[aria-label="First physical page to number"]','3');await clickText('Apply Page Numbers');
  const numbered=await PDFDocument.load(await downloadPdf());if(numbered.getPageCount()!==5)throw Error('Sample lost pages');
  const footers=await evaluate("(async()=>{const lib=await import('/vendor/pdfjs/pdf.min.mjs');lib.GlobalWorkerOptions.workerSrc='/vendor/pdfjs/pdf.worker.min.mjs';const data=new Uint8Array(await(await fetch(document.querySelector('a[download][href^=blob]').href)).arrayBuffer());const pdf=await lib.getDocument({data}).promise;const lines=[];for(let i=1;i<=pdf.numPages;i++){const text=await(await pdf.getPage(i)).getTextContent();lines.push(text.items.filter(x=>x.transform?.[5]<50).map(x=>x.str).join(' ').trim())}await pdf.destroy();return lines})()");
  if(JSON.stringify(footers)!==JSON.stringify(['','','Page 1 of 3','Page 2 of 3','Page 3 of 3']))throw Error('Stamped numbering does not match published example: '+JSON.stringify(footers));
 });
 await workflow('Homepage category filters preserve all 15 tool links',async()=>{
  await navigate('/');
  for(const [label,count,prefix] of [['Academic (3)',3,'/calc/'],['Business (2)',2,null],['PDF Tools (',10,'/pdf/']]){
   await clickText(label);await waitFor(`document.querySelectorAll('#tools a').length===${count}`);
   if(prefix&&!await evaluate(`Array.from(document.querySelectorAll('#tools a')).every(a=>a.getAttribute('href').startsWith(${JSON.stringify(prefix)}))`))throw Error('Wrong filtered tool category');
  }
  await evaluate(`Array.from(document.querySelectorAll('#tools button')).find(b=>b.textContent.includes('All Tools')).focus()`);
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  await waitFor(`document.querySelectorAll('#tools a').length===15`);
 });
 await workflow('Merge two PDFs into four pages',async()=>{await navigate('/pdf/merge');await upload([fixturePath,fixturePath]);await clickText('Merge');const bytes=await downloadPdf();if((await PDFDocument.load(bytes)).getPageCount()!==4)throw Error('Wrong merge page count')});
 await workflow('Split strict selection into one page',async()=>{await navigate('/pdf/split');await upload();await setInput('input[type=text]','2');await clickText('Extract');const bytes=await downloadPdf();if((await PDFDocument.load(bytes)).getPageCount()!==1)throw Error('Wrong split page count');await setInput('input[type=text]','1x');await clickText('Extract');await sleep(400);if(await evaluate('!!document.querySelector("a[download][href^=blob]")'))throw Error('Invalid selection kept a stale output')});
 await workflow('Organize rotation survives PDF export',async()=>{await navigate('/pdf/organize');await upload();await evaluate(`document.querySelector('button[title^="Rotate Right"]').click()`);await clickText('Apply Changes');const pdf=await PDFDocument.load(await downloadPdf());if(pdf.getPageCount()!==2||pdf.getPage(0).getRotation().angle!==90)throw Error('Rotation missing')});
 await workflow('Page numbers export retains two pages and rejects clipped stamps',async()=>{await navigate('/pdf/page-numbers');await upload([smallPagePath]);await clickText('Apply Page Numbers');await waitFor('document.body.innerText.includes("too small for this number")');if(await evaluate('!!document.querySelector("a[download][href^=blob]")'))throw Error('Clipped stamp was exported');await navigate('/pdf/page-numbers');await upload();await clickText('Apply Page Numbers');const pdf=await PDFDocument.load(await downloadPdf());if(pdf.getPageCount()!==2)throw Error('Wrong numbered page count')});
 await workflow('Browser encrypts AES-256 with distinct owner password',async()=>{await navigate('/pdf/protect');await upload();await setInput('input[placeholder*=strong]','TestPassword-2026');await setInput('input[placeholder*=Re-enter]','TestPassword-2026');await clickText('Protect PDF with Password');const bytes=await downloadPdf();const info=await toolkit.getInfo(bytes,{password:'TestPassword-2026'});if(!info.encrypted||info.encryption.bits!==256 || info.encryption.ownerPasswordMatched)throw Error('Encryption mismatch');encryptedFixture=path.join(rootDir,'scratch','fixture-encrypted.pdf');fs.writeFileSync(encryptedFixture,bytes)});
 await workflow('Browser decrypts a real protected PDF',async()=>{if(!encryptedFixture)throw Error('Encryption fixture unavailable');await navigate('/pdf/unlock');await upload([encryptedFixture]);await setInput('input[type=password]','TestPassword-2026');await clickText('Unlock');const bytes=await downloadPdf();if((await toolkit.getInfo(bytes)).encrypted)throw Error('Still encrypted');if((await PDFDocument.load(bytes)).getPageCount()!==2)throw Error('Unlock lost pages')});
 await workflow('Lossless compressor exports a readable PDF',async()=>{await navigate('/pdf/compress');await upload();await clickText('Lossless Only');await clickText('Compress to Under');if((await PDFDocument.load(await downloadPdf())).getPageCount()!==2)throw Error('Compression lost pages')});
 await workflow('PDF-to-image renders both pages at 150 DPI',async()=>{await navigate('/pdf/to-image');await upload();await clickText('150 DPI');await clickText('Render to');await waitFor('document.querySelectorAll("a[download][href^=data]").length===2');const width=await evaluate(`(async()=>{const i=new Image();i.src=document.querySelector('a[download][href^=data]').href;await i.decode();return i.naturalWidth})()`);if(width!==1250)throw Error('Unexpected raster width '+width);results.imageWidth=width});
 const images=await evaluate('(()=>{const c=document.createElement("canvas");c.width=480;c.height=320;const ctx=c.getContext("2d");ctx.fillStyle="white";ctx.fillRect(0,0,480,320);ctx.fillStyle="black";ctx.font="32px sans-serif";ctx.fillText("LOCAL OCR TEST",20,100);return [c.toDataURL("image/png"),c.toDataURL("image/webp")]})()');
 const imageFiles=['png','webp'].map((ext,i)=>{const p=path.join(rootDir,'scratch','fixture-image.'+ext);fs.writeFileSync(p,Buffer.from(images[i].split(',')[1],'base64'));return p});
 await workflow('PNG and WebP images produce two PDF pages',async()=>{await navigate('/pdf/from-image');await upload(imageFiles);await clickText('Convert');if((await PDFDocument.load(await downloadPdf())).getPageCount()!==2)throw Error('Image export lost pages')});
 await workflow('Tesseract recognizes a scanned image locally',async()=>{await navigate('/pdf/to-text');await upload([imageFiles[0]]);await clickText('Start Extraction');await waitFor(`document.querySelector('textarea')?.value.includes('LOCAL OCR TEST')`)});
 await workflow('Invoice export and edit invalidate stale download',async()=>{await navigate('/invoice');await setInput('input[aria-label="Sender business name"]','Fixture Studio');await setInput('input[aria-label="Client business name"]','Fixture Client');await setInput('input[aria-label="Item description"]','Design work');await setInput('input[aria-label="Item unit price"]','50');await clickText('Generate');if((await PDFDocument.load(await downloadPdf())).getPageCount()<1)throw Error('Invoice missing');await setInput('input[aria-label="Sender business name"]','Changed Studio');if(await evaluate('!!document.querySelector("a[download][href^=blob]")'))throw Error('Stale invoice remains')});
 await workflow('Expense log exports a genuine self-entered record',async()=>{await navigate('/receipt');await setInput('input[aria-label="Payee / Vendor Name"]','Fixture Vendor');await setInput('input[aria-label="Business Purpose (IRS Requirement)"]','Fixture business meeting');await setInput('input[aria-label="Item description"]','Actual travel');await setInput('input[aria-label="Expense amount"]','10');await clickText('Download Expense Voucher');if((await PDFDocument.load(await downloadPdf())).getPageCount()<1)throw Error('Expense record missing')});
 await workflow('Local OCR can be cancelled and retried',async()=>{await navigate('/pdf/to-text');await upload([path.join(rootDir,'scratch/fixture-image.png')]);await clickText('Start Extraction');await waitFor('Array.from(document.querySelectorAll("button")).some(b=>b.textContent.includes("Cancel extraction"))');await clickText('Cancel extraction');await waitFor('document.body.innerText.includes("Extraction cancelled")');await clickText('Start Extraction');await waitFor('document.querySelector("textarea")?.value.includes("LOCAL OCR TEST")');});
 await workflow('Blocked OCR engine reports an error and recovers on retry',async()=>{
  await navigate('/pdf/to-text');await upload([path.join(rootDir,'scratch/fixture-image.png')]);
  blockOcrCore=true;await send('Target.setAutoAttach',{autoAttach:true,waitForDebuggerOnStart:true,flatten:true});
  try{await clickText('Start Extraction');await waitFor('document.body.innerText.includes("local OCR engine could not load")');if(await evaluate('!!document.querySelector("textarea")?.value'))throw Error('Blocked engine retained a transcript');}
  finally{blockOcrCore=false;await send('Target.setAutoAttach',{autoAttach:true,waitForDebuggerOnStart:false,flatten:true});}
  await clickText('Start Extraction');await waitFor('document.querySelector("textarea")?.value.includes("LOCAL OCR TEST")');
 });
 await workflow('Malformed OCR input reports an error without a stale transcript',async()=>{const bad=path.join(rootDir,'scratch/fixture-invalid.pdf');fs.writeFileSync(bad,'%PDF-1.7 invalid fixture');await navigate('/pdf/to-text');await upload([bad]);await clickText('Start Extraction');await waitFor('!!document.querySelector("[role=alert]")');if(await evaluate('!!document.querySelector("textarea")?.value'))throw Error('Malformed input produced a transcript');});
 await workflow('Mixed digital and image PDF supports explicit full-page OCR',async()=>{const mixed=await PDFDocument.create(),p=mixed.addPage([600,400]),img=await mixed.embedPng(fs.readFileSync(path.join(rootDir,'scratch/fixture-image.png')));p.drawText('DIGITAL HEADING',{x:30,y:360,size:18});p.drawImage(img,{x:20,y:20,width:480,height:320});const fixture=path.join(rootDir,'scratch/fixture-mixed.pdf');fs.writeFileSync(fixture,await mixed.save());await navigate('/pdf/to-text');await upload([fixture]);await evaluate('document.querySelector("input[type=checkbox]").click()');await clickText('Start Extraction');await waitFor('document.querySelector("textarea")?.value.includes("LOCAL OCR TEST")');});
 await workflow('Contact creates a local draft without claiming delivery',async()=>{await navigate('/contact');await setInput('input[type=text]','Fixture User');await setInput('input[type=email]','fixture@example.com');await setInput('textarea','Non-sensitive fixture feedback');await evaluate(`(()=>{const link=document.querySelector('a[href^="mailto:"]');if(!link.href.includes('Fixture%20User')||!link.href.includes('fixture%40example.com'))throw Error('Email draft is incomplete');document.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))})()`);await waitFor('document.body.innerText.includes("Email Draft Prepared")');if(!await evaluate('document.querySelector("textarea")?.value.includes("Non-sensitive fixture feedback")'))throw Error('Draft text missing');});
 await workflow('GPA zero-credit courses are excluded',async()=>{await navigate('/calc/gpa');const count=await evaluate(`document.querySelectorAll('input[aria-label="Course credits"]').length`);if(count<1)throw Error('Missing editable course credits');for(let i=0;i<count;i++)await setInput('input[aria-label="Course credits"]','0',i);if(!await evaluate('document.body.innerText.includes("Enter at least one positive-credit")'))throw Error('Zero credits not reflected')});
 await workflow('Words calculator handles empty text without NaN',async()=>{await navigate('/calc/words-to-pages');await setInput('textarea','');if(await evaluate('/NaN|Infinity/.test(document.body.innerText)'))throw Error('Nonfinite result')});
 await workflow('Grade calculator computes the 114-percent required score',async()=>{await navigate('/calc/final-grade');if(!await evaluate('document.body.innerText.includes("114.0%")'))throw Error('Grade formula incorrect');await setInput('input[aria-label="Final exam weight percentage"]','0');if(!await evaluate('document.body.innerText.includes("Enter grades from 0")'))throw Error('Zero weight was silently replaced')});
 if(results.postRequests.length)throw Error('Unexpected local document POST: '+results.postRequests.join(','));

 client.close();
 const issues=results.pages.filter(p=>p.h1!==1||!p.canonical||new URL(p.canonical).href!==new URL("https://multipdfdoc.com"+p.route).href||!p.title||p.overflow||p.unlabeled.length||p.missingImages.length||p.jsonLd.includes("INVALID")||p.accessibility?.length);
 if(issues.length||results.exceptions.length||results.workflowFailures?.length||results.postRequests.length||results.externalRequests.length){process.exitCode=1;console.error("Browser issues:",issues.map(p=>p.route+"@"+p.width+" "+p.accessibility?.map(x=>x.id).join(",")))}
} catch(error){results.error=error.stack;process.exitCode=1;console.error(error)}
finally{fs.writeFileSync(path.join(rootDir,'docs','reports','static-browser-audit.json'),JSON.stringify(results,null,2));chromeProc.kill()}
