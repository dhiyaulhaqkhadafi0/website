import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {deliverTransactionEmails,emailConfiguration,transactionMessage} from '../cloudflare/transaction-email.mjs';
const env={TRANSACTION_EMAIL_ENABLED:'true',SMTP_USER:'sender@example.invalid',SMTP_PASS:'OFFLINE_FAKE',SMTP_FROM:'sender@example.invalid',NEXT_PUBLIC_SUPABASE_URL:'https://mykgtajanxczdnzekycl.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'OFFLINE_FAKE_SERVICE'};
const job={id:randomUUID(),order_id:randomUUID(),lease_token:randomUUID(),kind:'payment_received',recipient:'buyer@example.invalid',total:59000,product_names:'Offline fixture'};
assert.equal(emailConfiguration({...env,SMTP_FROM:'other@example.invalid'}),null);
assert.equal(emailConfiguration({...env,NEXT_PUBLIC_SUPABASE_URL:'https://chikki.example.invalid'}),null);
const message=transactionMessage(job,env.SMTP_FROM);assert.ok(message.text.includes('59.000'));assert.ok(message.text.includes('https://khadafidaffa.com/account/library'));assert.ok(!message.text.includes('OFFLINE_FAKE'));assert.equal(message.headers['Message-ID'],transactionMessage(job,env.SMTP_FROM).headers['Message-ID']);
assert.throws(()=>transactionMessage({...job,recipient:'buyer@example.invalid\r\nBcc:leak@example.invalid'},env.SMTP_FROM));
for(const fail of [false,true]){
 const writes=[],logs=[];let sends=0;
 const result=await deliverTransactionEmails(env,{send:async(config,msg)=>{sends++;assert.equal(config.secure,true);assert.equal(config.port,465);assert.equal(msg.to,job.recipient);if(fail)throw new Error('PRIVATE_RAW_SMTP_RESPONSE');},requestFetch:async(url,request)=>{assert.ok(url.startsWith(env.NEXT_PUBLIC_SUPABASE_URL));assert.equal(request.redirect,'manual');if(url.endsWith('commerce_claim_transaction_emails'))return Response.json([job]);writes.push(JSON.parse(request.body));return Response.json(null);},log:entry=>logs.push(entry)});
 assert.equal(sends,1);assert.equal(writes[0].p_accepted,!fail);assert.equal(result.accepted,fail?0:1);assert.equal(JSON.stringify(logs).includes(job.recipient),false);assert.equal(JSON.stringify(writes).includes('PRIVATE_RAW'),false);
}
let called=false;assert.equal((await deliverTransactionEmails({...env,SMTP_PASS:''},{send:async()=>{called=true;},requestFetch:async()=>{called=true;}})).skipped,true);assert.equal(called,false);
console.log('PASS email adapter: Gmail From alignment, Khadafi-only project, TLS465, private receipt, stable Message-ID, accepted-only success, safe failure classification and no send when unconfigured');
