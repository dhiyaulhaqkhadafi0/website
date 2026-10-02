export function AffiliateDisclosure({ active }: { active: boolean }) {
  if (!active) return null;
  return <p className="text-sm leading-7">Tautan situs platform di halaman ini berupa affiliate atau referral. Jika kamu mendaftar melalui tautan tersebut, saya mungkin menerima komisi tanpa biaya tambahan untukmu. Hubungan ini tidak menentukan platform mana yang ditampilkan atau urutan kurasinya.</p>;
}
