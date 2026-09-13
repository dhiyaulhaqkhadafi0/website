import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/mdx';
import { RESOURCES_DATA } from '@/content/resources-data';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://khadafidaffa.com';
  const posts = await getAllPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${siteUrl}/lab`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/komunitas`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/changelog`,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/resources`,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${siteUrl}/privacy`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      changeFrequency: 'yearly',
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
      changeFrequency: 'monthly',
      priority: 0.7,
    };
  });

  const resourceRoutes: MetadataRoute.Sitemap = RESOURCES_DATA.map((item) => {
    const validDate = getValidDate(item.updatedAt);
    return {
      url: `${siteUrl}/resources/${item.slug}`,
      ...(validDate ? { lastModified: validDate } : {}),
      changeFrequency: 'monthly',
      priority: 0.75,
    };
  });

  // Ensure /studio and draft routes are NEVER included
  return [...staticRoutes, ...blogRoutes, ...resourceRoutes];
}
