// Offline contract: all supported channels use the exact signed handler.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import { DOKU_CHANNELS } from '../src/lib/doku-channels.mjs';
import { handleDokuWebhookHttp } from '../src/lib/doku-webhook-handler.ts';
import { signature, verifyDokuHmacSignature, dokuInvoice, orderIdFromDokuInvoice } from '../src/lib/doku-security.ts';

const id=randomUUID(), invoice=dokuInvoice(id), path='/api/commerce/doku/webhook';
const client='OFFLINE-CLIENT', key='OFFLINE-HMAC-VECTOR';
let persisted=0;
const deps={verify:(headers,body)=>verifyDokuHmacSignature(headers,body,client,key,path),
  decodeInvoice:orderIdFromDokuInvoice,invoiceForOrder:dokuInvoice,canSettle:()=>true,
  persist:async event=>{assert.equal(event.orderId,id);assert.equal(event.amount,1000);persisted++;}};
async function send(channel,type='SALE',overrides={},signed=true){
  const raw=JSON.stringify({order:{invoice_number:invoice,amount:1000,currency:'IDR'},channel:{id:channel},transaction:{status:'SUCCESS',type},...overrides});
  const requestId=randomUUID(),time=new Date().toISOString();
  return handleDokuWebhookHttp(new Request('https://unit.invalid'+path,{method:'POST',headers:{
    'Client-Id':client,'Request-Id':requestId,'Request-Timestamp':time,
    Signature:signed?signature(client,requestId,time,path,raw,key):'invalid'},body:raw}),deps);
}
for(const channel of DOKU_CHANNELS) assert.equal((await send(channel)).status,200,channel);
assert.equal(persisted,DOKU_CHANNELS.length);
for(const channel of ['CREDIT_CARD','GOOGLE_PAY','KARTU_KREDIT_INDONESIA']){
  for(const type of ['AUTHORIZE','REFUND','UNKNOWN',null]) assert.equal((await send(channel,type)).status,400);
  assert.equal((await send(channel,'CAPTURE')).status,200);
}
const before=persisted;
assert.equal((await send('PAYMENT_LINK')).status,400);
assert.equal((await send('UNKNOWN')).status,400);
assert.equal((await send(null)).status,400);
assert.equal((await send('EMONEY_DOKU','SALE',{},false)).status,401);
assert.equal((await send('VIRTUAL_ACCOUNT_BNI','SALE',{order:{invoice_number:invoice,amount:1000,currency:'USD'}})).status,400);
assert.equal(persisted,before);
const sql=fs.readFileSync('supabase/migrations/20261021041208_doku_checkout_active_channels.sql','utf8');
const sqlChannels=[...sql.match(/p_channel not in \(([\s\S]*?)\n \)/)[1].matchAll(/'([^']+)'/g)].map(x=>x[1]);
assert.deepEqual([...sqlChannels].sort(),[...DOKU_CHANNELS].sort());
console.log(`PASS ${DOKU_CHANNELS.length} signed Checkout channels, card sale/capture, authorization rejection, signature/currency/unknown rejection and exact SQL allowlist`);
