import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: process.env.KHADAFI_CONSTRAINED_BUILD === "true"
    ? { cpus: 1, webpackMemoryOptimizations: true }
    : undefined,
  distDir: process.env.NEXT_OUTPUT_DIR || (process.env.NODE_ENV === "development" ? ".next-dev" : ".next"),
  async redirects() { return [{ source: "/freelance/resources", destination: "/freelance/tools", permanent: true }, { source: "/freelance/resources/:slug", destination: "/freelance/tools/:slug", permanent: true }]; },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'mykgtajanxczdnzekycl.supabase.co',
      },
    ],
  },
};

export default nextConfig;
