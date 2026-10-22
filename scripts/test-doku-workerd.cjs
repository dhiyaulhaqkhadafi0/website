/* eslint-disable @typescript-eslint/no-require-imports */
// Execute the real payment/status modules inside workerd. All outbound calls
// terminate in this local mock; these credentials and checkout paths are fake.
const assert=require('node:assert/strict'),fs=require('node:fs');
const {createHash,createHmac}=require('node:crypto'),esbuild=require('esbuild');
const {Miniflare,convertV4MiniflareOptions}=require('miniflare');
const client='BRN-WORKER-UNIT',secret='OFFLINE-WORKER-HMAC';
function signed(headers,target,body,response=false){const parts=['Client-Id:'+client,'Request-Id:'+headers.get('request-id'),(response?'Response':'Request')+'-Timestamp:'+headers.get(response?'response-timestamp':'request-timestamp'),'Request-Target:'+target];if(body!==null)parts.push('Digest:'+createHash('sha256').update(body).digest('base64'));return 'HMACSHA256='+createHmac('sha256',secret).update(parts.join('\n')).digest('base64')}
(async()=>{
 const source=`import {createDokuCheckout} from './src/lib/doku.ts';
 import {checkDokuStatus} from './src/lib/doku-status-check.ts';
 import {dokuInvoice} from './src/lib/doku-security.ts';
 const id='00000000-0000-4000-8000-000000000001';
 export default {async fetch(request){Object.assign(process.env,{DOKU_CLIENT_ID:' ${client}\\r\\n',DOKU_SECRET_KEY:' ${secret}\\r\\n',DOKU_ENABLED:'true',PAYMENTS_ENABLED:'true',DOKU_SITE_ORIGIN:'https://khadafidaffa.com',NEXT_PUBLIC_SUPABASE_URL:'https://mykgtajanxczdnzekycl.supabase.co',DOKU_IS_PRODUCTION:'true',DOKU_PRODUCTION_APPROVED:'true',DOKU_PUBLIC_SALES_APPROVED:'true',DOKU_QRIS_ENABLED:'true',DOKU_QRIS_STATUS:'ACTIVE'});
 try{if(new URL(request.url).searchParams.get('operation')==='status'){const result=await checkDokuStatus(dokuInvoice(id),{clientId:process.env.DOKU_CLIENT_ID,secretKey:process.env.DOKU_SECRET_KEY},true);return Response.json({ok:true,status:result.status,amount:result.amount})}
 const url=await createDokuCheckout({orderId:id,amount:1000,email:'test@example.invalid',name:'Local test',requestId:'00000000-0000-4000-8000-000000000002'});return Response.json({ok:true,host:new URL(url).hostname})}catch(error){return Response.json({ok:false,error:error.message})}}};`;
 const build=await esbuild.build({stdin:{contents:source,resolveDir:process.cwd(),loader:'ts'},bundle:true,write:false,format:'esm',platform:'neutral',external:['node:crypto'],plugins:[{name:'server-only-unit',setup(b){b.onResolve({filter:/^server-only$/},()=>({path:'empty',namespace:'unit'}));b.onLoad({filter:/.*/,namespace:'unit'},()=>({contents:'export {};',loader:'js'}))}}]});
 let mode='checkout',calls=0;
 const opts={modules:true,script:build.outputFiles[0].text,compatibilityDate:'2024-09-23',compatibilityFlags:JSON.parse(fs.readFileSync('wrangler.jsonc','utf8')).compatibility_flags,outboundService:async request=>{
  calls++;const target=new URL(request.url).pathname;assert.equal(new URL(request.url).origin,'https://api.doku.com');assert.equal(request.headers.get('client-id'),client);
  const body=request.method==='POST'?await request.text():null;assert.equal(request.headers.get('signature'),signed(request.headers,target,body));
  if(mode.startsWith('redirect'))return new Response('',{status:302,headers:{Location:'https://untrusted.invalid/never-follow'}});
  const order=body?JSON.parse(body).order:{invoice_number:target.split('/').pop(),amount:1000,currency:'IDR'};
  const payload=JSON.stringify(body?{response:{order,payment:{url:'https://checkout.doku.com/checkout-link-v2/local-unit'}}}:{order,transaction:{status:'PENDING'}});
  const headers=new Headers({'Client-Id':client,'Request-Id':request.headers.get('request-id'),'Response-Timestamp':'2026-10-22T00:00:00Z'});
  headers.set('Signature',mode.startsWith('bad')?'HMACSHA256=invalid':signed(headers,target,body?payload:null,true));return new Response(payload,{headers});
 }};
 const mf=new Miniflare(typeof convertV4MiniflareOptions==='function'?convertV4MiniflareOptions(opts):opts);
 try{for(const [test,operation,code]of [['checkout','checkout',null],['status','status',null],['redirect-checkout','checkout','DOKU_RESPONSE_REDIRECT_REJECTED'],['redirect-status','status','DOKU_STATUS_REDIRECT_BLOCKED'],['bad-checkout','checkout','DOKU_RESPONSE_SIGNATURE_INVALID'],['bad-status','status','DOKU_STATUS_SIGNATURE_INVALID']]){mode=test;const before=calls;const result=await(await mf.dispatchFetch('http://local.invalid/?operation='+operation)).json();assert.equal(calls-before,1,test+' must make one mock call and never follow redirects');if(code)assert.equal(result.error,code,test);else assert.equal(result.ok,true,JSON.stringify(result));console.log('PASS workerd '+test)}assert.equal(calls,6);console.log(JSON.stringify({passed:6,realProviderCalls:0,credentialCopyNormalization:true,redirectsFollowed:0}));}finally{await mf.dispose()}
})().catch(e=>{console.error(e);process.exitCode=1});
