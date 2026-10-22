import {emailRpc} from './provider-email.mjs';
const encoder=new TextEncoder();
const eventTypes=new Set(['email.sent','email.delivered','email.delivery_delayed','email.bounced','email.complained','email.failed','email.suppressed']);
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const reply=status=>new Response(null,{status,headers:{'Cache-Control':'no-store'}});
function decode(value){return Uint8Array.from(atob(value),c=>c.charCodeAt(0));}

// Svix signs the original bytes, including whitespace. WebCrypto verifies the
// HMAC in constant time; timestamp bounds and database replay fencing both apply.
export async function verifyResendSignature(headers,raw,secret,now=Date.now()){
 const id=headers.get('svix-id'),timestamp=headers.get('svix-timestamp'),signatures=headers.get('svix-signature');
 if(!/^whsec_[a-zA-Z0-9+/]+=*$/.test(secret||'')||!id||id.length>200||!/^\d{10}$/.test(timestamp||'')||!signatures||signatures.length>2048||Math.abs(now/1000-Number(timestamp))>300)return false;
 try{
  const key=await crypto.subtle.importKey('raw',decode(secret.slice(6)),{name:'HMAC',hash:'SHA-256'},false,['verify']);
  const prefix=encoder.encode(`${id}.${timestamp}.`),signed=new Uint8Array(prefix.length+raw.length);signed.set(prefix);signed.set(raw,prefix.length);
  for(const item of signatures.split(' ')){
   const [version,value]=item.split(',');if(version!=='v1'||!value)continue;
   try{if(await crypto.subtle.verify('HMAC',key,decode(value),signed))return true;}catch{/* Ignore malformed or rotated signatures. */}
  }
 }catch{/* Invalid secret or headers fail closed. */}
 return false;
}
export async function resendWebhook(request,env,{requestFetch=fetch,now=Date.now()}={}){
 if(request.method!=='POST')return new Response(null,{status:405,headers:{Allow:'POST','Cache-Control':'no-store'}});
 if(!env.RESEND_WEBHOOK_SECRET)return reply(503);
 if(Number(request.headers.get('Content-Length'))>32768)return reply(413);
 const reader=request.body?.getReader();if(!reader)return reply(400);
 const chunks=[];let length=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>32768){await reader.cancel();return reply(413);}chunks.push(value);}}catch{return reply(400);}
 const raw=new Uint8Array(length);let offset=0;for(const chunk of chunks){raw.set(chunk,offset);offset+=chunk.length;}
 if(!await verifyResendSignature(request.headers,raw,env.RESEND_WEBHOOK_SECRET,now))return reply(401);
 let event;try{event=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(raw));}catch{return reply(400);}
 if(!eventTypes.has(event?.type)||!uuid.test(event?.data?.email_id||''))return reply(400);
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',raw)),byte=>byte.toString(16).padStart(2,'0')).join('');
 try{
  await emailRpc(env,'commerce_record_resend_email_event',{p_event:request.headers.get('svix-id'),p_email:event.data.email_id,p_type:event.type,p_hash:hash},requestFetch);
  return reply(200);
 }catch{return reply(503);}
}
