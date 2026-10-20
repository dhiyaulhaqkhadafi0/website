// Secret stays in the service-binding request, never in URL or logs.
export async function reconcileScheduled(env) {
  if (env.DOKU_RECONCILE_ENABLED !== 'true') return { skipped: true };
  if (!env.DOKU_RECONCILE_TOKEN || env.DOKU_RECONCILE_TOKEN.length < 32 || !env.WORKER_SELF_REFERENCE || !/^https:\/\/[a-z0-9.-]+$/.test(env.DOKU_SITE_ORIGIN || '')) throw new Error('Scheduler configuration unavailable');
  const response = await env.WORKER_SELF_REFERENCE.fetch(new Request(env.DOKU_SITE_ORIGIN + '/api/internal/commerce/doku/reconcile', {
    method: 'POST', headers: { Authorization: 'Bearer ' + env.DOKU_RECONCILE_TOKEN }, signal: AbortSignal.timeout(180000),
  }));
  if (!response.ok) throw new Error('Reconciliation scheduler HTTP ' + response.status);
  return { ok: true };
}
