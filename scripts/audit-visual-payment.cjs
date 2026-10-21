/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const base = process.env.QA_BASE || 'http://localhost:3042', out = 'artifacts/visual-payment';
fs.mkdirSync(out,{recursive:true});
const fixtureEnabled=process.env.QA_CHECKOUT_FIXTURE==='true' && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base);
const fixtureDir=path.resolve('src/app/visual-checkout-qa');
if(fixtureEnabled) {
  assert.ok(fixtureDir.startsWith(path.resolve('src/app')+path.sep));
  assert.ok(!fs.existsSync(fixtureDir),'Refuse to overwrite an existing QA route');
  fs.mkdirSync(fixtureDir);
  fs.writeFileSync(path.join(fixtureDir,'page.tsx'),`import { CheckoutForm } from "@/components/commerce/CheckoutForm";
import { CommerceShell } from "@/components/commerce/CommerceShell";
import type { Product } from "@/lib/commerce-types";
export default function Page(){return <CommerceShell><h1>Checkout QA</h1><CheckoutForm product={{id:"00000000-0000-4000-8000-000000000001",slug:"qa-checkout",name:"Formula Profitable Blueprint",price:59000,category:"Ebook",cover_url:"",currency:"IDR"} as Product} email="buyer@example.invalid" name="Buyer QA" available guestEnabled /></CommerceShell>}`);
}
(async()=>{ const browser=await chromium.launch({channel:'chrome',headless:true}); const page=await browser.newPage({reducedMotion:'reduce'}), errors=[], checks=[], issues=[]; page.on('pageerror',e=>errors.push(e.message));
try {
for(const theme of ['dark','light']) {
  await page.addInitScript(t=>{localStorage.setItem('khadafi-home-theme',t);localStorage.setItem('khadafi-language-offer-dismissed','true')},theme);
  for(const route of ['/','/resources','/resources/high-context-prompts-pack','/products','/products/ebook-formula-profitable-blueprint','/checkout/ebook-formula-profitable-blueprint','/services','/about','/freelance','/freelance/belajar/mulai-freelance','/blog','/login','/privacy','/komunitas']) {
    await page.setViewportSize({width:1440,height:1000});
    const response=await page.goto(base+route,{waitUntil:'networkidle',timeout:120000}); assert.equal(response.status(),200,route); await page.evaluate(()=>document.fonts.ready);
    const result=await page.evaluate(()=>{
      const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d',{willReadFrequently:true});
      const rgb=c=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=c;ctx.fillRect(0,0,1,1);const d=ctx.getImageData(0,0,1,1).data;return [d[0],d[1],d[2],d[3]/255];}, lum=c=>c.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
      const over=(fg,bg)=>fg.slice(0,3).map((v,i)=>v*(fg[3]??1)+bg[i]*(1-(fg[3]??1)));
      const bad=[];
      for(const el of document.querySelectorAll('h1,h2,h3,h4,p,small,label,summary,a,button,span,dt,dd,li')) {
        const text=[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim();if(!text||!el.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})||el.closest('[aria-hidden="true"]'))continue;
        const st=getComputedStyle(el), box=el.getBoundingClientRect();if(box.width<5||box.height<5)continue;
        const fg=rgb(st.color);if(fg.length<3||(fg[3]??1)<.1)continue;
        const layers=[];for(let n=el;n;n=n.parentElement){const bg=rgb(getComputedStyle(n).backgroundColor);if(bg.length>=3)layers.push(bg);if((bg[3]??0)>=1)break;}let bg=[255,255,255];for(const layer of layers.reverse())bg=over(layer,bg);
        const l1=lum(over(fg,bg)),l2=lum(bg),ratio=(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);const large=parseFloat(st.fontSize)>=24||(parseFloat(st.fontSize)>=18.66&&Number(st.fontWeight)>=700);const target=large?3:4.5;
        if(ratio<target-.1)bad.push({text:text.slice(0,85),ratio:+ratio.toFixed(2),target,color:st.color,bg:bg.map(Math.round),cls:String(el.className).slice(0,90)});
      }return {bad,overflow:document.documentElement.scrollWidth>innerWidth+1};
    });
    assert.equal(result.overflow,false,route+' overflow');issues.push({theme,route,items:result.bad});checks.push(theme+' '+route);fs.writeFileSync(out+'/contrast.json',JSON.stringify(issues,null,2));
    if(['/', '/resources','/checkout/ebook-formula-profitable-blueprint'].includes(route))await page.screenshot({path:`${out}/${theme}-${route==='/'?'home':route.split('/')[1]}.png`,fullPage:route==='/resources'});
    if(route==='/resources'){
      const cards=page.locator('article[data-resource]');assert.equal(await cards.count(),20);assert.equal(await cards.locator('[class*="thumbnailLink"]').count(),20);
      await cards.first().scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/${theme}-cards.png`});const details=cards.first().locator('details');assert.equal(await details.getAttribute('open'),null);await details.locator('summary').click();assert.notEqual(await details.getAttribute('open'),null);await details.locator('summary').click();assert.equal(await details.getAttribute('open'),null);
      const gap=await page.evaluate(()=>{const c=document.querySelector('[class*="coverWrap"]'),h=document.querySelector('header[class*="hero"]');return h.querySelector('[class*="heroMeta"]').getBoundingClientRect().top-c.getBoundingClientRect().bottom});assert.ok(gap<90,'banner gap '+gap);
    }
    if(route==='/'){assert.equal(await page.getByRole('link',{name:'Hubungi Support'}).getAttribute('href'),'https://threads.com/khdfii9');assert.equal(await page.locator('a[class*="sectionBridge"]').count(),6);}
    if(route.startsWith('/checkout'))assert.equal(await page.getByRole('radio').count(),0);
  }
  for(const route of ['/','/resources','/products','/checkout/ebook-formula-profitable-blueprint']){await page.setViewportSize({width:390,height:844});await page.goto(base+route,{waitUntil:'networkidle',timeout:120000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' mobile overflow');await page.screenshot({path:`${out}/${theme}-mobile-${route==='/'?'home':route.split('/')[1]}.png`});checks.push(theme+' mobile '+route);}
}
if(fixtureEnabled) {
  await page.goto(base+'/visual-checkout-qa',{waitUntil:'networkidle'});
  let submitted;await page.route('**/api/commerce/orders',async route=>{submitted=route.request().postDataJSON();await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({order_id:'fixture-order',payment_url:'https://checkout.doku.com/checkout-link-v2/fixture'})});});
  await page.route('https://checkout.doku.com/**',route=>route.fulfill({status:200,contentType:'text/html',body:'<h1>DOKU fixture handoff</h1>'}));
  assert.equal(await page.getByRole('radio').count(),0);await page.locator('[name=consent]').check();await page.getByRole('button',{name:/Lanjut pembayaran/}).click();await page.waitForURL('https://checkout.doku.com/**');assert.equal(submitted.method,'all');assert.equal(submitted.slug,'qa-checkout');assert.equal(submitted.consent,true);checks.push('provider redirect after submit, all methods');
  await page.goto(base+'/visual-checkout-qa',{waitUntil:'networkidle'});await page.unroute('**/api/commerce/orders');await page.route('**/api/commerce/orders',route=>route.fulfill({status:409,contentType:'application/json',body:JSON.stringify({error:'Pesanan sebelumnya belum memiliki link pembayaran yang terverifikasi. Periksa pesananmu sebelum mengulang pembayaran.'})}));
  await page.locator('[name=consent]').check();await page.getByRole('button',{name:/Lanjut pembayaran/}).click();await page.locator('form [role=alert]').waitFor();assert.ok(await page.getByRole('link',{name:'Periksa pesanan saya'}).count());assert.equal(await page.getByRole('radio').count(),0);checks.push('pending order recovery, no duplicate new-order action');
}
fs.writeFileSync(out+'/contrast.json',JSON.stringify(issues,null,2));fs.writeFileSync(out+'/results.json',JSON.stringify({checks,errors,scope:'public pages and intercepted checkout fixture; no real payment'},null,2));console.log(JSON.stringify({checks:checks.length,errors,contrast:issues.filter(x=>x.items.length).map(x=>({theme:x.theme,route:x.route,count:x.items.length,examples:x.items.slice(0,5)}))},null,2));assert.deepEqual(errors,[]);
}finally{await browser.close();if(fixtureEnabled)fs.rmSync(fixtureDir,{recursive:true});}})().catch(e=>{console.error(e);process.exitCode=1});
