/* eslint-disable @typescript-eslint/no-require-imports -- Loopback QA only; never part of the application. */
const { createDatabase, asRole } = require("./check-home-database.cjs");
const http = require("node:http");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
async function start() {
  const db = await createDatabase();
  const fakeHttp = {
    ...http,
    createServer(handler) {
      return http.createServer(async (req, res) => {
        const url = new URL(req.url, "http://127.0.0.1:3021");
        const rpc = url.pathname.split("/rest/v1/rpc/")[1];
        const table = url.pathname.split("/rest/v1/")[1];
        if (
          ![
            "subscribe_freelance",
            "unsubscribe_freelance",
            "studio_access",
            "freelance_lead_stats",
          ].includes(rpc) &&
          table !== "freelance_leads"
        )
          return handler(req, res);
        res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:3014");
        res.setHeader(
          "Access-Control-Allow-Headers",
          "authorization,apikey,content-type,x-client-info,x-supabase-api-version",
        );
        if (req.method === "OPTIONS") {
          res.writeHead(204);
          return res.end();
        }
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
        let id = null;
        try {
          if (token.endsWith(".LOCAL_FIXTURE_ONLY"))
            id = JSON.parse(
              Buffer.from(token.split(".")[1], "base64url").toString(),
            ).sub;
        } catch {}
        const role = id ? "authenticated" : "anon";
        const send = (data, status = 200) => {
          res.setHeader("Content-Type", "application/json");
          res.writeHead(status);
          res.end(JSON.stringify(data));
        };
        try {
          if (rpc === "subscribe_freelance")
            return send(
              (
                await asRole(
                  db,
                  role,
                  id,
                  "select public.subscribe_freelance($1,$2::jsonb,$3,$4) result",
                  [
                    body.p_secret,
                    JSON.stringify(body.p_payload),
                    body.p_client_hash,
                    body.p_token_hash,
                  ],
                )
              ).rows[0].result,
            );
          if (rpc === "unsubscribe_freelance")
            return send(
              (
                await asRole(
                  db,
                  role,
                  id,
                  "select public.unsubscribe_freelance($1) result",
                  [body.p_token_hash],
                )
              ).rows[0].result,
            );
          if (rpc === "studio_access")
            return send(
              (
                await asRole(
                  db,
                  role,
                  id,
                  "select public.studio_access() result",
                )
              ).rows[0].result,
            );
          if (rpc === "freelance_lead_stats")
            return send(
              (
                await asRole(
                  db,
                  role,
                  id,
                  "select public.freelance_lead_stats() result",
                )
              ).rows[0].result,
            );
          let sql =
            "select id,name,email,source,status,consent_at,consent_version,created_at,utm_source,utm_campaign from freelance_leads";
          const args = [];
          for (const field of ["source", "status"]) {
            const val = url.searchParams.get(field);
            if (val?.startsWith("eq.")) {
              args.push(val.slice(3));
              sql +=
                (args.length === 1 ? " where " : " and ") +
                field +
                "=$" +
                args.length;
            }
          }
          const rows = (
            await asRole(db, role, id, sql + " order by created_at desc", args)
          ).rows;
          res.setHeader(
            "Content-Range",
            `0-${Math.max(rows.length - 1, 0)}/${rows.length}`,
          );
          return send(rows);
        } catch {
          return send(
            {
              message: "Local fixture database permission or validation error",
            },
            403,
          );
        }
      });
    },
  };
  const filename = path.join(__dirname, "commerce-fixture.cjs");
  vm.runInThisContext(
    `(function(require,__dirname){${fs.readFileSync(filename, "utf8")}\n})`,
    { filename },
  )((name) => (name === "node:http" ? fakeHttp : require(name)), __dirname);
}
start().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
