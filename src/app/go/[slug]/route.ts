import { boundedText, isTrackingAutomation, issueNavigationToken, readNavigationToken, resolveAffiliate, trackerQuery } from "@/lib/affiliate-server";
import { slugPattern } from "@/lib/affiliate-validation";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control":"no-store, max-age=0", "X-Robots-Tag":"noindex, nofollow", "Referrer-Policy":"no-referrer", "X-Content-Type-Options":"nosniff" };
const escape = (value: string) => value.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!));
function screen(title: string, content: string, status: number, nonce?: string) {
  return new Response(`<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escape(title)} · Khadafi</title><style>body{background:#f1efe7;color:#30362a;font:16px/1.8 system-ui;margin:0;padding:8vh 24px}main{max-width:520px;margin:auto;border-top:3px solid #9eaf84;padding-top:32px}small{letter-spacing:.12em;color:#788266}h1{font-size:30px;line-height:1.25;letter-spacing:-.04em}p{color:#686f5e}button,a{display:inline-block;min-height:44px;box-sizing:border-box;padding:12px 18px;border:0;border-radius:4px;background:#303b27;color:#fff;font:inherit;cursor:pointer}a{background:transparent;color:#4a6036;padding-left:0}button:focus-visible,a:focus-visible{outline:3px solid #829a62;outline-offset:4px}</style></head><body><main><small>KHADAFI / TAUTAN REFERRAL</small><h1>${escape(title)}</h1>${content}<p><a href="/freelance/direktori/micro1">← Kembali ke panduan Micro1</a></p></main></body></html>`,{status,headers:{...headers,"Referrer-Policy":nonce?"same-origin":"no-referrer","Content-Type":"text/html; charset=utf-8","Content-Security-Policy":`default-src 'none'; style-src 'unsafe-inline'; script-src ${nonce ? `'nonce-${nonce}'` : "'none'"}; form-action 'self' https:; base-uri 'none'; frame-ancestors 'none'`}});
}
function unavailable(status = 503) { return screen("Tautan belum tersedia", "<p>Tautan sedang nonaktif atau belum dapat diperiksa. Kembali ke panduan untuk membaca sumber resmi, atau coba lagi nanti.</p>",status); }
export async function HEAD() { return new Response(null,{status:204,headers}); }
export async function GET(request: Request, {params}: {params:Promise<{slug:string}>}) {
  const {slug}=await params;
  if (slug.length>80 || !slugPattern.test(slug)) return unavailable(404);
  let campaign: string; try { campaign=trackerQuery(new URL(request.url)); } catch { return screen("Parameter tidak valid","<p>Gunakan tautan yang diberikan pemilik situs.</p>",400); }
  try {
    const data=await resolveAffiliate(slug,campaign);
    if(data.status!=="ok") return unavailable(data.status==="campaign_unavailable"?404:410);
    // Crawlers and prefetches never generate click events.
    if(isTrackingAutomation(request)) return new Response(null,{status:302,headers:{...headers,Location:data.destination!}});
    const token=await issueNavigationToken(slug,campaign,request), nonce=crypto.randomUUID();
    return screen("Membuka peluang di platform…",`<p>Kamu akan menuju tautan referral. Pemilik situs mungkin menerima komisi jika syarat provider terpenuhi. Tidak ada jaminan penerimaan atau penghasilan.</p><form method="post" action="/go/${escape(slug)}"><input type="hidden" name="navigation" value="${escape(token)}"><button type="submit">Lanjutkan ke platform</button></form><p>Hanya klik keluar yang dicatat. Tanpa cookie pelacakan atau identitas pengunjung.</p><script nonce="${nonce}">document.querySelector('form').requestSubmit();</script>`,200,nonce);
  } catch { return unavailable(); }
}
export async function POST(request: Request,{params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  try {
    const origin=request.headers.get("origin");
    if(origin!==new URL(request.url).origin || new URL(request.url).search) return screen("Permintaan tidak valid","<p>Buka kembali tautan dari panduan.</p>",403);
    const body=new URLSearchParams(await boundedText(request));
    const token=await readNavigationToken(body.get("navigation") || "");
    if(!token || token.slug!==slug) return screen("Tautan kedaluwarsa","<p>Buka kembali tautan dari panduan untuk melanjutkan.</p>",400);
    const data=await resolveAffiliate(slug,token.campaign,isTrackingAutomation(request)?null:token);
    if(data.status!=="ok") return unavailable(410);
    return new Response(null,{status:303,headers:{...headers,Location:data.destination!}});
  } catch { return unavailable(); }
}
