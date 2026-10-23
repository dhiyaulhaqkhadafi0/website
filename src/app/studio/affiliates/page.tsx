import type { Metadata } from "next";
import { cookies } from "next/headers";
import { requireAffiliateAdmin as requireBlogAdmin } from "@/lib/affiliate-auth";
import { AffiliateManager } from "@/components/studio/AffiliateManager";
import { AffiliateSessionGate } from "@/components/studio/AffiliateSessionGate";
export const dynamic="force-dynamic";
export const metadata: Metadata={title:"Affiliate Manager / Studio",robots:{index:false,follow:false},alternates:{canonical:"https://khadafidaffa.com/studio/affiliates"}};
export default async function Page({searchParams}:{searchParams:Promise<{area?:string}>}){
  const token=(await cookies()).get("studio_affiliate_session")?.value;
  if(!token) return <AffiliateSessionGate/>;
  const auth=await requireBlogAdmin(new Request("https://khadafidaffa.com/studio/affiliates",{headers:{Authorization:`Bearer ${token}`}}));
  if(!auth.ok) return <AffiliateSessionGate/>;
  return <AffiliateManager initialArea={(await searchParams).area}/>;
}
