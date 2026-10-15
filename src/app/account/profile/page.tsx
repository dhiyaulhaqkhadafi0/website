import { pageUser } from "@/lib/commerce-server";
import s from "@/components/commerce/commerce.module.css";
export default async function ProfilePage() {
  const { user } = await pageUser("/account/profile");
  return (
    <section className={s.pageTitle}>
      <span className={s.eyebrow}>AKUN MEMBER</span>
      <h1>Profil saya.</h1>
      <p>Informasi akun yang sedang kamu gunakan.</p>
      <dl
        className={s.empty}
        style={{ display: "grid", gap: 24, marginBlock: 32 }}
      >
        <div>
          <dt>Nama</dt>
          <dd>{String(user.user_metadata?.display_name || "Belum diisi")}</dd>
        </div>
        <div>
          <dt>Alamat email</dt>
          <dd style={{ overflowWrap: "anywhere" }}>{user.email}</dd>
        </div>
        <div>
          <dt>Status email</dt>
          <dd>
            {user.email_confirmed_at ? "Terverifikasi" : "Belum terverifikasi"}
          </dd>
        </div>
      </dl>
      <p>
        Perlu bantuan dengan akunmu?{" "}
        <a href="mailto:daffadhiyaulhaqkhadafi@gmail.com">Hubungi Support ↗</a>
      </p>
    </section>
  );
}
