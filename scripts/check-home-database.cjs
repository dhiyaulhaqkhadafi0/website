/* eslint-disable @typescript-eslint/no-require-imports -- Isolated embedded PostgreSQL QA. */
const {
  PGlite,
} = require("../artifacts/home-ecosystem/qa-runtime/node_modules/@electric-sql/pglite");
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const root = path.resolve(__dirname, "..");
const owner = "11111111-1111-4111-8111-111111111111";
const member = "22222222-2222-4222-8222-222222222222";
const unverified = "77777777-7777-4777-8777-777777777777";
const hash = (value) => createHash("sha256").update(value).digest("hex");
async function createDatabase() {
  const db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create schema storage;
    grant usage on schema auth, public, storage to anon, authenticated, service_role;
    create table auth.users(id uuid primary key, email text, email_confirmed_at timestamptz, is_anonymous boolean default false);
    create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb $$;
    create function auth.uid() returns uuid language sql stable as $$ select (auth.jwt()->>'sub')::uuid $$;
    create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
    create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text,owner_id text);
    alter table storage.objects enable row level security;
    create function storage.foldername(text) returns text[] language sql as $$select string_to_array($1,'/')$$;
    create function public.rls_auto_enable() returns event_trigger language plpgsql as $$begin end$$;`);
  for (const file of [
    "supabase_blog_studio.sql",
    "supabase_commerce.sql",
    "supabase_freelance.sql",
    "supabase/migrations/20261013053325_homepage_newsletter_and_studio_access.sql",
  ])
    await db.exec(fs.readFileSync(path.join(root, file), "utf8"));
  await db.query(
    "insert into auth.users values ($1,$2,now(),false),($3,$4,now(),false),($5,$6,null,false)",
    [
      owner,
      "owner@example.invalid",
      member,
      "reader@example.invalid",
      unverified,
      "unverified@example.invalid",
    ],
  );
  await db.exec(
    "insert into public.blog_admin_emails(email) values ('owner@example.invalid'),('unverified@example.invalid');",
  );
  await db.query(
    "insert into private.freelance_server_config(secret_hash) values ($1)",
    [hash("local-fixture-secret")],
  );
  return db;
}
async function asRole(db, role, id, sql, args = []) {
  return db.transaction(async (tx) => {
    await tx.query("select set_config('request.jwt.claims',$1,true)", [
      JSON.stringify({ sub: id, role, email: "owner@example.invalid" }),
    ]);
    await tx.exec("set local role " + role);
    return tx.query(sql, args);
  });
}
async function run() {
  const db = await createDatabase();
  let checks = 0;
  const check = (name) => {
    console.log("PASS " + name);
    checks++;
  };
  try {
    const payload = {
      name: " QA Reader ",
      email: " QA@Example.invalid ",
      source: "homepage",
      consent: true,
    };
    // Server normalizes before invoking RPC; SQL independently normalizes stored identity.
    payload.email = payload.email.trim().toLowerCase();
    const subscribe = async (
      p = payload,
      client = hash("client-1"),
      token = hash("unsubscribe-1"),
      secret = "local-fixture-secret",
    ) =>
      (
        await asRole(
          db,
          "anon",
          null,
          "select public.subscribe_freelance($1,$2::jsonb,$3,$4) result",
          [secret, JSON.stringify(p), client, token],
        )
      ).rows[0].result;
    assert.equal(await subscribe(), "inserted");
    const first = (await db.query("select * from freelance_leads")).rows[0];
    assert.equal(first.name, "QA Reader");
    assert.equal(first.email, "qa@example.invalid");
    assert.equal(first.source, "homepage");
    assert.equal(first.consent_version, "khadafi-updates-v1");
    assert.ok(first.consent_at);
    check("newsletter identity, source and consent persist in PostgreSQL");
    assert.equal(
      await subscribe({ ...payload, name: "Replacement" }),
      "existing",
    );
    assert.equal(
      (await db.query("select count(*)::int n from freelance_leads")).rows[0].n,
      1,
    );
    assert.equal(
      (await db.query("select name from freelance_leads")).rows[0].name,
      "QA Reader",
    );
    check("duplicate preserves identity, attribution and consent");
    assert.equal(
      (
        await asRole(
          db,
          "anon",
          null,
          "select public.unsubscribe_freelance($1) result",
          [hash("unsubscribe-1")],
        )
      ).rows[0].result,
      true,
    );
    assert.equal(await subscribe(), "unsubscribed");
    assert.equal(
      (await db.query("select status from freelance_leads")).rows[0].status,
      "unsubscribed",
    );
    check("unsubscribe works and resubmission never reactivates silently");
    await assert.rejects(() =>
      subscribe(
        payload,
        hash("bad-secret-client"),
        hash("new-token"),
        "wrong-secret",
      ),
    );
    await assert.rejects(() =>
      subscribe({ ...payload, consent: false }, hash("no-consent")),
    );
    check("database rejects wrong secret and missing consent");
    for (let i = 0; i < 5; i++)
      await subscribe(
        { ...payload, email: `rate${i}@example.invalid` },
        hash("rate-client"),
        hash("rate-" + i),
      );
    assert.equal(
      await subscribe(
        { ...payload, email: "rate6@example.invalid" },
        hash("rate-client"),
        hash("rate-6"),
      ),
      "limited",
    );
    check("database rate limit rejects sixth attempt");
    await assert.rejects(() =>
      asRole(db, "anon", null, "select * from freelance_leads"),
    );
    assert.equal(
      (
        await asRole(
          db,
          "authenticated",
          member,
          "select * from freelance_leads",
        )
      ).rows.length,
      0,
    );
    check("anonymous and member cannot read subscriber data");
    assert.ok(
      (
        await asRole(
          db,
          "authenticated",
          owner,
          "select * from freelance_leads",
        )
      ).rows.length > 0,
    );
    check("verified allowlisted founder can read subscribers");
    assert.equal(
      (
        await asRole(
          db,
          "authenticated",
          owner,
          "select public.studio_access() allowed",
        )
      ).rows[0].allowed,
      true,
    );
    assert.equal(
      (
        await asRole(
          db,
          "authenticated",
          member,
          "select public.studio_access() allowed",
        )
      ).rows[0].allowed,
      false,
    );
    assert.equal(
      (
        await asRole(
          db,
          "authenticated",
          unverified,
          "select public.studio_access() allowed",
        )
      ).rows[0].allowed,
      false,
    );
    check(
      "forged JWT email and unverified allowlisted identity cannot obtain founder access",
    );
    await db.exec(
      fs.readFileSync(
        path.join(root, "scripts/check-commerce-database.sql"),
        "utf8",
      ),
    );
    check(
      "actual commerce SQL: transactions, ownership RLS, entitlement, refund and private file permissions",
    );
    await db.exec(
      fs.readFileSync(
        path.join(
          root,
          "supabase/migrations/20261013053325_homepage_newsletter_and_studio_access.sql",
        ),
        "utf8",
      ),
    );
    check("incremental migration can be reapplied without data loss");
    fs.writeFileSync(
      path.join(root, "artifacts/home-ecosystem/database-results.json"),
      JSON.stringify(
        { checks, engine: "PGlite PostgreSQL", hosted: false },
        null,
        2,
      ),
    );
    console.log(
      `${checks} embedded PostgreSQL checks passed. Hosted database unchanged.`,
    );
  } finally {
    await db.close();
  }
}
module.exports = { createDatabase, asRole, owner, member, hash };
if (require.main === module)
  run().catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  });
