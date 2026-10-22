import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {providerConfiguration,providerMessage,deliverProviderEmails} from '../cloudflare/provider-email.mjs';
import {resendPayload,sendResendEmail} from '../cloudflare/resend-email.mjs';
import {verifyResendSignature,resendWebhook} from '../cloudflare/resend-webhook.mjs';
const env={TRANSACTION_EMAIL_ENABLED:'true',NEXT_PUBLIC_SUPABASE_URL:'https://mykgtajanxczdnzekycl.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'local-test-only',SMTP_USER:'qa@gmail.com',SMTP_FROM:'qa@gmail.com',SMTP_PASS:'local-test-only',RESEND_DOMAIN_VERIFIED:'true',RESEND_TESTS_ENABLED:'true',RESEND_API_KEY:'re_local_test_only'};
const job={id:crypto.randomUUID(),order_id:null,kind:'delivery_probe',provider:'resend',lease_token:crypto.randomUUID(),recipient:'qa@example.invalid',created_at:'2026-10-23T00:00:00Z'};
const config=providerConfiguration(env,'resend'),message=providerMessage(job,config);job.message_payload=resendPayload(config,message,job);
assert.equal(config.replyTo,'qa@gmail.com');assert.equal(providerConfiguration({...env,RESEND_REPLY_TO_VERIFIED:'true'},'resend').replyTo,'support@khadafidaffa.com');
assert.equal(providerConfiguration({...env,RESEND_DOMAIN_VERIFIED:'false'},'resend'),null);
assert.equal(providerConfiguration({...env,NEXT_PUBLIC_SUPABASE_URL:'https://other.supabase.co'},'resend'),null);
assert.equal(providerConfiguration({...env,SMTP_FROM:'bad\r\nvalue'},'resend'),null);
const calls=[],providerId=crypto.randomUUID();
const accept=async(url,options)=>{calls.push({url,...options});return Response.json({id:providerId});};
await sendResendEmail(config,message,job,accept);await sendResendEmail({...config,replyTo:'support@khadafidaffa.com'},null,job,accept);
assert.equal(calls[0].body,calls[1].body);assert.equal(calls[0].headers['Idempotency-Key'],calls[1].headers['Idempotency-Key']);assert.equal(calls[0].url,'https://api.resend.com/emails');assert.equal(calls[0].redirect,'manual');
for(const [status,body,code] of [[429,{},'RESEND_RATE_LIMITED'],[403,{},'RESEND_AUTH'],[422,{},'RESEND_REJECTED'],[500,{},'RESEND_UNKNOWN'],[200,{id:'not-an-id'},'RESEND_UNKNOWN'],[409,{name:'invalid_idempotent_request'},'RESEND_KEY_CONFLICT'],[409,{name:'concurrent_idempotent_requests'},'RESEND_UNKNOWN']])await assert.rejects(()=>sendResendEmail(config,message,job,async()=>Response.json(body,{status})),{message:code});
await assert.rejects(()=>sendResendEmail(config,message,job,async()=>{throw Error('sensitive transport details');}),{message:'RESEND_UNKNOWN'});
console.log('PASS sender gates, immutable provider body/idempotency key, fixed endpoint and sanitized HTTP failures');

const rpcCalls=[],logs=[];let smtpCalls=0,resendCalls=0;
const fakeRpc=async(url,options)=>{
 const name=url.split('/').at(-1),body=JSON.parse(options.body);rpcCalls.push({name,body});
 if(name==='commerce_claim_provider_emails')return Response.json(body.p_provider==='resend'?[{...job}]:[]);
 if(name==='commerce_prepare_resend_email')return Response.json(job.message_payload);
 if(name==='commerce_finish_provider_email')return new Response(null,{status:204});
 throw Error('Unexpected RPC');
};
await deliverProviderEmails(env,{requestFetch:fakeRpc,smtpSend:async()=>{smtpCalls++;},resendSend:async()=>{resendCalls++;throw Error('provider raw response contains a secret');},log:x=>logs.push(x)});
assert.equal(smtpCalls,0);assert.equal(resendCalls,1);assert.equal(rpcCalls[0].body.p_provider,'smtp');assert.equal(rpcCalls[0].body.p_include_new,true);
assert.equal(rpcCalls.find(x=>x.name==='commerce_claim_provider_emails'&&x.body.p_provider==='resend').body.p_include_new,false);
assert.equal(rpcCalls.find(x=>x.name==='commerce_finish_provider_email').body.p_error,'RESEND_UNKNOWN');assert.ok(!JSON.stringify(logs).includes('secret'));
rpcCalls.length=0;
await deliverProviderEmails({...env,TRANSACTION_EMAIL_PROVIDER:'resend'},{requestFetch:fakeRpc,smtpSend:async()=>{},resendSend:async()=>({id:providerId})});
assert.equal(rpcCalls[0].body.p_include_new,false);
rpcCalls.length=0;
await deliverProviderEmails({...env,TRANSACTION_EMAIL_PROVIDER:'resend',RESEND_PRODUCTION_APPROVED:'true',RESEND_REPLY_TO_VERIFIED:'true'},{requestFetch:fakeRpc,smtpSend:async()=>{},resendSend:async()=>({id:providerId})});
assert.equal(rpcCalls[0].body.p_include_new,true);assert.equal(rpcCalls.find(x=>x.name==='commerce_claim_provider_emails'&&x.body.p_provider==='smtp').body.p_include_new,false);
console.log('PASS canaries preserve Gmail default, cutover gates all new jobs, old jobs drain on original provider, no automatic fallback');

// Public test vector from https://docs.svix.com/receiving/verifying-payloads/how-manual
// Store its documented non-production key as bytes so scanners do not mistake
// a literal whsec token for a deployed Stripe credential. Never use in production.
const publicTestKeyBytes=Uint8Array.from([166,82,119,158,108,130,12,96,74,34,118,175,116,226,181,230,59,37]);
const publicTestSecret='whsec_'+Buffer.from(publicTestKeyBytes).toString('base64');
const officialHeaders=new Headers({'svix-id':'msg_loFOjxBNrRLzqYUf','svix-timestamp':'1731705121','svix-signature':'v1,rAvfW3dJ/X/qxhsaXPOyyCGmRKsaKWcsNccKXlIktD0='});
assert.equal(await verifyResendSignature(officialHeaders,new TextEncoder().encode('{"event_type":"ping","data":{"success":true}}'),publicTestSecret,1731705121000),true);
const secret='whsec_'+Buffer.from('local-test-signing-key-not-production').toString('base64');
const body=JSON.stringify({type:'email.delivered',data:{email_id:providerId}}),now=Date.now(),timestamp=String(Math.floor(now/1000));
const signature=createHmac('sha256',Buffer.from(secret.slice(6),'base64')).update(`evt-local.${timestamp}.${body}`).digest('base64');
const headers={'svix-id':'evt-local','svix-timestamp':timestamp,'svix-signature':`v1,invalid v1,${signature}`};
const request=(payload=body,extra={})=>new Request('https://khadafidaffa.com/api/commerce/email/resend/webhook',{method:'POST',headers:{...headers,...extra},body:payload});
let writes=0;const record=async(url,options)=>{writes++;assert.equal(url,env.NEXT_PUBLIC_SUPABASE_URL+'/rest/v1/rpc/commerce_record_resend_email_event');const data=JSON.parse(options.body);assert.equal(data.p_type,'email.delivered');assert.equal(data.p_email,providerId);assert.match(data.p_hash,/^[a-f0-9]{64}$/);return new Response(null,{status:204});};
assert.equal((await resendWebhook(request(),{...env,RESEND_WEBHOOK_SECRET:secret},{requestFetch:record,now})).status,200);assert.equal(writes,1);
assert.equal((await resendWebhook(request(body+' '),{...env,RESEND_WEBHOOK_SECRET:secret},{requestFetch:record,now})).status,401);
assert.equal((await resendWebhook(request(),{...env,RESEND_WEBHOOK_SECRET:secret},{requestFetch:record,now:now+301000})).status,401);
assert.equal((await resendWebhook(request(),{...env,RESEND_WEBHOOK_SECRET:secret},{requestFetch:async()=>new Response(null,{status:500}),now})).status,503);
assert.equal((await resendWebhook(request('a'.repeat(32769)),{...env,RESEND_WEBHOOK_SECRET:secret},{requestFetch:record,now})).status,413);
assert.equal((await resendWebhook(request(),env,{requestFetch:record,now})).status,503);
assert.equal(writes,1);
assert.equal((await resendWebhook(new Request('https://khadafidaffa.com/api/commerce/email/resend/webhook'),env)).status,405);
console.log('PASS official Svix vector, rotated signatures, raw-body verification, stale/tampered/oversize rejection and commit-before-acknowledgement');
