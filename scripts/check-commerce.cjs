/* eslint-disable @typescript-eslint/no-require-imports -- Standalone security regression checks. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ts=require('typescript');
const {createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..');
let checks=0;
function check(name,fn){fn();checks++;console.log('PASS '+name);}
function load(file,mocks={},globals={}){
 const loaded={exports:{}};
 const code=ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
 const context={module:loaded,exports:loaded.exports,require:name=>Object.hasOwn(mocks,name)?mocks[name]:require(name),Response,Request,URL,Buffer,AbortSignal,console:{info(){},error(){}},process:{env:{}},...globals};
 vm.runInNewContext(code,context,{filename:file});return loaded.exports;
}
const media=load('src/lib/product-media.ts');
const types=load('src/lib/commerce-types.ts',{'./product-media':media});
const valid={name:'Formula Profitable Blueprint',slug:'formula-profitable-blueprint',category:'Ebook',price:59000,status:'draft',cover_url:'/products/cover.webp',featured:true,included:['Chapter 1'],short_description:'A real ebook',description:'',audience:'',preview:'',seo_title:'',seo_description:''};
check('safe redirect refuses external, protocol-relative and backslash paths',()=>{for(const target of ['https://evil.invalid','//evil.invalid','/\\evil.invalid','/x\r\nLocation: evil'])assert.equal(types.safeReturnTo(target),'/account');assert.equal(types.safeReturnTo('/checkout/book?step=1'),'/checkout/book?step=1');});
check('product input rejects manipulated prices, statuses and executable covers',()=>{assert.equal(types.validateProduct(valid).price,59000);for(const p of [{price:-1},{price:'59000'},{status:'paid'},{cover_url:'javascript:alert(1)'},{included:[null]},{slug:'../../secret'}])assert.throws(()=>types.validateProduct({...valid,...p}));});
check('payment states require approved capture; unknown and partial refund do not grant paid',()=>{assert.equal(types.paymentStatus('settlement'),'paid');assert.equal(types.paymentStatus('capture','accept'),'paid');assert.equal(types.paymentStatus('capture','challenge'),'pending');assert.equal(types.paymentStatus('capture','deny'),null);assert.equal(types.paymentStatus('partial_refund'),null);assert.equal(types.paymentStatus('refund'),'refunded');});
const json=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store'}});
async function run(){
 const key='test-only-not-a-production-key';
 const order='12345678-1234-4234-8234-123456789012';
 const notification={order_id:order,status_code:'200',gross_amount:'59000.00',transaction_status:'settlement'};
 notification.signature_key=createHash('sha512').update(order+'200'+'59000.00'+key).digest('hex');
 let writes=[],fetchCount=0,canonical={order_id:order,gross_amount:'59000.00',currency:'IDR',transaction_id:'provider-reference',transaction_status:'pending'};
 const webhook=load('src/app/api/commerce/webhook/route.ts',{
  '@/lib/commerce-server':{json},
  '@/lib/commerce-types':types,
  '@/lib/supabase':{createServiceRoleClient:()=>({rpc:async(name,payload)=>{writes.push({name,payload});return {error:null};}})}
 },{process:{env:{MIDTRANS_SERVER_KEY:key,SUPABASE_SERVICE_ROLE_KEY:'test-only-service',MIDTRANS_IS_PRODUCTION:'true'}},fetch:async()=>{fetchCount++;return Response.json(canonical);}});
 const req=p=>new Request('https://khadafidaffa.com/api/commerce/webhook',{method:'POST',body:JSON.stringify(p)});
 assert.equal((await webhook.POST(req({...notification,signature_key:'0'.repeat(128)}))).status,401);
 assert.equal(fetchCount,0);assert.equal(writes.length,0);checks++;console.log('PASS forged webhook signature cannot fetch or write');
 assert.equal((await webhook.POST(req(notification))).status,200);assert.equal(writes.at(-1).payload.p_status,'pending');
 checks++;console.log('PASS signed notification with altered paid status uses provider verification');
 canonical={...canonical,transaction_status:'settlement'};
 await webhook.POST(req(notification));assert.equal(writes.at(-1).payload.p_total,59000);assert.equal(writes.at(-1).payload.p_status,'paid');
 checks++;console.log('PASS verified payment sends exact server amount to atomic fulfillment');
 const count=writes.length;canonical={...canonical,order_id:'wrong-order'};
 assert.equal((await webhook.POST(req(notification))).status,400);assert.equal(writes.length,count);
 checks++;console.log('PASS mismatched canonical order cannot fulfill');
 let owned=[];let serviceCalls=0;let expiry=0;
 const query={select(){return this;},eq(){return this;},then(resolve){resolve({data:owned,error:null});}};
 const download=load('src/app/api/commerce/download/route.ts',{
  '@/lib/commerce-server':{json,commerceConfigured:()=>true,requireUser:async()=>({ok:true,user:{id:'customer-a'},client:{from:()=>query}})},
  '@/lib/supabase':{createServiceRoleClient:()=>{serviceCalls++;return {from:()=>({select(){return this;},eq(){return this;},order:async()=>({data:[{storage_path:'private/product.pdf',name:'product.pdf'}],error:null})}),storage:{from:()=>({createSignedUrl:async(_p,seconds)=>{expiry=seconds;return {data:{signedUrl:'https://storage.invalid/temporary'},error:null};}})}};}}
 });
 const dreq=()=>new Request('https://khadafidaffa.com/api/commerce/download',{method:'POST',body:JSON.stringify({product_id:'someone-elses-product'})});
 assert.equal((await download.POST(dreq())).status,403);assert.equal(serviceCalls,0);
 owned=[{expires_at:'2000-01-01T00:00:00Z'}];assert.equal((await download.POST(dreq())).status,403);assert.equal(serviceCalls,0);
 checks++;console.log('PASS unowned or expired access cannot reach privileged storage');
 owned=[{expires_at:null}];const downloaded=await download.POST(dreq());assert.equal(downloaded.status,200);assert.equal(expiry,900);assert.equal(downloaded.headers.get('Cache-Control'),'private, no-store');
 checks++;console.log('PASS authorized download has 15-minute URL and no-store response');
 const noAuth={ok:false,response:json({error:'Login required'},401)};
 const checkout=load('src/app/api/commerce/orders/route.ts',{'@/lib/commerce-server':{json,sameOrigin:()=>true,requireUser:async()=>noAuth},'@/lib/guest-order':{},'@/lib/supabase':{createServiceRoleClient:()=>{throw new Error('Must not reach storage');}}});
 assert.equal((await checkout.POST(new Request('https://khadafidaffa.com/api/commerce/orders',{method:'POST',headers:{authorization:'Bearer invalid'},body:'{}'}))).status,401);
 assert.equal((await checkout.POST(new Request('https://khadafidaffa.com/api/commerce/orders',{method:'POST',body:'{}'}))).status,400);
 checks++;console.log('PASS invalid auth and incomplete guest checkout cannot reach database');
 const page=fs.readFileSync(path.join(root,'src/app/checkout/success/page.tsx'),'utf8');assert.ok(!/commerce_set_payment|\\.update\(|\\.insert\(/.test(page));checks++;console.log('PASS success page only reads authenticated order status');
 console.log(checks+' commerce security checks passed.');
}
run().catch(error=>{console.error(error);process.exitCode=1;});
