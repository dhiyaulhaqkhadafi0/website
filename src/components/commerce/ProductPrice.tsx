import { money } from "@/lib/commerce-types";
import s from "./commerce.module.css";
export type PriceValues={price:number;compare_at_price?:number|null;promotion_enabled?:boolean;promotion_label?:string};
export function ProductPrice({product,compact=false}:{product:PriceValues;compact?:boolean}){
 const comparison=product.compare_at_price;
 const promotion=product.promotion_enabled&&comparison!=null&&comparison>product.price&&product.price>0;
 return <span className={s.productPricing} data-product-price={product.price}>
  {promotion&&<span className={s.promoContext}><del aria-label={"Harga reguler "+money(comparison)}>{money(comparison)}</del><span className={s.promoBadge}>Hemat {Math.round((comparison-product.price)/comparison*100)}%</span></span>}
  <strong>{money(product.price)}</strong>
  {promotion&&!compact&&<small>{product.promotion_label||"Harga spesial"} · Hemat {money(comparison-product.price)}</small>}
 </span>;
}
