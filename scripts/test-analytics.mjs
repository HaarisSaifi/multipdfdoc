import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const origin=process.env.TEST_ORIGIN||'http://localhost:3000';
const chrome=spawn(process.env.CHROME_PATH||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless=new','--remote-debugging-port=9224','--no-first-run','--user-data-dir='+path.resolve('scratch/chrome-analytics-profile')],{stdio:'ignore'});
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const report={mockedLoaders:[],unexpectedExternalRequests:[],checks:[]};
let ws;
try{
 let endpoint;
 for(let i=0;i<40;i++){try{endpoint=(await(await fetch('http://localhost:9224/json/version')).json()).webSocketDebuggerUrl;break}catch{await pause(250)}}
 if(!endpoint)throw Error('Chrome did not start');
 ws=new WebSocket(endpoint);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject});
 let id=0,session;const pending=new Map();
 const send=(method,params={},target=session)=>new Promise((resolve,reject)=>{const next=++id;const timer=setTimeout(()=>{pending.delete(next);reject(Error('Timed out '+method))},15000);pending.set(next,r=>{clearTimeout(timer);r.error?reject(Error(r.error.message)):resolve(r.result)});ws.send(JSON.stringify({id:next,method,params,...(target?{sessionId:target}:{})}))});
 ws.onmessage=e=>{const message=JSON.parse(e.data);if(message.id){pending.get(message.id)?.(message);pending.delete(message.id)}else if(message.method==='Fetch.requestPaused'){
  const {requestId,request}=message.params;
  if(request.url.startsWith('https://www.googletagmanager.com/gtag/js?id=')){
   report.mockedLoaders.push(request.url);send('Fetch.fulfillRequest',{requestId,responseCode:200,responseHeaders:[{name:'Content-Type',value:'application/javascript'}],body:Buffer.from('/* Mock loader: deliberately sends no real analytics. */').toString('base64')}).catch(()=>{});
  }else{if(/^https?:/.test(request.url)&&new URL(request.url).origin!==origin){report.unexpectedExternalRequests.push(request.url);send('Fetch.failRequest',{requestId,errorReason:'BlockedByClient'}).catch(()=>{})}else send('Fetch.continueRequest',{requestId}).catch(()=>{})}
 }};
 const target=await send('Target.createTarget',{url:'about:blank'},undefined);session=(await send('Target.attachToTarget',{targetId:target.targetId,flatten:true},undefined)).sessionId;
 await send('Page.enable');await send('Runtime.enable');await send('Fetch.enable',{patterns:[{urlPattern:'*'}]});
 const evalJs=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text);return r.result.value};
 const waitFor=async expression=>{for(let i=0;i<80;i++){if(await evalJs(expression))return;await pause(100)}throw Error('Condition failed '+expression)};
 const go=async route=>{await send('Page.navigate',{url:origin+route});await waitFor('document.readyState==="complete" && !!document.querySelector("h1")');await pause(400)};
 const click=async label=>{if(!await evalJs('(()=>{const b=Array.from(document.querySelectorAll("button")).find(x=>x.textContent.includes('+JSON.stringify(label)+'));if(!b)return false;b.click();return true})()'))throw Error('Missing '+label)};
 await go('/');await evalJs('localStorage.clear()');await go('/?privateInput=DO_NOT_SEND#secret');
 if(report.mockedLoaders.length)throw Error('Loader requested before consent');report.checks.push('No analytics loader before opt-in');
 await click('Allow analytics');await waitFor('Array.isArray(window.dataLayer) && window.dataLayer.some(x=>x[0]==="event")');await pause(400);
 if(report.mockedLoaders.length!==1)throw Error('Expected one consented mock loader');
 let events=await evalJs('window.dataLayer');if(JSON.stringify(events).includes('DO_NOT_SEND')||JSON.stringify(events).includes('#secret'))throw Error('URL input leaked');
 await evalJs("document.querySelector('a[href=\"/blog\"]').click()");await waitFor('location.pathname==="/blog" && window.dataLayer.filter(x=>x[0]==="event").length===2');
 events=await evalJs('window.dataLayer');if(events.filter(x=>x[0]==='js').length!==1)throw Error('Analytics reinitialized on client navigation');
 if(events.filter(x=>x[0]==='event').some(x=>/[?#]/.test(x[2].page_location)))throw Error('Unsanitized page location');
 report.checks.push('One initialization and two sanitized page visits across client navigation');
 await click('Analytics choices');await click('No thanks');await pause(700);await waitFor('document.body.innerText.includes("Analytics choices — off")');
 if(await evalJs('!!document.querySelector("script[src*=googletagmanager]")'))throw Error('Loader survived withdrawal');
 await go('/pdf/merge');if(await evalJs('!!document.querySelector("script[src*=googletagmanager]")'))throw Error('Denied choice did not persist');
 if(report.unexpectedExternalRequests.length)throw Error('Unexpected external request');report.checks.push('Withdrawal reload removes loader and persists across pages');
 console.log('PASS optional analytics: opt-in, mocked loader, sanitized navigation, single initialization, withdrawal; no real Google collection');
}catch(error){report.error=error.stack;process.exitCode=1;console.error(error)}finally{fs.writeFileSync('docs/reports/analytics-consent-2026-10-11.json',JSON.stringify(report,null,2));ws?.close();chrome.kill()}
