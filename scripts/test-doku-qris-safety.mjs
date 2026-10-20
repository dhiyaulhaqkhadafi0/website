import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { dokuInvoice,orderIdFromDokuInvoice,signature,verifyDokuHmacSignature } from '../src/lib/doku-security.ts';
import { dokuPolicy } from '../src/lib/doku-config.ts';
import { handleDokuWebhookHttp } from '../src/lib/doku-webhook-handler.ts';
import { reconcileScheduled } from '../cloudflare/doku-schedule.mjs';
// Cryptographic unit vectors ONLY, never assigned to server/provider environment.
const client='unit-vector-client',key='unit-vector-hmac',target='/api/commerce/doku/webhook';
const id=randomUUID(),invoice=dokuInvoice(id),inbox=new Map();let paid=false,grants=0,fail=false;
const deps={verify:(h,b)=>verifyDokuHmacSignature(h,b,client,key,target),decodeInvoice:orderIdFromDokuInvoice,invoiceForOrder:dokuInvoice,canSettle:()=>true,
 persist:async e=>{if(fail)throw Error('durable persistence failure');if(e.orderId!==id||e.amount!==1000)throw Error('Order mismatch');if(inbox.has(e.eventId)&&inbox.get(e.eventId)!==e.bodyHash)throw Error('Replay conflict');inbox.set(e.eventId,e.bodyHash);if(e.status==='SUCCESS'&&!paid){paid=true;grants++}}};
function payload(patch={}){return JSON.stringify({service:{id:'QRIS'},channel:{id:'QRIS_DOKU'},order:{invoice_number:invoice,amount:1000,currency:'IDR'},transaction:{status:'SUCCESS'},...patch})}
function request(body=payload(),opts={}){const requestId=opts.requestId||randomUUID(),timestamp=new Date(Date.now()+(opts.age||0)).toISOString();return new Request('https://unit.invalid'+target,{method:'POST',headers:{'Client-Id':opts.client||client,'Request-Id':requestId,'Request-Timestamp':timestamp,Signature:opts.signature||signature(client,requestId,timestamp,opts.target||target,body,key)},body})}
let checks=0;async function expect(name,req,code){const r=await handleDokuWebhookHttp(req,deps);assert.equal(r.status,code,name);checks++;console.log('PASS '+name)}
await expect('QRIS signature invalid',request(payload(),{signature:'HMACSHA256=invalid'}),401);
await expect('QRIS wrong Client-Id',request(payload(),{client:'other'}),401);
await expect('QRIS wrong request target',request(payload(),{target:'/wrong'}),401);
await expect('QRIS stale replay outside 13h delivery window',request(payload(),{age:-14*3600_000}),401);
await expect('QRIS future timestamp beyond skew',request(payload(),{age:6*60_000}),401);
await expect('QRIS wrong currency',request(payload({order:{invoice_number:invoice,amount:1000,currency:'USD'}})),400);
await expect('QRIS unknown invoice',request(payload({order:{invoice_number:'KSXYZ',amount:1000}})),503);
await expect('QRIS signed amount mismatch',request(payload({order:{invoice_number:invoice,amount:1001}})),503);
await expect('QRIS unapproved channel',request(payload({channel:{id:'CREDIT_CARD'}})),400);
await expect('bounded chunked body',request('x'.repeat(32769)),413);
fail=true;await expect('durable DB failure is non-2xx',request(),503);fail=false;assert.equal(paid,false);
const eventId=randomUUID();await expect('QRIS official Non-SNAP envelope signed SUCCESS',request(payload(),{requestId:eventId}),200);
await expect('QRIS exact duplicate',request(payload(),{requestId:eventId}),200);
await expect('conflicting body under same event ID',request(payload({transaction:{status:'FAILED'}}),{requestId:eventId}),503);
await Promise.all(Array.from({length:5},()=>expect('concurrent signed SUCCESS',request(),200)));assert.equal(grants,1);
await expect('late PENDING observed without regression',request(payload({transaction:{status:'PENDING'}})),200);assert.equal(paid,true);
const env={DOKU_CLIENT_ID:client,DOKU_SECRET_KEY:key,DOKU_SITE_ORIGIN:'https://isolated.example',NEXT_PUBLIC_SUPABASE_URL:'http://127.0.0.1:54321',DOKU_ENABLED:'true',PAYMENTS_ENABLED:'true'};
assert.equal(dokuPolicy(env).checkout,true);assert.equal(dokuPolicy({...env,NEXT_PUBLIC_SUPABASE_URL:'https://mykgtajanxczdnzekycl.supabase.co'}).configured,false);
assert.equal(dokuPolicy({...env,NEXT_PUBLIC_SUPABASE_URL:'https://zhxqjmciowxozrohutoi.supabase.co'}).configured,false);
assert.equal(dokuPolicy({...env,PAYMENTS_ENABLED:'false'}).configured,true);assert.equal(dokuPolicy({...env,PAYMENTS_ENABLED:'false'}).checkout,false);
const live={...env,DOKU_IS_PRODUCTION:'true',DOKU_SITE_ORIGIN:'https://khadafidaffa.com',NEXT_PUBLIC_SUPABASE_URL:'https://mykgtajanxczdnzekycl.supabase.co',DOKU_PRODUCTION_APPROVED:'true',DOKU_QA_ENABLED:'true',DOKU_QA_LIVE_APPROVED:'true',DOKU_QRIS_ENABLED:'true'};
assert.equal(dokuPolicy({...live,DOKU_QRIS_STATUS:'UPDATING'}).qaCheckout,false);
assert.equal(dokuPolicy({...live,DOKU_QRIS_STATUS:'ACTIVE'}).qaCheckout,true);assert.equal(dokuPolicy({...live,DOKU_QRIS_STATUS:'ACTIVE'}).checkout,false);checks++;console.log('PASS environment isolation, independent kill switch, QRIS ACTIVE and private/public gate separation');
assert.deepEqual(await reconcileScheduled({}),{skipped:true});let calls=0;
await reconcileScheduled({DOKU_RECONCILE_ENABLED:'true',DOKU_RECONCILE_TOKEN:'a'.repeat(40),DOKU_SITE_ORIGIN:'https://isolated.example',WORKER_SELF_REFERENCE:{fetch:async r=>{calls++;assert.equal(new URL(r.url).pathname,'/api/internal/commerce/doku/reconcile');assert.ok(r.headers.get('authorization'));assert.equal(new URL(r.url).search,'');return new Response('{}')}}});
assert.equal(calls,1);await assert.rejects(()=>reconcileScheduled({DOKU_RECONCILE_ENABLED:'true'}));checks++;console.log('PASS scheduler service binding, secret header, disabled and missing-config safety');
console.log(JSON.stringify({passed:true,checks,scope:'offline vectors and scheduler contract; no provider call'}));
