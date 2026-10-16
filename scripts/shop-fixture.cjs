/* eslint-disable @typescript-eslint/no-require-imports -- Loopback Supabase HTTP adapter to an actual isolated PostgreSQL database. */
const { createShopDatabase, asRole } = require("./check-shop-database.cjs");
const http = require("node:http");
const port = 3031,
  appOrigin = "http://localhost:3026";
const users = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    email: "owner@example.invalid",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    email: "reader@example.invalid",
  },
].map((u) => ({
  ...u,
  aud: "authenticated",
  role: "authenticated",
  email_confirmed_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  is_anonymous: false,
  user_metadata: {},
  app_metadata: { provider: "email" },
}));
const tokens = new Map();
function session(user) {
  const token = [
    Buffer.from('{"alg":"HS256","typ":"JWT"}').toString("base64url"),
    Buffer.from(
      JSON.stringify({
        sub: user.id,
        email: user.email,
        role: "authenticated",
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    ).toString("base64url"),
    "LOCAL_FIXTURE_ONLY",
  ].join(".");
  tokens.set(token, user);
  return {
    access_token: token,
    refresh_token: "local-fixture-refresh-" + user.id,
    token_type: "bearer",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    user,
  };
}
async function start() {
  const db = await createShopDatabase();
  let failNext = false;
  http
    .createServer(async (req, res) => {
      const url = new URL(req.url, "http://127.0.0.1:" + port);
      res.setHeader("Access-Control-Allow-Origin", appOrigin);
      res.setHeader(
        "Access-Control-Allow-Headers",
        "authorization,apikey,content-type,x-client-info,x-supabase-api-version,prefer",
      );
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
      res.setHeader("Access-Control-Expose-Headers", "Content-Range");
      const send = (data, status = 200) => {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(status);
        res.end(JSON.stringify(data));
      };
      if (req.method === "OPTIONS") return send({}, 204);
      const chunks = [];
      for await (const c of req) chunks.push(c);
      let body = {};
      try {
        body = JSON.parse(Buffer.concat(chunks).toString() || "{}");
      } catch {}
      const token = String(req.headers.authorization || "").replace(
        /^Bearer /,
        "",
      );
      const user = tokens.get(token);
      const role =
        token === "local-service-role"
          ? "service_role"
          : user
            ? "authenticated"
            : "anon";
      try {
        if (url.pathname === "/__qa/status")
          return send({
            count: (
              await db.query(
                "select count(*)::int count from service_inquiries",
              )
            ).rows[0].count,
            leads: (
              await db.query("select count(*)::int count from freelance_leads")
            ).rows[0].count,
          });
        if (url.pathname === "/__qa/reset" && req.method === "POST") {
          await db.exec("delete from service_inquiries");
          return send({ ok: true });
        }
        if (url.pathname === "/__qa/fail-next" && req.method === "POST") {
          failNext = true;
          return send({ ok: true });
        }
        if (url.pathname === "/auth/v1/token") {
          const found = users.find(
            (u) =>
              u.email === body.email ||
              body.refresh_token === "local-fixture-refresh-" + u.id,
          );
          return found &&
            (body.password === "local-fixture-password" || body.refresh_token)
            ? send(session(found))
            : send({ msg: "Invalid fixture credentials" }, 400);
        }
        if (url.pathname === "/auth/v1/user")
          return user
            ? send(user)
            : send({ msg: "Invalid fixture token" }, 401);
        if (url.pathname === "/auth/v1/logout") return send({});
        if (url.pathname === "/rest/v1/rpc/studio_access")
          return send(
            (await asRole(db, role, user?.id, "select studio_access() allowed"))
              .rows[0].allowed,
          );
        if (url.pathname === "/rest/v1/rpc/submit_service_inquiry") {
          if (failNext) {
            failNext = false;
            return send({ message: "Injected local transient failure" }, 503);
          }
          return send(
            (
              await asRole(
                db,
                role,
                user?.id,
                "select submit_service_inquiry($1,$2::jsonb,$3,$4) result",
                [
                  body.p_request_id,
                  JSON.stringify(body.p_payload),
                  body.p_client_hash,
                  body.p_payload_hash,
                ],
              )
            ).rows[0].result,
          );
        }
        if (url.pathname === "/rest/v1/commerce_products")
          return send(
            req.headers.accept?.includes("vnd.pgrst.object") ? null : [],
          );
        if (url.pathname === "/rest/v1/service_inquiries") {
          if (req.method === "PATCH") {
            const id = url.searchParams.get("id")?.slice(3);
            const result = await asRole(
              db,
              role,
              user?.id,
              "update service_inquiries set status=$1 where id=$2 returning id,status",
              [body.status, id],
            );
            return send(result.rows[0] || null);
          }
          const status = url.searchParams.get("status")?.slice(3);
          const columns =
            "id,name,email,service,description,budget,timeline,status,created_at,consent_version";
          const result = await asRole(
            db,
            role,
            user?.id,
            `select ${columns} from service_inquiries${status ? " where status=$1" : ""} order by created_at desc`,
            status ? [status] : [],
          );
          const offset = Number(url.searchParams.get("offset") || 0),
            limit = Number(url.searchParams.get("limit") || 25);
          res.setHeader(
            "Content-Range",
            `${offset}-${Math.max(offset, result.rows.length - 1)}/${result.rows.length}`,
          );
          return send(result.rows.slice(offset, offset + limit));
        }
        if (url.pathname.startsWith("/rest/v1/")) return send([]);
        return send({ error: "Unknown local fixture route" }, 404);
      } catch (e) {
        return send({ message: e.message, code: "42501" }, 403);
      }
    })
    .listen(port, "127.0.0.1", () => console.log("SHOP FIXTURE READY " + port));
}
start().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
