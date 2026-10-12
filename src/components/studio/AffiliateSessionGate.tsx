"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import s from "./affiliates.module.css";
export function AffiliateSessionGate() {
  const router=useRouter();const [error,setError]=useState("");const [busy,setBusy]=useState(true);const [attempt,setAttempt]=useState(0);
  useEffect(()=>{let active=true;
    void (async()=>{
      const {data}=await supabase.auth.getSession();
      if(!data.session){if(active){setBusy(false);setError("Masuk menggunakan akun admin Studio untuk melanjutkan.");}return;}
      const response=await fetch("/api/studio/affiliates/session",{method:"POST",headers:{Authorization:`Bearer ${data.session.access_token}`}});
      if(!response.ok){const body=await response.json();throw new Error(body.error||"Sesi belum dapat diverifikasi.");}
      if(active) { router.refresh(); setBusy(false); setError("Sesi telah diverifikasi. Periksa sesi lagi jika workspace belum terbuka."); }
    })().catch(reason=>{if(active){setBusy(false);setError(reason instanceof Error?reason.message:"Koneksi terputus.");}});
    return()=>{active=false;};
  },[router,attempt]);
  return <div className={s.gate}><span className={s.eyebrow}>KHADAFI / PRIVATE STUDIO</span><h1>Affiliate workspace.</h1><p>{busy?"Memverifikasi sesi admin di server…":error}</p><Link href="/studio">Masuk melalui Studio →</Link>{!busy&&<button type="button" onClick={()=>{setBusy(true);setAttempt(v=>v+1);}}>Periksa sesi lagi</button>}</div>;
}
