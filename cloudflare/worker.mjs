import app from '../.open-next/worker.js';
import { reconcileScheduled } from './doku-schedule.mjs';
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from '../.open-next/worker.js';
const worker = {
  fetch(request, env, ctx) {
    if (request.method === 'GET' && new URL(request.url).pathname === '/api/visitor-context') {
      const hint = request.cf?.country;
      const country = typeof hint === 'string' && /^[A-Z]{2}$/.test(hint) && hint !== 'XX' ? hint : null;
      return Response.json({ country }, { headers: { 'Cache-Control': 'private, no-store' } });
    }
    return app.fetch(request, env, ctx);
  },
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(reconcileScheduled(env));
  },
};
export default worker;
