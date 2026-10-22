"use client";
import type { PriceValues } from "./ProductPrice";
import { ProductPrice } from "./ProductPrice";
import s from "./commerce.module.css";
export function PromotionFields({value,onChange}:{value:PriceValues;onChange:(patch:Partial<PriceValues>)=>void}){
 return <fieldset className={s.promotionFields}><legend>Promosi & harga coret</legend>
  <label className={s.check}><input type="checkbox" checked={value.promotion_enabled||false} onChange={e=>onChange({promotion_enabled:e.target.checked})}/><span>Tampilkan promosi pada katalog, halaman produk, dan checkout</span></label>
  <label>Harga reguler / harga sebelum diskon (Rp)<input type="number" min={1} max={100000000} step={1} value={value.compare_at_price??""} required={value.promotion_enabled} onChange={e=>onChange({compare_at_price:e.target.value===""?null:Number(e.target.value)})}/></label>
  <label>Label promosi<input maxLength={60} value={value.promotion_label||"Harga spesial"} onChange={e=>onChange({promotion_label:e.target.value})}/></label>
  <small>Harga jual di atas adalah nominal yang ditagihkan. Menonaktifkan tampilan promosi tidak mengubah harga jual. Gunakan harga reguler yang benar.</small>
  <div className={s.promoPreview}><span>Preview harga</span><ProductPrice product={value}/></div>
 </fieldset>;
}
