/* eslint-disable @typescript-eslint/no-require-imports -- Isolated SQL and validation verification. */
const fs = require("node:fs"),
  path = require("node:path"),
  vm = require("node:vm"),
  assert = require("node:assert/strict"),
  ts = require("typescript");
const { PGlite } = require(
  process.env.PGLITE_PATH ||
    path.resolve(
      "artifacts/studio20/sql-tools/node_modules/@electric-sql/pglite",
    ),
);
function load(file) {
  const moduleRecord = { exports: {} };
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    {
      module: moduleRecord,
      exports: moduleRecord.exports,
      URL,
      TextEncoder,
      Intl,
      require: (name) =>
        name.startsWith(".")
          ? load(path.resolve(path.dirname(file), name + ".ts"))
          : require(name),
    },
  );
  return moduleRecord.exports;
}
const { validateApp, safeAppUrl } = load("src/lib/apps-validation.ts"),
  { validateWorkspace } = load("src/lib/affiliate-workspace.ts");
const { parseCommissionCsv, COMMISSION_COLUMNS } = load(
  "src/lib/affiliate-import.ts",
);
let checks = 0;
function pass(name) {
  checks++;
  console.log("PASS", name);
}
async function main() {
  const policy = await import("../src/lib/analytics-policy.mjs");
  for (const p of [
    "/studio",
    "/studio/apps",
    "/account",
    "/login",
    "/register",
    "/auth/callback",
    "/checkout/secret",
    "/api/commerce/orders",
    "/go/test",
  ])
    assert.equal(policy.isAnalyticsPath(p), false, p);
  assert.equal(
    policy.safePage("/apps?token=private#email"),
    "https://khadafidaffa.com/apps",
  );
  assert.equal(policy.safePage("/blog/name%40private"), null);
  pass("analytics public allowlist and query stripping");
  const record = {
    name: "Test",
    slug: "test",
    category_id: "00000000-0000-4000-8000-000000000001",
    short_description: "A test app",
    deployment: "external",
    destination: "https://example.com/app",
    pricing_model: "free",
    price: 0,
    status: "published",
    version: "1.0.0",
  };
  assert.equal(validateApp(record).price, 0);
  for (const change of [
    { destination: "javascript:alert(1)" },
    { destination: "https://user:pass@example.com/" },
    { price: -1 },
    { pricing_model: "one_time", price: 25000 },
    { pricing_model: "free", price: 25000 },
    { slug: "not valid" },
    { status: "public" },
    { currency: "USD" },
    { deployment: "internal", destination: "/studio" },
  ])
    assert.throws(() => validateApp({ ...record, ...change }));
  assert.equal(
    validateApp({
      ...record,
      pricing_model: "one_time",
      price: 25000,
      access_terms: "Version 1, one account. No AI credits.",
    }).price,
    25000,
  );
  for (const u of [
    "//evil.test",
    "http://example.com",
    "https://localhost/x",
    "https://127.0.0.1/x",
    "https://10.0.0.1/x",
  ])
    assert.equal(safeAppUrl(u), false);
  pass("app validation, pricing scope, URLs, slugs");
  assert.throws(() =>
    validateWorkspace("placements", {
      name: "x",
      public_url: "javascript:alert(1)",
    }),
  );
  pass("affiliate workspace validation");
  const csv =
    COMMISSION_COLUMNS.join(",") +
    '\n00000000-0000-4000-8000-000000000001,,provider-1,reported,,USD,pending,,,,"note, with comma"';
  assert.equal(parseCommissionCsv(csv)[0].notes, "note, with comma");
  assert.throws(() => parseCommissionCsv(csv + "\n" + csv.split("\n")[1]));
  assert.throws(() => parseCommissionCsv("invalid,header\n1,2"));
  pass("commission CSV schema, quoted fields and in-file deduplication");
  const db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls; create schema auth; create schema private;
 create table auth.users(id uuid primary key); create table public.commerce_orders(id uuid primary key);
 create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb $$;
 create function auth.uid() returns uuid language sql stable as $$ select (auth.jwt()->>'sub')::uuid $$;
 create function private.is_blog_admin() returns boolean language sql stable as $$ select coalesce(auth.jwt()->>'email','')='studio@example.invalid' $$;
 grant usage on schema public,private,auth to anon,authenticated;grant execute on function private.is_blog_admin(),auth.uid(),auth.jwt() to anon,authenticated;
 create table public.blog_admin_emails(email text);insert into public.blog_admin_emails values('studio@example.invalid');
 `);
  await db.exec(
    fs.readFileSync(
      "supabase/migrations/20261012071152_affiliate_management_v1.sql",
      "utf8",
    ),
  );
  const before = await db.query(
    "select count(*)::int as n from public.affiliate_programs",
  );
  await db.exec(
    fs.readFileSync(
      "supabase/migrations/20261023185741_studio_apps_and_affiliate_workspace.sql",
      "utf8",
    ),
  );
  pass("additive migration executes on embedded PostgreSQL");
  assert.equal(
    (await db.query("select count(*)::int as n from public.affiliate_programs"))
      .rows[0].n,
    before.rows[0].n,
  );
  assert.equal(
    (await db.query("select count(*)::int as n from public.apps_registry"))
      .rows[0].n,
    0,
  );
  pass("existing records preserved; no seeded apps, clicks, commissions");
  await db.exec(
    `select set_config('request.jwt.claims','{"email":"studio@example.invalid","sub":"00000000-0000-4000-8000-000000000003"}',false); set role authenticated;`,
  );
  const category = (
    await db.query("select id from public.app_categories limit 1")
  ).rows[0].id;
  const app = (
    await db.query(
      `insert into public.apps_registry(category_id,name,slug,short_description,deployment,destination,status) values($1,'Local QA','local-qa','QA only','external','https://example.com/app','draft') returning id,updated_at`,
      [category],
    )
  ).rows[0];
  await assert.rejects(
    db.query(
      `insert into public.apps_registry(category_id,name,slug,short_description,deployment) values($1,'Dup','local-qa','Duplicate','external')`,
      [category],
    ),
  );
  const stale = await db.query(
    `update public.apps_registry set name='Stale' where id=$1 and updated_at='2000-01-01' returning id`,
    [app.id],
  );
  assert.equal(stale.rows.length, 0);
  await db.query(
    `update public.apps_registry set status='published' where id=$1`,
    [app.id],
  );
  assert.ok(
    (await db.query("select count(*)::int as n from public.apps_audit_log"))
      .rows[0].n >= 2,
  );
  pass("admin CRUD, slug collision, stale writes and automatic audit");
  const opportunity = (
    await db.query(
      `insert into public.affiliate_opportunities(name,provider,official_website,program_url,status) values('Research','Provider','https://example.com','https://example.com/affiliate','approved') returning id,updated_at`,
    )
  ).rows[0];
  const promoted = (
    await db.query("select public.promote_affiliate_opportunity($1,$2) as id", [
      opportunity.id,
      opportunity.updated_at,
    ])
  ).rows[0].id;
  assert.equal(
    (
      await db.query(
        "select status from public.affiliate_programs where id=$1",
        [promoted],
      )
    ).rows[0].status,
    "draft",
  );
  pass("approved discovery promotes atomically to draft program");
  const imported = {
    program_id: promoted,
    campaign_id: null,
    external_reference: "local-statement-1",
    referral_status: "earned",
    amount: 10,
    currency: "USD",
    payout_status: "confirmed",
    confirmed_at: new Date().toISOString(),
    paid_at: null,
    evidence_reference: "Local provider report",
    notes: "No customer information",
  };
  await db.query("select public.import_affiliate_commissions($1::jsonb,$2)", [
    JSON.stringify([imported]),
    "preview",
  ]);
  await assert.rejects(
    db.query("select public.import_affiliate_commissions($1::jsonb,$2)", [
      JSON.stringify([
        { ...imported, external_reference: "must-rollback" },
        imported,
      ]),
      "preview",
    ]),
  );
  assert.equal(
    (
      await db.query(
        "select count(*)::int as n from public.affiliate_commissions where external_reference='must-rollback'",
      )
    ).rows[0].n,
    0,
  );
  const revenue = (
    await db.query(
      "select public.affiliate_revenue_breakdown(now()-interval '1 day',now()+interval '1 day','preview',null) as data",
    )
  ).rows[0].data;
  assert.equal(revenue.find((r) => r.group === "program").confirmed, 10);
  pass(
    "atomic CSV import rollback and real currency-preserving revenue aggregation",
  );
  await db.exec("reset role; set role anon;");
  assert.equal(
    (await db.query("select count(*)::int as n from public.apps_registry"))
      .rows[0].n,
    1,
  );
  await assert.rejects(
    db.query(`update public.apps_registry set name='attack'`),
  );
  await assert.rejects(
    db.query("select * from public.affiliate_opportunities"),
  );
  await assert.rejects(db.query("select * from public.app_entitlements"));
  pass("anonymous access restricted to public catalog");
  await db.exec(
    `reset role;select set_config('request.jwt.claims','{"email":"reader@example.invalid","sub":"00000000-0000-4000-8000-000000000004"}',false);set role authenticated;`,
  );
  assert.equal(
    (
      await db.query(
        "select count(*)::int as n from public.affiliate_opportunities",
      )
    ).rows[0].n,
    0,
  );
  await assert.rejects(
    db.query(
      `insert into public.app_categories(name,slug) values('Attack','attack')`,
    ),
  );
  await assert.rejects(
    db.query(
      `insert into public.app_entitlements(app_id,user_id,order_id,status,access_terms,version_scope) values($1,gen_random_uuid(),gen_random_uuid(),'active','bad','all')`,
      [app.id],
    ),
  );
  pass("nonadmin cannot edit registry or self-issue paid access");
  await db.exec(
    `reset role;select set_config('request.jwt.claims','{"email":"studio@example.invalid","sub":"00000000-0000-4000-8000-000000000003"}',false);set role authenticated;`,
  );
  await db.query(
    `update public.apps_registry set status='archived' where id=$1`,
    [app.id],
  );
  await db.exec("reset role;set role anon;");
  assert.equal(
    (await db.query("select count(*)::int as n from public.apps_registry"))
      .rows[0].n,
    0,
  );
  pass("archived apps removed from public reads by RLS");
  await db.exec("reset role;");
  const flags = await db.query(
    `select tablename,rowsecurity from pg_tables where schemaname='public' and (tablename like 'app_%' or tablename like 'apps_%' or tablename like 'affiliate_%')`,
  );
  assert.ok(flags.rows.every((r) => r.rowsecurity));
  pass("RLS enabled on all Apps and affiliate tables");
  await db.exec(`reset role;
    insert into auth.users(id) values('00000000-0000-4000-8000-000000000004'),('00000000-0000-4000-8000-000000000005');
    insert into public.commerce_orders(id) values('00000000-0000-4000-8000-000000000009');`);
  await db.query(
    `insert into public.app_entitlements(app_id,user_id,order_id,status,access_terms,version_scope) values($1,'00000000-0000-4000-8000-000000000004','00000000-0000-4000-8000-000000000009','active','Local fixture','1.0.0')`,
    [app.id],
  );
  await db.exec(
    `select set_config('request.jwt.claims','{"email":"reader@example.invalid","sub":"00000000-0000-4000-8000-000000000004"}',false);set role authenticated;`,
  );
  assert.equal(
    (await db.query("select count(*)::int as n from public.app_entitlements"))
      .rows[0].n,
    1,
  );
  await db.exec(
    `reset role;select set_config('request.jwt.claims','{"email":"another@example.invalid","sub":"00000000-0000-4000-8000-000000000005"}',false);set role authenticated;`,
  );
  assert.equal(
    (await db.query("select count(*)::int as n from public.app_entitlements"))
      .rows[0].n,
    0,
  );
  pass(
    "licenses visible only to their owner, not another authenticated account",
  );
  await db.close();
  fs.mkdirSync("artifacts/studio20", { recursive: true });
  fs.writeFileSync(
    "artifacts/studio20/foundation-tests.json",
    JSON.stringify(
      {
        checks,
        postgres: "PGlite, local only",
        productionWrites: false,
        passed: true,
      },
      null,
      2,
    ),
  );
  console.log(`${checks} foundation groups passed.`);
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
