/* eslint-disable @typescript-eslint/no-require-imports -- Loopback-only QA fixture; never imported by the app. */
const http=require('node:http');
const {randomUUID}=require('node:crypto');
const now=new Date().toISOString();
const ids={owner:'11111111-1111-4111-8111-111111111111',reader:'22222222-2222-4222-8222-222222222222',product:'33333333-3333-4333-8333-333333333333',draft:'44444444-4444-4444-8444-444444444444',paid:'55555555-5555-4555-8555-555555555555',pending:'66666666-6666-4666-8666-666666666666'};
const users=[{id:ids.owner,aud:'authenticated',role:'authenticated',email:'owner@example.invalid',email_confirmed_at:now,user_metadata:{display_name:'QA Owner'},app_metadata:{provider:'email'},created_at:now,is_anonymous:false},{id:ids.reader,aud:'authenticated',role:'authenticated',email:'reader@example.invalid',email_confirmed_at:now,user_metadata:{display_name:'QA Reader'},app_metadata:{provider:'email'},created_at:now,is_anonymous:false}];
const tokens=new Map();
function session(user){const token=[Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url'),Buffer.from(JSON.stringify({sub:user.id,email:user.email,role:'authenticated',exp:Math.floor(Date.now()/1000)+3600})).toString('base64url'),'LOCAL_FIXTURE_ONLY'].join('.');tokens.set(token,user);return {access_token:token,token_type:'bearer',expires_in:3600,refresh_token:'fixture-refresh-'+user.id,user};}
const base={category:'Ebook',price:59000,currency:'IDR',cover_url:'/products/formula-profitable-blueprint-cover.webp',featured:true,included:['QA: satu fondasi yang jelas','QA: langkah yang bisa dipraktikkan','QA: checklist untuk evaluasi'],description:'Data fixture untuk memeriksa halaman produk. Konten ini hanya tersedia di server loopback pengujian.',audience:'QA: builder, freelancer, dan kreator.',preview:'QA PREVIEW\nIni adalah cuplikan untuk memeriksa tipografi dan tampilan mobile.',seo_title:'',seo_description:'',created_at:now,updated_at:now};
const products=[{...base,id:ids.product,name:'QA Fixture · Formula Profitable Blueprint',slug:'qa-formula-profitable-blueprint',short_description:'Fixture pengujian lokal — bukan produk production.',status:'published'},{...base,id:ids.draft,name:'Formula Profitable Blueprint',slug:'formula-profitable-blueprint',short_description:'Draft pertama; PDF sedang disiapkan.',status:'draft'}];
const files=[{id:randomUUID(),product_id:ids.product,storage_path:ids.product+'/fixture.pdf',name:'QA-fixture.pdf',version:'1',created_at:now}];
const orders=[{id:ids.paid,user_id:ids.reader,customer_name:'QA Reader',customer_email:'reader@example.invalid',total:59000,currency:'IDR',status:'paid',provider:'midtrans',payment_url:null,created_at:now,commerce_order_items:[{product_id:ids.product,product_name:products[0].name,price:59000}]},{id:ids.pending,user_id:ids.reader,customer_name:'QA Reader',customer_email:'reader@example.invalid',total:59000,currency:'IDR',status:'pending',provider:'midtrans',payment_url:null,created_at:now,commerce_order_items:[{product_id:ids.product,product_name:products[0].name,price:59000}]}];
const entitlements=[{id:randomUUID(),user_id:ids.reader,resource_type:'product',resource_id:ids.product,order_id:ids.paid,status:'active',expires_at:null,granted_at:now}];
let storageNames=new Set([ids.product+'/fixture.pdf']);
http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://127.0.0.1:3021');
 res.setHeader('Access-Control-Allow-Origin',['http://localhost:3014','http://127.0.0.1:3014'].includes(req.headers.origin)?req.headers.origin:'http://127.0.0.1:3014');res.setHeader('Access-Control-Allow-Headers','authorization,apikey,x-client-info,content-type,x-supabase-api-version');res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE,OPTIONS');
 if(req.method==='OPTIONS'){res.writeHead(204);return res.end();}
 const chunks=[];for await(const c of req)chunks.push(c);
 const bytes=Buffer.concat(chunks);let body={};try{body=JSON.parse(bytes.toString());}catch{}
 const user=tokens.get(String(req.headers.authorization||'').replace(/^Bearer /,''));
 function json(data,status=200){res.setHeader('Content-Type','application/json');res.writeHead(status);res.end(JSON.stringify(data));}
 if(url.pathname==='/auth/v1/token'){
  const found=users.find(u=>u.email===body.email || body.refresh_token==='fixture-refresh-'+u.id);
  return found && (body.password==='fixture-password' || body.refresh_token) ? json(session(found)) : json({msg:'Invalid fixture credentials'},400);
 }
 if(url.pathname==='/auth/v1/user')return user?json(user):json({msg:'Invalid fixture token'},401);
 if(url.pathname==='/auth/v1/logout')return json({});
 if(url.pathname.startsWith('/storage/v1/object/sign/'))return json({signedURL:'/object/sign/commerce-files/fixture.pdf?token=LOCAL_FIXTURE_ONLY'});
 if(url.pathname==='/storage/v1/object/list/commerce-files')return json([...storageNames].filter(p=>p.startsWith(body.prefix+'/')).map(p=>({name:p.slice(body.prefix.length+1),id:randomUUID(),metadata:{mimetype:'application/pdf'}})));
 if(url.pathname.startsWith('/storage/v1/object/commerce-files/') && req.method==='POST'){const p=url.pathname.slice('/storage/v1/object/commerce-files/'.length);storageNames.add(p);return json({Key:'commerce-files/'+p,Id:randomUUID()});}
 const table=url.pathname.slice('/rest/v1/'.length);
 if(!url.pathname.startsWith('/rest/v1/'))return json({error:'Fixture endpoint absent'},404);
 if(table==='rpc/commerce_create_order')return json({error:'Use existing fixture orders'},400);
 let rows=table==='commerce_products'?products:table==='commerce_product_files'?files:table==='commerce_orders'?orders:table==='commerce_entitlements'?entitlements:[];
 if(!user && table==='commerce_products')rows=rows.filter(p=>p.status==='published');
 if(user && user.id===ids.reader && ['commerce_orders','commerce_entitlements'].includes(table))rows=rows.filter(p=>p.user_id===ids.reader);
 if(user && user.id===ids.reader && table==='commerce_product_files')rows=[];
 function filter(list){return list.filter(row=>[...url.searchParams].every(([k,v])=>!v.startsWith('eq.') || String(row[k])===v.slice(3)));}
 rows=filter(rows);
 if(req.method==='POST'){
  if(table==='commerce_products'){if(user?.id!==ids.owner)return json({message:'Forbidden'},403);const p={...body,id:randomUUID(),currency:'IDR',created_at:now,updated_at:now};products.push(p);rows=[p];}
  if(table==='commerce_product_files'){const f={...body,id:randomUUID(),version:'1',created_at:now};files.push(f);rows=[f];}
 }
 if(req.method==='PATCH' && table==='commerce_products'){
  if(user?.id!==ids.owner)return json({message:'Forbidden'},403);
  if(body.status==='published' && !files.some(f=>f.product_id===rows[0]?.id))return json({message:'Upload a private product file before publishing.'},400);
  rows.forEach(p=>Object.assign(p,body,{updated_at:new Date().toISOString()}));
 }
 const select=url.searchParams.get('select')||'';
 const mapped=rows.map(row=>{
  if(table==='commerce_products' && select.includes('commerce_product_files'))return {...row,commerce_product_files:files.filter(f=>f.product_id===row.id)};
  if(table==='commerce_entitlements' && select.includes('commerce_products'))return {...row,commerce_products:products.find(p=>p.id===row.resource_id)};
  return row;
 });
 res.setHeader('Content-Range','0-'+Math.max(0,mapped.length-1)+'/'+mapped.length);
 return req.headers.accept?.includes('application/vnd.pgrst.object+json')?json(mapped[0]||null,mapped.length?200:406):json(mapped);
}).listen(3021,'127.0.0.1',()=>console.log('Loopback QA fixture ready on 3021. No production data or secrets.'));
