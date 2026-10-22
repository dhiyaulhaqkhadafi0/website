import { createHash, randomUUID } from "node:crypto";
import { requireUser, sameOrigin, json } from "@/lib/commerce-server";
import { createServiceRoleClient } from "@/lib/supabase";
import { dokuPolicy } from "@/lib/doku-config";
import { checkDokuStatus } from "@/lib/doku-status-check";
import { requestDokuCancellation } from "@/lib/doku-cancel";
import { isDokuSettlement } from "@/lib/doku-channels.mjs";

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
 if(!sameOrigin(request))return json({error:"Origin tidak diizinkan."},403);
 const auth=await requireUser(request);if(!auth.ok)return auth.response;
 const {id}=await params;if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))return json({error:"Pesanan tidak valid."},400);
 const policy=dokuPolicy(process.env);if(!policy.configured)return json({error:"Layanan pembayaran belum tersedia."},503);
 const db=createServiceRoleClient();
 const {data:claim,error}=await db.rpc("commerce_claim_doku_cancel",{p_order:id,p_user:auth.user.id,p_environment:policy.environment});
 if(error||!claim)return json({error:"Pesanan tidak tersedia untuk dibatalkan."},404);
 if(claim.paid)return json({error:"Pembayaran sudah diterima. Pesanan lunas tidak dapat dibatalkan."},409);
 if(claim.closed)return json({status:"cancelled",message:"Pesanan sudah ditutup. Kamu dapat memilih produk lain."});
 if(claim.busy)return json({error:"Permintaan sebelumnya masih diproses. Periksa status beberapa saat lagi."},409);
 let rejected=false,requestAttempted=Boolean(claim.check_only);
 try{
  const credentials={clientId:process.env.DOKU_CLIENT_ID||"",secretKey:process.env.DOKU_SECRET_KEY||""};
  const read=async()=>{const status=await checkDokuStatus(claim.invoice,credentials,policy.production);if(status.invoice!==claim.invoice||status.amount!==claim.total)throw new Error("DOKU_CANCEL_ORDER_MISMATCH");return status;};
  const before=await read();
  if(before.status==="SUCCESS"){
   if(!isDokuSettlement(before.channel,before.status,before.transactionType))throw new Error("DOKU_CANCEL_ORDER_MISMATCH");
   const written=await db.rpc("commerce_record_doku_event",{p_order:id,p_total:claim.total,p_reference:claim.invoice,p_environment:policy.environment,
    p_event:"cancel-check:"+randomUUID(),p_hash:createHash("sha256").update(JSON.stringify(before)).digest("hex"),p_status:"SUCCESS",p_channel:before.channel});
   if(written.error)throw new Error("DOKU_CANCEL_PERSISTENCE_FAILED");
   rejected=true;return json({error:"Pembayaran sudah diterima. Periksa pesanan dan library kamu."},409);
  }
  const confirm=async(status:typeof before)=>{
   const result=await db.rpc("commerce_confirm_doku_cancel",{p_order:id,p_environment:policy.environment,p_invoice:claim.invoice,p_total:claim.total,p_outcome:status.status});
   if(result.error)throw new Error("DOKU_CANCEL_PERSISTENCE_FAILED");
   return result.data===true;
  };
  if(["CANCELLED","EXPIRED"].includes(before.status))return (await confirm(before))?json({status:"cancelled",message:"Pesanan ditutup. Kamu dapat memilih produk lain."}):json({error:"Status pembayaran berubah. Periksa pesananmu."},409);
  const channel=before.channel;
  if(channel&&channel!=="QRIS_DOKU"&&(!channel.startsWith("VIRTUAL_ACCOUNT_")||["VIRTUAL_ACCOUNT_BTN","VIRTUAL_ACCOUNT_BNC","VIRTUAL_ACCOUNT_BPD","VIRTUAL_ACCOUNT_OCBC"].includes(channel))){
   rejected=true;return json({error:"Kanal pembayaran ini belum mendukung pembatalan langsung. Kamu tetap bisa membeli produk lain; jangan bayar tagihan lama jika tidak dilanjutkan."},422);
  }
  if(!claim.check_only){requestAttempted=true;await requestDokuCancellation({invoice:claim.invoice,originalRequestId:claim.original_request_id,requestId:claim.request_id,...credentials,production:policy.production});}
  const after=await read();
  if(["CANCELLED","EXPIRED"].includes(after.status)&&await confirm(after))return json({status:"cancelled",message:"Pembatalan dikonfirmasi DOKU. Silakan pilih produk lain."});
  return json({status:"pending",message:"Permintaan pembatalan sedang diverifikasi DOKU. Kamu tetap bisa memilih produk lain."},202);
 }catch(error){
  const code=typeof error==="object"&&error!==null&&"message" in error&&typeof error.message==="string"?error.message:"";
  if(!requestAttempted&&code==="DOKU_STATUS_NOT_FOUND_UNCONFIRMED"){
   const closed=await db.rpc("commerce_close_unregistered_doku_intent",{p_order:id,p_user:auth.user.id,p_token:claim.token,p_environment:policy.environment});
   if(!closed.error&&closed.data===true){rejected=false;return json({status:"cancelled",local_only:true,message:"Catatan pesanan lama ditutup. Invoice ini tidak ditemukan di DOKU; penutupan lokal bukan konfirmasi pembatalan tagihan DOKU. Jangan bayar tautan lama. Jika dana sudah terpotong, hubungi support."});}
  }
  rejected=!requestAttempted||code==="DOKU_CANCEL_REJECTED";
  return json({error:code==="DOKU_CANCEL_REJECTED"?"DOKU belum menerima pembatalan. Periksa pengaktifan Order Cancellation dan kanal pembayaran di dashboard merchant.":"Status pembatalan belum dapat dipastikan. Periksa status pesanan kembali; jangan membuat pembayaran ganda."},502);
 }finally{
  await db.rpc("commerce_finish_doku_cancel",{p_order:id,p_token:claim.token,p_rejected:rejected});
 }
}
