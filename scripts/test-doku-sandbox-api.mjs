// Standalone DOKU *SANDBOX* API connectivity probe.
// No Supabase, Next.js, tunnel, Docker, or production key is required.
// Sends exactly ONE request to api-sandbox.doku.com, creates NO real payment.
// Run: node scripts/test-doku-sandbox-api.mjs
// Keys are read from environment; never print or commit them.
import { createHash, createHmac, randomUUID } from 'node:crypto';

const ENDPOINT = 'https://api-sandbox.doku.com/checkout/v1/payment';
const TARGET = '/checkout/v1/payment';
const clientId = process.env.DOKU_CLIENT_ID || '';
const secretKey = process.env.DOKU_SECRET_KEY || '';

if (!clientId || !secretKey) {
  console.error('ERROR: DOKU_CLIENT_ID / DOKU_SECRET_KEY Sandbox belum diatur di environment proses ini.');
  process.exitCode = 1;
} else {
  // Diagnostic only: no callbacks, browser return, or webhook are requested here.
  // Those must be tested separately against the local application.
  const invoice = 'KSTEST' + Date.now().toString(36).toUpperCase();
  const amount = 59000;
  const requestBody = JSON.stringify({
    order: { amount, invoice_number: invoice, currency: 'IDR', auto_redirect: false },
    payment: { payment_due_date: 60 },
  });
  const digest = createHash('sha256').update(requestBody, 'utf8').digest('base64');
  const requestId = randomUUID();
  const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const canonical = [
    'Client-Id:' + clientId,
    'Request-Id:' + requestId,
    'Request-Timestamp:' + timestamp,
    'Request-Target:' + TARGET,
    'Digest:' + digest,
  ].join('\n');
  const signature = 'HMACSHA256=' + createHmac('sha256', secretKey).update(canonical).digest('base64');

  try {
    console.log('Probing DOKU Sandbox ONLY — Rp59.000, no real charge...');
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': clientId,
        'Request-Id': requestId,
        'Request-Timestamp': timestamp,
        'Signature': signature,
      },
      body: requestBody,
      signal: AbortSignal.timeout(15000),
    });
    const raw = await response.text();
    if (raw.length > 65536) throw new Error('Body respons terlalu besar');
    let result;
    try { result = JSON.parse(raw); } catch { throw new Error('Respons bukan JSON'); }

    if (!response.ok) {
      // Print only safe status / standard error identifier, NOT raw body or full URL.
      const code = result?.error?.code ?? result?.error_code ?? result?.error?.type;
      const safeCode = typeof code === 'string' && /^[a-z0-9_.-]{1,80}$/i.test(code) ? code : 'not-provided';
      throw new Error('DOKU Sandbox HTTP ' + response.status + ' (code: ' + safeCode + ')');
    }
    const responseOrder = result?.response?.order;
    const paymentUrl = result?.response?.payment?.url;
    if (responseOrder?.invoice_number !== invoice ||
        Number(responseOrder?.amount) !== amount ||
        typeof paymentUrl !== 'string') {
      throw new Error('Invoice, nominal, atau payment URL tidak sesuai');
    }
    const url = new URL(paymentUrl);
    if (url.protocol !== 'https:' || url.hostname !== 'sandbox.doku.com' ||
        url.username || url.password || url.port) {
      // Print ONLY the hostname for diagnosis. Full checkout URL includes a
      // bearer-like payment token and must never be logged or pasted in chat.
      const host = /^[a-z0-9.-]{1,253}$/i.test(url.hostname) ? url.hostname : '(invalid hostname)';
      console.error('DIAGNOSTIC: DOKU returned checkout hostname: ' + host);
      console.error('DIAGNOSTIC: HTTPS=' + (url.protocol === 'https:') +
                    ', default port=' + !url.port);
      throw new Error('Host checkout Sandbox tidak sesuai daftar host yang diizinkan; link diblokir.');
    }
    console.log('PASS: Kredensial Sandbox diterima dan checkout dibuat.');
    console.log('PASS: Invoice dan nominal Rp59.000 sesuai.');
    console.log('PASS: Host pembayaran = ' + url.hostname);
    console.log('Catatan: URL lengkap sengaja tidak dicetak. Belum ada transaksi dibayar / webhook diuji.');
  } catch (err) {
    console.error('FAILED: ' + (err instanceof Error ? err.message : 'Kesalahan tak terduga'));
    console.error('Periksa API key Sandbox dan hak akses produk DOKU Checkout pada akun Sandbox.');
    process.exitCode = 1;
  }
}
