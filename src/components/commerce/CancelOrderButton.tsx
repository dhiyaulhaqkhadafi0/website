"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { commerceApi } from "./client-api";
import s from "./commerce.module.css";
export function CancelOrderButton({orderId,onCancelled}:{orderId:string;onCancelled?:()=>void}) {
 const router=useRouter(), lock=useRef(false);
 const [confirm,setConfirm]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 async function cancel(){
  if(lock.current)return;lock.current=true;setBusy(true);setMessage("");
  try{
   const result=await commerceApi(`/api/commerce/orders/${orderId}/cancel`,{method:"POST"});
   setMessage(result.message);setConfirm(false);
   if(result.status==="cancelled"){
    try{const stored=sessionStorage.getItem("khadafi-checkout-order-"+orderId);if(stored){const mapping=JSON.parse(stored);if(typeof mapping.storageKey==="string"&&mapping.storageKey.startsWith("khadafi-checkout-")&&sessionStorage.getItem(mapping.storageKey)===mapping.key){sessionStorage.removeItem(mapping.storageKey);sessionStorage.removeItem("khadafi-checkout-method-"+mapping.key);}sessionStorage.removeItem("khadafi-checkout-order-"+orderId);}}catch{}
    onCancelled?.();router.refresh();
   }
  }catch(error){setMessage(error instanceof Error?error.message:"Pembatalan belum dapat dipastikan.");}
  finally{lock.current=false;setBusy(false);}
 }
 return <div className={s.cancelOrder}>
  {!confirm?<button className={s.secondary} type="button" onClick={()=>setConfirm(true)}>Batalkan pembayaran</button>:<>
   <p>Batalkan pesanan yang belum dibayar? Jika kamu sudah membayar, periksa status terlebih dahulu.</p>
   <div className={s.actions}><button type="button" className={s.secondary} disabled={busy} onClick={()=>void cancel()}>{busy?"Memverifikasi DOKU…":"Ya, batalkan pesanan"}</button><button type="button" className={s.secondary} disabled={busy} onClick={()=>setConfirm(false)}>Kembali</button></div>
  </>}
  {message&&<p role="status">{message}</p>}
  <Link href="/products">Pilih produk lain ↗</Link>
 </div>;
}
