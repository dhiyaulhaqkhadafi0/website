// Direct REST adapter: deterministic request + provider idempotency, no automatic
// fallback or client-supplied endpoint. Never log response bodies or credentials.
export function resendPayload(config,message,job){
 return {from:`Khadafi <${config.from}>`,to:[message.to],subject:message.subject,text:message.text,
  ...(config.replyTo?{reply_to:config.replyTo}:{}),headers:message.headers,tags:[{name:'outbox_id',value:job.id}]};
}
export async function sendResendEmail(config,_message,job,requestFetch=fetch){
 const body=job.message_payload;
 if(!body||body.from!=='Khadafi <notifications@khadafidaffa.com>')throw new Error('RESEND_REJECTED');
 let response;
 try{response=await requestFetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+config.apiKey,'Content-Type':'application/json','Idempotency-Key':'khadafi-transaction/'+job.id},body:JSON.stringify(body),cache:'no-store',redirect:'manual',signal:AbortSignal.timeout(15000)});}
 catch{throw new Error('RESEND_UNKNOWN');}
 const raw=await response.text();let result;try{result=raw.length<=65536?JSON.parse(raw):null;}catch{result=null;}
 if(response.status===429)throw new Error('RESEND_RATE_LIMITED');
 if([401,403].includes(response.status))throw new Error('RESEND_AUTH');
 if(response.status===409)throw new Error(result?.name==='concurrent_idempotent_requests'?'RESEND_UNKNOWN':'RESEND_KEY_CONFLICT');
 if(response.status>=400&&response.status<500)throw new Error('RESEND_REJECTED');
 if(!response.ok||!result||!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(result.id||''))throw new Error('RESEND_UNKNOWN');
 return {id:result.id};
}
