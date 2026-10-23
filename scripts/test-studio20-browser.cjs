/* eslint-disable @typescript-eslint/no-require-imports -- Loopback-only browser/API fixture. No production credentials. */
const http = require("node:http"),
  fs = require("node:fs"),
  assert = require("node:assert/strict"),
  crypto = require("node:crypto"),
  { spawn, spawnSync } = require("node:child_process");
const { chromium } = require(
  process.env.PLAYWRIGHT_PATH ||
    "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright",
);
const backend = "http://127.0.0.1:3242",
  base = "http://localhost:3243";
const user = {
  id: "00000000-0000-4000-8000-000000000003",
  aud: "authenticated",
  role: "authenticated",
  email: "studio@example.invalid",
  email_confirmed_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {},
  created_at: new Date().toISOString(),
};
const token =
  Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
    "base64url",
  ) +
  "." +
  Buffer.from(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: "authenticated",
      exp: Math.floor(Date.now() / 1000) + 3600,
    }),
  ).toString("base64url") +
  ".loopback-fixture";
const now = new Date().toISOString();
const categories = [
  ["kalkulator", "Kalkulator"],
  ["ai-generators", "AI Generators"],
  ["analyzers", "Analyzers"],
  ["converters", "Converters"],
  ["business-tools", "Business Tools"],
  ["productivity", "Productivity"],
].map(([slug, name], i) => ({
  id: crypto.randomUUID(),
  slug,
  name,
  name_en: name,
  description: "Tools praktis untuk pekerjaan spesifik.",
  description_en: "Practical tools.",
  icon: "grid",
  sort_order: i,
  created_at: now,
  updated_at: now,
}));
const article = {
  id: crypto.randomUUID(),
  author_id: user.id,
  title: "Ruang untuk ide yang lebih jernih",
  slug: "ruang-ide",
  excerpt:
    "Catatan untuk membangun pekerjaan mandiri dengan lebih tenang dan terarah.",
  content_json: {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Pekerjaan yang baik dimulai dari ruang untuk berpikir. Ini adalah naskah khusus pengujian lokal, tidak pernah dikirim ke produksi. ".repeat(
              8,
            ),
          },
        ],
      },
    ],
  },
  content_html: "<p>Ini adalah naskah pengujian lokal.</p>",
  status: "draft",
  category: "Independent Work",
  cover_url: "/images/brand/khadafi-studio-ks.webp",
  cover_slides: [],
  theme: "light",
  accent: "#739265",
  music_uri: "",
  music_mood: "",
  music_enabled: false,
  seo_title: "Ruang untuk ide",
  seo_description:
    "Catatan pengujian lokal yang lengkap dan aman untuk memeriksa alur penerbitan naskah di Studio.",
  og_image: "",
  word_count: 200,
  reading_time: 1,
  published_at: null,
  last_published_at: null,
  created_at: now,
  updated_at: now,
};
const tables = {
  app_categories: categories,
  apps_registry: [],
  app_entitlements: [],
  affiliate_categories: [
    {
      id: crypto.randomUUID(),
      name: "AI & Automation",
      slug: "ai-automation",
      description: "Tools AI",
      created_at: now,
      updated_at: now,
    },
  ],
  affiliate_programs: [],
  affiliate_links: [],
  affiliate_campaigns: [],
  affiliate_commissions: [],
  affiliate_opportunities: [],
  affiliate_placements: [],
  affiliate_experiments: [],
  affiliate_audit_log: [],
  blog_articles: [article],
  published_blog_articles: [],
  commerce_products: [],
};
const stats = () => ({
  active_programs: tables.affiliate_programs.filter(
    (p) => p.status === "active",
  ).length,
  active_links: tables.affiliate_links.filter((p) => p.status === "active")
    .length,
  clicks: 0,
  last_activity: null,
  programs: [],
  links: [],
  campaigns: [],
  sources: [],
  daily: [],
  recent: [],
  commissions: [],
});
let failApps = false,
  failSave = false;
const checks = [];
const pass = (name) => {
  checks.push(name);
  console.log("PASS", name);
};
const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  res.setHeader("Access-Control-Expose-Headers", "Content-Range");
  if (req.method === "OPTIONS") {
    res.end();
    return;
  }
  let raw = "";
  for await (const part of req) raw += part;
  const body = raw ? JSON.parse(raw) : null,
    url = new URL(req.url, backend);
  const send = (value, status = 200) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(value));
  };
  if (url.pathname === "/auth/v1/user")
    return req.headers.authorization === `Bearer ${token}`
      ? send(user)
      : send({ message: "Invalid token" }, 401);
  if (url.pathname === "/auth/v1/logout") return send({});
  if (url.pathname.endsWith("/rpc/studio_access")) return send(true);
  if (url.pathname.endsWith("/rpc/affiliate_stats")) return send(stats());
  if (url.pathname.endsWith("/rpc/affiliate_revenue_breakdown"))
    return send([]);
  if (url.pathname.endsWith("/rpc/affiliate_track"))
    return send({ status: "unavailable" });
  if (url.pathname.endsWith("/rpc/publish_article")) {
    const a = tables.blog_articles.find((a) => a.id === body.article_id);
    Object.assign(a, {
      status: "published",
      published_at: new Date().toISOString(),
      last_published_at: new Date().toISOString(),
    });
    tables.published_blog_articles = [{ ...a }];
    return send({ ok: true, id: a.id, slug: a.slug });
  }
  const name = url.pathname.split("/").pop();
  if (!tables[name])
    return send({ message: "Unknown fixture endpoint " + name }, 404);
  if (failApps && name === "apps_registry")
    return send({ message: "Fixture outage" }, 503);
  if (failSave && name === "blog_articles" && req.method === "PATCH")
    return send({ message: "Fixture autosave failure" }, 503);
  const matches = (row) =>
    [...url.searchParams.entries()].every(([key, v]) => {
      if (["select", "order", "limit", "offset"].includes(key)) return true;
      const [op, ...rest] = v.split("."),
        value = rest.join(".");
      if (op === "eq") return String(row[key]) === value;
      if (op === "in")
        return value.slice(1, -1).split(",").includes(String(row[key]));
      if (op === "ilike")
        return String(row[key] || "")
          .toLowerCase()
          .includes(value.replace(/%/g, "").toLowerCase());
      return true;
    });
  let result;
  if (req.method === "GET") result = tables[name].filter(matches);
  else if (req.method === "POST") {
    if (body.slug && tables[name].some((r) => r.slug === body.slug))
      return send({ code: "23505" }, 409);
    const row = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...body,
    };
    tables[name].push(row);
    result = [row];
  } else if (req.method === "PATCH") {
    result = tables[name].filter(matches);
    for (const row of result)
      Object.assign(row, body, { updated_at: new Date().toISOString() });
  } else return send({});
  const total = result.length;
  const offset = Number(url.searchParams.get("offset") || 0),
    limit = Number(url.searchParams.get("limit") || 1000);
  result = result.slice(offset, offset + limit);
  res.setHeader(
    "Content-Range",
    `0-${Math.max(0, result.length - 1)}/${total}`,
  );
  send(
    req.headers.accept?.includes("application/vnd.pgrst.object+json")
      ? result[0] || null
      : result,
    req.method === "POST" ? 201 : 200,
  );
});
async function main() {
  fs.mkdirSync("artifacts/studio20", { recursive: true });
  await new Promise((resolve) => server.listen(3242, "127.0.0.1", resolve));
  const log = fs.openSync("artifacts/studio20/browser-next.log", "w");
  const child = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "dev", "--webpack", "-p", "3243"],
    {
      windowsHide: true,
      stdio: ["ignore", log, log],
      env: {
        ...process.env,
        NEXT_OUTPUT_DIR: ".next-dev",
        NEXT_PUBLIC_GA_DEBUG: "true",
        NEXT_PUBLIC_GA_MANUAL_EVENTS_READY: "true",
        NEXT_PUBLIC_SUPABASE_URL: backend,
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_loopback_only",
        AFFILIATE_ENVIRONMENT: "preview",
      },
    },
  );
  let browser, debugPage;
  try {
    let ready = false;
    for (let i = 0; i < 180; i++) {
      try {
        const r = await fetch(base + "/api/apps/categories");
        if (r.ok) {
          ready = true;
          break;
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 500));
    }
    assert.ok(ready, "Next loopback server ready");
    // Precompile server routes before the browser's bounded fetch timeout starts.
    for (const route of [
      "/api/studio/apps/registry",
      "/api/studio/affiliates/programs",
      "/api/studio/affiliate-workspace/opportunities",
      "/api/studio/articles",
    ]) {
      const response = await fetch(base + route, {
        headers: { Authorization: `Bearer ${token}` },
      });
      assert.equal(response.status, 200, route);
    }
    browser = await chromium.launch({ channel: "chrome", headless: true });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      locale: "id-ID",
      timezoneId: "Asia/Jakarta",
    });
    await context.addCookies(
      ["khadafi-access", "studio_affiliate_session"].map((name) => ({
        name,
        value: token,
        url: base,
        httpOnly: true,
        sameSite: "Lax",
      })),
    );
    await context.addInitScript(
      ({ token, user }) => {
        localStorage.setItem(
          "sb-127-auth-token",
          JSON.stringify({
            access_token: token,
            refresh_token: "loopback-refresh",
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            expires_in: 3600,
            token_type: "bearer",
            user,
          }),
        );
      },
      { token, user },
    );
    const page = await context.newPage();
    debugPage = page;
    page.setDefaultTimeout(45000);
    const errors = [],
      consoleWarnings = [];
    page.on("pageerror", (e) => errors.push(e.stack || e.message));
    page.on("console", (m) => {
      if (m.type() === "error") {
        consoleWarnings.push(m.text());
        console.log("BROWSER", m.text().slice(0, 500));
        if (consoleWarnings.length === 1)
          console.log("HYDRATION_DIFF", m.text().slice(-2400));
      }
    });
    if (process.argv.includes("--visual-smoke")) {
      for (const width of [390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        const fetched = page.waitForResponse((r) =>
          r.url().endsWith("/api/apps/categories"),
        );
        await page.goto(base + "/apps");
        await fetched;
        const language = page
          .getByRole("button", { name: "Pilih bahasa / Select language" })
          .first();
        await language.click();
        await page.keyboard.press("Escape");
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
        );
        await page.screenshot({
          path: "artifacts/studio20/visual-apps-" + width + ".png",
          fullPage: true,
          caret: "initial",
        });
      }
      assert.deepEqual(errors, []);
      assert.equal(
        consoleWarnings.some((t) => t.includes("hydrated")),
        false,
      );
      fs.writeFileSync(
        "artifacts/studio20/visual-smoke.json",
        JSON.stringify(
          {
            widths: [390, 768, 1024, 1440],
            errors,
            hydrationWarnings: 0,
            scope:
              "Empty catalog, visible language control, no overflow; screenshot caret kept unchanged.",
          },
          null,
          2,
        ),
      );
      pass(
        "responsive catalog and language control, no screenshot-induced hydration warnings",
      );
      return;
    }
    await page.goto(base + "/studio/apps", { timeout: 120000 });
    await page
      .getByRole("button", { name: "Tambah aplikasi", exact: true })
      .waitFor();
    try {
      await page
        .getByRole("heading", { name: "Mulai dari satu masalah yang nyata." })
        .waitFor();
    } catch (e) {
      await page.screenshot({
        path: "artifacts/studio20/failure-initial.png",
        fullPage: true,
        caret: "initial",
      });
      console.log("INITIAL PAGE", await page.locator("body").innerText());
      console.log("ERRORS", errors);
      throw e;
    }
    pass("Apps manager authenticated empty state");
    await page
      .getByRole("button", { name: "Tambah aplikasi", exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    await dialog
      .getByLabel("Nama aplikasi", { exact: true })
      .fill("QA Focus Tool");
    await dialog.getByLabel("Slug unik", { exact: true }).fill("qa-focus");
    await dialog
      .getByLabel("Ringkasan ID", { exact: true })
      .fill("Aplikasi fixture khusus pengujian lokal.");
    await dialog
      .getByLabel("URL / route aplikasi", { exact: true })
      .fill("https://example.com/tool");
    await dialog
      .getByRole("button", { name: "Simpan ke database", exact: true })
      .click();
    await dialog.waitFor({ state: "hidden" });
    await page.getByRole("button", { name: "Edit", exact: true }).waitFor();
    assert.equal(tables.apps_registry[0].status, "draft");
    pass("Apps form persists a draft through protected API");
    await page.goto(base + "/apps");
    await page
      .getByRole("heading", { name: "Koleksi pertama sedang diracik." })
      .waitFor();
    assert.equal(
      await page.getByRole("heading", { name: "QA Focus Tool" }).count(),
      0,
    );
    pass("draft absent from public catalog");
    await page.goto(base + "/studio/apps?area=catalog");
    await page.getByRole("button", { name: "Edit", exact: true }).click();
    await dialog.locator("select[name=status]").selectOption("published");
    await dialog
      .getByRole("button", { name: "Simpan ke database", exact: true })
      .click();
    await dialog.waitFor({ state: "hidden" });
    pass("application publication persisted");
    await page.goto(base + "/apps");
    await page.getByRole("link", { name: "Apps", exact: true }).waitFor();
    await page.getByRole("heading", { name: "QA Focus Tool" }).waitFor();
    await page
      .getByRole("searchbox", { name: "Cari aplikasi" })
      .fill("missing");
    await page
      .getByRole("heading", { name: "Belum ada yang sesuai." })
      .waitFor();
    await page.getByRole("button", { name: "Hapus filter" }).click();
    await page.getByRole("heading", { name: "QA Focus Tool" }).click();
    await page.getByRole("link", { name: /Buka aplikasi eksternal/ }).waitFor();
    assert.equal(
      await page
        .getByRole("link", { name: /Buka aplikasi eksternal/ })
        .getAttribute("href"),
      "https://example.com/tool",
    );
    pass("published catalog, filters, detail and safe external launch");
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(base + "/apps");
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      await page.screenshot({
        path: `artifacts/studio20/apps-${width}.png`,
        fullPage: true,
        caret: "initial",
      });
    }
    pass("public Apps responsive 390/768/1440");
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(base + "/studio/affiliates");
    const affiliate = page.getByRole("navigation", {
      name: "Navigasi Affiliate Manager",
    });
    await affiliate.getByRole("button", { name: /Discovery/ }).click();
    await page
      .getByRole("button", { name: "Tambah catatan", exact: true })
      .click();
    await dialog
      .getByLabel("Nama program", { exact: true })
      .fill("QA Opportunity");
    await dialog.getByLabel("Provider", { exact: true }).fill("QA Provider");
    await dialog
      .getByLabel("Website resmi", { exact: true })
      .fill("https://example.com");
    await dialog
      .getByLabel("URL program affiliate", { exact: true })
      .fill("https://example.com/partners");
    await dialog
      .getByRole("button", { name: "Simpan ke database", exact: true })
      .click();
    await dialog.waitFor({ state: "hidden" });
    await page
      .getByRole("button", { name: "Edit QA Opportunity", exact: true })
      .waitFor();
    assert.equal(tables.affiliate_opportunities[0].status, "researching");
    pass("affiliate discovery saves a real record through server validation");
    await affiliate.getByRole("button", { name: /Analytics/ }).click();
    await page
      .getByRole("heading", { name: "Klik per program", exact: true })
      .waitFor();
    await affiliate.getByRole("button", { name: /Payouts/ }).click();
    await page
      .getByRole("heading", { name: "Rekonsiliasi payout", exact: true })
      .waitFor();
    await affiliate.getByRole("button", { name: /Overview/ }).click();
    await page.screenshot({
      path: "artifacts/studio20/affiliate-desktop.png",
      fullPage: true,
      caret: "initial",
    });
    pass("affiliate sidebar, analytics and payout distinction");
    await page.setViewportSize({ width: 390, height: 900 });
    await page.getByRole("button", { name: "Buka navigasi Studio" }).click();
    const drawer = page.getByRole("dialog");
    await drawer.getByRole("button", { name: /Programs/ }).click();
    await drawer.waitFor({ state: "hidden" });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page.screenshot({
      path: "artifacts/studio20/affiliate-mobile.png",
      fullPage: true,
      caret: "initial",
    });
    pass("affiliate mobile drawer keyboard-compatible native dialog");
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(base + "/studio");
    await page.getByLabel("Judul naskah", { exact: true }).waitFor();
    assert.equal(await page.locator(".studio-left").count(), 0);
    assert.equal(await page.locator(".studio-right").count(), 0);
    const canvas = await page
      .locator(".studio-editor-scroll>div")
      .first()
      .boundingBox();
    assert.ok(canvas.width >= 760 && canvas.width <= 820);
    await page
      .getByLabel("Judul naskah", { exact: true })
      .fill("Ruang menulis yang tenang");
    await page.getByRole("status").filter({ hasText: "Tersimpan" }).waitFor();
    assert.equal(tables.blog_articles[0].title, "Ruang menulis yang tenang");
    await page.screenshot({
      path: "artifacts/studio20/editor-desktop.png",
      fullPage: true,
      caret: "initial",
    });
    pass("editor 800px paper canvas and autosave persistence");
    await page
      .getByRole("button", { name: "Pengaturan artikel", exact: true })
      .click();
    await page.locator(".studio-right").waitFor();
    await page
      .getByRole("button", { name: "Pengaturan artikel", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Daftar naskah", exact: true })
      .click();
    await page.locator(".studio-left").waitFor();
    await page
      .getByRole("button", { name: "Daftar naskah", exact: true })
      .click();
    await page.getByRole("button", { name: "Mode Fokus", exact: true }).click();
    assert.ok(
      (await page.locator(".studio-shell").getAttribute("class")).includes(
        "focus",
      ),
    );
    await page.getByRole("button", { name: "Mode Fokus", exact: true }).click();
    pass("editor inspectors, library and focus mode preserve canvas");
    await page
      .getByRole("button", { name: "Pratinjau naskah", exact: true })
      .click();
    await page.locator(".studio-preview-modal").waitFor();
    await page.keyboard.press("Escape");
    await page.locator(".studio-preview-modal").waitFor({ state: "hidden" });
    pass("article preview and Escape close");
    await page
      .getByRole("button", { name: "Publikasikan", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Publikasikan Sekarang", exact: true })
      .click();
    await page.waitForFunction(() =>
      document
        .querySelector(".studio-doc-header")
        ?.textContent.includes("Published"),
    );
    assert.equal(
      tables.published_blog_articles[0].title,
      "Ruang menulis yang tenang",
    );
    pass("article publication through existing server RPC");
    await page.setViewportSize({ width: 390, height: 900 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page.screenshot({
      path: "artifacts/studio20/editor-mobile.png",
      fullPage: true,
      caret: "initial",
    });
    pass("editor responsive 390px");
    const anon = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
    });
    let gaLoads = 0;
    await anon.route("https://www.googletagmanager.com/**", (route) => {
      gaLoads++;
      return route.fulfill({
        contentType: "application/javascript",
        body: "window.gaFixtureLoaded=true;",
      });
    });
    const publicPage = await anon.newPage();
    await publicPage.goto(
      base + "/apps?email=private@example.invalid#access-token",
    );
    await publicPage
      .getByRole("button", { name: "Tanpa analytics", exact: true })
      .waitFor();
    assert.equal(gaLoads, 0);
    await publicPage
      .getByRole("button", { name: "Tanpa analytics", exact: true })
      .click();
    await publicPage.reload();
    assert.equal(gaLoads, 0);
    pass("no analytics script before consent or after denial");
    await publicPage.goto(base + "/cookies");
    await publicPage
      .getByRole("button", { name: "Izinkan analytics", exact: true })
      .click();
    await publicPage.waitForFunction(() => window.khadafiGaReady === true);
    assert.equal(gaLoads, 1);
    let events = await publicPage.evaluate(() => window.dataLayer);
    assert.equal(
      events.filter((e) => e[0] === "event" && e[1] === "page_view").length,
      1,
    );
    assert.ok(!JSON.stringify(events).includes("private@example.invalid"));
    await publicPage
      .getByRole("button", { name: "Nonaktifkan analytics", exact: true })
      .click();
    await publicPage.waitForFunction(
      () => localStorage.getItem("khadafi-analytics-consent") === "denied",
    );
    assert.equal(
      await publicPage.evaluate(() => window.khadafiGaReady === true),
      false,
    );
    pass("analytics opt-in, sanitized single pageview and withdrawal");
    await publicPage.goto(base + "/apps");
    const lang = publicPage
      .getByRole("button", { name: "Pilih bahasa / Select language" })
      .first();
    assert.ok((await lang.innerText()).includes("ID / EN"));
    await lang.click();
    await publicPage
      .getByRole("button", { name: "English", exact: true })
      .click();
    await publicPage
      .getByRole("button", { name: "Aktifkan & terjemahkan", exact: true })
      .waitFor();
    assert.equal(
      await publicPage.evaluate(() =>
        localStorage.getItem("khadafi-analytics-consent"),
      ),
      "denied",
    );
    pass("visible ID / EN keeps translation consent independent");
    const anonymousApi = await anon.request.get(
      base + "/api/studio/apps/registry",
    );
    assert.equal(anonymousApi.status(), 401);
    const foreign = await context.request.post(
      base + "/api/studio/apps/registry",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Origin: "https://evil.example",
        },
        data: {},
      },
    );
    assert.equal(foreign.status(), 403);
    pass("private APIs reject anonymous and foreign-origin mutations");
    failApps = true;
    await page.goto(base + "/studio/apps");
    await page
      .getByRole("alert")
      .filter({ hasText: "Database Apps belum tersedia" })
      .waitFor();
    failApps = false;
    await page.getByRole("button", { name: "Coba lagi", exact: true }).click();
    await page.getByRole("button", { name: "Edit", exact: true }).waitFor();
    pass("Apps database failure and retry recovery");
    assert.deepEqual(errors, []);
    pass("no browser runtime exceptions");
    fs.writeFileSync(
      "artifacts/studio20/browser-tests.json",
      JSON.stringify(
        {
          checks,
          errors,
          consoleWarnings,
          scope:
            "Isolated loopback Supabase fixture, browser/API integration. PostgreSQL/RLS verified separately. No hosted mutation or GA delivery claim.",
        },
        null,
        2,
      ),
    );
  } catch (e) {
    if (debugPage) {
      await debugPage.screenshot({
        path: "artifacts/studio20/failure.png",
        fullPage: true,
        caret: "initial",
      });
      console.log("FAILED PAGE", await debugPage.locator("body").innerText());
    }
    throw e;
  } finally {
    if (browser) await browser.close();
    server.close();
    if (process.platform === "win32")
      spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
        windowsHide: true,
        stdio: "ignore",
      });
    else child.kill("SIGTERM");
    fs.closeSync(log);
  }
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
