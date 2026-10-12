import "server-only";
import { requireBlogAdmin } from "./blog-auth";
import { affiliateJson } from "./affiliate-server";
// Reuse the Studio identity and allowlist, with bounded failure handling.
export async function requireAffiliateAdmin(request: Request): ReturnType<typeof requireBlogAdmin> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      requireBlogAdmin(request),
      new Promise<never>((_resolve,reject)=>{timer=setTimeout(()=>reject(new Error("Auth timeout")),8000);}),
    ]);
  } catch {
    return {ok:false,response:affiliateJson({error:"Sesi admin belum dapat diverifikasi. Silakan coba lagi."},503)};
  } finally { if(timer)clearTimeout(timer); }
}
