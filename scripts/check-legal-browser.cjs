/* eslint-disable @typescript-eslint/no-require-imports -- Browser regression for the release. */
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE ||
    "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright",
);
const base = process.env.QA_BASE || "http://127.0.0.1:3014";
const out = path.resolve(__dirname, "../artifacts/legal-release");
fs.mkdirSync(out, { recursive: true });
let browser;
const checks = [];
const errors = [];
async function main() {
  browser = await chromium.launch({ headless: true, channel: "chrome" });
  const context = await browser.newContext({
    locale: "id-ID",
    reducedMotion: "reduce",
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error" && /hydrated|hydration|Uncaught/i.test(m.text()))
      errors.push(m.text());
  });
  let googleRequests = 0;
  page.on("request", (r) => {
    if (/translate\.google|translate\.googleapis/.test(r.url()))
      googleRequests++;
  });
  const check = (name) => {
    checks.push(name);
    console.log("PASS " + name);
  };
  const go = async (route) => {
    const response = await page.goto(base + route, {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });
    assert.equal(response.status(), 200, route);
    await page.locator('h1').waitFor();
    await page.waitForFunction(() => { const button=document.querySelector('button[aria-label="Pilih bahasa / Select language"]');return !button || typeof button.onclick === 'function'; });
  };
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ["/privacy", "/terms", "/cookies", "/changelog"]) {
      await go(route);
      assert.equal(await page.locator("h1").count(), 1);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        route + " width " + width,
      );
      const info = page.getByRole("navigation", { name: "Informasi legal" });
      assert.deepEqual(
        await info
          .locator("a")
          .evaluateAll((nodes) => nodes.map((n) => new URL(n.href).pathname)),
        ["/about", "/privacy", "/terms", "/cookies", "/changelog"],
      );
      assert.equal(
        await page.locator('link[rel="canonical"]').getAttribute("href"),
        "https://khadafidaffa.com" + route,
      );
      await page.screenshot({
        path: path.join(out, route.slice(1) + "-" + width + ".png"),
        fullPage: true,
      });
    }
    check(`${width}px legal pages: headings, links, canonical and no overflow`);
  }
  assert.equal(googleRequests, 0);
  check("no Google Translate request before optional consent");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await go("/cookies");
  await page
    .getByRole("button", { name: "Izinkan terjemahan", exact: true })
    .click();
  await page
    .getByRole("status")
    .filter({ hasText: "Terjemahan opsional diizinkan" })
    .waitFor();
  assert.equal(
    await page.evaluate(() =>
      localStorage.getItem("khadafi-translation-consent"),
    ),
    "granted",
  );
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(googleRequests, 0);
  check("allowing translation alone does not load a third-party script");
  await page
    .getByRole("button", { name: "Nonaktifkan terjemahan", exact: true })
    .click();
  await page
    .getByRole("status")
    .filter({ hasText: "Terjemahan opsional dinonaktifkan" })
    .waitFor();
  assert.equal(
    await page.evaluate(() =>
      localStorage.getItem("khadafi-translation-consent"),
    ),
    "denied",
  );
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(googleRequests, 0);
  check("cookie preference can be revoked and persists after reload");
  await page
    .getByRole("button", { name: "Pilih bahasa / Select language" })
    .first()
    .click();
  await page.getByRole("button", { name: "English", exact: true }).click();
  await page.getByRole("button", { name: "Aktifkan & terjemahkan" }).waitFor();
  assert.equal(googleRequests, 0);
  await page.getByRole("button", { name: "Tetap Bahasa Indonesia" }).click();
  check("language picker explains optional data processing before opt-in");
  await go("/");
  assert.match(await page.locator("h1").innerText(), /Belajar, berkarya/);
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page
    .locator("footer")
    .screenshot({ path: path.join(out, "footer-desktop.png") });
  check("Indonesian homepage and refined footer render");
  await go("/freelance/direktori/micro1");
  await page.getByRole("heading", { level: 1 }).waitFor();
  assert.match(await page.locator("body").innerText(), /micro1/i);
  check("existing Micro1 destination preserved");
  for (const route of [
    "/products",
    "/login",
    "/resources",
    "/freelance/tools",
    "/blog",
  ])
    await go(route);
  check("public account/catalog and learning destinations respond");
  for (const route of ["/account", "/studio/overview", "/studio/affiliates"]) {
    await page.goto(base + route, { waitUntil: "domcontentloaded" });
    await page.waitForURL("**/login?returnTo=**");
  }
  check(
    "private member/founder/affiliate pages reject anonymous access through shared login",
  );
  for (const route of [
    "/api/studio/freelance",
    "/api/studio/affiliates/session",
  ]) {
    const r = route.endsWith("/session")
      ? await context.request.post(base + route, { headers: { Origin: base } })
      : await context.request.get(base + route);
    assert.equal(r.status(), 401, route);
    assert.match(r.headers()["cache-control"], /no-store/);
  }
  check("private subscriber and affiliate APIs reject anonymous access");
  const response = await context.request.post(
    base + "/api/freelance/subscribe",
    { headers: { Origin: "https://evil.invalid" }, data: {} },
  );
  assert.equal(response.status(), 403);
  check("newsletter rejects cross-origin requests before persistence");
  assert.deepEqual(errors, []);
  check("zero uncaught browser errors");
  fs.writeFileSync(
    path.join(out, "browser-results.json"),
    JSON.stringify({ checks, errors, base }, null, 2),
  );
  await browser.close();
  console.log(`${checks.length} release browser groups passed.`);
}
main().catch(async (e) => {
  console.error(e);
  await browser?.close();
  process.exitCode = 1;
});
