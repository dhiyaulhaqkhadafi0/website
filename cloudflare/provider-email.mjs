import {emailConfiguration as smtpConfiguration,transactionMessage} from './transaction-email.mjs';
import {resendPayload} from './resend-email.mjs';
const address=/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
const errors=new Set(['INVALID_RECIPIENT','SMTP_AUTH','SMTP_TIMEOUT','SMTP_CONNECTION','SMTP_RECIPIENT','RESEND_AUTH','RESEND_RATE_LIMITED','RESEND_REJECTED','RESEND_UNKNOWN','RESEND_KEY_CONFLICT']);
export function providerConfiguration(env,provider){
 if(provider==='smtp')return smtpConfiguration(env);
 if(provider!=='resend'||env.TRANSACTION_EMAIL_ENABLED!=='true'||env.RESEND_DOMAIN_VERIFIED!=='true'||
  (env.RESEND_TESTS_ENABLED!=='true'&&env.RESEND_PRODUCTION_APPROVED!=='true')||!/^re_[a-zA-Z0-9_]+$/.test(env.RESEND_API_KEY||'')||
  env.NEXT_PUBLIC_SUPABASE_URL!=='https://mykgtajanxczdnzekycl.supabase.co'||!env.SUPABASE_SERVICE_ROLE_KEY)return null;
 const from='notifications@khadafidaffa.com';
 const replyTo=env.RESEND_REPLY_TO_VERIFIED==='true'?'support@khadafidaffa.com':env.SMTP_FROM;
 if(!address.test(replyTo||''))return null;
 return {provider:'resend',from,replyTo,apiKey:env.RESEND_API_KEY};
}
export async function emailRpc(env,name,body,requestFetch=fetch){
 if(env.NEXT_PUBLIC_SUPABASE_URL!=='https://mykgtajanxczdnzekycl.supabase.co'||!env.SUPABASE_SERVICE_ROLE_KEY)throw new Error('EMAIL_DATABASE_UNAVAILABLE');
 const response=await requestFetch(env.NEXT_PUBLIC_SUPABASE_URL+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,Authorization:'Bearer '+env.SUPABASE_SERVICE_ROLE_KEY,'Content-Type':'application/json'},body:JSON.stringify(body),redirect:'manual',signal:AbortSignal.timeout(15000)});
 if(!response.ok)throw new Error('EMAIL_DATABASE_UNAVAILABLE');return response.status===204?null:response.json();
}
export function providerMessage(job,config){
 if(job.kind!=='delivery_probe')return transactionMessage(job,config.from);
 if(job.provider!=='resend'||!address.test(job.recipient||'')||!/^[-a-f0-9]{36}$/i.test(job.id))throw new Error('INVALID_RECIPIENT');
 return {from:{name:'Khadafi',email:config.from},to:job.recipient,subject:'Uji pengiriman email Khadafi',
  text:`Ini adalah pengujian pengirim notifications@khadafidaffa.com yang Anda minta.\n\nKode uji: ${job.id.slice(0,8).toUpperCase()}\nWaktu persiapan: ${job.created_at}\n\nSilakan periksa folder Inbox/Spam dan autentikasi SPF, DKIM, DMARC. Pengujian ini tidak membuat pesanan atau pembayaran.\n\nKhadafi`,
  headers:{'Message-ID':`<khadafi-${job.id}@khadafidaffa.com>`,'Auto-Submitted':'auto-generated'}};
}
export async function deliverProviderEmails(env,{smtpSend,resendSend,requestFetch=fetch,log=()=>{}}){
 const preferred=env.TRANSACTION_EMAIL_PROVIDER||'smtp';if(!['smtp','resend'].includes(preferred))return {skipped:true};
 const summary={accepted:0,failed:0,skipped:[]};
 for(const provider of [preferred,...['smtp','resend'].filter(p=>p!==preferred)]){
  const config=providerConfiguration(env,provider);if(!config){summary.skipped.push(provider);continue;}
  const takeNew=provider===preferred&&(provider!=='resend'||(env.RESEND_PRODUCTION_APPROVED==='true'&&env.RESEND_REPLY_TO_VERIFIED==='true'));
  const jobs=await emailRpc(env,'commerce_claim_provider_emails',{p_provider:provider,p_include_new:takeNew},requestFetch);
  if(!Array.isArray(jobs))throw new Error('EMAIL_DATABASE_UNAVAILABLE');
  for(const job of jobs){
   if(job.provider!==provider)throw new Error('EMAIL_PROVIDER_MISMATCH');
   let accepted=false,error=null,id=null;
   try{
    const message=job.message_payload&&provider==='resend'?null:providerMessage(job,config);
    if(provider==='resend')job.message_payload=await emailRpc(env,'commerce_prepare_resend_email',{p_id:job.id,p_token:job.lease_token,p_payload:job.message_payload||resendPayload(config,message,job)},requestFetch);
    const result=await (provider==='resend'?resendSend(config,message,job):smtpSend(config,message,job));id=result?.id||null;accepted=true;summary.accepted++;
   }
   catch(failure){error=errors.has(failure?.message)?failure.message:provider==='resend'?'RESEND_UNKNOWN':'SMTP_SEND_FAILED';summary.failed++;}
   await emailRpc(env,'commerce_finish_provider_email',{p_id:job.id,p_token:job.lease_token,p_provider:provider,p_accepted:accepted,p_error:error,p_provider_id:id},requestFetch);
   log({id:job.id,provider,outcome:accepted?'PROVIDER_ACCEPTED':error});
  }
 }
 return summary;
}
