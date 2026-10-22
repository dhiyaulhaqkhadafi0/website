"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Globe, X } from "lucide-react";
import { SUPPORTED_LANGUAGES, suggestedLanguage, isPublicTranslationPath } from "@/lib/visitor-language.mjs";
const KEY="khadafi_language_offer_v1";
export function LanguageSuggestion({onTranslate}:{onTranslate:(code:string)=>void}) {
  const pathname=usePathname() || "/";
  const [suggestion,setSuggestion]=useState<string|null>(null),[selected,setSelected]=useState("en");
  const [error,setError]=useState("");
  const root=useRef<HTMLElement>(null);
  useEffect(()=>{
    if(!isPublicTranslationPath(pathname) || /bot|crawler|spider/i.test(navigator.userAgent))return;
    try { if(localStorage.getItem("khadafi_lang_preference") || Date.now()-Number(localStorage.getItem(KEY)||0)<30*86400000)return; } catch { /* Offer without persisting if storage is unavailable. */ }
    let active=true;
    const controller=new AbortController();
    const timer=setTimeout(()=>{
      void fetch("/api/visitor-context",{signal:controller.signal,cache:"no-store"}).then(r=>r.ok?r.json():{country:null}).catch(()=>({country:null})).then(({country})=>{
        if(!active)return;
        const code=suggestedLanguage(typeof country==="string"?country:null,navigator.languages || [navigator.language]);
        if(code!=="id"){setSelected(code);setSuggestion(code);}
      });
    },1800);
    return()=>{active=false;clearTimeout(timer);controller.abort();};
  },[pathname]);
  function dismiss(){try{localStorage.setItem(KEY,String(Date.now()));}catch{}setSuggestion(null);}
  useEffect(()=>{if(!suggestion)return;const escape=(e:KeyboardEvent)=>{if(e.key==="Escape"){try{localStorage.setItem(KEY,String(Date.now()));}catch{}setSuggestion(null);}};window.addEventListener("keydown",escape);return()=>window.removeEventListener("keydown",escape);},[suggestion]);
  if(!suggestion || !isPublicTranslationPath(pathname))return null;
  return <aside ref={root} className="language-offer notranslate" role="dialog" aria-modal="false" aria-labelledby="language-offer-title" translate="no">
    <button type="button" className="language-offer-close" aria-label="Dismiss language suggestion" onClick={dismiss}><X size={16}/></button>
    <span className="language-offer-kicker"><Globe size={13}/> MAKE YOURSELF AT HOME</span>
    <h2 id="language-offer-title">A little closer.<br/><em>In your language.</em></h2>
    <p>Read this page in your preferred language. Optional translation uses Google Translate, which receives public page content and browser information.</p>
    <label htmlFor="suggested-language">Choose your language</label>
    <select id="suggested-language" value={selected} onChange={e=>setSelected(e.target.value)}>{SUPPORTED_LANGUAGES.filter(l=>l.code!=="id").map(l=><option key={l.code} value={l.code}>{l.label}</option>)}</select>
    <div className="language-offer-actions"><button type="button" onClick={()=>{try{onTranslate(selected);}catch{setError("Please allow browser storage to save your language choice.");}}}>Translate page ↗</button><button type="button" onClick={dismiss}>Keep Bahasa Indonesia</button></div>
    <small>Automatic translation may vary. <a href="/cookies">Privacy &amp; preferences</a></small>
    {error && <p role="alert">{error}</p>}
  </aside>;
}
