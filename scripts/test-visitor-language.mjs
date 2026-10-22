import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { suggestedLanguage, isPublicTranslationPath, SUPPORTED_LANGUAGES } from '../src/lib/visitor-language.mjs';
import { GET } from '../src/app/api/visitor-context/route.ts';

for (const [country,languages,expected] of [
  ['US',['id-ID'],'en'],['JP',['id-ID'],'ja'],['BR',['pt-BR'],'pt'],
  ['CA',['fr-CA','en-CA'],'fr'],['IN',['kn-IN'],'kn'],['TW',['zh-Hant-TW'],'zh-TW'],
  ['HK',['zh-HK'],'zh-TW'],['ID',['id-ID','en-US'],'id'],['ID',['en-US'],'en'],
  [null,['id-ID','en-US'],'id'],[null,['en-US'],'en'],['NG',['yo-NG'],'yo'],
  ['US',['xx-XX'],'en'],['ZA',['af-ZA'],'af'],['PH',['fil-PH'],'tl'],['NO',['nb-NO'],'no'],
]) assert.equal(suggestedLanguage(country,languages),expected,`${country}/${languages}`);
assert.equal(new Set(SUPPORTED_LANGUAGES.map(l=>l.code)).size,SUPPORTED_LANGUAGES.length);
for (const path of ['/login','/register','/checkout/book','/account/orders','/studio/overview','/api/commerce/orders']) assert.equal(isPublicTranslationPath(path),false,path);
for (const path of ['/','/resources','/products','/blog/example','/freelance']) assert.equal(isPublicTranslationPath(path),true,path);
for (const country of ['ID','US','JP']) {
  const response=GET(new Request('https://unit.invalid/api/visitor-context?country=XX',{headers:{'cf-ipcountry':country}}));
  assert.deepEqual(await response.json(),{country});assert.equal(response.headers.get('cache-control'),'private, no-store');
}
for (const hint of ['XX','T1','invalid','US,ID']) assert.deepEqual(await GET(new Request('https://unit.invalid/api/visitor-context',{headers:{'cf-ipcountry':hint}})).json(),{country:null});

let forwarded=0,scheduled=0;
const source=fs.readFileSync('cloudflare/worker.mjs','utf8').replace(/^import .*;\r?\n/gm,'').replace(/^export \{.*;\r?\n/gm,'').replace('export default worker;','globalThis.testWorker=worker;');
const scope={URL,Response,app:{fetch:(request,env,ctx)=>{forwarded++;assert.equal(env.fixture,true);assert.ok(ctx);return new Response('app');}},reconcileScheduled:()=>{scheduled++;return Promise.resolve();}};
vm.runInNewContext(source,scope);
const geo=scope.testWorker.fetch({method:'GET',url:'https://unit.invalid/api/visitor-context',cf:{country:'ID'},headers:new Headers({'cf-ipcountry':'US'})},{},{});
assert.deepEqual(await geo.json(),{country:'ID'});assert.equal(forwarded,0);
assert.equal(await scope.testWorker.fetch(new Request('https://unit.invalid/api/commerce/doku/webhook',{method:'POST'}),{fixture:true},{}).text(),'app');
scope.testWorker.scheduled({}, {}, {waitUntil:promise=>assert.ok(promise)});assert.equal(scheduled,1);
console.log(`PASS visitor locale selection (${SUPPORTED_LANGUAGES.length} languages), private-route exclusions, request-local no-store response, trusted edge country, and unchanged app/scheduler delegation`);
