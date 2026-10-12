/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node CommonJS verification script. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),ts=require('typescript'),vm=require('node:vm');
const filename=path.resolve('src/lib/affiliate-validation.ts'),moduleObject={exports:{}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports:moduleObject.exports,module:moduleObject,require,URL,Intl});
const {validDestination,validateAffiliate,classifyAffiliateSource,MICRO1_REFERRAL_URL}=moduleObject.exports;
let checks=0;function test(name,fn){fn();checks++;console.log('PASS',name);}
test('exact owner referral preserved',()=>{const u=new URL(MICRO1_REFERRAL_URL);assert.equal(u.searchParams.get('referralCode'),'b22f58a9-d462-4389-ab54-34e45d361215');assert.deepEqual([...u.searchParams.entries()].slice(1),[['utm_source','referral'],['utm_medium','share'],['utm_campaign','job_referral']]);});
test('approved HTTPS destination',()=>assert.equal(validDestination(MICRO1_REFERRAL_URL),true));
for(const url of ['https://evil.example','http://refer.micro1.ai/x','javascript:alert(1)','https://refer.micro1.ai.evil.example/x','https://refer.micro1.ai@evil.example/x','https://user:pass@refer.micro1.ai/x','https://refer.micro1.ai:8080/x','https://refer.micro1.ai/x#token','https://refer.micro1.ai\\@evil.example/x','https://refer.micro1.ai/x\n'])test('reject unsafe '+JSON.stringify(url),()=>assert.equal(validDestination(url),false));
const id='00000000-0000-4000-8000-000000000001';
const commission={program_id:id,campaign_id:'',external_reference:'statement-1',referral_status:'earned',payout_status:'confirmed',amount:'100.50',currency:'USD',confirmed_at:'2026-10-12',paid_at:'',evidence_reference:'provider statement',notes:''};
test('proven earned commission',()=>assert.equal(validateAffiliate('commissions',commission).amount,100.5));
for(const change of [{amount:'-1'},{amount:'Infinity'},{amount:'NaN'},{amount:'1.123'},{amount:'1e3'},{currency:'XYZ'},{evidence_reference:''},{external_reference:''},{confirmed_at:''},{payout_status:'paid'},{referral_status:'reported'},{paid_at:'2026-10-11'}])test('reject invalid commission '+JSON.stringify(change),()=>assert.throws(()=>validateAffiliate('commissions',{...commission,...change})));
test('honest unknown pending commission',()=>assert.equal(validateAffiliate('commissions',{...commission,amount:'',referral_status:'reported',payout_status:'pending',confirmed_at:'',evidence_reference:''}).amount,null));
test('campaign requires matching valid dates',()=>assert.throws(()=>validateAffiliate('campaigns',{name:'Threads',slug:'threads-organic',status:'active',program_id:id,link_id:id,source:'threads',medium:'organic',starts_at:'2026-10-13',ends_at:'2026-10-12'})));
test('source classification does not store referrer or PII',()=>{assert.equal(classifyAffiliateSource('https://www.linkedin.com/feed?email=secret'),'linkedin');assert.equal(classifyAffiliateSource('https://linkedin.com.evil.test'),'other');assert.equal(classifyAffiliateSource(null),'direct');});
test('single directory entry',()=>assert.equal((fs.readFileSync('src/content/freelance-directory.ts','utf8').match(/slug: "micro1"/g)||[]).length,1));
test('no analytics seed data',()=>{const sql=fs.readFileSync('supabase/migrations/20261012071152_affiliate_management_v1.sql','utf8');assert.ok(!/^insert into public\.affiliate_(click_events|commissions)/m.test(sql));assert.ok(sql.includes('enable row level security'));});
console.log(`${checks} affiliate checks passed.`);
