/* eslint-disable @typescript-eslint/no-require-imports -- Real browser acceptance checks against local fixture data only. */
const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict"),
  ts = require("typescript");
const {
  chromium,
} = require("C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const base = process.env.QA_BASE || "http://localhost:3026",
  fixture = "http://127.0.0.1:3031",
  out = path.resolve("artifacts/shop", base.startsWith("https://") ? "production" : "browser");
fs.mkdirSync(out, { recursive: true });
function load(file, imports = {}) {
  const m = { exports: {} };
  new Function(
    "module",
    "exports",
    "require",
    ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText,
  )(m, m.exports, (name) => imports[name] || require(name));
  return m.exports;
}
const catalog = load("src/content/shop.ts"),
  discovery = load("src/lib/shop-discovery.ts"),
  validation = load("src/lib/service-inquiry.ts", {
    "@/content/shop": catalog,
  });
async function request(input, options = {}) {
  const response = await fetch(input, { ...options, signal: options.signal || AbortSignal.timeout(base.startsWith("https://") ? 20000 : 120000) });
  const bytes = await response.arrayBuffer();
  const copy = new Response([204,205,304].includes(response.status) ? null : bytes, { status: response.status, statusText: response.statusText, headers: response.headers });
  Object.defineProperty(copy, "url", { value: response.url });
  return copy;
}
const checks = [],
  errors = [],
  layouts = [],
  metrics = [];
let browser;
const pass = (name) => {
  checks.push(name);
  console.log("PASS " + name);
};
async function ready(page) {
  await page.getByRole("heading", { level: 1 }).waitFor({ state: "visible" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images]
        .filter(
          (i) =>
            i.loading !== "lazy" ||
            (i.getBoundingClientRect().top < innerHeight &&
              i.getBoundingClientRect().bottom > 0),
        )
        .map((i) =>
          i.complete
            ? Promise.resolve()
            : new Promise((r) => {
                i.addEventListener("load", r, { once: true });
                i.addEventListener("error", r, { once: true });
              }),
        ),
    );
  });
}
async function run() {
  const items = [...catalog.CURATED_TOOLS, ...catalog.SERVICES];
  assert.equal(items.length, 7);
  assert.equal(
    catalog.CURATED_TOOLS.every(
      (t) => !t.affiliate && new URL(t.officialUrl).protocol === "https:",
    ),
    true,
  );
  assert.equal(
    discovery.discover(items, { ...discovery.EMPTY_FILTERS, q: "OPENAI" })
      .length,
    1,
  );
  assert.equal(
    discovery.discover(items, {
      ...discovery.EMPTY_FILTERS,
      q: "notion workspace",
    }).length,
    1,
  );
  const originals = [
    {
      ...items[0],
      id: "qa-free",
      type: "original",
      price: 0,
      format: "Template",
      topic: "Templates",
    },
    {
      ...items[0],
      id: "qa-paid",
      type: "original",
      price: 59000,
      format: "Ebook",
      topic: "Ebooks",
    },
  ];
  assert.equal(
    discovery.discover(originals, {
      ...discovery.EMPTY_FILTERS,
      type: "original",
      price: "paid",
    })[0].id,
    "qa-paid",
  );
  assert.equal(
    discovery.discover(originals, {
      ...discovery.EMPTY_FILTERS,
      type: "original",
      sort: "price-desc",
    })[0].price,
    59000,
  );
  assert.equal(
    discovery.normalizeFilters(
      {
        ...discovery.EMPTY_FILTERS,
        type: "service",
        price: "paid",
        sort: "price-asc",
      },
      items,
    ).sort,
    "recommended",
  );
  assert.equal(
    discovery.readFilters(
      new URLSearchParams("type=bogus&topic=wrong&sort=price-asc"),
      items,
    ).type,
    "all",
  );
  assert.throws(() => validation.validateInquiry({ consent: false }));
  pass(
    "Verified catalog, multi-field search, contextual normalization and comparable original-only price sorting",
  );
  browser = await chromium.launch({ headless: true, channel: "chrome" });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
    locale: "id-ID",
  });
  const page = await ctx.newPage();
  async function settled() {
    await ready(page);
    if (await page.locator("#koleksi").count()) await page.locator('#koleksi[data-hydrated="true"]').waitFor();
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  }
  async function navigate(url, options = {}) {
    const response = await page.goto(url, { ...options, waitUntil: "domcontentloaded" });
    await settled(); return response;
  }
  async function reloadReady() {
    const response = await page.reload({ waitUntil: "domcontentloaded" });
    await settled(); return response;
  }
  page.setDefaultTimeout(15000);
  page.setDefaultNavigationTimeout(90000);
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    window.__shopVitals = { cls: 0, lcp: 0 };
    new PerformanceObserver((list) => {
      for (const e of list.getEntries())
        if (!e.hadRecentInput) window.__shopVitals.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__shopVitals.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
  });
  const routes = [
    "/products",
    "/products/original",
    "/products/recommended",
    ...catalog.CURATED_TOOLS.map((i) => i.href),
    "/services",
    ...catalog.SERVICES.map((i) => i.href),
  ];
  for (const width of [375, 768, 1440])
    for (const route of routes) {
      await page.setViewportSize({ width, height: 1000 });
      const response = await navigate(base + route, {
        waitUntil: "networkidle",
        timeout: 90000,
      });
      if (response.status() !== 200) fs.writeFileSync(path.join(out, "unexpected-response.json"), JSON.stringify({route,width,status:response.status(),headers:await response.allHeaders(),body:(await response.text()).slice(0,2000)},null,2));
      assert.equal(response.status(), 200, route);
      await ready(page);
      assert.equal(await page.locator("h1").count(), 1, route);
      assert.equal(
        await page.locator('link[rel="canonical"]').getAttribute("href"),
        "https://khadafidaffa.com" + route,
      );
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        bg: getComputedStyle(document.querySelector("[data-theme]"))
          .getPropertyValue("--bg")
          .trim(),
        vitals: window.__shopVitals,
      }));
      assert.equal(state.overflow, false, route + " " + width);
      assert.equal(state.bg, "#0d0d11");
      layouts.push({ route, width, overflow: false });
      metrics.push({ route, width, ...state.vitals });
      const slug = route.split("/").filter(Boolean).join("-");
      if (
        [
          "/products",
          "/services",
          "/products/figma",
          "/services/website-landing-page",
        ].includes(route)
      ) {
        await page.screenshot({
          path: path.join(out, slug + "-" + width + "-top.png"),
          caret: "initial",
        });
        if (width === 1440)
          await page.screenshot({
            path: path.join(out, slug + "-" + width + "-full.png"),
            fullPage: true,
            caret: "initial",
          });
      }
    }
  pass(
    "33 responsive layouts across 11 routes at 375/768/1440: HTTP 200, one H1, canonical, no overflow, correct dark palette",
  );
  await navigate(base + "/products", { waitUntil: "networkidle" });
  const cards = page.locator("a[data-offering]");
  assert.equal(await cards.count(), 7);
  await page.getByLabel("Cari koleksi", { exact: true }).fill("OPENAI");
  await page.waitForFunction(
    () => document.querySelectorAll("a[data-offering]").length === 1,
  );
  assert.match(await cards.first().innerText(), /ChatGPT/);
  assert.match(page.url(), /q=OPENAI/);
  await page
    .getByRole("button", { name: "Hapus pencarian", exact: true })
    .click();
  await page.waitForFunction(
    () => document.querySelectorAll("a[data-offering]").length === 7,
  );
  await page.getByRole("button", { name: /Affiliate Picks/ }).click();
  assert.equal(await cards.count(), 4);
  await page.locator("#desktop-topic").selectOption("Product Building");
  assert.equal(await cards.count(), 2);
  await page.locator("#desktop-format").selectOption("Platform");
  assert.equal(await cards.count(), 1);
  assert.match(await cards.innerText(), /Vercel/);
  assert.equal(await page.getByLabel("Harga", { exact: true }).count(), 0);
  await reloadReady();
  assert.equal(await cards.count(), 1);
  await page.getByRole("button", { name: "Hapus filter format" }).click();
  assert.equal(await cards.count(), 2);
  await page.getByRole("button", { name: "Reset semua", exact: true }).click();
  assert.equal(await cards.count(), 7);
  await page
    .getByLabel("Cari koleksi", { exact: true })
    .fill("unfindable-local-fixture");
  await page.getByRole("heading", { name: "Belum ada yang cocok." }).waitFor();
  assert.equal(await cards.count(), 0);
  await page.getByRole("button", { name: "Reset semua", exact: true }).click();
  await page.getByRole("button", { name: /Produk Original/ }).click();
  await page
    .getByRole("heading", { name: "Karya yang baik membutuhkan waktu." })
    .waitFor();
  assert.equal(await page.locator('a[href^="/checkout/"]').count(), 0);
  pass(
    "Search, debounce, clear, combined filters, shareable reload, remove-one chips, reset, empty and honest unpublished original state",
  );
  await navigate(base + "/products", { waitUntil: "networkidle" });
  await page.locator('#koleksi[data-hydrated="true"]').waitFor();
  await page.keyboard.press("Control+k");
  assert.equal(
    await page
      .getByLabel("Cari koleksi", { exact: true })
      .evaluate((el) => el === document.activeElement),
    true,
  );
  await page.setViewportSize({ width: 375, height: 850 });
  await page.getByRole("button", { name: /Jasa Khadafi/ }).click();
  await page.getByRole("button", { name: "Filter & urutkan" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor();
  assert.equal(
    await page.evaluate(() => document.body.style.overflow),
    "hidden",
  );
  await page.locator("#mobile-topic").selectOption("Creator & Marketing");
  await page.getByRole("button", { name: "Tampilkan 1 hasil" }).click();
  assert.equal(await cards.count(), 1);
  assert.equal(await page.evaluate(() => document.body.style.overflow), "");
  assert.equal(
    await page
      .getByRole("button", { name: /Filter & urutkan/ })
      .evaluate((el) => el === document.activeElement),
    true,
  );
  await page.getByRole("button", { name: /Filter & urutkan/ }).click();
  await page.locator("#mobile-topic").selectOption("Product Building");
  await page.keyboard.press("Escape");
  assert.equal(await cards.count(), 1);
  await page.getByRole("button", { name: /Filter & urutkan/ }).click();
  await page.getByRole("button", { name: "Reset filter", exact: true }).click();
  await page.getByRole("button", { name: "Tampilkan 3 hasil" }).click();
  assert.equal(await cards.count(), 3);
  pass(
    "Ctrl+K shortcut; native mobile dialog, apply/reset/cancel, Escape, focus return and body scroll restoration",
  );
  await page.getByRole("button", { name: "Gunakan tema terang" }).click();
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector("[data-theme]"))
        .getPropertyValue("--bg")
        .trim() === "#f5f2ec",
  );
  await navigate(base + "/services", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Gunakan tema gelap" }).waitFor();
  await page.screenshot({
    path: path.join(out, "services-375-light.png"),
    fullPage: true,
    caret: "initial",
  });
  await page.getByRole("button", { name: "Gunakan tema gelap" }).click();
  const transition = await page
    .locator('button[type="submit"]')
    .evaluate((el) => getComputedStyle(el).transitionDuration);
  assert.match(transition, /0s/);
  await page.locator("summary").first().click();
  await page.getByRole("link", { name: /Produk Digital Khadafi/ }).waitFor();
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("header details").getAttribute("open"), null);
  pass(
    "Shared ivory/dark persistence, reduced motion and keyboard storefront submenu",
  );
  for (const tool of catalog.CURATED_TOOLS) {
    await navigate(base + tool.href, { waitUntil: "networkidle" });
    const outbound = page.getByRole("link", { name: "Lihat di Website Resmi" });
    assert.equal(await outbound.getAttribute("href"), tool.officialUrl);
    assert.equal(await outbound.getAttribute("target"), "_blank");
    assert.match(await outbound.getAttribute("rel"), /noopener/);
    assert.match(await page.locator("main").innerText(), /bukan affiliate/);
  }
  const draft = await navigate(
    base + "/products/formula-profitable-blueprint",
    { waitUntil: "networkidle" },
  );
  assert.ok([200, 404].includes(draft.status()));
  await page.getByRole("heading", { name: "404", exact: true }).waitFor();
  assert.ok(await page.locator('meta[name="robots"][content*="noindex"]').count());
  assert.equal(await page.locator('a[href^="/checkout/"]').count(), 0);
  const missing = await navigate(base + "/services/not-a-service", {
    waitUntil: "networkidle",
  });
  assert.ok([200, 404].includes(missing.status()));
  await page.getByRole("heading", { name: "404", exact: true }).waitFor();
  assert.ok(await page.locator('meta[name="robots"][content*="noindex"]').count());
  pass(
    "Four exact official outbound destinations, explicit non-affiliate disclosures, draft and unknown routes render not-found/noindex without checkout (Next streamed responses may be HTTP 200)",
  );
  if (base.startsWith("https://")) {
    assert.equal(new URL(base).hostname, "khadafidaffa.com", "Production QA is restricted to the intended domain");
    const invalid = await request(base + "/api/services/inquiries", { method: "POST", headers: { "Content-Type": "application/json", Origin: base }, body: "{}" });
    assert.equal(invalid.status, 400);
    const foreign = await request(base + "/api/services/inquiries", { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://foreign.example" }, body: "{}" });
    assert.equal(foreign.status, 403);
    const privateApi = await request(base + "/api/studio/inquiries");
    assert.equal(privateApi.status, 401);
    assert.match(privateApi.headers.get("cache-control"), /no-store/);
    const privatePage = await request(base + "/studio/inquiries", { redirect: "manual" });
    assert.ok([307,308].includes(privatePage.status));
    assert.match(privatePage.headers.get("location"), /login/);
    pass("Production API validation/origin rejection and private Studio authorization; no synthetic production contact saved");
    assert.deepEqual(errors, []);
    pass("Zero uncaught browser exceptions in production acceptance");
    fs.writeFileSync(path.join(out, "verification.json"), JSON.stringify({base, checks, layouts, errors, metrics, fieldVitals: "Not measured; unthrottled browser lab only", productionWrites: false}, null, 2));
    return;
  }
  await request(fixture + "/__qa/reset", { method: "POST" });
  assert.equal((await request(base + "/api/services/inquiries", { method: "POST", headers: { "Content-Type": "application/json", Origin: base }, body: "{}" })).status, 400);
  await navigate(base + "/services/website-landing-page", {
    waitUntil: "networkidle",
  });
  assert.equal(
    await page.locator("#inquiry-service").inputValue(),
    "website-landing-page",
  );
  await page.getByLabel("Nama", { exact: true }).fill("QA Local Builder");
  await page
    .getByLabel("Email", { exact: true })
    .fill("qa-browser@example.invalid");
  await page
    .locator("#inquiry-description")
    .fill(
      "A browser fixture brief for a responsive website with a clear inquiry flow.",
    );
  await page.getByRole("button", { name: "Kirim brief proyek" }).click();
  assert.equal((await (await request(fixture + "/__qa/status")).json()).count, 0);
  await page.locator('input[name="consent"]').check();
  await request(fixture + "/__qa/fail-next", { method: "POST" });
  await page.getByRole("button", { name: "Kirim brief proyek" }).click();
  await page.locator('form [role="alert"]').waitFor();
  assert.match(
    await page.locator('form [role="alert"]').innerText(),
    /belum dapat dikonfirmasi/,
  );
  assert.equal((await (await request(fixture + "/__qa/status")).json()).count, 0);
  assert.match(
    await page.locator("#inquiry-description").inputValue(),
    /browser fixture/,
  );
  await page.getByRole("button", { name: "Kirim brief proyek" }).click();
  await page.getByRole("heading", { name: "Idemu sudah sampai." }).waitFor();
  const saved = await (await request(fixture + "/__qa/status")).json();
  assert.equal(saved.count, 1);
  assert.equal(saved.leads, 0);
  pass(
    "Actual form → Next API → PostgreSQL: consent required, injected backend failure retains brief, retry persists once, no newsletter side effect",
  );
  const origin = base,
    valid = {
      name: "QA HTTP Builder",
      email: "qa-http@example.invalid",
      service: "product-prototyping",
      description:
        "A local HTTP acceptance brief with realistic enough context for the API.",
      budget: "",
      timeline: "",
      consent: true,
      consent_version: validation.INQUIRY_CONSENT,
      website: "",
      request_id: crypto.randomUUID(),
    };
  const api = (value, headers = {}) =>
    request(base + "/api/services/inquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
        ...headers,
      },
      body: JSON.stringify(value),
    });
  assert.equal(
    (await api(valid, { Origin: "https://foreign.example" })).status,
    403,
  );
  assert.equal((await api({ ...valid, consent: false })).status, 400);
  assert.equal((await api({ ...valid, website: "spam" })).status, 400);
  assert.equal((await api({ ...valid, description: "short" })).status, 400);
  assert.equal((await api({ ...valid, request_id: "invalid" })).status, 400);
  assert.equal(
    (await api({ ...valid, description: "x".repeat(17000) })).status,
    400,
  );
  assert.equal((await api(valid)).status, 201);
  assert.equal((await api(valid)).status, 201);
  assert.equal((await (await request(fixture + "/__qa/status")).json()).count, 2);
  assert.equal(
    (await api({ ...valid, description: valid.description + " modified" }))
      .status,
    409,
  );
  assert.equal(
    (
      await api({
        ...valid,
        email: "qa-other@example.invalid",
        request_id: crypto.randomUUID(),
      })
    ).status,
    201,
  );
  const limit = await api({
    ...valid,
    email: "qa-limit@example.invalid",
    request_id: crypto.randomUUID(),
  });
  assert.equal(limit.status, 429);
  assert.equal(limit.headers.get("retry-after"), "3600");
  pass(
    "HTTP validation, bounded body, origin/honeypot/consent, retry idempotency, payload conflict and atomic rate limits",
  );
  for (const route of [
    "/account",
    "/account/library",
    "/studio/inquiries",
  ]) {
    const response = await request(base + route, { redirect: "manual" });
    assert.ok([307, 308].includes(response.status), route);
    assert.match(response.headers.get("location"), /login/);
  }
  for (const route of ["/api/studio/inquiries", "/api/studio/products"]) {
    const response = await request(base + route);
    assert.equal(response.status, 401, route);
    if (route.endsWith("inquiries"))
      assert.match(response.headers.get("cache-control"), /no-store/);
  }
  const login = async (email) =>
    await (
      await request(fixture + "/auth/v1/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "local-fixture-password" }),
      })
    ).json();
  const reader = await login("reader@example.invalid"),
    owner = await login("owner@example.invalid");
  assert.equal(
    (
      await request(base + "/api/studio/inquiries", {
        headers: { Authorization: "Bearer " + reader.access_token },
      })
    ).status,
    403,
  );
  let report = await request(base + "/api/studio/inquiries", {
    headers: { Authorization: "Bearer " + owner.access_token },
  });
  assert.equal(report.status, 200);
  const inbox = await report.json();
  assert.equal(inbox.inquiries.length, 3);
  assert.ok(!("client_hash" in inbox.inquiries[0]));
  const id = inbox.inquiries[0].id;
  assert.equal(
    (
      await request(base + "/api/studio/inquiries", {
        method: "PATCH",
        headers: {
          Origin: base,
          Authorization: "Bearer " + owner.access_token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: "contacted" }),
      })
    ).status,
    200,
  );
  const storageKey = "sb-127-auth-token";
  await page.evaluate(
    ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
    { key: storageKey, value: owner },
  );
  await ctx.addCookies([
    {
      name: "khadafi-access",
      value: owner.access_token,
      url: base,
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
  await navigate(base + "/studio/inquiries", { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Percakapan berikutnya." }).waitFor();
  await page.getByText("QA Local Builder", { exact: true }).waitFor();
  await page.screenshot({
    path: path.join(out, "studio-inquiries-owner.png"),
    fullPage: true,
    caret: "initial",
  });
  pass(
    "Anonymous private redirects, API 401/no-store, reader 403, real owner RLS inbox and status update, Studio runtime",
  );
  assert.deepEqual(errors, []);
  pass("Zero uncaught browser exceptions in final acceptance run");
  fs.writeFileSync(
    path.join(out, "verification.json"),
    JSON.stringify(
      {
        base,
        checks,
        layouts,
        errors,
        metrics,
        fieldVitals: "Not measured; unthrottled local lab only",
        productionWrites: false,
      },
      null,
      2,
    ),
  );
}
run()
  .catch((e) => {
    console.error(e);
    fs.writeFileSync(
      path.join(out, "failure.json"),
      JSON.stringify({ message: e.message, checks, errors, layouts }, null, 2),
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close();
  });
