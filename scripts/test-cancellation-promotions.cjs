/* eslint-disable @typescript-eslint/no-require-imports */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto'),ts=require('typescript');
function load(file,mocks={},env={}){const mod={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{module:mod,exports:mod.exports,require:n=>mocks[n]??require(n),process:{env},Response,Buffer,AbortSignal,URL,console});return mod.exports;}
(async()=>{
 const security=load('src/lib/doku-security.ts'),credentials=await import('../src/lib/doku-credentials.mjs');
 const {requestDokuCancellation}=load('src/lib/doku-cancel.ts',{'./doku-security':security,'./doku-credentials.mjs':credentials});
 const input={invoice:'KSOFFLINETEST',originalRequestId:crypto.randomUUID(),requestId:crypto.randomUUID(),clientId:'OFFLINE_CLIENT',secretKey:'OFFLINE_ONLY_KEY',production:true};
 await requestDokuCancellation(input,async(url,init)=>{assert.equal(url,'https://api.doku.com/checkout/v3/cancellations');assert.equal(init.redirect,'manual');assert.equal(init.cache,'no-store');const body=JSON.parse(init.body);assert.equal(body.payment.original_request_id,input.originalRequestId);assert.equal(init.headers.Signature,security.signature(input.clientId,input.requestId,init.headers['Request-Timestamp'],'/checkout/v3/cancellations',init.body,input.secretKey));return new Response('{}');});
 for(const status of [302,403,429,500])await assert.rejects(()=>requestDokuCancellation(input,async()=>new Response('{}',{status})),/DOKU_CANCEL_/);
 await assert.rejects(()=>requestDokuCancellation(input,async()=>{throw new Error('timeout')}),/UNKNOWN/);
 await assert.rejects(()=>requestDokuCancellation(input,async()=>new Response('{}',{headers:{Signature:'HMACSHA256=bad'}})),/INVALID_RESPONSE/);
 console.log('PASS official production cancellation URL, POST signing, original request, redirect block and ambiguous transport handling');
 const {checkDokuStatus}=load('src/lib/doku-status-check.ts',{'./doku-credentials.mjs':credentials});
 async function signedStatus(rawStatus,orderStatus){return checkDokuStatus(input.invoice,input,true,async(url,init)=>{const time=new Date().toISOString(),target=new URL(url).pathname;const canonical=['Client-Id:'+input.clientId,'Request-Id:'+init.headers['Request-Id'],'Response-Timestamp:'+time,'Request-Target:'+target].join('\n');return new Response(JSON.stringify({order:{invoice_number:input.invoice,amount:59000,currency:'IDR',status:orderStatus},transaction:rawStatus?{status:rawStatus}:{},channel:{id:'QRIS_DOKU'}}),{headers:{'Client-Id':input.clientId,'Request-Id':init.headers['Request-Id'],'Response-Timestamp':time,Signature:'HMACSHA256='+crypto.createHmac('sha256',input.secretKey).update(canonical).digest('base64')}});});}
 assert.equal((await signedStatus(null,'ORDER_CANCELLED')).status,'CANCELLED');assert.equal((await signedStatus('SUCCESS','ORDER_CANCELLED')).status,'SUCCESS');assert.equal((await signedStatus(null,'ORDER_GENERATED')).status,'PENDING');assert.equal((await signedStatus(null,'ORDER_EXPIRED')).status,'EXPIRED');
 console.log('PASS signed cancellation/order status mapping; SUCCESS takes precedence');
 let mode='pending',calls=[],user='buyer',claimMode='remote';const id=crypto.randomUUID();
 const db={rpc:async(name,args)=>{calls.push({name,args});if(name==='commerce_claim_doku_cancel'){if(args.p_user!=='buyer')return {error:{}};return {data:claimMode==='local'?{closed:true}:claimMode==='paid'?{paid:true}:{token:'lease',invoice:input.invoice,original_request_id:input.originalRequestId,request_id:input.requestId,total:59000,check_only:claimMode==='unknown'}};}if(name==='commerce_confirm_doku_cancel')return {data:true};return {data:null};}};
 let reads=0,posts=0;
 const api=load('src/app/api/commerce/orders/[id]/cancel/route.ts',{
  '@/lib/commerce-server':{sameOrigin:r=>r.headers.get('origin')==='https://khadafidaffa.com',requireUser:async()=>user?{ok:true,user:{id:user}}:{ok:false,response:Response.json({error:'auth'},{status:401})},json:(b,s=200)=>Response.json(b,{status:s})},
  '@/lib/supabase':{createServiceRoleClient:()=>db},'@/lib/doku-config':{dokuPolicy:()=>({configured:true,production:true,environment:'production'})},
  '@/lib/doku-status-check':{checkDokuStatus:async()=>{reads++;if(mode==='invalid')throw new Error('DOKU_STATUS_SIGNATURE_INVALID');return {invoice:input.invoice,amount:mode==='mismatch'?1:59000,status:mode==='paid'?'SUCCESS':mode==='cancelled'&&reads>1?'CANCELLED':'PENDING',channel:mode==='unsupported'?'EMONEY_OVO':'QRIS_DOKU',transactionType:'SALE'};}},
  '@/lib/doku-cancel':{requestDokuCancellation:async()=>{posts++;if(mode==='timeout')throw new Error('DOKU_CANCEL_UNKNOWN');}},'@/lib/doku-channels.mjs':{isDokuSettlement:()=>true},
 });
 const invoke=async(origin='https://khadafidaffa.com')=>api.POST(new Request('https://khadafidaffa.com/api/commerce/orders/'+id+'/cancel',{method:'POST',headers:{Origin:origin}}),{params:Promise.resolve({id})});
 assert.equal((await invoke('https://evil.invalid')).status,403);user=null;assert.equal((await invoke()).status,401);user='other';assert.equal((await invoke()).status,404);user='buyer';
 for(mode of ['invalid','mismatch','unsupported']){calls=[];posts=0;reads=0;const result=await invoke();assert.ok(result.status>=400);assert.equal(posts,0);assert.ok(!calls.some(c=>c.name==='commerce_confirm_doku_cancel'));}
 mode='pending';reads=0;calls=[];assert.equal((await invoke()).status,202);assert.ok(!calls.some(c=>c.name==='commerce_confirm_doku_cancel'));
 mode='cancelled';reads=0;calls=[];assert.equal((await invoke()).status,200);assert.ok(calls.some(c=>c.name==='commerce_confirm_doku_cancel'));
 mode='paid';posts=0;calls=[];assert.equal((await invoke()).status,409);assert.equal(posts,0);assert.ok(calls.some(c=>c.name==='commerce_record_doku_event'));
 mode='pending';claimMode='unknown';posts=0;assert.equal((await invoke()).status,202);assert.equal(posts,0);
 claimMode='local';reads=0;assert.equal((await invoke()).status,200);assert.equal(reads,0);claimMode='paid';assert.equal((await invoke()).status,409);
 console.log('PASS API auth, CSRF, ownership, signed-status failures, channel guard, acknowledgement-only pending, terminal confirmation, paid protection and no blind cancellation retry');
 const {validatePromotion}=load('src/lib/commerce-types.ts',{'./product-media':{}});
 assert.equal(validatePromotion({price:59000,compare_at_price:298000,promotion_enabled:true}).compare_at_price,298000);
 for(const patch of [{compare_at_price:59000},{compare_at_price:1.5},{price:0},{promotion_enabled:'true'},{promotion_label:'x'.repeat(61)}])assert.throws(()=>validatePromotion({price:59000,compare_at_price:298000,promotion_enabled:true,...patch}));
 console.log('PASS promotion validation rejects invalid, equal, free, fractional or misleading regular price');
})().catch(e=>{console.error(e);process.exitCode=1;});
