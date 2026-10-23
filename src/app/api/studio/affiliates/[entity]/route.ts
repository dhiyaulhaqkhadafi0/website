import { requireAffiliateAdmin as requireBlogAdmin } from "@/lib/affiliate-auth";
import { affiliateEnvironment, affiliateJson, allowedAffiliateHosts, boundedText } from "@/lib/affiliate-server";
import { isAffiliateEntity, uuidPattern, validateAffiliate } from "@/lib/affiliate-validation";
export const dynamic = "force-dynamic";
function range(params: URLSearchParams) {
  const days=params.get("days") || "30";
  let since: Date, until: Date;
  if(days==="custom") {
    const from=params.get("from")||"",to=params.get("to")||"";
    if(!/^\d{4}-\d{2}-\d{2}$/.test(from)||!/^\d{4}-\d{2}-\d{2}$/.test(to)) throw new Error("Pilih tanggal awal dan akhir.");
    since=new Date(`${from}T00:00:00+07:00`);until=new Date(`${to}T00:00:00+07:00`);until.setUTCDate(until.getUTCDate()+1);
  } else {
    if(!["7","30","90"].includes(days)) throw new Error("Rentang tidak valid.");
    until=new Date();since=new Date(until.getTime()-Number(days)*86400000);
  }
  if(!Number.isFinite(since.getTime())||!Number.isFinite(until.getTime())||since>=until||until.getTime()-since.getTime()>367*86400000) throw new Error("Rentang maksimal 366 hari.");
  return {since:since.toISOString(),until:until.toISOString()};
}
export async function GET(request: Request,{params}:{params:Promise<{entity:string}>}) {
  const auth=await requireBlogAdmin(request);if(!auth.ok){auth.response.headers.set("Cache-Control","private, no-store");return auth.response;}
  const {entity}=await params; if(!isAffiliateEntity(entity)) return affiliateJson({error:"Area tidak ditemukan."},404);
  try {
    const query=new URL(request.url).searchParams, period=range(query),page=Number(query.get("page")||1),q=query.get("q")||"",status=query.get("status")||"",program=query.get("program")||"";
    if(!Number.isSafeInteger(page)||page<1||page>100000||q.length>120||!/^[-\p{L}\p{N} .@_]*$/u.test(q)|| (program&&!uuidPattern.test(program)) || (status&&!(entity==="commissions"?["reported","qualified","earned","paid","rejected"]:["draft","active","paused","archived"]).includes(status))) throw new Error("Filter tidak valid.");
    const environment=affiliateEnvironment();
    let rows=auth.client.from(`affiliate_${entity}`).select("*",{count:"exact"}).order("created_at",{ascending:false});
    if(entity==="commissions") rows=rows.eq("environment",environment);
    if(entity==="commissions") rows=rows.gte("created_at",period.since).lt("created_at",period.until);
    if(q) rows=rows.ilike(entity==="commissions"?"external_reference":"name",`%${q}%`);
    if(status) rows=rows.eq(entity==="commissions"?"referral_status":"status",status);
    if(program) rows=rows.eq(entity==="programs"?"id":"program_id",program);
    const results=await Promise.all([
      rows.range((page-1)*25,page*25-1).abortSignal(AbortSignal.timeout(8000)),
      auth.client.rpc("affiliate_stats",{p_since:period.since,p_until:period.until,p_environment:environment,p_program:program||null}).abortSignal(AbortSignal.timeout(8000)),
      auth.client.from("affiliate_programs").select("id,name,status,created_at,updated_at").order("name").limit(1000).abortSignal(AbortSignal.timeout(8000)),
      auth.client.from("affiliate_links").select("id,name,slug,program_id,status,created_at,updated_at").order("name").limit(1000),
      auth.client.from("affiliate_campaigns").select("id,name,slug,link_id,program_id,status,created_at,updated_at").order("name").limit(1000),
      auth.client.from("affiliate_audit_log").select("id,entity,record_id,action,occurred_at,before_data,after_data").order("occurred_at",{ascending:false}).limit(12).abortSignal(AbortSignal.timeout(8000)),
      auth.client.from("affiliate_categories").select("id,name,slug").order("name").limit(100),
      auth.client.rpc('affiliate_revenue_breakdown',{p_since:period.since,p_until:period.until,p_environment:environment,p_program:program||null}).abortSignal(AbortSignal.timeout(8000)),
    ]);
    if(results.some(r=>r.error)) return affiliateJson({error:"Data affiliate belum dapat dimuat. Periksa migrasi database dan akses admin."},503);
    return affiliateJson({rows:results[0].data,count:results[0].count,page,stats:results[1].data,programs:results[2].data,links:results[3].data,campaigns:results[4].data,audit:results[5].data,categories:results[6].data,revenue:results[7].data,environment,tracking_origin:environment==="preview"?new URL(request.url).origin:"https://khadafidaffa.com"});
  } catch(error){return affiliateJson({error:error instanceof Error?error.message:"Permintaan tidak valid."},400);}
}
async function write(request: Request,entity: string,editing: boolean) {
  const auth=await requireBlogAdmin(request);if(!auth.ok){auth.response.headers.set("Cache-Control","private, no-store");return auth.response;}
  if(request.headers.get("origin")!==new URL(request.url).origin) return affiliateJson({error:"Origin tidak valid."},403);
  if(!isAffiliateEntity(entity)) return affiliateJson({error:"Area tidak ditemukan."},404);
  try {
    if(!request.headers.get("content-type")?.includes("application/json")) throw new Error("Gunakan JSON.");
    const body=JSON.parse(await boundedText(request,16384));
    if(!body||typeof body!=="object"||Array.isArray(body)) throw new Error("Data tidak valid.");
    const data=validateAffiliate(entity,body,allowedAffiliateHosts());
    if(entity==="commissions") data.environment=affiliateEnvironment();
    const table=auth.client.from(`affiliate_${entity}`);
    let result;
    if(editing){
      if(!uuidPattern.test(body.id)||typeof body.updated_at!=="string"||!Number.isFinite(Date.parse(body.updated_at))) throw new Error("ID dan versi data wajib valid.");
      let update=table.update(data).eq("id",body.id).eq("updated_at",body.updated_at);
      if(entity==="commissions") update=update.eq("environment",affiliateEnvironment());
      result=await update.select("*").abortSignal(AbortSignal.timeout(8000)).maybeSingle();
    }else result=await table.insert(data).select("*").abortSignal(AbortSignal.timeout(8000)).single();
    if(result.error){
      const code=result.error.code;
      return affiliateJson({error:code==="23505"?"Slug atau referensi provider sudah tercatat. Periksa duplikasi.":code==="23503"?"Program, link, dan campaign harus saling sesuai.":"Data gagal disimpan. Periksa isian, izin, dan koneksi database."},code==="23505"?409:code==="23503"||code==="23514"?400:503);
    }
    if(!result.data) return affiliateJson({error:"Data telah berubah atau tidak ditemukan. Muat ulang sebelum mengedit."},409);
    return affiliateJson({row:result.data},editing?200:201);
  }catch(error){return affiliateJson({error:error instanceof Error?error.message:"Data tidak valid."},400);}
}
export async function POST(request: Request,{params}:{params:Promise<{entity:string}>}) {return write(request,(await params).entity,false);}
export async function PATCH(request: Request,{params}:{params:Promise<{entity:string}>}) {return write(request,(await params).entity,true);}
