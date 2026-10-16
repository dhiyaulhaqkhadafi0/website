/* eslint-disable @typescript-eslint/no-require-imports -- End-to-end acceptance checks for the editorial redesign. */
const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict"),
  ts = require("typescript");
const {
  chromium,
} = require("C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const base = process.env.QA_BASE || "http://localhost:3019";
const hosted = base.startsWith("https://");
const out = path.resolve("artifacts/redesign", hosted ? "production" : "local");
fs.mkdirSync(out, { recursive: true });
function load(file) {
  const m = { exports: {} };
  new Function(
    "module",
    "exports",
    ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText,
  )(m, m.exports);
  return m.exports;
}
const { LEARNING_RESOURCES: resources } = load(
  "src/content/learning-resources.ts",
);
const { LEARNING_GUIDES: guides } = load("src/content/learning-content.ts");
const checks = [],
  errors = [],
  metrics = [];
let browser;
function pass(name) {
  checks.push(name);
  console.log("PASS " + name);
}
async function main() {
  assert.equal(resources.length, 20);
  assert.equal(new Set(resources.map((r) => r.slug)).size, 20);
  assert.equal(resources.filter((r) => r.sourceType === "original").length, 10);
  assert.equal(resources.filter((r) => r.externalUrl).length, 10);
  for (const r of resources.filter((r) => r.internalPath)) {
    assert.ok(guides[r.slug]);
    assert.ok(guides[r.slug].sections.length >= 3);
  }
  assert.equal(guides["high-context-prompts-pack"].prompts.length, 24);
  assert.equal(guides["mvp-readiness-checklist"].checklist.length, 32);
  pass(
    "20 published resources, 10 complete originals, 24 prompts and 32 MVP checks",
  );
  browser = await chromium.launch({ headless: true, channel: "chrome" });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
    locale: "id-ID",
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error" && /hydration|uncaught/i.test(m.text()))
      errors.push(m.text());
  });
  await page.addInitScript(() => {
    window.qaVitals = { lcp: 0, cls: 0 };
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.qaVitals.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries())
        if (!e.hadRecentInput) window.qaVitals.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  async function go(route) {
    const response = await page.goto(base + route, {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });
    assert.equal(response.status(), 200, route);
    await page.locator("h1").waitFor();
    await page.waitForFunction(
      () =>
        (!document.querySelector('button[aria-label^="Gunakan tema"]') ||
          typeof document.querySelector('button[aria-label^="Gunakan tema"]')
            ?.onclick === "function") &&
        (!document.querySelector("#workspace") ||
          typeof document.querySelector("#workspace button")?.onclick ===
            "function") &&
        (!document.querySelector("#collection") ||
          typeof document.querySelector("#collection button")?.onclick ===
            "function"),
    );
    return response;
  }
  for (const width of [375, 768, 1100, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "/",
      "/about",
      "/resources",
      "/resources/product-idea-brief",
      "/resources/checklist-persiapan-freelance",
    ]) {
      await go(route);
      assert.equal(await page.locator("h1").count(), 1, route);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        route + " overflow " + width,
      );
      assert.equal(
        new URL(
          await page.locator('link[rel="canonical"]').getAttribute("href"),
        ).href,
        new URL("https://khadafidaffa.com" + route).href,
      );
      const id = (route.slice(1) || "home").replaceAll("/", "-");
      if (width === 375 || width === 1440) {
        await page.screenshot({
          caret: "initial",
          path: path.join(out, id + "-" + width + "-top.png"),
        });
        if (
          route.includes("product-idea") ||
          route.includes("checklist-persiapan")
        )
          await page.screenshot({
            caret: "initial",
            path: path.join(out, id + "-" + width + ".png"),
            fullPage: true,
          });
      }
      metrics.push({
        route,
        width,
        ...(await page.evaluate(() => window.qaVitals)),
      });
    }
  }
  pass(
    "20 responsive layouts: one heading, canonical URL, no overflow at 375/768/1100/1440",
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await go("/resources");
  assert.equal(await page.locator("[data-resource]").count(), 20);
  await page
    .getByRole("searchbox", { name: "Cari materi belajar" })
    .fill("GitHub");
  await page.waitForFunction(
    () => new URLSearchParams(location.search).get("q") === "GitHub",
  );
  assert.equal(await page.locator("[data-resource]").count(), 1);
  assert.match(
    await page.locator("[data-resource]").innerText(),
    /Introduction to GitHub/,
  );
  await page
    .getByRole("button", { name: "Hapus pencarian", exact: true })
    .click();
  await page.waitForFunction(() => !location.search);
  assert.equal(await page.locator("[data-resource]").count(), 20);
  await page
    .locator("button[aria-pressed]")
    .filter({ hasText: /^AI$/ })
    .first()
    .click();
  assert.equal(await page.locator("[data-resource]").count(), 5);
  await page.getByRole("button", { name: "Hapus semua filter" }).click();
  await page
    .getByRole("searchbox", { name: "Cari materi belajar" })
    .fill("tidak-ada-materi-xyz");
  await page
    .getByRole("heading", { name: "Belum menemukan yang cocok?" })
    .waitFor();
  assert.equal(await page.locator("[data-resource]").count(), 0);
  await page.getByRole("button", { name: "Lihat semua materi" }).click();
  assert.equal(await page.locator("[data-resource]").count(), 20);
  await go("/resources?category=product&format=course&level=beginner");
  await page.waitForFunction(
    () => document.querySelectorAll("[data-resource]").length === 2,
  );
  await page
    .getByRole("combobox", { name: "Tingkat kesulitan" })
    .selectOption("intermediate");
  assert.equal(await page.locator("[data-resource]").count(), 1);
  assert.match(await page.locator("[data-resource]").innerText(), /Next.js/);
  pass(
    "Debounced search, clear, categories, combined format/level filters, empty state and shareable URLs",
  );
  for (const r of resources.filter((r) => r.internalPath)) {
    await go(r.internalPath);
    await page.locator("#workspace").waitFor();
    assert.ok(
      (await page.locator("article").first().innerText()).length > 1200,
      r.slug,
    );
    await page.getByRole("link", { name: "Kembali ke library" }).waitFor();
  }
  await go("/resources/high-context-prompts-pack");
  assert.equal(await page.locator("details").count(), 24);
  await page.locator("details").first().locator("summary").click();
  await page.getByRole("button", { name: "Salin prompt" }).first().click();
  assert.match(
    await page.evaluate(() => navigator.clipboard.readText()),
    /Konteks saya/,
  );
  await go("/resources/mvp-readiness-checklist");
  assert.equal(
    await page.locator('#workspace input[type="checkbox"]').count(),
    32,
  );
  pass(
    "All eight original URLs and two new guides render; all 24 prompts are available and copyable",
  );
  await go("/resources/product-idea-brief");
  const template = page.getByRole("textbox", {
    name: /Template Product Idea Brief/,
  });
  await template.fill("CATATAN QA LOKAL — ide produk yang bisa diperiksa.");
  await page
    .getByRole("button", { name: "Salin template", exact: false })
    .click();
  assert.equal(
    await page.evaluate(() => navigator.clipboard.readText()),
    "CATATAN QA LOKAL — ide produk yang bisa diperiksa.",
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(() =>
    document.querySelector("textarea")?.value.includes("CATATAN QA LOKAL"),
  );
  assert.match(await template.inputValue(), /CATATAN QA LOKAL/);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Unduh Markdown" }).click();
  const download = await downloadPromise;
  await download.saveAs(path.join(out, "product-idea-brief.md"));
  assert.match(
    fs.readFileSync(path.join(out, "product-idea-brief.md"), "utf8"),
    /CATATAN QA LOKAL/,
  );
  assert.match(await page.locator("#example").innerText(), /CONTOH FIKTIF/);
  await page.getByRole("button", { name: "Gunakan template awal" }).click();
  assert.match(await template.inputValue(), /Product Idea Brief/);
  await page.emulateMedia({ media: "print" });
  assert.equal(await page.locator("textarea").isVisible(), false);
  assert.equal(
    await page.locator('[class*="printTemplate"]').isVisible(),
    true,
  );
  await page.pdf({
    path: path.join(out, "product-idea-brief.pdf"),
    format: "A4",
    printBackground: false,
  });
  await page.emulateMedia({ media: "screen" });
  await go("/resources/checklist-persiapan-freelance");
  const box = page.locator('#workspace input[type="checkbox"]').first();
  await box.check();
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      document.querySelector('#workspace input[type="checkbox"]')?.checked ===
      true,
  );
  assert.equal(await box.isChecked(), true);
  const checkDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "Unduh Markdown" }).click();
  const checklistFile = await checkDownload;
  await checklistFile.saveAs(path.join(out, "freelance-checklist.md"));
  assert.match(
    fs.readFileSync(path.join(out, "freelance-checklist.md"), "utf8"),
    /- \[x\] Layanan/,
  );
  await page.emulateMedia({ media: "print" });
  assert.equal(await box.isVisible(), true);
  await page.pdf({
    path: path.join(out, "freelance-checklist.pdf"),
    format: "A4",
    printBackground: false,
  });
  await page.emulateMedia({ media: "screen" });
  await page.getByRole("button", { name: "Kosongkan centang" }).click();
  assert.equal(await box.isChecked(), false);
  pass(
    "Editable templates, clipboard, local persistence, Markdown downloads, checklist state and printable PDFs",
  );
  await go("/");
  const orb = page.locator('[class*="orbBody"]').first();
  assert.equal(
    await orb.evaluate((e) => getComputedStyle(e).animationName),
    "none",
  );
  await page.getByRole("button", { name: "Lihat semua sertifikasi" }).click();
  assert.equal(
    (await page
      .locator("dialog button")
      .filter({ hasText: /Product Management Essentials/ })
      .count()) >= 1,
    true,
  );
  await page.getByRole("button", { name: /Buka sertifikasi 1:/ }).click();
  await page.getByRole("link", { name: "Verifikasi di penerbit" }).waitFor();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Gunakan tema terang" }).click();
  await page.getByRole("button", { name: "Gunakan tema gelap" }).waitFor();
  assert.equal(
    await page.locator("[data-theme]").getAttribute("data-theme"),
    "light",
  );
  await go("/about");
  await page.getByRole("button", { name: "Gunakan tema gelap" }).waitFor();
  assert.equal(
    await page.locator("[data-theme]").getAttribute("data-theme"),
    "light",
  );
  await page.getByRole("button", { name: "Gunakan tema gelap" }).click();
  pass(
    "Reduced motion, original credential gallery, issuer links and shared dark/ivory themes",
  );
  const motion = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "no-preference",
  });
  const mp = await motion.newPage();
  await mp.goto(base, { waitUntil: "domcontentloaded" });
  const note = mp.locator('[data-kind="paper"]');
  const words = note.locator('span[aria-hidden="true"]');
  const first = await words.innerText();
  const bounds = await note.boundingBox();
  await mp.waitForTimeout(6300);
  assert.notEqual(await words.innerText(), first);
  const bounds2 = await note.boundingBox();
  assert.equal(Math.round(bounds.height), Math.round(bounds2.height));
  await mp.getByRole("button", { name: "Jeda animasi catatan" }).click();
  const paused = await words.innerText();
  await mp.waitForTimeout(6300);
  assert.equal(await words.innerText(), paused);
  assert.notEqual(
    await mp
      .locator('[class*="orbBody"]')
      .evaluate((e) => getComputedStyle(e).animationName),
    "none",
  );
  await motion.close();
  pass(
    "Six-second note rotation, pause control, stable note layout and active CSS orb",
  );
  const api = await ctx.request.post(base + "/api/freelance/subscribe", {
    headers: { Origin: "https://foreign.example" },
    data: {
      name: "Blocked",
      email: "blocked@example.invalid",
      consent: true,
      source: "homepage",
    },
  });
  assert.equal(api.status(), 403);
  for (const route of ["/account", "/studio/overview"]) {
    const response = await ctx.request.get(base + route, { maxRedirects: 0 });
    assert.ok([302, 303, 307, 308].includes(response.status()), route);
    assert.match(response.headers().location, /login/);
  }
  const privateApi = await ctx.request.get(base + "/api/studio/freelance");
  assert.ok([401, 403].includes(privateApi.status()));
  await go("/freelance");
  await go("/freelance/direktori/micro1");
  await go("/blog");
  const currentArticle = await page
    .locator('a[href^="/blog/"]')
    .first()
    .getAttribute("href");
  assert.ok(currentArticle);
  await go(currentArticle);
  assert.ok((await page.locator("main").first().innerText()).length > 1500);
  await page.setViewportSize({ width: 375, height: 1000 });
  await go("/resources");
  await page
    .getByRole("button", { name: "Buka navigasi", exact: true })
    .click();
  await page
    .getByRole("navigation", { name: "Navigasi Mobile", exact: true })
    .waitFor();
  await page.keyboard.press("Escape");
  await page
    .getByRole("navigation", { name: "Navigasi Mobile", exact: true })
    .waitFor({ state: "hidden" });
  assert.equal(
    await page.evaluate(() =>
      document.activeElement?.getAttribute("aria-label"),
    ),
    "Buka navigasi",
  );
  await page
    .getByRole("button", { name: "Buka navigasi", exact: true })
    .click();
  const mobileNav = page.getByRole("navigation", {
    name: "Navigasi Mobile",
    exact: true,
  });
  await mobileNav.getByRole("button", { name: /^Freelance/ }).click();
  await mobileNav.getByRole("link", { name: /Lowongan Remote/ }).click();
  await page.waitForURL("**/freelance/jobs");
  pass(
    "Current published article body and mobile menu, Escape focus and destination navigation",
  );
  assert.equal(errors.length, 0, errors.join("\n"));
  pass(
    "Freelance, Micro1, blog, newsletter origin rejection and anonymous account/Studio protections",
  );
  fs.rmSync(path.join(out, "failure.json"), { force: true });
  fs.writeFileSync(
    path.join(out, "verification.json"),
    JSON.stringify(
      {
        base,
        checks,
        errors,
        metrics,
        fieldVitals:
          "Not measured; metrics above are browser lab observations, not p75 field data.",
        productionMutations: false,
      },
      null,
      2,
    ),
  );
  console.log(
    checks.length + " acceptance groups passed; zero uncaught browser errors.",
  );
  await browser.close();
}
main().catch(async (e) => {
  console.error(e.stack || e);
  fs.writeFileSync(
    path.join(out, "failure.json"),
    JSON.stringify({ error: e.message, checks, errors }, null, 2),
  );
  if (browser) await browser.close();
  process.exitCode = 1;
});
