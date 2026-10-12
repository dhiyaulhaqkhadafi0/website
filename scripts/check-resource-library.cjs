/* eslint-disable @typescript-eslint/no-require-imports -- Standalone validation. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ts=require('typescript');
const root=path.resolve(__dirname,'..');
function load(file){const m={exports:{}};const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2020}}).outputText;vm.runInThisContext(`(function(require,module,exports){${code}\n})`,{filename:file})(name=>name.endsWith('.json')?JSON.parse(fs.readFileSync(path.resolve(path.dirname(file),name),'utf8')):require(name),m,m.exports);return m.exports;}
const {calculateFreelanceRate:calc,DEFAULT_RATE_INPUTS:d}=load(path.join(root,'src/lib/freelance-rate.ts'));
const result=calc(d);
assert.ok(Math.abs(result.monthlyBillableHours-65)<1e-8);
assert.ok(Math.abs(result.requiredMonthlyRevenue-10588235.294)<.01);
assert.ok(Math.abs(result.minimumHourlyRate-162895.9276)<.01);
assert.ok(Math.abs(result.quoteHourlyRate-195475.1131)<.1);
assert.equal(result.suggestedRoundedQuote,200000);
for(const bad of [{weeklyWorkHours:0},{weeklyWorkHours:NaN},{weeklyWorkHours:Infinity},{billablePercent:0},{billablePercent:101},{billablePercent:1e-320},{reservePercent:100},{reservePercent:-1},{quoteBufferPercent:-1},{desiredMonthlyTakeHome:-1},{monthlyBusinessCosts:-1},{currency:'EUR'},{desiredMonthlyTakeHome:0,monthlyBusinessCosts:0}])assert.throws(()=>calc({...d,...bad}));
const usd=calc({...d,currency:'USD',desiredMonthlyTakeHome:3000,monthlyBusinessCosts:300});assert.equal(usd.suggestedRoundedQuote%5,0);
assert.equal(calc({...d,currency:'USD'}).minimumHourlyRate,result.minimumHourlyRate,'Currency must not convert input values');
const {PUBLISHED_RESOURCES:resources,filterResources,findResource,relatedResources}=load(path.join(root,'src/content/freelance-resources.ts'));
assert.equal(resources.length,9);assert.equal(filterResources('','template').length,4);assert.equal(filterResources('','tool').length,3);assert.equal(filterResources('hourly rate','calculator').length,1);assert.equal(filterResources(' TAGIHAN ')[0].id,'T06');assert.equal(filterResources('does-not-exist').length,0);assert.equal(findResource('unknown'),undefined);
const {RESOURCE_CONTENT:content}=load(path.join(root,'src/content/freelance-resource-content.ts'));
for(const r of resources){assert.ok(relatedResources(r).length<=3);assert.ok(relatedResources(r).every(item=>item.status==='published'));if(r.type!=='guide')assert.ok(content[r.id].length>700);if(r.type==='template'){const file=path.join(root,`public/downloads/freelance/${r.slug}.md`);assert.equal(fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n'),content[r.id].replace(/\r\n/g,'\n'));}if(r.type==='tool'){assert.equal(new URL(r.officialUrl).protocol,'https:');assert.equal(new URL(r.pricingUrl).protocol,'https:');}}
const guide=fs.readFileSync(path.join(root,'src/components/freelance/FullFreelanceGuide.tsx'),'utf8');
for(const chapter of ['01-memahami','02-menentukan-arah','03-niche','04-portfolio','05-harga','06-peluang','07-client'])assert.ok(guide.includes(`section id="${chapter}"`));assert.ok(guide.includes('30 hari mulai freelance.'));assert.ok(guide.includes("Workflow client"));
console.log('Resource library passed: 9 published resources, 4 valid downloads, related links, 7 complete chapters, search/filter, calculator example and invalid-input scenarios.');
