/* eslint-disable @typescript-eslint/no-require-imports -- Isolated database and server security regression tests. */
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict'), ts = require('typescript');
const root = path.resolve(__dirname, '..');
function load(file, mocks = {}, globals = {}) {
  const loaded = { exports: {} };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, { module: loaded, exports: loaded.exports, require: name => Object.hasOwn(mocks,name) ? mocks[name] : require(name), process: { env: {} }, Response, Request, URL, Buffer, AbortSignal, console, ...globals });
  return loaded.exports;
}
const json = (data, status = 200) => Response.json(data, { status });
async function run() {
  const media = load('src/lib/product-media.ts'), types = load('src/lib/commerce-types.ts', { './product-media': media });
  assert.equal(media.mediaUrl('/products/ebook-formula-profitable-blueprint-cover'), '/products/formula-profitable-blueprint-cover.webp');
  assert.ok(media.mediaUrl('commerce-covers/valid.webp').includes('/public/blog-media/commerce-covers/valid.webp'));
  for (const bad of ['javascript:alert(1)', '//evil.test/a.png', '../commerce-files/private.pdf', 'https://user:password@evil.test/image.webp', 'https://x.test\\@evil.test/a.png']) assert.equal(media.mediaUrl(bad), '');
  assert.throws(() => types.validateGallery(new Array(13).fill({url:'/cover.webp',alt:''})));
  assert.throws(() => types.validateGallery([{url:'javascript:alert(1)',alt:''}]));
  console.log('PASS cover repair, public storage keys, media validation and gallery limits');
  const jar = new Map(), orderId = '12345678-1234-4234-8234-123456789012';
  const guest = load('src/lib/guest-order.ts', { 'server-only': {}, 'next/headers': { cookies: async () => ({ get: key => jar.get(key), set: (key,value,options) => jar.set(key,{ value,options }) }) }, './supabase': {} }, { process: { env: { SUPABASE_SERVICE_ROLE_KEY: 'local-test-only-secret', NODE_ENV: 'production' } } });
  await guest.grantGuestOrder(orderId);
  assert.equal(await guest.ownsGuestOrder(orderId), true);
  assert.equal(await guest.ownsGuestOrder('22345678-1234-4234-8234-123456789012'), false);
  const token = jar.values().next().value;
  assert.equal(token.options.httpOnly, true); assert.equal(token.options.secure, true); assert.equal(token.options.sameSite, 'lax');
  token.value = token.value.slice(0,-2) + 'xx';
  assert.equal(await guest.ownsGuestOrder(orderId), false);
  console.log('PASS guest receipt is signed, order-specific, HttpOnly and rejects tampering');
  let writes = 0, identityCalls = 0, grants = 0, gateway = 0;
  const db = { rpc: async name => { writes++; return name === 'commerce_guest_attempt' ? { error: null } : { data: { id: orderId, status: 'pending', total: 59000, provider: 'doku' }, error: null }; }, auth: { admin: { generateLink: async () => { identityCalls++; return { data: { user: {id:'email-identity',email:'buyer@example.invalid'}, properties:{action_link:'must-not-leak',hashed_token:'must-not-leak'} }, error:null }; } } }, from: () => ({ update: () => ({ eq: async () => ({ error:null }) }) }) };
  const orders = load('src/app/api/commerce/orders/route.ts', { '@/lib/commerce-server': { json, sameOrigin: req => req.headers.get('origin') === 'https://khadafidaffa.com', requireUser: async () => ({ok:false,response:json({},401)}), commerceConfigured: () => true, publishedProduct: async () => ({id:'server-product',price:59000,name:'Real product'}) }, '@/lib/doku-order-checkout':{checkoutForDokuOrder:async(order,email)=>{gateway++;assert.equal(order.total,59000);assert.equal(email,'buyer@example.invalid');return 'https://jokul.doku.com/checkout/unit';}},'@/lib/doku-webhook-handler':{readLimitedBody:async r=>r.text()},'@/lib/supabase':{createServiceRoleClient:()=>db}, '@/lib/guest-order':{grantGuestOrder:async()=>{grants++;},guestFingerprint:()=> 'a'.repeat(64)} }, { process:{env:{COMMERCE_GUEST_CHECKOUT_ENABLED:'true',DOKU_SITE_ORIGIN:'https://khadafidaffa.com',DOKU_IS_PRODUCTION:'true'}}, fetch:async (_url,init)=>{gateway++; const body=JSON.parse(init.body); assert.equal(body.transaction_details.gross_amount,59000); assert.equal(body.customer_details.email,'buyer@example.invalid'); return Response.json({redirect_url:'https://app.midtrans.com/snap/test-only'});} });
  const payload={slug:'ebook',name:'Buyer',email:'buyer@example.invalid',key:orderId,consent:true,price:1,user_id:'attacker',status:'paid'};
  const request=(body=payload,origin='https://khadafidaffa.com')=>new Request('https://khadafidaffa.com/api/commerce/orders',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify(body)});
  assert.equal((await orders.POST(request(payload,'https://evil.test'))).status,403); assert.equal(writes,0);
  assert.equal((await orders.POST(request({...payload,consent:false}))).status,400); assert.equal(writes,0);
  const result=await orders.POST(request()); const resultText=await result.text();
  assert.equal(result.status,200); assert.equal(identityCalls,1); assert.equal(grants,1); assert.equal(gateway,1); assert.ok(!resultText.includes('must-not-leak'));
  console.log('PASS guest checkout enforces origin/consent, server price, rate gate and never returns identity tokens');
  let currentOrder=null, signed=0, validEntitlement=false;
  const query={select(){return this;},eq(){return this;},order:async()=>({data:[{storage_path:'private.pdf',name:'product.pdf'}],error:null}),then(resolve){resolve({data:validEntitlement?[{expires_at:null}]:[],error:null});}};
  const download=load('src/app/api/commerce/guest-download/route.ts',{'@/lib/guest-order':{guestOrder:async()=>currentOrder},'@/lib/commerce-server':{json,sameOrigin:()=>true},'@/lib/supabase':{createServiceRoleClient:()=>({from:()=>query,storage:{from:()=>({createSignedUrl:async(_p,seconds)=>{signed++;assert.equal(seconds,900);return{data:{signedUrl:'https://example.invalid/expiring'},error:null};}})}})}});
  const dr=product=>new Request('https://khadafidaffa.com/api/commerce/guest-download',{method:'POST',body:JSON.stringify({order:orderId,product})});
  assert.equal((await download.POST(dr('product'))).status,403);
  currentOrder={id:orderId,user_id:'email-identity',status:'pending',commerce_order_items:[{product_id:'product'}]};
  assert.equal((await download.POST(dr('product'))).status,403);
  currentOrder.status='paid'; assert.equal((await download.POST(dr('other-product'))).status,403);
  assert.equal((await download.POST(dr('product'))).status,403); assert.equal(signed,0);
  validEntitlement=true; assert.equal((await download.POST(dr('product'))).status,200); assert.equal(signed,1);
  currentOrder.status='refunded'; assert.equal((await download.POST(dr('product'))).status,403); assert.equal(signed,1);
  console.log('PASS guest download rejects unpaid, other products, revoked/refunded access and issues 15-minute URLs only after fulfillment');
  const {createDatabase,asRole}=require('./check-home-database.cjs');
  const dbTest=await createDatabase();
  try {
    await dbTest.exec("insert into commerce_products(name,slug,short_description,category,price,status) values ('Local QA product','local-qa-product','Fixture only','Ebook',59000,'draft');");
    await dbTest.exec(fs.readFileSync(path.join(root,'supabase/migrations/20261017051124_commerce_media_guest_checkout.sql'),'utf8'));
    const owner='11111111-1111-4111-8111-111111111111',reader='22222222-2222-4222-8222-222222222222';
    const product=(await dbTest.query('select * from commerce_products limit 1')).rows[0];
    assert.equal(product.creator_name,media.CREATOR_NAME);
    await asRole(dbTest,'authenticated',owner,'update commerce_products set gallery=$1::jsonb where id=$2',[JSON.stringify([{url:'/cover.webp',alt:'Preview'}]),product.id]);
    await asRole(dbTest,'authenticated',reader,'update commerce_products set creator_name=$1 where id=$2',['Attacker',product.id]);
    assert.equal((await dbTest.query('select creator_name from commerce_products where id=$1',[product.id])).rows[0].creator_name,media.CREATOR_NAME);
    await assert.rejects(()=>asRole(dbTest,'anon',null,'select * from commerce_guest_limits'));
    await assert.rejects(()=>asRole(dbTest,'authenticated',reader,'select commerce_guest_attempt($1)',['b'.repeat(64)]));
    for(let i=0;i<12;i++) await asRole(dbTest,'service_role',null,'select commerce_guest_attempt($1)',['b'.repeat(64)]);
    await assert.rejects(()=>asRole(dbTest,'service_role',null,'select commerce_guest_attempt($1)',['b'.repeat(64)]));
    assert.equal((await dbTest.query('select hour_count from commerce_guest_limits')).rows[0].hour_count,12);
    console.log('PASS additive migration, owner media writes, reader isolation and atomic guest rate limits on isolated PostgreSQL');
    await dbTest.exec(fs.readFileSync(path.join(root,'scripts/check-commerce-database.sql'),'utf8'));
    console.log('PASS full SQL lifecycle: duplicate orders/notifications, server amount, free fulfillment, refund and ownership RLS');
  } finally { await dbTest.close(); }
  console.log('7 commerce experience security groups passed.');
}
run().catch(e=>{console.error(e);process.exitCode=1;});
