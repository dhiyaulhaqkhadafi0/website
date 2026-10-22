import app from '../.open-next/worker.js';
import { reconcileScheduled } from './doku-schedule.mjs';
import { emailScheduled } from './email-schedule.mjs';
import { resendWebhook } from './resend-webhook.mjs';
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from '../.open-next/worker.js';
const worker = {
  fetch(request, env, ctx) {
    if (new URL(request.url).pathname === '/api/commerce/email/resend/webhook') {
      return resendWebhook(request, env);
    }
    if (request.method === 'GET' && new URL(request.url).pathname === '/api/visitor-context') {
      const hint = request.cf?.country;
      const country = typeof hint === 'string' && /^[A-Z]{2}$/.test(hint) && hint !== 'XX' ? hint : null;
      return Response.json({ country }, { headers: { 'Cache-Control': 'private, no-store' } });
    }
    return app.fetch(request, env, ctx);
  },
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(reconcileScheduled(env));
    ctx.waitUntil(emailScheduled(env));
  },
};
export default worker;
