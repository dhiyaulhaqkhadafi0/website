/* eslint-disable @typescript-eslint/no-require-imports -- Isolated PostgreSQL checks; never touches hosted data. */
const { createDatabase, asRole } = require("./check-home-database.cjs");
const fs = require("node:fs"),
  assert = require("node:assert/strict"),
  crypto = require("node:crypto");
const migration =
  "supabase/migrations/20261016134325_studio_shop_service_inquiries.sql";
const owner = "11111111-1111-4111-8111-111111111111",
  reader = "22222222-2222-4222-8222-222222222222",
  unverified = "77777777-7777-4777-8777-777777777777";
const hash = (value) => crypto.createHash("sha256").update(value).digest("hex");
const payload = {
  name: " QA Builder ",
  email: "QA@Example.invalid",
  service: "website-landing-page",
  description:
    "A local fixture project brief with enough detail to validate persistence.",
  budget: "",
  timeline: "",
  consent: true,
  consent_version: "studio-shop-inquiry-v1",
};
async function createShopDatabase() {
  const db = await createDatabase();
  await db.exec(fs.readFileSync(migration, "utf8"));
  return db;
}
async function submit(
  db,
  value = payload,
  id = crypto.randomUUID(),
  client = hash("fixture-client"),
) {
  return (
    await asRole(
      db,
      "service_role",
      null,
      "select public.submit_service_inquiry($1,$2::jsonb,$3,$4) result",
      [id, JSON.stringify(value), client, hash(JSON.stringify(value))],
    )
  ).rows[0].result;
}
async function run() {
  const db = await createShopDatabase(),
    checks = [];
  const pass = (name) => {
    checks.push(name);
    console.log("PASS " + name);
  };
  try {
    const request = crypto.randomUUID();
    assert.equal((await submit(db, payload, request)).status, "accepted");
    const saved = (await db.query("select * from service_inquiries")).rows[0];
    assert.equal(saved.name, "QA Builder");
    assert.equal(saved.email, "qa@example.invalid");
    assert.equal(saved.status, "new");
    assert.equal(saved.consent_version, "studio-shop-inquiry-v1");
    pass("Real SQL persistence, normalization, consent version and status");
    assert.equal((await submit(db, payload, request)).status, "accepted");
    assert.equal(
      (await db.query("select count(*)::int count from service_inquiries"))
        .rows[0].count,
      1,
    );
    assert.equal(
      (
        await submit(
          db,
          { ...payload, description: payload.description + " edited" },
          request,
        )
      ).status,
      "conflict",
    );
    pass(
      "Idempotent retry without duplicate and conflicting payload rejection",
    );
    await assert.rejects(() => submit(db, { ...payload, consent: false }));
    await assert.rejects(() =>
      submit(db, { ...payload, service: "fictional-service" }),
    );
    await assert.rejects(() =>
      submit(db, { ...payload, description: "short" }),
    );
    pass(
      "Database independently rejects absent consent, unknown service and short brief",
    );
    for (const [role, id] of [
      ["anon", null],
      ["authenticated", reader],
      ["authenticated", owner],
    ])
      await assert.rejects(() =>
        asRole(
          db,
          role,
          id,
          "select submit_service_inquiry($1,$2::jsonb,$3,$4)",
          [
            crypto.randomUUID(),
            JSON.stringify(payload),
            hash("client"),
            hash("data"),
          ],
        ),
      );
    pass(
      "Submission RPC executable only by service role, including denial for owner browser",
    );
    await assert.rejects(() =>
      asRole(db, "anon", null, "select * from service_inquiries"),
    );
    assert.equal(
      (
        await asRole(
          db,
          "authenticated",
          reader,
          "select * from service_inquiries",
        )
      ).rows.length,
      0,
    );
    assert.equal(
      (
        await asRole(
          db,
          "authenticated",
          unverified,
          "select * from service_inquiries",
        )
      ).rows.length,
      0,
    );
    assert.equal(
      (
        await asRole(
          db,
          "authenticated",
          owner,
          "select * from service_inquiries",
        )
      ).rows.length,
      1,
    );
    pass(
      "Anonymous denied; reader and unverified owner cannot read; verified owner can read",
    );
    assert.equal(
      (
        await asRole(
          db,
          "authenticated",
          reader,
          "update service_inquiries set status='closed' returning id",
        )
      ).rows.length,
      0,
    );
    await asRole(
      db,
      "authenticated",
      owner,
      "update service_inquiries set status='contacted'",
    );
    await assert.rejects(() =>
      asRole(
        db,
        "authenticated",
        owner,
        "update service_inquiries set email='changed@example.invalid'",
      ),
    );
    await assert.rejects(() =>
      asRole(db, "authenticated", owner, "delete from service_inquiries"),
    );
    pass(
      "Owner status-only updates; unauthorized updates, private identity edits and deletes denied",
    );
    await submit(db);
    await submit(db);
    assert.equal((await submit(db)).status, "limited");
    assert.equal(
      (await submit(db, payload, crypto.randomUUID(), hash("different-ip")))
        .status,
      "limited",
    );
    pass("Atomic per-client and per-email hourly submission limits");
    const schema = (
      await db.query(
        "select relrowsecurity from pg_class where oid='service_inquiries'::regclass",
      )
    ).rows[0];
    assert.equal(schema.relrowsecurity, true);
    assert.equal(
      (await db.query("select count(*)::int count from freelance_leads"))
        .rows[0].count,
      0,
    );
    pass("RLS enabled; project consent never creates newsletter subscription");
    fs.mkdirSync("artifacts/shop", { recursive: true });
    fs.writeFileSync(
      "artifacts/shop/database-verification.json",
      JSON.stringify(
        {
          database: "isolated embedded PostgreSQL",
          checks,
          productionWrites: false,
        },
        null,
        2,
      ),
    );
  } finally {
    await db.close();
  }
}
module.exports = { createShopDatabase, asRole, submit };
if (require.main === module)
  run().catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
