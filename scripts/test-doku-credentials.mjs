import assert from 'node:assert/strict';
import {normalizeDokuCredentials,dokuTransportFailure} from '../src/lib/doku-credentials.mjs';
assert.deepEqual(normalizeDokuCredentials(' BRN-OFFLINE\r\n',' TEST-ONLY\r\n'),{clientId:'BRN-OFFLINE',secretKey:'TEST-ONLY'});
assert.throws(()=>normalizeDokuCredentials(' \n','TEST'),/DOKU_CREDENTIALS_MISSING/);
assert.throws(()=>normalizeDokuCredentials('BRN-TEST\nInjected: value','TEST'),/DOKU_CREDENTIALS_INVALID_FORMAT/);
assert.throws(()=>normalizeDokuCredentials('BRN-TEST','TEST\0KEY'),/DOKU_CREDENTIALS_INVALID_FORMAT/);
for(const [error,code] of [
 [{name:'TypeError',message:'Invalid header value'},'HEADER_INVALID'],
 [{message:'redirect mode is set to error'},'REDIRECT_BLOCKED'],
 [{message:"The 'cache' field is not implemented"},'CACHE_UNSUPPORTED'],
 [{name:'TimeoutError'},'TIMEOUT'],
 [{cause:{code:'ENOTFOUND'}},'DNS_FAILURE'],
 [{cause:{code:'CERT_HAS_EXPIRED'}},'TLS_FAILURE'],
 [{message:'Private arbitrary message never copied'},'TRANSPORT_FAILURE'],
]) for(const operation of ['STATUS','CHECKOUT']) assert.equal(dokuTransportFailure(error,operation),'DOKU_'+operation+'_'+code);
console.log('PASS credential copy whitespace normalization, header/control injection rejection and redacted cross-realm transport classification; no provider calls');
