import {requireStudio,sameOrigin,json} from "@/lib/commerce-server";
import {validatePromotion} from "@/lib/commerce-types";
import {readLimitedBody} from "@/lib/doku-webhook-handler";
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
 if(!sameOrigin(request))return json({error:"Origin tidak diizinkan."},403);
 const auth=await requireStudio(request);if(!auth.ok)return auth.response;
 const {id}=await params;if(!/^[0-9a-f-]{36}$/i.test(id))return json({error:"Produk tidak valid."},400);
 try{
  const input=JSON.parse(await readLimitedBody(request,4096));
  if(!Number.isInteger(input.price)||input.price<0||input.price>100000000||typeof input.updated_at!=="string"||!Number.isFinite(Date.parse(input.updated_at)))throw new Error("Harga atau versi produk tidak valid. Muat ulang halaman.");
  const promotion=validatePromotion(input);
  const {data,error}=await auth.client.from("commerce_products").update({price:input.price,...promotion}).eq("id",id).eq("is_payment_qa",false).eq("updated_at",input.updated_at).select("*").maybeSingle();
  if(error)return json({error:"Promosi belum dapat disimpan. Periksa nominal harga."},400);
  if(!data)return json({error:"Produk sudah diperbarui atau tidak tersedia. Muat ulang halaman sebelum menyimpan."},409);
  return json({product:data});
 }catch(error){return json({error:error instanceof Error&&error.message.startsWith("Harga")?error.message:"Data promosi tidak valid. Periksa harga reguler dan harga jual."},400);}
}
