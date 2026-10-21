import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";

const cloudflareConfig = defineCloudflareConfig({
  // Only wraps entries Next already caches. Dynamic checkout, prices and
  // authenticated responses are never added to a public response cache.
  incrementalCache: withRegionalCache(r2IncrementalCache, {
    mode: "short-lived",
    bypassTagCacheOnCacheHit: false,
  }),
});

export default {
  ...cloudflareConfig,
  // Cloudflare Workers Builds invokes `npm run build`. OpenNext then needs a
  // separate command for compiling Next.js itself, otherwise it recurses.
  buildCommand: "npm run build:next",
};
