import assert from 'node:assert/strict';
import fs from 'node:fs';
const origin=new URL(process.argv[2]||'http://127.0.0.1:3045');
if(origin.hostname!=='127.0.0.1'||origin.protocol!=='http:')throw new Error('Runtime smoke test only accepts a loopback Worker');
const build=fs.readFileSync('.next/BUILD_ID','utf8').trim();
for(const [path,status] of [['/',200],['/products',200],['/resources',200],['/login',200],['/api/commerce/email/resend/webhook',405]]){
 const response=await fetch(new URL(path,origin),{redirect:'manual',signal:AbortSignal.timeout(45000)});
 assert.equal(response.status,status,path);await response.arrayBuffer();console.log(`PASS local workerd ${path} ${status}`);
}
assert.equal((await(await fetch(new URL('/BUILD_ID',origin))).text()).trim(),build);
console.log('PASS actual packaged Worker renders before production deployment; no orders, email sends or payments created');
