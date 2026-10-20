import app from '../.open-next/worker.js';
import { reconcileScheduled } from './doku-schedule.mjs';
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from '../.open-next/worker.js';
export default {
  fetch: app.fetch,
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(reconcileScheduled(env));
  },
};
