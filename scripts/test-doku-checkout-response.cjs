/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const ts = require('typescript'), crypto = require('node:crypto');
function load(file, mocks, env, extras = {}) {
  const mod = { exports: {} };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText,
    { module: mod, exports: mod.exports, require: name => name === 'server-only' ? {} : mocks[name] ?? require(name), process: { env }, Response, URL, Buffer, AbortSignal, ...extras });
  return mod.exports;
}
(async () => {
  const security = load('src/lib/doku-security.ts', {}, {}), policy = load('src/lib/doku-config.ts', {}, {}), hosts = load('src/lib/doku-checkout-host.ts', {}, {});
  const methods = load('src/lib/checkout-methods.ts', {}, {});
  const env = { DOKU_ENABLED: 'true', PAYMENTS_ENABLED: 'true', DOKU_CLIENT_ID: 'OFFLINE_CLIENT_VECTOR', DOKU_SECRET_KEY: 'OFFLINE_HMAC_VECTOR', DOKU_SITE_ORIGIN: 'https://khadafidaffa.com', NEXT_PUBLIC_SUPABASE_URL: 'https://mykgtajanxczdnzekycl.supabase.co', DOKU_IS_PRODUCTION: 'true', DOKU_PRODUCTION_APPROVED: 'true', DOKU_PUBLIC_SALES_APPROVED: 'true', DOKU_QRIS_ENABLED: 'true', DOKU_QRIS_STATUS: 'ACTIVE', DOKU_QA_ENABLED: 'true', DOKU_QA_LIVE_APPROVED: 'true' };
  const input = { orderId: crypto.randomUUID(), requestId: crypto.randomUUID(), amount: 1000, email: 'buyer@example.invalid', name: 'Buyer' };
  let mode = 'echo';
  let expectedMethods = null;
  const doku = load('src/lib/doku.ts', { './doku-security': security, './doku-config': policy, './doku-checkout-host': hosts, './checkout-methods': methods }, env, {
    fetch: async (url, options) => {
      assert.equal(url, 'https://api.doku.com/checkout/v1/payment');
      assert.equal(options.redirect, 'error');
      const request = JSON.parse(options.body);
      assert.equal(request.order.amount, 1000);
      assert.equal(request.payment.type, 'SALE');
      if (expectedMethods === null) assert.equal(Object.hasOwn(request.payment, 'payment_method_types'), false, 'DOKU chooses active eligible methods');
      else assert.deepEqual(request.payment.payment_method_types, expectedMethods);
      const echo = { client_id: env.DOKU_CLIENT_ID, request_id: input.requestId, date: options.headers['Request-Timestamp'], signature: options.headers.Signature };
      if (mode === 'wrong-echo') echo.request_id = crypto.randomUUID();
      if (mode === 'provider-metadata') { echo.date = timestampWithMilliseconds(); echo.signature = 'provider-body-metadata'; }
      if (mode === 'partial-metadata') { delete echo.date; delete echo.signature; }
      const raw = JSON.stringify({ message: ['SUCCESS'], response: { order: { invoice_number: security.dokuInvoice(input.orderId), amount: mode === 'wrong-amount' ? 1001 : 1000, currency: 'IDR' }, payment: { url: mode === 'wrong-host' ? 'https://evil.invalid/pay' : 'https://checkout.doku.com/checkout-link-v2/unit' }, ...(mode === 'bare' ? {} : { headers: echo }) } });
      const time = new Date().toISOString();
      const headers = !['echo','bare','wrong-echo','provider-metadata','partial-metadata'].includes(mode) ? { 'Client-Id': env.DOKU_CLIENT_ID, 'Request-Id': input.requestId, 'Response-Timestamp': time, Signature: mode === 'bad-signature' ? 'HMACSHA256=invalid' : security.signature(env.DOKU_CLIENT_ID, input.requestId, time, '/checkout/v1/payment', raw, env.DOKU_SECRET_KEY, true) } : {};
      return new Response(raw, { status: mode === 'auth-rejected' ? 403 : 200, headers });
    },
  });
  mode='signed'; assert.equal(await doku.createDokuCheckout(input), 'https://checkout.doku.com/checkout-link-v2/unit');
  mode='echo'; assert.equal(await doku.createDokuCheckout(input), 'https://checkout.doku.com/checkout-link-v2/unit');
  mode='bare'; assert.equal(await doku.createDokuCheckout(input), 'https://checkout.doku.com/checkout-link-v2/unit');
  function timestampWithMilliseconds() { return new Date().toISOString(); }
  for (mode of ['provider-metadata','partial-metadata']) assert.equal(await doku.createDokuCheckout(input), 'https://checkout.doku.com/checkout-link-v2/unit');
  mode='signed'; expectedMethods=['VIRTUAL_ACCOUNT_BNI']; await doku.createDokuCheckout({...input, method:'VIRTUAL_ACCOUNT_BNI'});
  expectedMethods=['QRIS']; await doku.createDokuCheckout({...input, privateQa:true});
  env.DOKU_QRIS_ENABLED='false'; expectedMethods=['VIRTUAL_ACCOUNT_BANK_MANDIRI']; await doku.createDokuCheckout(input);
  env.DOKU_QRIS_ENABLED='true'; expectedMethods=null;
  console.log('PASS new public production Checkout omits method filter, uses SALE; private QA stays QRIS-only and QRIS kill switch stays enforced');
  for (const [test, code] of [['wrong-echo', 'DOKU_RESPONSE_METADATA_INVALID'], ['bad-signature', 'DOKU_RESPONSE_SIGNATURE_INVALID'], ['wrong-amount', 'DOKU_RESPONSE_ORDER_MISMATCH'], ['wrong-host', 'DOKU_RESPONSE_HOST_REJECTED'], ['auth-rejected', 'DOKU_CREDENTIALS_REJECTED']]) {
    mode = test; await assert.rejects(() => doku.createDokuCheckout(input), error => error.message === code, test);
  }
  let providerCalls=0,storedUrl='https://checkout.doku.com/checkout-link-v2/existing';
  const existing=load('src/lib/doku-order-checkout.ts',{'./supabase':{createServiceRoleClient:()=>({rpc:async()=>({data:{url:storedUrl}})})},'./doku':{dokuInvoice:security.dokuInvoice,createDokuCheckout:async()=>{providerCalls++;throw Error('Must reuse saved checkout')}},'./doku-config':policy,'./doku-checkout-host':hosts,'./checkout-methods':methods},env);
  assert.equal(await existing.checkoutForDokuOrder({id:input.orderId,total:1000},input.email,input.name),storedUrl);assert.equal(providerCalls,0);
  storedUrl='https://checkout.doku.com.evil.invalid/pay';await assert.rejects(()=>existing.checkoutForDokuOrder({id:input.orderId,total:1000},input.email,input.name));assert.equal(providerCalls,0);
  console.log('PASS documented HTTPS response with request echo or optional metadata; wrong metadata, supplied invalid HMAC, amount and host rejected; fixed API without redirects; no provider calls');
  console.log('PASS existing current-host checkout URL is reused without creating a provider session; spoofed stored URL rejected');
})().catch(error => { console.error(error.message); process.exitCode = 1; });
