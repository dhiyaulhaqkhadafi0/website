/* eslint-disable @typescript-eslint/no-require-imports */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript'),crypto=require('node:crypto');
function load(file,mocks={}){const mod={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{module:mod,exports:mod.exports,require:n=>mocks[n]??require(n),process:{env:{DOKU_SITE_ORIGIN:'https://khadafidaffa.com'}},Response,Request,URL,Buffer,Error});return mod.exports;}
(async()=>{
 const methods=load('src/lib/checkout-methods.ts'),policy=load('src/lib/doku-config.ts');
 let state='pending',providerCalls=0,methodSeen,code='',price=59000,total=59000;const id=crypto.randomUUID();
 const route=load('src/app/api/commerce/orders/route.ts',{
  '@/lib/commerce-server':{sameOrigin:()=>true,requireUser:async()=>({ok:true,user:{id:'owner',email:'buyer@example.invalid'}}),json:(d,s=200)=>Response.json(d,{status:s}),publishedProduct:async()=>({id:'product',price}),commerceConfigured:()=>true},
  '@/lib/supabase':{createServiceRoleClient:()=>({rpc:async(_name,args)=>{assert.equal(args.p_user,'owner');assert.equal(args.p_product,'product');return {data:{id,total,status:state,provider:'doku'}};}})},
  '@/lib/guest-order':{grantGuestOrder:async()=>{throw Error('No guest grant expected');}},
  '@/lib/doku-order-checkout':{checkoutForDokuOrder:async(order,_email,_name,_qa,method)=>{assert.equal(order.total,price);methodSeen=method;providerCalls++;if(code)throw Error(code);return 'https://checkout.doku.com/checkout-link-v2/fixture';}},
  '@/lib/doku-webhook-handler':{readLimitedBody:async r=>r.text()},'@/lib/checkout-methods':methods,'@/lib/doku-config':policy,
 });
 const post=(extra={})=>route.POST(new Request('https://khadafidaffa.com/api/commerce/orders',{method:'POST',headers:{authorization:'Bearer fixture'},body:JSON.stringify({slug:'ebook',name:'Buyer',consent:true,key:crypto.randomUUID(),amount:1,status:'paid',...extra})}));
 let response=await post();assert.equal(response.status,200);assert.match((await response.json()).payment_url,/^https:\/\/checkout\.doku\.com\//);assert.equal(methodSeen,'all');assert.equal(providerCalls,1);
 state='paid';response=await post();assert.equal((await response.json()).status,'paid');assert.equal(providerCalls,1);
 state='pending';code='DOKU_CHECKOUT_PENDING';response=await post();assert.equal(response.status,409);assert.equal((await response.json()).code,code);
 code='';response=await post({method:'invalid'});assert.equal(response.status,400);assert.equal(providerCalls,2);
 price=1000;response=await post();assert.equal(response.status,409);assert.equal((await response.json()).code,'DOKU_ORDER_PRICE_CHANGED');assert.equal(providerCalls,2);
 total=1000;response=await post({amount:59000});assert.equal(response.status,200);assert.ok((await response.json()).payment_url);assert.equal(providerCalls,3);
 state='paid';total=59000;response=await post();assert.equal((await response.json()).status,'paid');assert.equal(providerCalls,3);
 state='pending';price=59000;total=1000;response=await post();assert.equal(response.status,409);assert.equal((await response.json()).code,'DOKU_ORDER_PRICE_CHANGED');assert.equal(providerCalls,3);
 console.log('PASS server price and owner, hosted all-method handoff, paid-order resume without provider call, pending recovery and invalid method rejection; no real provider calls');
 console.log('PASS temporary Rp1,000 handoff ignores client amount, blocks older Rp59,000 pending orders and the reverse price change, and preserves paid-order access without provider calls');
})().catch(e=>{console.error(e);process.exitCode=1});
