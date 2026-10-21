// HTTPS tunnel backend target: ONLY DOKU POST webhook is forwarded.
// Launch: node scripts/doku-webhook-relay.mjs
// Route a dedicated Cloudflare Tunnel hostname to http://127.0.0.1:8788,
// NOT directly to Next.js :3000 or Supabase :54321/54322.
import { createServer } from "node:http";
const path = "/api/commerce/doku/webhook";
const server = createServer(async (req, res) => {
  if (req.method !== "POST" || req.url !== path) {
    res.writeHead(404, { "Content-Type": "text/plain", "Cache-Control": "no-store" });
    res.end("Not found");
    return;
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 32768) {
      res.writeHead(413);
      res.end();
      return;
    }
    chunks.push(chunk);
  }
  try {
    const body = Buffer.concat(chunks);
    // Forward exactly the headers participating in the DOKU HMAC.
    const headers = {
      "Content-Type": "application/json",
      "Client-Id": String(req.headers["client-id"] || ""),
      "Request-Id": String(req.headers["request-id"] || ""),
      "Request-Timestamp": String(req.headers["request-timestamp"] || ""),
      "Signature": String(req.headers["signature"] || ""),
    };
    const upstream = await fetch("http://127.0.0.1:3000" + path, {
      method: "POST", headers, body, signal: AbortSignal.timeout(10000),
      redirect: "manual",
    });
    const data = await upstream.arrayBuffer();
    if (data.byteLength > 32768) throw new Error("oversized upstream response");
    res.writeHead(upstream.status, {
      "Content-Type": "application/json", "Cache-Control": "no-store",
    });
    res.end(Buffer.from(data));
  } catch {
    res.writeHead(502, { "Content-Type": "application/json", "Cache-Control": "no-store" });
    res.end('{"error":"Local webhook unavailable"}');
  }
});
server.listen(8788, "127.0.0.1", () => {
  console.log("DOKU webhook-only relay listening at 127.0.0.1:8788");
  console.log("All routes except POST /api/commerce/doku/webhook return 404.");
  console.log("Do not forward local Supabase or Next.js ports publicly.");
});
