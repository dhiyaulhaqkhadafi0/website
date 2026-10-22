/* eslint-disable @typescript-eslint/no-require-imports */
// Anonymous views only; refuses checkout creation in this test context.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{const out='artifacts/visual-payment/promotion-live';fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage({reducedMotion:'reduce'}),errors=[],checks=[];let writes=0;
 page.on('pageerror',error=>errors.push(error.message));await page.route('**/api/commerce/orders',route=>{if(route.request().method()==='POST'){writes++;return route.abort();}return route.continue();});
 try{for(const theme of ['dark','light']){
  await page.addInitScript(value=>{localStorage.setItem('khadafi-home-theme',value);localStorage.setItem('khadafi-language-offer-dismissed','true');},theme);
  for(const width of [390,1440]){await page.setViewportSize({width,height:900});for(const route of ['/products','/products/ebook-formula-profitable-blueprint','/checkout/ebook-formula-profitable-blueprint']){
   const response=await page.goto('https://khadafidaffa.com'+route,{waitUntil:'networkidle',timeout:90000});assert.equal(response.status(),200);await page.evaluate(()=>document.fonts.ready);
   const price=page.locator('[data-product-price="59000"]').first();await price.waitFor();assert.ok((await price.locator('del').textContent()).includes('298.000'));assert.ok((await price.textContent()).includes('59.000'));assert.ok((await price.textContent()).includes('Hemat 80%'));
   assert.equal(await page.getByText(/Rp\s*1\.000/).count(),0);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   if(route.startsWith('/checkout/')){assert.equal(await page.getByRole('radio').count(),0);assert.ok(await page.getByRole('button',{name:/Lanjut pembayaran.*59\.000/}).isDisabled());assert.ok(await page.getByRole('link',{name:/Masuk untuk membeli/}).isVisible());}
   await page.screenshot({path:out+'/'+theme+'-'+width+'-'+(route.startsWith('/checkout/')?'checkout':route==='/products'?'catalog':'product')+'.png'});checks.push({theme,width,route,sellingPrice:59000,regularPrice:298000});
  }}
 }assert.equal(writes,0);assert.deepEqual(errors,[]);const result={passed:true,checks,errors,orderWrites:writes,realPayments:0};fs.writeFileSync(out+'/result.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
