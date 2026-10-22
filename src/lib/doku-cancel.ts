import { timingSafeEqual } from "node:crypto";
import { signature } from "./doku-security";
import { normalizeDokuCredentials } from "./doku-credentials.mjs";

// A successful POST is an acknowledgement only. Signed Check Status must confirm
// cancellation before our order becomes cancelled.
export async function requestDokuCancellation(input: {
  invoice: string; originalRequestId: string; requestId: string;
  clientId: string; secretKey: string; production: boolean;
}, requestFetch: typeof fetch = fetch) {
  if (!/^KS[0-9A-Z]{1,25}$/.test(input.invoice) ||
      ![input.originalRequestId,input.requestId].every(id=>/^[0-9a-f-]{36}$/i.test(id)))
    throw new Error("DOKU_CANCEL_INVALID_ORDER");
  const credentials=normalizeDokuCredentials(input.clientId,input.secretKey);
  const target="/checkout/v3/cancellations",time=new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const body=JSON.stringify({order:{invoice_number:input.invoice},payment:{original_request_id:input.originalRequestId},note:"Customer requested cancellation"});
  const response=await requestFetch((input.production?"https://api.doku.com":"https://api-sandbox.doku.com")+target,{
    method:"POST",cache:"no-store",redirect:"manual",signal:AbortSignal.timeout(15000),
    headers:{"Content-Type":"application/json","Client-Id":credentials.clientId,"Request-Id":input.requestId,"Request-Timestamp":time,
      Signature:signature(credentials.clientId,input.requestId,time,target,body,credentials.secretKey)},body,
  }).catch(()=>{throw new Error("DOKU_CANCEL_UNKNOWN");});
  if(response.status>=300&&response.status<400)throw new Error("DOKU_CANCEL_REDIRECT_BLOCKED");
  if(!response.ok)throw new Error(response.status>=400&&response.status<500?"DOKU_CANCEL_REJECTED":"DOKU_CANCEL_UNKNOWN");
  const text=await response.text();if(text.length>65536)throw new Error("DOKU_CANCEL_INVALID_RESPONSE");
  const received=response.headers.get("signature");
  if(received){
    const responseTime=response.headers.get("response-timestamp")||"";
    const expected=signature(credentials.clientId,input.requestId,responseTime,target,text,credentials.secretKey,true);
    const a=Buffer.from(received),b=Buffer.from(expected);
    if(response.headers.get("client-id")!==credentials.clientId||response.headers.get("request-id")!==input.requestId||
      !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(responseTime)||a.length!==b.length||!timingSafeEqual(a,b))
      throw new Error("DOKU_CANCEL_INVALID_RESPONSE");
  }
}
