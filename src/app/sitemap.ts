import { sbs, monetization, chapterHref, pathwayHref } from '@/content/business-hub';
import type { MetadataRoute } from "next";
import { CURATED_TOOLS, SERVICES } from "@/content/shop";
import { getAllPosts } from "@/lib/mdx";
import { LEARNING_RESOURCES } from "@/content/learning-resources";
import {
  PUBLISHED_RESOURCES,
  resourceHref,
} from "@/content/freelance-resources";
import { FREELANCE_PLATFORMS } from "@/content/freelance-directory";
import { isPublicDestination } from "@/lib/public-routes";
import { publishedProducts } from "@/lib/commerce-server";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = "https://khadafidaffa.com";
  const [posts, products] = await Promise.all([getAllPosts(), publishedProducts()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/cookies`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteUrl}/products`, changeFrequency: "weekly", priority: 0.8 },
    ...[
      "/products/original",
      "/products/recommended",
      "/services",
      ...CURATED_TOOLS.map((item) => item.href),
      ...SERVICES.map((item) => item.href),
    ].map((path) => ({
      url: siteUrl + path,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...products.map((product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      ...(product.updated_at && !Number.isNaN(Date.parse(product.updated_at)) ? { lastModified: new Date(product.updated_at) } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${siteUrl}/freelance/jobs`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/`,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/freelance`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/lab`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/komunitas`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/changelog`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/resources`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  function getValidDate(dateStr?: string): Date | undefined {
    if (!dateStr) return undefined;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? undefined : d;
  }

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => {
    const validDate =
      getValidDate(post.metadata.updatedAt) || getValidDate(post.metadata.date);
    return {
      url: `${siteUrl}/blog/${post.metadata.slug}`,
      ...(validDate ? { lastModified: validDate } : {}),
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });

  const resourceRoutes: MetadataRoute.Sitemap = LEARNING_RESOURCES.filter(
    (r) => r.internalPath && r.status === "published",
  ).map((item) => {
    const validDate = getValidDate(item.verifiedAt);
    return {
      url: `${siteUrl}/resources/${item.slug}`,
      ...(validDate ? { lastModified: validDate } : {}),
      changeFrequency: "monthly",
      priority: 0.75,
    };
  });

  // Ensure /studio and draft routes are NEVER included
  const freelanceRoutes: MetadataRoute.Sitemap = [
 ...sbs.chapters.map(c=>({url:siteUrl+chapterHref(c.slug),changeFrequency:'monthly' as const,priority:0.75})),
 ...monetization.items.map(i=>({url:siteUrl+pathwayHref(i.slug),changeFrequency:'monthly' as const,priority:0.7})),
    {
      url: `${siteUrl}/freelance/direktori`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/freelance/tools`,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    ...PUBLISHED_RESOURCES.map((r) => ({
      url: siteUrl + resourceHref(r),
      lastModified: new Date(r.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...FREELANCE_PLATFORMS.map((platform) => ({
      url: `${siteUrl}/freelance/direktori/${platform.slug}`,
      lastModified: new Date(platform.lastCheckedAt),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];
  const routes = [
    ...staticRoutes,
    ...blogRoutes,
    ...resourceRoutes,
    ...freelanceRoutes,
  ].filter((route) => isPublicDestination(new URL(route.url).pathname));
  return [...new Map(routes.map(route => [route.url, route])).values()];
}
