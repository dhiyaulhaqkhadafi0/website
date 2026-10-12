/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node CommonJS browser verification script. */
const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=process.env.QA_BASE_URL||'http://localhost:3211';
const ua='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36';
const destination='https://refer.micro1.ai/referral/jobs?referralCode=b22f58a9-d462-4389-ab54-34e45d361215&utm_source=referral&utm_medium=share&utm_campaign=job_referral';
(async()=>{
 fs.mkdirSync('artifacts/micro1',{recursive:true});const browser=await chromium.launch({channel:'chrome',headless:true});const context=await browser.newContext({userAgent:ua,locale:'id-ID',timezoneId:'Asia/Jakarta',reducedMotion:'reduce',...(process.env.QA_PROXY?{proxy:{server:process.env.QA_PROXY}}:{})});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const checks=[];const pass=name=>{checks.push(name);console.log('PASS',name);};
 try{
  for(const width of [360,768,1280]){
   await page.setViewportSize({width,height:950});await page.goto(base+'/freelance/direktori/micro1',{waitUntil:'networkidle'});
   await page.getByRole('heading',{level:1,name:'Micro1 — Peluang Remote untuk Expert di Era AI'}).waitFor();
   assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('details').count(),9);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.screenshot({path:`artifacts/micro1/public-${width}.png`,fullPage:true,caret:'initial'});
   await page.screenshot({path:`artifacts/micro1/hero-${width}.png`,caret:'initial'});
   pass('public layout '+width);
  }
  const faq=page.locator('summary').filter({hasText:'Apakah bisa mendaftar dari Indonesia?'});await faq.click();assert.ok(await page.locator('details[open]').count());await faq.click();pass('FAQ expands and collapses');
  await page.getByRole('link',{name:'Pelajari Cara Kerjanya'}).click();assert.equal(new URL(page.url()).hash,'#cara-kerja');pass('timeline anchor');
  const cta=page.getByRole('link',{name:'Jelajahi Peluang di Micro1',exact:false}).first();assert.equal(await cta.getAttribute('rel'),'sponsored noopener noreferrer');assert.equal(await cta.getAttribute('href'),'/go/micro1?campaign=website-directory');
  await context.route('**/*',async route=>{const request=route.request();if(request.method()==='POST'&&request.url()===base+'/go/micro1'){const response=await route.fetch({maxRedirects:0});assert.equal(response.status(),303);assert.equal(response.headers().location,destination);await route.fulfill({status:200,contentType:'text/html',body:'<h1>Verified referral destination intercepted for QA</h1>'});}else if(request.url().startsWith('https://refer.micro1.ai/'))await route.abort();else await route.continue();});
  const popupPromise=context.waitForEvent('page');await cta.click();const popup=await popupPromise;await popup.getByText('Verified referral destination intercepted for QA').waitFor({timeout:20000});await popup.close();pass('actual browser navigation -> tracked POST -> exact referral destination');
  await page.goto(base+'/studio/affiliates',{waitUntil:'networkidle'});await page.getByRole('heading',{name:'Affiliate workspace.'}).waitFor();assert.equal(await page.getByRole('navigation',{name:'Area affiliate'}).count(),0);await page.screenshot({path:'artifacts/micro1/unauthenticated-studio.png',caret:'initial'});pass('server-gated Studio reveals no manager/data');
  for(const entity of ['programs','links','campaigns','commissions']){for(const method of ['GET','POST','PATCH']){const r=await context.request.fetch(base+'/api/studio/affiliates/'+entity,{method,data:method==='GET'?undefined:{},maxRedirects:0});assert.equal(r.status(),401);assert.ok(r.headers()['cache-control'].includes('no-store'));}}pass('all admin API methods reject missing auth');
  const forbidden=await context.request.get(base+'/api/studio/affiliates/programs',{headers:{Authorization:'Bearer invalid-token'}});assert.equal(forbidden.status(),401);pass('invalid session rejected');
  for(const [suffix,status] of [['?url=https://evil.test',400],['?campaign=unknown-campaign',404],['?campaign=a&campaign=b',400],['?campaign=../../evil',400]]){const r=await context.request.get(base+'/go/micro1'+suffix,{maxRedirects:0});assert.equal(r.status(),status);assert.ok(r.headers()['cache-control'].includes('no-store'));assert.ok(!r.headers().location);}pass('unknown campaigns and open redirect attempts rejected');
  assert.equal((await context.request.head(base+'/go/micro1')).status(),204);pass('HEAD has no event');
  const prefetch=await context.request.get(base+'/go/micro1',{headers:{'sec-purpose':'prefetch'},maxRedirects:0});assert.equal(prefetch.status(),302);assert.equal(prefetch.headers().location,destination);pass('prefetch resolves without click event');
  const bridge=await context.request.get(base+'/go/micro1?campaign=website-directory',{maxRedirects:0});assert.equal(bridge.status(),200);const html=await bridge.text();const token=html.match(/name="navigation" value="([^"]+)"/)[1];
  for(let i=0;i<2;i++){const r=await context.request.post(base+'/go/micro1',{form:{navigation:token},headers:{Origin:base},maxRedirects:0});assert.equal(r.status(),303);assert.equal(r.headers().location,destination);}pass('identical navigation token retries remain idempotent');
  const forged=await context.request.post(base+'/go/micro1',{form:{navigation:token+'x'},headers:{Origin:base},maxRedirects:0});assert.equal(forged.status(),400);const csrf=await context.request.post(base+'/go/micro1',{form:{navigation:token},headers:{Origin:'https://evil.test'},maxRedirects:0});assert.equal(csrf.status(),403);pass('signed token tampering and foreign origin rejected');
  for(const href of ['/freelance/tools/mulai-freelance-dari-nol','/freelance/tools/portfolio-starter-kit','/freelance/direktori','/freelance/jobs','/freelance/cari'])assert.equal((await context.request.get(base+href)).status(),200);pass('related routes and existing Freelance sections remain available');
  assert.deepEqual(errors,[]);pass('no browser runtime exceptions');fs.writeFileSync('artifacts/micro1/public-browser-qa.json',JSON.stringify({base,time:new Date().toISOString(),checks,errors,trackingTestNavigations:2,externalRequests:'Intercepted; no provider form submitted'},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
