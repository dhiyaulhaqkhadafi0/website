// Pure composition and orchestration; the SMTP adapter lives outside Next.js.
const address=/^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;
export function emailConfiguration(env){
 if(env.TRANSACTION_EMAIL_ENABLED!=='true')return null;
 const host=env.SMTP_HOST||'smtp.gmail.com',from=env.SMTP_FROM||env.SMTP_USER;
 if(!/^[a-z0-9.-]+$/i.test(host)||!env.SMTP_USER||!env.SMTP_PASS||!address.test(from||'')||!env.SUPABASE_SERVICE_ROLE_KEY||env.NEXT_PUBLIC_SUPABASE_URL!=='https://mykgtajanxczdnzekycl.supabase.co')return null;
 if(host==='smtp.gmail.com'&&from.toLowerCase()!==env.SMTP_USER.toLowerCase())return null;
 return {host,port:465,secure:true,startTls:false,credentials:{username:env.SMTP_USER,password:env.SMTP_PASS},from};
}
export function transactionMessage(job,from){
 if(!address.test(job.recipient||'')||!Number.isSafeInteger(job.total)||job.total<0||!['payment_received','order_cancelled'].includes(job.kind)||!/^[-a-f0-9]{36}$/i.test(job.order_id)||!/^[-a-f0-9]{36}$/i.test(job.id))throw new Error('INVALID_RECIPIENT');
 const number=job.order_id.slice(0,8).toUpperCase(),paid=job.kind==='payment_received';
 const title=paid?'Pembayaran diterima':'Pesanan dibatalkan';
 const total=new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(job.total);
 const link='https://khadafidaffa.com/'+(paid?'account/library':'account/orders');
 const text=`${title}\n\nPesanan: ${number}\nProduk: ${String(job.product_names||'Produk digital').slice(0,1000)}\nTotal: ${total}\n\n${paid?'Pembayaran DOKU telah diverifikasi. Produk tersedia di library akun pembeli.':'Pesanan yang belum dibayar telah ditutup. Tagihan ini tidak perlu dibayar.'}\n\n${paid?'Buka library':'Lihat pesanan'}: ${link}\nMasuk menggunakan email pembeli yang sama.\n\nKhadafi\nEmail ini merupakan pemberitahuan transaksi.`;
 return {from:{name:'Khadafi',email:from},to:job.recipient,subject:`${title} — pesanan ${number}`,text,headers:{'Message-ID':`<khadafi-${job.id}@${from.split('@')[1]}>`,'Auto-Submitted':'auto-generated'}};
}
export async function deliverTransactionEmails(env,{send,requestFetch=fetch,log=()=>{}}){
 const config=emailConfiguration(env);if(!config)return {skipped:true,reason:'SMTP_NOT_CONFIGURED'};
 async function rpc(name,body){
  const response=await requestFetch(env.NEXT_PUBLIC_SUPABASE_URL+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,Authorization:'Bearer '+env.SUPABASE_SERVICE_ROLE_KEY,'Content-Type':'application/json'},body:JSON.stringify(body),redirect:'manual',signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw new Error('EMAIL_DATABASE_UNAVAILABLE');return response.status===204?null:response.json();
 }
 const jobs=await rpc('commerce_claim_transaction_emails',{});if(!Array.isArray(jobs))throw new Error('EMAIL_DATABASE_UNAVAILABLE');
 let accepted=0,failed=0;
 for(const job of jobs){
  let ok=false,error=null;
  try{const message=transactionMessage(job,config.from);await send(config,message);ok=true;accepted++;}
  catch(failure){error=['INVALID_RECIPIENT','SMTP_AUTH','SMTP_TIMEOUT','SMTP_CONNECTION','SMTP_RECIPIENT'].includes(failure?.message)?failure.message:'SMTP_SEND_FAILED';failed++;}
  await rpc('commerce_finish_transaction_email',{p_id:job.id,p_token:job.lease_token,p_accepted:ok,p_error:error});
  // Only an opaque queue ID and a controlled outcome, never SMTP responses or PII.
  log({id:job.id,outcome:ok?'SMTP_ACCEPTED':error});
 }
 return {accepted,failed};
}
