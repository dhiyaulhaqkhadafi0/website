/* eslint-disable @typescript-eslint/no-require-imports */
const assert=require('node:assert/strict'),fs=require('node:fs');
const {PGlite}=require(process.env.PGLITE_MODULE || '@electric-sql/pglite');
(async()=>{
 const db=new PGlite(); let checks=0; const pass=name=>{checks++;console.log('PASS '+name)};
 try{
 await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create schema storage;create schema private;
 create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz,is_anonymous boolean default false);
 create function auth.jwt() returns jsonb language sql stable as $$select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb$$;
 create function auth.uid() returns uuid language sql stable as $$select (auth.jwt()->>'sub')::uuid$$;
 create table public.blog_admin_emails(email text primary key);
 create function private.is_blog_admin() returns boolean language sql stable as $$select false$$;
 create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
 create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);alter table storage.objects enable row level security;
 create function storage.foldername(text) returns text[] language sql as $$select string_to_array($1,'/')$$;`);
 for(const f of ['supabase_commerce.sql','supabase/migrations/20261017051124_commerce_media_guest_checkout.sql','supabase/migrations/20261018094500_doku_checkout_sandbox.sql','supabase/migrations/20261020154413_doku_go_live_safety.sql','supabase/migrations/20261021034531_doku_production_checkout_host.sql','supabase/migrations/20261021041208_doku_checkout_active_channels.sql','supabase/migrations/20261021074807_doku_checkout_method_binding.sql']){ console.log('Applying '+f); await db.exec(fs.readFileSync(f,'utf8')); }
 pass('curated migrations apply on embedded PostgreSQL without production connection');
 const user='11111111-1111-4111-8111-111111111111',other='22222222-2222-4222-8222-222222222222';
 await db.query("insert into auth.users values($1,'qa@example.invalid',now(),false),($2,'other@example.invalid',now(),false)",[user,other]);
 await db.exec("insert into public.blog_admin_emails values('qa@example.invalid')");
 const product=(await db.query("insert into commerce_products(name,slug,price,status) values('Synthetic local SQL product','sql-only',59000,'draft') returning id")).rows[0].id;
 await db.query("insert into commerce_product_files(product_id,storage_path,name) values($1,'sql-only/test.pdf','test.pdf')",[product]);
 await db.query("update commerce_products set status='published' where id=$1",[product]);
 const create=async(key,userId=user)=>(await db.query('select (commerce_create_order_doku($1,$2,$3,$4,$5)).*',[userId,product,'Local QA','qa@example.invalid',key])).rows[0];
 const key=crypto.randomUUID(),order=await create(key);assert.equal((await create(key)).id,order.id);assert.equal(order.total,59000);pass('server price and idempotent purchase intent');
 const invoice='KSLOCALTEST1'; const claim=async env=>(await db.query('select commerce_claim_doku_checkout($1,$2,$3) result',[order.id,env,invoice])).rows[0].result;
 const first=await claim('sandbox');assert.ok(first.token);assert.equal((await claim('sandbox')).busy,true);await assert.rejects(()=>claim('production'));pass('checkout concurrency lock, stable request ID and environment isolation');
 await db.query('select commerce_finish_doku_checkout($1,$2,$3)',[order.id,first.token,'https://staging.doku.com/checkout/test']);
 const productionOrder=await create(crypto.randomUUID(),other);
 const productionClaim=(await db.query('select commerce_claim_doku_checkout($1,$2,$3) result',[productionOrder.id,'production','KSLOCALPROD2'])).rows[0].result;
 for(const url of ['https://checkout.doku.com.evil.test/pay','https://sandbox.doku.com/checkout/test','https://evil.test@checkout.doku.com/pay'])await assert.rejects(()=>db.query('select commerce_finish_doku_checkout($1,$2,$3)',[productionOrder.id,productionClaim.token,url]));
 await db.query('select commerce_finish_doku_checkout($1,$2,$3)',[productionOrder.id,productionClaim.token,'https://checkout.doku.com/checkout-link-v2/test']);
 const storedProduction=(await db.query('select status,payment_url from commerce_orders where id=$1',[productionOrder.id])).rows[0];assert.equal(storedProduction.status,'pending');assert.equal(storedProduction.payment_url,'https://checkout.doku.com/checkout-link-v2/test');pass('production current Checkout hostname persists without settlement; spoofed host, credentials and sandbox host rejected');
 const methodUser='33333333-3333-4333-8333-333333333333';
 await db.query("insert into auth.users values($1,'method@example.invalid',now(),false)",[methodUser]);
 const methodOrder=await create(crypto.randomUUID(),methodUser);
 const methodClaim=async method=>(await db.query('select commerce_claim_doku_checkout_method($1,$2,$3,$4) result',[methodOrder.id,'production','KSMETHODTEST3',method])).rows[0].result;
 await assert.rejects(()=>methodClaim('CREDIT_CARD'));
 await db.exec('set role service_role');
 const methodFirst=await methodClaim('QRIS');assert.ok(methodFirst.token);assert.equal((await methodClaim('QRIS')).busy,true);assert.equal((await methodClaim('VIRTUAL_ACCOUNT_BNI')).method_locked,true);
 await db.query('select commerce_finish_doku_checkout($1,$2,$3)',[methodOrder.id,methodFirst.token,'https://checkout.doku.com/checkout-link-v2/method-test']);
 assert.equal((await methodClaim('QRIS')).url,'https://checkout.doku.com/checkout-link-v2/method-test');
 const methodState=(await db.query('select checkout_method,checkout_request_id from commerce_doku_state where order_id=$1',[methodOrder.id])).rows[0];assert.equal(methodState.checkout_method,'QRIS');assert.equal(methodState.checkout_request_id,methodFirst.request_id);
 assert.equal((await db.query('select count(*)::int n from commerce_entitlements where order_id=$1',[methodOrder.id])).rows[0].n,0);await db.exec('reset role');
 for(const role of ['anon','authenticated'])assert.equal((await db.query("select has_function_privilege($1,'public.commerce_claim_doku_checkout_method(uuid,text,text,text)','EXECUTE') allowed",[role])).rows[0].allowed,false);
 pass('method binding is service-only, durable, rejects unsupported choices and changes after claim; retries reuse the original session without settlement');
 const {DOKU_CHANNELS}=await import('../src/lib/doku-channels.mjs');
 for(const channel of [...DOKU_CHANNELS,'UNKNOWN',null]){
  await db.exec('begin');
  try{
   const notify=()=>db.query('select commerce_record_doku_event($1,$2,$3,$4,$5,$6,$7,$8)',[productionOrder.id,59000,'KSLOCALPROD2','production','channel-event','c'.repeat(64),'SUCCESS',channel]);
   if(channel===null||channel==='UNKNOWN')await assert.rejects(notify);
   else{await notify();await notify();assert.equal((await db.query('select count(*)::int n from commerce_entitlements where order_id=$1',[productionOrder.id])).rows[0].n,1);}
  }finally{await db.exec('rollback')}
 }
 pass('all Checkout channels settle exactly once in SQL; unknown and NULL rejected without access');
 for(const role of ['anon','authenticated','service_role']){
  const allowed=(await db.query("select has_function_privilege($1,'public.commerce_record_doku_event(uuid,integer,text,text,text,text,text,text)','EXECUTE') allowed",[role])).rows[0].allowed;
  assert.equal(allowed,role==='service_role');
 }
 pass('settlement RPC remains service-only with fixed search path');
 const event=async(id,status='SUCCESS',amount=59000,hash='a'.repeat(64),env='sandbox')=>db.query('select commerce_record_doku_event($1,$2,$3,$4,$5,$6,$7,$8)',[order.id,amount,invoice,env,id,hash,status,'QRIS_DOKU']);
 await assert.rejects(()=>event('wrong-amount','SUCCESS',59001));await assert.rejects(()=>event('wrong-env','SUCCESS',59000,undefined,'production'));
 assert.equal((await db.query('select count(*)::int n from commerce_entitlements')).rows[0].n,0);pass('signed wrong amount/environment cannot unlock');
 await event('qris-1');await event('qris-1');await event('qris-2');assert.equal((await db.query('select count(*)::int n from commerce_entitlements')).rows[0].n,1);
 await assert.rejects(()=>event('qris-1','SUCCESS',59000,'b'.repeat(64)));pass('QRIS inbox, duplicate and conflicting replay, exactly one entitlement');
 await event('late-failure','FAILED');assert.equal((await db.query('select status from commerce_orders where id=$1',[order.id])).rows[0].status,'paid');pass('out-of-order FAILED never regresses paid order');
 await db.query('delete from commerce_entitlements where order_id=$1',[order.id]);await event('repair');assert.equal((await db.query('select count(*)::int n from commerce_entitlements')).rows[0].n,1);pass('paid without entitlement recovery is idempotent');
 await db.query("update commerce_orders set created_at=now()-interval '5 minutes' where id=$1",[order.id]);await db.query("update commerce_doku_state set next_check_at=now()-interval '1 minute' where order_id=$1",[order.id]);await db.query('delete from commerce_entitlements where order_id=$1',[order.id]);
 const batch=(await db.query("select * from commerce_claim_doku_reconciliation('sandbox')")).rows;assert.equal(batch.length,1);assert.equal((await db.query("select * from commerce_claim_doku_reconciliation('sandbox')")).rows.length,0);
 await assert.rejects(()=>db.query('select commerce_finish_doku_reconciliation($1,$2,$3)',[order.id,crypto.randomUUID(),null]));
 await db.query('select commerce_finish_doku_reconciliation($1,$2,$3)',[order.id,batch[0].lease_token,'PROVIDER_OR_DB_ERROR']);
 const state=(await db.query('select * from commerce_doku_state where order_id=$1',[order.id])).rows[0];assert.equal(state.attempts,1);assert.ok(Date.parse(state.next_check_at)>Date.now());pass('durable scheduler lease, missed delivery repair selection, backoff and error class');
 await event('repair-before-refund');await event('refund','REFUNDED');assert.equal((await db.query('select status from commerce_entitlements where order_id=$1',[order.id])).rows[0]?.status,'revoked');await assert.rejects(()=>event('late-paid'));pass('refund blocks late SUCCESS from restoring access');
 const qa=(await db.query("insert into commerce_products(name,slug,price,status,is_payment_qa) values('DOKU Live Payment QA','payment-qa',1000,'draft',true) returning id")).rows[0].id;
 await db.query("insert into commerce_product_files(product_id,storage_path,name) values($1,'payment-qa/test.pdf','dummy.pdf')",[qa]);
 await assert.rejects(()=>db.query("update commerce_products set status='published' where id=$1",[qa]));
 await assert.rejects(()=>db.query('select commerce_create_doku_qa_order($1,$2,$3,false)',[other,qa,crypto.randomUUID()]));
 await db.exec('set role service_role');
 const free=(await db.query('select (commerce_create_doku_qa_order($1,$2,$3,true)).*',[user,qa,crypto.randomUUID()])).rows[0];assert.equal(free.total,0);assert.equal(free.provider,'free');assert.equal(free.status,'paid');pass('admin-only draft QA, original file isolation and free fulfilment without gateway');await db.exec('reset role');
 for(const role of ['anon','authenticated']){
  await db.exec('set role '+role);await assert.rejects(()=>db.query('select * from commerce_doku_events'));await assert.rejects(()=>db.query('select commerce_create_doku_qa_order($1,$2,$3,true)',[user,qa,crypto.randomUUID()]));await db.exec('reset role');
 }
 pass('event/state tables and privileged RPC inaccessible to anonymous and buyers');
 for(const file of ['20261022192257_commerce_cancellation_and_promotions.sql','20261022192306_commerce_transaction_email_outbox.sql','20261022195641_commerce_close_legacy_unregistered_intents.sql'])await db.exec(fs.readFileSync('supabase/migrations/'+file,'utf8'));
 const cancelUser=crypto.randomUUID();await db.query("insert into auth.users values($1,'cancel@example.invalid',now(),false)",[cancelUser]);
 const local=await create(crypto.randomUUID(),cancelUser);
 const cancelClaim=async(id,userId=cancelUser)=>(await db.query("select commerce_claim_doku_cancel($1,$2,'production') result",[id,userId])).rows[0].result;
 await assert.rejects(()=>cancelClaim(local.id,other));assert.equal((await cancelClaim(local.id)).closed,true);
 assert.equal((await db.query('select status from commerce_orders where id=$1',[local.id])).rows[0].status,'cancelled');
 const remote=await create(crypto.randomUUID(),cancelUser);assert.notEqual(remote.id,local.id);pass('ownership enforced; untouched local intent can cancel and create fresh same-product order');
 const remoteClaim=(await db.query("select commerce_claim_doku_checkout_method($1,'production','KSCANCELTEST','all') result",[remote.id])).rows[0].result;
 assert.equal((await cancelClaim(remote.id)).busy,true);
 await db.query('select commerce_finish_doku_checkout($1,$2,$3)',[remote.id,remoteClaim.token,'https://checkout.doku.com/checkout-link-v2/cancel']);
 const lease=await cancelClaim(remote.id);assert.ok(lease.token);assert.equal(lease.check_only,false);assert.equal((await cancelClaim(remote.id)).busy,true);
 assert.equal((await db.query('select status from commerce_orders where id=$1',[remote.id])).rows[0].status,'pending');
 await db.query('select commerce_finish_doku_cancel($1,$2,false)',[remote.id,lease.token]);
 const retry=await cancelClaim(remote.id);assert.equal(retry.check_only,true);assert.equal(retry.request_id,lease.request_id);
 await db.query('select commerce_finish_doku_cancel($1,$2,false)',[remote.id,retry.token]);pass('remote cancel acknowledgement never settles; lease and uncertain request reuse are durable');
 await assert.rejects(()=>db.query("select commerce_confirm_doku_cancel($1,'production','KSCANCELTEST',59001,'CANCELLED')",[remote.id]));
 await assert.rejects(()=>db.query("select commerce_confirm_doku_cancel($1,'sandbox','KSCANCELTEST',59000,'CANCELLED')",[remote.id]));
 assert.equal((await db.query("select commerce_confirm_doku_cancel($1,'production','KSCANCELTEST',59000,'CANCELLED') result",[remote.id])).rows[0].result,true);
 assert.equal((await db.query('select count(*)::int n from commerce_entitlements where order_id=$1',[remote.id])).rows[0].n,0);
 await db.query("select commerce_record_doku_event($1,59000,'KSCANCELTEST','production','late-real-payment',$2,'SUCCESS','QRIS_DOKU')",[remote.id,'d'.repeat(64)]);
 await db.query("select commerce_record_doku_event($1,59000,'KSCANCELTEST','production','late-real-payment',$2,'SUCCESS','QRIS_DOKU')",[remote.id,'d'.repeat(64)]);
 assert.equal((await cancelClaim(remote.id)).paid,true);
 assert.equal((await db.query('select count(*)::int n from commerce_entitlements where order_id=$1',[remote.id])).rows[0].n,1);pass('verified cancellation matches invoice/environment/amount; late verified SUCCESS wins and grants once');
 for(const role of ['anon','authenticated']){
  for(const fn of ['commerce_claim_doku_cancel(uuid,uuid,text)','commerce_finish_doku_cancel(uuid,uuid,boolean)','commerce_confirm_doku_cancel(uuid,text,text,integer,text)','commerce_claim_transaction_emails()','commerce_finish_transaction_email(uuid,uuid,boolean,text)'])assert.equal((await db.query('select has_function_privilege($1,$2,\'EXECUTE\') allowed',[role,'public.'+fn])).rows[0].allowed,false);
  await db.exec('set role '+role);await assert.rejects(()=>db.query('select * from commerce_email_outbox'));await assert.rejects(()=>db.query('select * from commerce_email_attempts'));await db.exec('reset role');
 }pass('cancellation and email queue RPCs, recipient data and logs inaccessible to buyers and anonymous callers');
 await db.query('update commerce_products set compare_at_price=298000,promotion_enabled=true where id=$1',[product]);
 await assert.rejects(()=>db.query('update commerce_products set compare_at_price=59000 where id=$1',[product]));
 await assert.rejects(()=>db.query('update commerce_products set price=298000 where id=$1',[product]));
 assert.equal((await db.query('select price from commerce_products where id=$1',[product])).rows[0].price,59000);pass('promotion constraint preserves actual selling price and rejects misleading comparisons');
 const emails=(await db.query('select * from commerce_claim_transaction_emails()')).rows;
 assert.equal(emails.length,2);assert.ok(emails.some(q=>q.kind==='payment_received'&&q.order_id===remote.id));assert.ok(!emails.some(q=>q.kind==='order_cancelled'&&q.order_id===remote.id));
 assert.equal((await db.query('select * from commerce_claim_transaction_emails()')).rows.length,0);
 const receipt=emails.find(q=>q.kind==='payment_received');
 await db.query("select commerce_finish_transaction_email($1,$2,false,'DO NOT STORE RAW SMTP SECRET')",[receipt.id,receipt.lease_token]);
 let queued=(await db.query('select * from commerce_email_outbox where id=$1',[receipt.id])).rows[0];assert.equal(queued.state,'queued');assert.equal(queued.last_error_class,'SMTP_SEND_FAILED');assert.ok(Date.parse(queued.next_attempt_at)>Date.now());
 await assert.rejects(()=>db.query('select commerce_finish_transaction_email($1,$2,true,null)',[receipt.id,receipt.lease_token]));
 await db.query("update commerce_email_outbox set next_attempt_at=now()-interval '1 minute' where id=$1",[receipt.id]);
 const mailRetry=(await db.query('select * from commerce_claim_transaction_emails()')).rows[0];assert.equal(mailRetry.id,receipt.id);
 await db.query('select commerce_finish_transaction_email($1,$2,true,null)',[mailRetry.id,mailRetry.lease_token]);
 queued=(await db.query('select * from commerce_email_outbox where id=$1',[receipt.id])).rows[0];assert.equal(queued.state,'sent');assert.ok(queued.accepted_at);
 assert.equal((await db.query('select count(*)::int n from commerce_email_attempts where outbox_id=$1',[receipt.id])).rows[0].n,2);pass('paid/cancel transition queue deduplicates; stale cancellation skipped; SMTP retry, sanitization, lease fencing and acceptance audit work');
 const abandoned=emails.find(q=>q.kind==='order_cancelled');await db.query("update commerce_email_outbox set attempts=5,lease_until=now()-interval '1 minute' where id=$1",[abandoned.id]);
 await db.query('select * from commerce_claim_transaction_emails()');assert.equal((await db.query('select state from commerce_email_outbox where id=$1',[abandoned.id])).rows[0].state,'failed');pass('exhausted crashed sender reaches failed state rather than leaving an eternal pending lease');
 const legacyUser=crypto.randomUUID();await db.query("insert into auth.users values($1,'legacy@example.invalid',now(),false)",[legacyUser]);const legacy=await create(crypto.randomUUID(),legacyUser);
 const legacyCheckout=(await db.query("select commerce_claim_doku_checkout_method($1,'production','KSLEGACYTEST','all') result",[legacy.id])).rows[0].result;
 await db.query('select commerce_finish_doku_checkout($1,$2,null)',[legacy.id,legacyCheckout.token]);
 const legacyCancel=await cancelClaim(legacy.id,legacyUser);
 const closeLegacy=async(userId=legacyUser,token=legacyCancel.token)=>(await db.query("select commerce_close_unregistered_doku_intent($1,$2,$3,'production') result",[legacy.id,userId,token])).rows[0].result;
 assert.equal(await closeLegacy(),false);await db.query("update commerce_orders set created_at=now()-interval '26 hours' where id=$1",[legacy.id]);assert.equal(await closeLegacy(other),false);assert.equal(await closeLegacy(legacyUser,crypto.randomUUID()),false);
 await db.query("update commerce_orders set payment_url='https://checkout.doku.com/checkout-link-v2/exists' where id=$1",[legacy.id]);assert.equal(await closeLegacy(),false);await db.query('update commerce_orders set payment_url=null where id=$1',[legacy.id]);
 assert.equal(await closeLegacy(),true);await db.query('select commerce_finish_doku_cancel($1,$2,false)',[legacy.id,legacyCancel.token]);
 assert.equal((await db.query('select cancel_state from commerce_doku_state where order_id=$1',[legacy.id])).rows[0].cancel_state,'unknown');
 assert.ok((await db.query("select order_id from commerce_claim_doku_reconciliation('production')")).rows.some(r=>r.order_id===legacy.id));
 await db.query("select commerce_confirm_doku_cancel($1,'production','KSLEGACYTEST',59000,'EXPIRED')",[legacy.id]);assert.equal((await db.query('select cancel_state from commerce_doku_state where order_id=$1',[legacy.id])).rows[0].cancel_state,'confirmed');
 await db.query("select commerce_record_doku_event($1,59000,'KSLEGACYTEST','production','legacy-late-payment',$2,'SUCCESS','QRIS_DOKU')",[legacy.id,'e'.repeat(64)]);assert.equal((await db.query('select status from commerce_orders where id=$1',[legacy.id])).rows[0].status,'paid');
 for(const role of ['anon','authenticated'])assert.equal((await db.query("select has_function_privilege($1,'public.commerce_close_unregistered_doku_intent(uuid,uuid,uuid,text)','EXECUTE') allowed",[role])).rows[0].allowed,false);
 pass('stale local closure enforces age, owner, lease and no URL; provider remains unknown, reconciliation persists and late signed payment wins');
 await db.exec(fs.readFileSync('supabase/migrations/20261022203627_commerce_email_provider_pinning.sql','utf8'));
 // Isolate the provider tests from previously created synthetic transition jobs.
 await db.exec("update commerce_email_outbox set state='skipped',lease_token=null,lease_until=null where state in ('queued','sending')");
 const probe=async()=>(await db.query("insert into commerce_email_outbox(kind,provider,recipient_override) values('delivery_probe','resend','qa@example.invalid') returning id")).rows[0].id;
 await assert.rejects(()=>db.query("insert into commerce_email_outbox(kind,recipient_override) values('delivery_probe','qa@example.invalid')"));
 await assert.rejects(()=>db.query("insert into commerce_email_outbox(kind,provider,recipient_override,order_id) values('delivery_probe','resend','qa@example.invalid',$1)",[legacy.id]));
 const probeId=await probe();
 assert.equal((await db.query("select * from commerce_claim_provider_emails('smtp',true)")).rows.length,0);
 let resendJob=(await db.query("select * from commerce_claim_provider_emails('resend',false)")).rows[0];assert.equal(resendJob.id,probeId);assert.equal(resendJob.recipient,'qa@example.invalid');assert.equal(resendJob.total,0);
 assert.equal((await db.query("select * from commerce_claim_provider_emails('resend',false)")).rows.length,0);
 pass('private delivery probes require explicit Resend assignment, no order and recipient; SMTP never claims Resend jobs');
 const payload={from:'Khadafi <notifications@khadafidaffa.com>',to:['qa@example.invalid'],subject:'Local provider test',text:'Local test',reply_to:'qa@example.invalid'};
 await assert.rejects(()=>db.query('select commerce_prepare_resend_email($1,$2,$3)',[probeId,crypto.randomUUID(),payload]));
 await assert.rejects(()=>db.query('select commerce_prepare_resend_email($1,$2,$3)',[probeId,resendJob.lease_token,{...payload,to:['other@example.invalid']} ]));
 const frozen=(await db.query('select commerce_prepare_resend_email($1,$2,$3) body',[probeId,resendJob.lease_token,payload])).rows[0].body;
 assert.deepEqual((await db.query('select commerce_prepare_resend_email($1,$2,$3) body',[probeId,resendJob.lease_token,{...payload,reply_to:'support@khadafidaffa.com'}])).rows[0].body,frozen);
 await assert.rejects(()=>db.query("select commerce_finish_provider_email($1,$2,'smtp',true,null,null)",[probeId,resendJob.lease_token]));
 await assert.rejects(()=>db.query("select commerce_finish_provider_email($1,$2,'resend',true,null,null)",[probeId,resendJob.lease_token]));
 await db.query("select commerce_finish_provider_email($1,$2,'resend',false,'RESEND_UNKNOWN',null)",[probeId,resendJob.lease_token]);
 await db.query("update commerce_email_outbox set next_attempt_at=now()-interval '1 minute' where id=$1",[probeId]);
 assert.equal((await db.query("select * from commerce_claim_provider_emails('smtp',true)")).rows.length,0);
 resendJob=(await db.query("select * from commerce_claim_provider_emails('resend',false)")).rows[0];assert.deepEqual(resendJob.message_payload,frozen);
 pass('provider/lease fencing and immutable payload survive uncertain attempts without cross-provider fallback');
 const providerId=crypto.randomUUID(),record=async(id,type,hash='a'.repeat(64))=>db.query('select commerce_record_resend_email_event($1,$2,$3,$4)',[id,providerId,type,hash]);
 await record('evt-before-response','email.delivered');await record('evt-before-response','email.delivered');
 await db.query("select commerce_finish_provider_email($1,$2,'resend',true,null,$3)",[probeId,resendJob.lease_token,providerId]);
 let delivered=(await db.query('select state,delivery_status,provider_message_id from commerce_email_outbox where id=$1',[probeId])).rows[0];assert.equal(delivered.state,'sent');assert.equal(delivered.delivery_status,'delivered');assert.equal(delivered.provider_message_id,providerId);
 await record('evt-bounce','email.bounced');await record('evt-late-delivery','email.delivered');await record('evt-delayed','email.delivery_delayed');
 assert.equal((await db.query('select delivery_status from commerce_email_outbox where id=$1',[probeId])).rows[0].delivery_status,'bounced');
 await assert.rejects(()=>record('evt-bounce','email.delivered'));await assert.rejects(()=>record('evt-bounce','email.bounced','b'.repeat(64)));
 assert.equal((await db.query("select count(*)::int n from commerce_email_provider_events where event_id='evt-before-response'")).rows[0].n,1);
 pass('signed-event storage handles duplicates, conflicts, callback-before-response and out-of-order bounce status');
 const expiredProbe=await probe();await db.query("update commerce_email_outbox set first_attempt_at=now()-interval '24 hours',attempts=1 where id=$1",[expiredProbe]);
 assert.equal((await db.query("select * from commerce_claim_provider_emails('resend',false)")).rows.length,0);
 assert.equal((await db.query('select last_error_class from commerce_email_outbox where id=$1',[expiredProbe])).rows[0].last_error_class,'RESEND_RETRY_WINDOW_EXPIRED');
 const rejectedProbe=await probe();const rejectJob=(await db.query("select * from commerce_claim_provider_emails('resend',false)")).rows[0];
 await db.query("select commerce_finish_provider_email($1,$2,'resend',false,'RESEND_AUTH',null)",[rejectedProbe,rejectJob.lease_token]);
 assert.equal((await db.query('select state from commerce_email_outbox where id=$1',[rejectedProbe])).rows[0].state,'failed');
 pass('unknown Resend retries stop before 24-hour idempotency expiry; permanent auth failure requires operator action');
 // A new business event stays unassigned until the selected provider claims it.
 const switchUser=crypto.randomUUID();await db.query("insert into auth.users values($1,'switch@example.invalid',now(),false)",[switchUser]);const switchOrder=await create(crypto.randomUUID(),switchUser);await cancelClaim(switchOrder.id,switchUser);
 assert.equal((await db.query("select * from commerce_claim_provider_emails('resend',false)")).rows.length,0);
 const pinnedSmtp=(await db.query('select * from commerce_claim_transaction_emails()')).rows[0];assert.equal(pinnedSmtp.order_id,switchOrder.id);
 assert.equal((await db.query('select provider from commerce_email_outbox where id=$1',[pinnedSmtp.id])).rows[0].provider,'smtp');
 assert.equal((await db.query("select * from commerce_claim_provider_emails('resend',true)")).rows.length,0);
 pass('legacy Gmail worker interface pins new business jobs; switching defaults never steals an in-flight email');
 for(const role of ['anon','authenticated']){
  for(const fn of ['commerce_claim_provider_emails(text,boolean)','commerce_prepare_resend_email(uuid,uuid,jsonb)','commerce_finish_provider_email(uuid,uuid,text,boolean,text,uuid)','commerce_record_resend_email_event(text,uuid,text,text)'])assert.equal((await db.query('select has_function_privilege($1,$2,\'EXECUTE\') allowed',[role,'public.'+fn])).rows[0].allowed,false);
  await db.exec('set role '+role);await assert.rejects(()=>db.query('select * from commerce_email_provider_events'));await db.exec('reset role');
 }
 pass('provider payloads, events and mutation RPCs remain service-only with RLS');
 fs.mkdirSync('artifacts/payments',{recursive:true});fs.writeFileSync('artifacts/payments/sql-verification.json',JSON.stringify({passed:true,checks,at:new Date().toISOString(),runtime:'embedded PostgreSQL / PGlite',productionTouched:false},null,2));
 }finally{await db.close()}
})().catch(e=>{console.error(e.message,e.position,e.internalPosition,e.internalQuery,e.where);process.exitCode=1});
