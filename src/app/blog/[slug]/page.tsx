import { getPublishedPostBySlug, getPostSlugs, getRelatedPosts } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BlogPostContent from '@/components/blog/BlogPostContent';
import { addHeadingIds, tiptapHeadingsToMarkdown } from '@/lib/blog-types';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return { title: 'Artikel Tidak Ditemukan' };
  }

  const siteUrl = 'https://khadafidaffa.com';
  const canonicalUrl = `${siteUrl}/blog/${slug}`;
  const rawTitle = post.metadata.seoTitle?.trim() || post.metadata.title;
  const title = rawTitle
    .replace(/\s*\|\s*Digital Grimoire/gi, '')
    .replace(/\s*\|\s*Khadafi/gi, '')
    .trim();
  const description = post.metadata.seoDescription?.trim() || post.metadata.excerpt;
  const coverImage = post.metadata.ogImage || post.metadata.cover_url || post.metadata.image || '/assets/og-image.png';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonicalUrl,
      publishedTime: post.metadata.date,
      modifiedTime: post.metadata.updatedAt || post.metadata.date,
      images: [{ url: coverImage, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [coverImage],
    },
  };
}

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug: slug.replace(/\.mdx$/, '') }));
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(slug, post.metadata.category, 3);
  const siteUrl = 'https://khadafidaffa.com';
  const articleUrl = `${siteUrl}/blog/${slug}`;
  const coverImage = post.metadata.ogImage || post.metadata.cover_url || post.metadata.image;
  const absoluteCoverImage = coverImage
    ? coverImage.startsWith('http')
      ? coverImage
      : `${siteUrl}${coverImage.startsWith('/') ? '' : '/'}${coverImage}`
    : `${siteUrl}/assets/og-image.png`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.metadata.seoTitle || post.metadata.title,
    description: post.metadata.seoDescription || post.metadata.excerpt,
    datePublished: post.metadata.date,
    dateModified: post.metadata.updatedAt || post.metadata.date,
    author: {
      '@type': 'Person',
      name: 'Daffa Dhiyaulhaq Khadafi',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Person',
      name: 'Daffa Dhiyaulhaq Khadafi',
      url: siteUrl,
    },
    url: articleUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    image: [absoluteCoverImage],
  };

  const jsonLdScript = (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );

  if (post.source === 'studio') {
    const tocContent = post.contentJson ? tiptapHeadingsToMarkdown(post.contentJson) : '';
    return (
      <>
        {jsonLdScript}
        <BlogPostContent post={{ ...post, content: tocContent }} slug={slug} relatedPosts={relatedPosts}>
          <div dangerouslySetInnerHTML={{ __html: addHeadingIds(post.contentHtml || '') }} />
        </BlogPostContent>
      </>
    );
  }

  return (
    <>
      {jsonLdScript}
      <BlogPostContent post={post} slug={slug} relatedPosts={relatedPosts}>
        <div dangerouslySetInnerHTML={{ __html: addHeadingIds(post.contentHtml || '') }} />
      </BlogPostContent>
    </>
  );
}
