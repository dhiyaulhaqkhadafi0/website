/* eslint-disable @typescript-eslint/no-require-imports -- Browser acceptance; no live transactions or uploads. */
const {chromium}=require('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=process.env.QA_BASE || 'http://localhost:3026',out=path.resolve('artifacts/commerce-experience',base.startsWith('https')?'production':'local');
fs.mkdirSync(out,{recursive:true});
async function run(){
 const browser=await chromium.launch({headless:true,channel:'chrome'}),errors=[],layouts=[],checks=[];
 try {
  const context=await browser.newContext({reducedMotion:'reduce'}),page=await context.newPage();
  page.on('pageerror',e=>errors.push({url:page.url(),message:e.message,stack:e.stack}));
  for(const route of ['/products','/products/ebook-formula-profitable-blueprint','/checkout/ebook-formula-profitable-blueprint','/']) for(const width of [375,768,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:120000});await page.locator('h1').first().waitFor();await page.evaluate(()=>document.fonts.ready);
   if(route==='/products')await page.waitForSelector('[data-hydrated="true"]');
   await page.evaluate(async()=>{[...document.images].forEach(i=>{i.loading='eager';});await Promise.all([...document.images].map(i=>i.complete?null:new Promise(r=>{const timer=setTimeout(r,20000);const done=()=>{clearTimeout(timer);r();};i.addEventListener('load',done,{once:true});i.addEventListener('error',done,{once:true});})));});
   const layout=await page.evaluate(()=>({width:innerWidth,document:document.documentElement.scrollWidth,broken:[...document.images].filter(i=>!i.complete || i.naturalWidth===0).map(i=>i.src)}));
   assert.ok(layout.document<=width+1,route+' overflow '+width+': '+layout.document);assert.deepEqual(layout.broken,[],route+' broken images');layouts.push({route,...layout});
   await page.screenshot({path:path.join(out,route==='/'?`home-${width}.png`:route.replaceAll('/','-').slice(1)+`-${width}.png`),fullPage:true});console.log('PASS layout '+route+' '+width);
  }
  checks.push('12 responsive layouts, real covers, no overflow');
  await page.goto(base+'/products');await page.waitForSelector('[data-hydrated="true"]');
  const search=page.getByRole('searchbox');await search.fill('zz-no-such-item');await page.getByRole('button',{name:'Cari koleksi',exact:true}).click();await page.getByText('Belum ada yang cocok.',{exact:true}).waitFor();assert.ok(page.url().includes('q='));
  await search.fill('Notion');await search.press('Enter');await page.getByRole('heading',{name:'Notion',exact:true}).waitFor();await page.getByRole('button',{name:'Hapus pencarian',exact:true}).click();
  await page.getByRole('heading',{name:'Ebook Formula Profitable Blueprint',exact:true}).waitFor();
  const card=page.locator('article[data-offering="original"]').first(),before=await card.boundingBox();await card.getByText('Ringkasan',{exact:true}).click();const after=await card.boundingBox();assert.ok(Math.abs(before.height-after.height)<1);assert.ok(await card.locator('details').getAttribute('open')!==null);await card.getByText('Ringkasan',{exact:true}).click();
  checks.push('search submit/Enter/empty/reset and summary without grid resize');
  await page.goto(base+'/products/ebook-formula-profitable-blueprint');const thumbnails=await page.locator('button[aria-label^="Lihat gambar "]').count();if(thumbnails>1)await page.getByRole('button',{name:'Lihat gambar 3',exact:true}).click();await page.getByRole('button',{name:'Perbesar preview produk'}).click();const modal=page.getByRole('dialog',{name:/Preview/});await modal.waitFor();if(thumbnails>1){await modal.getByRole('button',{name:'Gambar sebelumnya'}).click();await modal.getByText('2 / 3',{exact:false}).waitFor();await modal.getByRole('button',{name:'Gambar berikutnya'}).click();await modal.getByText('3 / 3',{exact:false}).waitFor();}await modal.getByRole('button',{name:'Zoom in',exact:true}).click();await modal.getByText(/150%/).waitFor();await modal.getByRole('button',{name:'Zoom out',exact:true}).click();await page.keyboard.press('Escape');await modal.waitFor({state:'hidden'});assert.equal(await page.getByRole('button',{name:'Perbesar preview produk'}).evaluate(e=>e===document.activeElement),true);
  assert.ok((await page.locator('body').innerText()).includes('Daffa Dhiyaulhaq Khadafi'));
  checks.push('real product preview, zoom, Escape/focus return and creator; '+thumbnails+' gallery thumbnails');
  await page.goto(base+'/checkout/ebook-formula-profitable-blueprint');await page.locator('input[name=email]').waitFor();assert.ok(!page.url().includes('/login'));await page.getByLabel('Nama lengkap',{exact:true}).fill('Local UI check');await page.locator('input[name=email]').fill('local-ui@example.invalid');
  assert.equal(await page.locator('input[name="consent"]').isChecked(),false);assert.ok((await page.locator('body').innerText()).includes('Bank / Virtual Account'));checks.push('guest checkout public, consent required and payment method context');
  await page.goto(base+'/login');await page.getByRole('button',{name:'Masuk lewat tautan email'}).click();assert.equal(await page.getByLabel('Password',{exact:true}).count(),0);checks.push('passwordless library login option');
  await page.evaluate(()=>localStorage.setItem('khadafi-home-theme','light'));
  for(const route of ['/products','/products/ebook-formula-profitable-blueprint','/checkout/ebook-formula-profitable-blueprint'])for(const width of [375,1440]){
   await page.setViewportSize({width,height:1000});await page.goto(base+route,{waitUntil:'domcontentloaded'});await page.locator('[data-theme="light"]').first().waitFor();await page.evaluate(()=>document.fonts.ready);
   const size=await page.evaluate(()=>document.documentElement.scrollWidth);assert.ok(size<=width+1,route+' light overflow');layouts.push({route,theme:'light',width,document:size});await page.screenshot({path:path.join(out,route.replaceAll('/','-').slice(1)+`-${width}-light.png`),fullPage:true});
  }
  checks.push('6 light-theme layouts without overflow');
  const nojs=await browser.newContext({javaScriptEnabled:false}),plain=await nojs.newPage();await plain.goto(base+'/login');assert.equal(await plain.getByRole('button',{name:'Masuk',exact:true}).isDisabled(),true);assert.equal(await plain.locator('form').first().getAttribute('method'),'post');await plain.goto(base+'/checkout/ebook-formula-profitable-blueprint');assert.equal(await plain.locator('form[aria-label="Checkout produk"]').getAttribute('method'),'post');await nojs.close();checks.push('POST and hydration privacy before JavaScript (checkout requires JavaScript for payment)');
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify({base,checks,layouts,errors},null,2));console.log(JSON.stringify({checks,layouts:layouts.length,errors},null,2));
 }finally{await browser.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
