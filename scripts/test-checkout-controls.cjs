/* eslint-disable @typescript-eslint/no-require-imports */
// Local component fixture only. Provider and order HTTP calls are intercepted.
const {chromium}=require('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=process.env.QA_BASE||'http://127.0.0.1:3042';
assert.match(base,/^http:\/\/(127\.0\.0\.1|localhost):\d+$/);
const dir=path.resolve('src/app/visual-checkout-qa');assert.ok(!fs.existsSync(dir));fs.mkdirSync(dir);
fs.writeFileSync(path.join(dir,'page.tsx'),`import { CheckoutForm } from '@/components/commerce/CheckoutForm';
import { CommerceShell } from '@/components/commerce/CommerceShell';
import type { Product } from '@/lib/commerce-types';
export default function Page(){return <CommerceShell><h1>Local checkout fixture</h1><CheckoutForm product={{id:'00000000-0000-4000-8000-000000000001',slug:'qa-checkout',name:'Formula Profitable Blueprint',price:59000,category:'Ebook',cover_url:'',currency:'IDR'} as Product} email='buyer@example.invalid' name='Buyer QA' available guestEnabled /></CommerceShell>}`);
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});const context=await browser.newContext({reducedMotion:'reduce'}),page=await context.newPage();const errors=[],checks=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  let count=0,body,release;
  const handoff='https://checkout.doku.com/checkout-link-v2/local-test';
  await page.route('https://checkout.doku.com/**',r=>r.fulfill({status:200,contentType:'text/html',body:'<h1>Mock provider</h1>'}));
  for(const theme of ['dark','light'])for(const width of [390,1440]){
   await page.addInitScript(t=>localStorage.setItem('khadafi-home-theme',t),theme);await page.setViewportSize({width,height:900});
   const gate=new Promise(resolve=>{release=resolve});
   await page.route('**/api/commerce/orders',async r=>{count++;body=r.request().postDataJSON();await gate;await r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({order_id:'fixture',payment_url:handoff})})});
   await page.goto(base+'/visual-checkout-qa',{waitUntil:'domcontentloaded',timeout:120000});
   const card=page.getByRole('button',{name:/Pilih cara bayar di DOKU/});await card.waitFor();
   const before=count;await card.click();assert.equal(count,before,'Consent is required');assert.equal(await page.locator('[name=consent]').evaluate(e=>e.validity.valueMissing),true);
   await page.locator('[name=consent]').check();await card.click();await page.getByRole('button',{name:/Menyiapkan halaman DOKU/}).waitFor();
   assert.equal(await page.getByRole('button',{name:/Menyiapkan halaman DOKU/}).isDisabled(),true);assert.equal(await page.getByRole('button',{name:/Menyiapkan pesanan/}).isDisabled(),true);
   await page.locator('form').evaluate(form=>form.requestSubmit());assert.equal(count,before+1,'Duplicate submission prevented');
   assert.equal(body.method,'all');assert.equal(body.consent,true);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.screenshot({path:`artifacts/visual-payment/checkout-control-${theme}-${width}.png`,fullPage:true});release();await page.waitForURL(handoff);await page.unroute('**/api/commerce/orders');checks.push(`${theme} ${width}: consent, card action, busy, duplicate guard, hosted handoff`);
  }
  await page.route('**/api/commerce/orders',r=>r.fulfill({status:409,contentType:'application/json',body:JSON.stringify({error:'Pesanan sebelumnya belum memiliki link pembayaran yang terverifikasi. Periksa pesananmu sebelum mengulang pembayaran.'})}));
  await page.goto(base+'/visual-checkout-qa',{waitUntil:'domcontentloaded'});await page.locator('[name=consent]').check();await page.getByRole('button',{name:/Lanjut pembayaran/}).click();await page.locator('form [role=alert]').waitFor();assert.ok(page.url().includes('/visual-checkout-qa'));assert.equal(await page.getByRole('link',{name:/Periksa pesanan saya/}).count(),1);assert.equal(await page.getByRole('button',{name:/Pilih cara bayar di DOKU/}).isEnabled(),true);checks.push('Bottom action uses same form; ambiguous order stays on recovery UI');
  assert.deepEqual(errors,[]);fs.writeFileSync('artifacts/visual-payment/checkout-controls-results.json',JSON.stringify({checks,uncaughtErrors:errors,realProviderCalls:0},null,2));console.log(JSON.stringify({passed:checks.length,uncaughtErrors:errors,realProviderCalls:0}));
 }finally{await browser.close();fs.rmSync(dir,{recursive:true});}
})().catch(e=>{console.error(e);process.exitCode=1});
