/* eslint-disable @typescript-eslint/no-require-imports */
const {chromium}=require('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{const browser=await chromium.launch({headless:true,channel:'chrome'});const errors=[],checks=[];try{
 const page=await browser.newPage({reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
 const base='http://127.0.0.1:3028';
 for(const width of [360,390,768,1440])for(const route of ['/products','/products/ebook-formula-profitable-blueprint','/checkout/ebook-formula-profitable-blueprint']){
  await page.setViewportSize({width,height:960});const r=await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:120000});assert.equal(r.status(),200);await page.locator('h1').first().waitFor();await page.evaluate(()=>document.fonts.ready);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' overflow '+width);
  if(route.includes('/products/')){await page.locator('[data-gallery-ready=true]').waitFor();await page.getByRole('button',{name:'Perbesar preview produk'}).click();const modal=page.getByRole('dialog');await modal.waitFor();
   for(const zoom of [50,75,100,125,150]){await modal.getByRole('combobox',{name:'Persentase zoom'}).selectOption(String(zoom));assert.equal(await modal.getByRole('combobox').inputValue(),String(zoom));}
   await modal.getByRole('button',{name:'Reset zoom ke 100%'}).click();assert.equal(await modal.getByRole('combobox').inputValue(),'100');await modal.getByRole('button',{name:'Zoom in',exact:true}).click();assert.equal(await modal.getByRole('combobox').inputValue(),'125');
   await page.keyboard.press('0');assert.equal(await modal.getByRole('combobox').inputValue(),'100');await page.keyboard.press('Escape');await modal.waitFor({state:'hidden'});assert.ok(await page.getByRole('button',{name:'Perbesar preview produk'}).evaluate(e=>e===document.activeElement));
   await page.screenshot({path:`artifacts/payments/gallery-${width}.png`,fullPage:false});
  }
  if(route.startsWith('/checkout')){assert.ok(await page.getByRole('link',{name:'Masuk untuk membeli'}).count());assert.ok(await page.getByRole('button',{name:/Lanjut bayar/}).isDisabled());}
  if(route==='/products')await page.screenshot({path:`artifacts/payments/catalog-${width}.png`,fullPage:false});checks.push(route+' '+width);
 }
 for(const [route,status]of [['/api/studio/commerce/payment-qa',404],['/api/internal/commerce/doku/reconcile',404],['/api/commerce/download',401],['/api/commerce/doku/webhook',401]]){const r=await page.request.post(base+route,{data:{}});assert.equal(r.status(),status,route)}
 assert.deepEqual(errors,[]);fs.writeFileSync('artifacts/payments/browser-verification.json',JSON.stringify({passed:true,checks,errors,scope:'real published catalog via anonymous reads, disabled payments, no order creation',at:new Date().toISOString()},null,2));console.log(JSON.stringify({passed:true,layouts:checks.length,errors}));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
