import {pageUser} from "@/lib/commerce-server";
import type {Product} from "@/lib/commerce-types";
import {StudioPromotions} from "@/components/commerce/StudioPromotions";
import s from "@/components/commerce/commerce.module.css";
export default async function Page(){
 const auth=await pageUser("/studio/promotions",true);
 const {data,error}=await auth.client.from("commerce_products").select("*").eq("is_payment_qa",false).order("updated_at",{ascending:false});
 return <><div className={s.pageTitle}><span className={s.eyebrow}>KHADAFI STUDIO / PROMOTIONS</span><h1>Harga yang jelas. <em>Penawaran yang tepat.</em></h1><p>Atur harga jual, harga reguler yang dicoret, dan label promosi. Harga jual adalah nominal yang ditagihkan ke pembeli.</p></div>{error?<p className={s.notice} role="alert">Promosi belum dapat dimuat.</p>:<StudioPromotions products={(data||[]) as Product[]}/>}</>;
}
