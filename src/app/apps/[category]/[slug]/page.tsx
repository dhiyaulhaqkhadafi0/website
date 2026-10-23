import Link from "next/link";
import Image from 'next/image';
import { notFound } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { AppLaunch } from "@/components/apps/AppsCatalog";
import { publicApps } from "@/lib/apps-server";
import { appHref } from "@/lib/apps-types";
import s from "@/components/apps/apps.module.css";
export const dynamic = "force-dynamic";
async function find(params: Promise<{ category: string; slug: string }>) {
  const { category, slug } = await params;
  const data = await publicApps();
  const c = data.categories.find((c) => c.slug === category);
  const app = data.apps.find((a) => a.slug === slug && a.category_id === c?.id);
  return { ...data, category: c, app };
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { app, category } = await find(params);
  if (!app) return {};
  return {
    title: app.seo_title || app.name,
    description: app.seo_description || app.short_description,
    alternates: {
      canonical: `https://khadafidaffa.com/apps/${category!.slug}/${app.slug}`,
    },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { app, category, apps, categories } = await find(params);
  if (!app || !category) notFound();
  const related = apps
    .filter((a) => a.category_id === app.category_id && a.id !== app.id)
    .slice(0, 3);
  return (
    <>
      <Navbar />
      <article className={s.detail}>
        <nav>
          <Link href="/apps">Apps</Link> /{" "}
          <Link href={`/apps/${category.slug}`}>{category.name}</Link>
        </nav>
        <span className={s.eyebrow}>
          {category.name} · V{app.version}
        </span>
        <h1>{app.name}</h1>
        <p>{app.short_description}</p>
        {app.cover_url && (
            <Image unoptimized width={1240} height={775} src={app.cover_url} alt={app.name} className={s.cover} />
        )}
        <div className={s.detailGrid}>
          <div className={s.description}>{app.description}</div>
          <AppLaunch app={app} />
        </div>
        {related.length > 0 && (
          <aside className={s.note}>
            <span>APLIKASI TERKAIT</span>
            <div>
              {related.map((a) => (
                <p key={a.id}>
                  <Link href={appHref(a, categories)}>{a.name} ↗</Link>
                </p>
              ))}
            </div>
          </aside>
        )}
      </article>
    </>
  );
}
