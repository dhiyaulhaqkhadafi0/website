/* eslint-disable @typescript-eslint/no-require-imports -- Server behavior regression tests. */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const assert = require("node:assert/strict");
const { webcrypto } = require("node:crypto");
const root = path.resolve(__dirname, "..");
function load(file, mocks = {}) {
  const loaded = { exports: {} };
  const code = ts.transpileModule(
    fs.readFileSync(path.join(root, file), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    },
  ).outputText;
  vm.runInNewContext(
    code,
    {
      module: loaded,
      exports: loaded.exports,
      require: (n) => (Object.hasOwn(mocks, n) ? mocks[n] : require(n)),
      Request,
      Response,
      URL,
      Buffer,
      crypto: webcrypto,
      TextEncoder,
      TextDecoder,
      process: { env: {} },
    },
    { filename: file },
  );
  return loaded.exports;
}
async function main() {
  let checks = 0;
  const check = (n) => {
    checks++;
    console.log("PASS " + n);
  };
  const { hasSameOrigin } = load("src/lib/request-origin.ts");
  assert.equal(
    hasSameOrigin(
      new Request("http://localhost:3014/api/auth/session", {
        headers: { host: "127.0.0.1:3014", origin: "http://127.0.0.1:3014" },
      }),
    ),
    true,
  );
  for (const origin of [
    "https://evil.invalid",
    "http://khadafidaffa.com",
    "null",
    "https://khadafidaffa.com/path",
    "https://khadafidaffa.com.evil.invalid",
  ])
    assert.equal(
      hasSameOrigin(
        new Request("http://localhost/api", {
          headers: { host: "khadafidaffa.com", origin },
        }),
      ),
      false,
    );
  assert.equal(
    hasSameOrigin(
      new Request("http://localhost/api", {
        headers: {
          host: "khadafidaffa.com",
          origin: "https://khadafidaffa.com",
        },
      }),
    ),
    true,
  );
  check(
    "Origin accepts legitimate Next proxy requests and rejects foreign, opaque and insecure origins",
  );
  let user = {
      id: "member",
      email: "owner@example.invalid",
      email_confirmed_at: "2026-10-13",
      user_metadata: { role: "founder" },
    },
    allowed = false,
    roleError = null;
  const auth = load("src/lib/blog-auth.ts", {
    "@/lib/supabase": {
      isSupabaseConfigured: true,
      supabase: {
        auth: { getUser: async () => ({ data: { user }, error: null }) },
      },
      createAuthenticatedSupabaseClient: () => ({
        rpc: async () => ({ data: allowed, error: roleError }),
      }),
    },
  });
  const request = new Request("https://khadafidaffa.com", {
    headers: { Authorization: "Bearer fixture" },
  });
  assert.equal((await auth.requireBlogAdmin(request)).response.status, 403);
  check(
    "client founder metadata and matching email cannot grant founder access",
  );
  allowed = true;
  user = { ...user, email_confirmed_at: null };
  assert.equal((await auth.requireBlogAdmin(request)).response.status, 403);
  user = { ...user, email_confirmed_at: "2026-10-13", is_anonymous: true };
  assert.equal((await auth.requireBlogAdmin(request)).response.status, 401);
  check("unverified and anonymous identities cannot access founder APIs");
  user = { ...user, is_anonymous: false };
  assert.equal((await auth.requireBlogAdmin(request)).ok, true);
  roleError = { message: "RPC absent" };
  assert.equal((await auth.requireBlogAdmin(request)).response.status, 503);
  check(
    "founder access requires trusted database permission and fails closed if unavailable",
  );
  let result = "inserted",
    failure = null,
    stored = null;
  const response = (data, status = 200, extra = {}) =>
    Response.json(data, {
      status,
      headers: { "Cache-Control": "no-store", ...extra },
    });
  const endpoint = load("src/app/api/freelance/subscribe/route.ts", {
    "@/lib/freelance-leads-server": {
      sameLeadOrigin: hasSameOrigin,
      smallJson: (r) => r.json(),
      clientHash: async () => "a".repeat(64),
      sha256: async () => "b".repeat(64),
      signupSecret: () => "fixture-secret",
      leadJson: response,
      freelanceClient: () => ({
        rpc: async (_n, p) => {
          stored = p;
          return { data: result, error: failure };
        },
      }),
    },
  });
  const post = (data, origin = "https://khadafidaffa.com") =>
    endpoint.POST(
      new Request("https://khadafidaffa.com/api/freelance/subscribe", {
        method: "POST",
        headers: { Origin: origin, "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    );
  const payload = {
    name: "  QA Reader  ",
    email: " QA@EXAMPLE.INVALID ",
    consent: true,
    source: "homepage",
  };
  assert.equal((await post(payload, "https://evil.invalid")).status, 403);
  assert.equal((await post({ ...payload, consent: false })).status, 400);
  assert.equal((await post({ ...payload, email: "invalid" })).status, 400);
  assert.equal((await post({ ...payload, website: "bot" })).status, 400);
  check(
    "newsletter API validates origin, email, consent and honeypot before persistence",
  );
  const inserted = await post(payload);
  const first = await inserted.json();
  assert.equal(inserted.status, 200);
  assert.equal(stored.p_payload.email, "qa@example.invalid");
  assert.equal(stored.p_payload.name, "QA Reader");
  assert.equal(stored.p_payload.source, "homepage");
  assert.match(first.manageUrl, /#[a-f0-9]{64}$/);
  assert.match(first.message, /Terima kasih, QA Reader!/);
  check(
    "server normalizes identity and only confirmed insert returns personalized success and unsubscribe link",
  );
  result = "existing";
  const duplicate = await (await post(payload)).json();
  assert.equal(duplicate.manageUrl, undefined);
  assert.match(duplicate.message, /tidak ditambahkan dua kali/);
  result = "unsubscribed";
  assert.match((await (await post(payload)).json()).message, /tetap nonaktif/);
  check(
    "duplicate and unsubscribed API states never create a false active subscription",
  );
  result = "limited";
  assert.equal((await post(payload)).status, 429);
  failure = { message: "database offline" };
  const failed = await post(payload);
  assert.equal(failed.status, 503);
  assert.equal((await failed.json()).ok, undefined);
  check("rate limiting and database failure never report success");
  console.log(`${checks} homepage server checks passed.`);
  fs.writeFileSync(
    path.join(root, "artifacts/home-ecosystem/server-results.json"),
    JSON.stringify({ checks }, null, 2),
  );
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
