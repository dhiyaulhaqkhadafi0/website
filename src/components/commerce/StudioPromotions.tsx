"use client";
import {useState} from "react";
import type {Product} from "@/lib/commerce-types";
import {PromotionFields} from "./PromotionFields";
import {commerceApi} from "./client-api";
import s from "./commerce.module.css";
function PromotionCard({product}:{product:Product}){
 const [value,setValue]=useState(product),[busy,setBusy]=useState(false),[notice,setNotice]=useState("");
 async function save(e:React.FormEvent){e.preventDefault();if(busy)return;setBusy(true);setNotice("");try{
  const result=await commerceApi(`/api/studio/products/${product.id}/promotion`,{method:"PATCH",body:JSON.stringify({price:value.price,compare_at_price:value.compare_at_price,promotion_enabled:value.promotion_enabled||false,promotion_label:value.promotion_label||"Harga spesial",updated_at:value.updated_at})});
  setValue(result.product);setNotice("Promosi disimpan. Harga baru berlaku untuk pesanan baru; nominal pesanan yang sudah dibuat tetap tersimpan.");
 }catch(error){setNotice(error instanceof Error?error.message:"Promosi belum tersimpan.");}finally{setBusy(false);}}
 return <form className={s.promotionCard+" "+s.form} onSubmit={save}><h2>{product.name}</h2><p>{product.status==="published"?"Tayang di katalog":"Produk belum dipublikasikan"}</p>
  <label>Harga jual / nominal checkout (Rp)<input type="number" min={0} max={100000000} step={1} required value={value.price} onChange={e=>setValue({...value,price:Number(e.target.value)})}/></label>
  <PromotionFields value={value} onChange={patch=>setValue({...value,...patch})}/>
  {notice&&<p role="status">{notice}</p>}<button className={s.button} disabled={busy}>{busy?"Menyimpan…":"Simpan promosi"}</button>
 </form>;
}
export function StudioPromotions({products}:{products:Product[]}){return <div className={s.promotionGrid}>{products.map(product=><PromotionCard key={product.id} product={product}/>)}{!products.length&&<p>Tambahkan produk terlebih dahulu untuk mengatur promosi.</p>}</div>;}
