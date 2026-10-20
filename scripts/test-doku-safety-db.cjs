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
 for(const f of ['supabase_commerce.sql','supabase/migrations/20261017051124_commerce_media_guest_checkout.sql','supabase/migrations/20261018094500_doku_checkout_sandbox.sql','supabase/migrations/20261020154413_doku_go_live_safety.sql']){ console.log('Applying '+f); await db.exec(fs.readFileSync(f,'utf8')); }
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
 fs.mkdirSync('artifacts/payments',{recursive:true});fs.writeFileSync('artifacts/payments/sql-verification.json',JSON.stringify({passed:true,checks,at:new Date().toISOString(),runtime:'embedded PostgreSQL / PGlite',productionTouched:false},null,2));
 }finally{await db.close()}
})().catch(e=>{console.error(e.message,e.position,e.internalPosition,e.internalQuery,e.where);process.exitCode=1});
