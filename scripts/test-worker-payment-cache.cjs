/* eslint-disable @typescript-eslint/no-require-imports */
const {Miniflare,convertV4MiniflareOptions}=require('miniflare');
const assert=require('node:assert/strict');
const fs=require('node:fs');
for(const file of ['wrangler.jsonc','wrangler.doku-staging.jsonc']) {
 const config=JSON.parse(fs.readFileSync(file,'utf8'));
 assert.ok(config.compatibility_flags.includes('cache_option_enabled'),file+' must support payment no-store requests');
}
(async()=>{
 for(const enabled of [false,true]){
  const options={modules:true,script:`export default {async fetch(){try{const r=await fetch('https://provider.invalid/status',{cache:'no-store'});return Response.json({ok:r.ok})}catch(error){return Response.json({ok:false,name:error.name,error:error.message})}}}`,compatibilityDate:'2024-09-23',compatibilityFlags:['nodejs_compat',...(enabled?['cache_option_enabled']:[])],outboundService:()=>new Response('mock provider')};
  const mf=new Miniflare(typeof convertV4MiniflareOptions==='function'?convertV4MiniflareOptions(options):options);
  try{const result=await (await mf.dispatchFetch('http://local.invalid')).json();if(enabled)assert.equal(result.ok,true);else{assert.equal(result.ok,false);assert.match(result.error,/cache.*not implemented/i)}console.log(JSON.stringify({cacheFlag:enabled,...result,externalNetworkCalls:0}));}finally{await mf.dispose()}
 }
})().catch(e=>{console.error(e);process.exitCode=1});
