/* eslint-disable @typescript-eslint/no-require-imports -- Public artifact preflight; never prints credential values. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const entries=fs.readFileSync('.env.local','utf8').split(/\r?\n/).map(line=>line.match(/^([A-Z_]+)=(.*)$/)).filter(Boolean);
const secrets=entries.filter(([,key,value])=>!key.startsWith('NEXT_PUBLIC_') && /KEY|SECRET/.test(key) && value.length>=12).map(([,key,value])=>({key,value:value.replace(/^['"]|['"]$/g,'')}));
let count=0;
function scan(dir){for(const name of fs.readdirSync(dir)){const file=path.join(dir,name);if(fs.statSync(file).isDirectory())scan(file);else{const bytes=fs.readFileSync(file);for(const secret of secrets)assert.ok(!bytes.includes(Buffer.from(secret.value)),'Private credential found in '+file+' ('+secret.key+')');for(const marker of ['LOCAL_FIXTURE_ONLY','http://127.0.0.1:3031','http://localhost:3031'])assert.ok(!bytes.includes(Buffer.from(marker)),'Local fixture reference in '+file);count++;}}}
scan('.open-next/assets');
const manifest=JSON.parse(fs.readFileSync('.next/server/app-paths-manifest.json','utf8'));
assert.ok(!Object.keys(manifest).some(route=>route.includes('commerce-preview-qa')),'Temporary component QA route in build');
assert.ok(Object.keys(manifest).some(route=>route.includes('/api/commerce/guest-download/')),'Guest download route missing');
assert.ok(!fs.readdirSync('public/products').some(name=>name.endsWith('.pdf')),'Paid product PDF must stay private');
console.log(JSON.stringify({publicFiles:count,privateCredentialsChecked:secrets.length,leaks:0,temporaryQaRoute:false,paidPdfPublic:false}));
