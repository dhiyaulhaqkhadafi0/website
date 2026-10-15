/* eslint-disable @typescript-eslint/no-require-imports -- Real browser QA against loopback fixtures. */
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE ||
    "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright",
);
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const base = "http://127.0.0.1:3014";
const out = path.resolve(__dirname, "../artifacts/home-ecosystem");
const checks = [];
const errors = [];
let browserHandle;
async function main() {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  browserHandle = browser;
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    locale: "id-ID",
    timezoneId: "Asia/Jakarta",
    reducedMotion: "reduce",
    extraHTTPHeaders: { "cf-connecting-ip": "loopback-qa-" + Date.now() },
  });
  const page = await context.newPage();
  globalThis.homeQaPage = page;
  page.on("pageerror", (e) => errors.push(e.message));
  const check = (name) => {
    checks.push(name);
    console.log("PASS " + name);
  };
  const go = async (route) => {
    const response = await page.goto(base + route, {
      waitUntil: /^\/(studio|account)/.test(route)
        ? "domcontentloaded"
        : "networkidle",
      timeout: 120000,
    });
    assert.equal(response.status(), 200, route);
  };
  // Google Translate is optional third-party UI, excluded from deterministic local checks.
  await context.route("**/translate.google.com/**", (route) => route.abort());
  await go("/");
  assert.equal(await page.locator("h1").count(), 1);
  assert.match(await page.title(), /Belajar, Berkarya/);
  assert.equal(await page.locator("html").getAttribute("lang"), "id");
  assert.equal(
    await page.getByText("Mulai Proyek", { exact: true }).count(),
    0,
  );
  assert.equal(
    await page
      .locator("header")
      .first()
      .evaluate((e) => getComputedStyle(e).position),
    "relative",
  );
  check("Indonesian home, one H1, metadata, static navbar and revised CTA");
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.locator("#about").scrollIntoViewIfNeeded();
    await page
      .locator("#about img")
      .first()
      .evaluate((img) => img.decode());
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    for (const theme of ["dark", "light"]) {
      await page.evaluate((theme) => {
        localStorage.setItem("khadafi-home-theme", theme);
        window.dispatchEvent(new Event("home-theme-change"));
      }, theme);
      await page.waitForFunction(
        (t) =>
          document.querySelector("[data-theme]")?.getAttribute("data-theme") ===
          t,
        theme,
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        `${width} ${theme} overflow`,
      );
      await page.screenshot({
        path: path.join(out, `home-${width}-${theme}.png`),
        fullPage: true,
      });
      if (width === 1440 || width === 390)
        await page.screenshot({
          path: path.join(out, `hero-${width}-${theme}.png`),
        });
    }
    check(`${width}px: dark/light rendered without overflow`);
  }
  await page.evaluate(() => {
    localStorage.setItem("khadafi-home-theme", "dark");
    window.dispatchEvent(new Event("home-theme-change"));
  });
  const social = page.getByRole("navigation", { name: "Media sosial Khadafi" });
  const links = await social.locator("a").evaluateAll((items) =>
    items.map((a) => ({
      href: a.href,
      label: a.getAttribute("aria-label"),
      rel: a.rel,
      width: a.getBoundingClientRect().width,
      height: a.getBoundingClientRect().height,
    })),
  );
  const expected = [
    "https://www.youtube.com/@khdfii9",
    "https://www.tiktok.com/@khdfii9",
    "https://www.instagram.com/khdfii9",
    "https://www.threads.com/@khdfii9?hl=id",
    "https://www.facebook.com/khdfii9",
    "https://www.linkedin.com/in/khdfii9",
  ];
  assert.deepEqual(
    links.map((l) => l.href),
    expected,
  );
  for (const link of links) {
    assert.ok(
      link.label &&
        link.rel.includes("noopener") &&
        link.width >= 44 &&
        link.height >= 44,
    );
  }
  // Open each actual anchor in a new tab, intercepting the external navigation before platform login/bot checks.
  for (let i = 0; i < expected.length; i++) {
    await context.route(expected[i], (r) =>
      r.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<title>External navigation target</title>",
      }),
    );
    const popupPromise = page.waitForEvent("popup");
    await social.locator("a").nth(i).click();
    const popup = await popupPromise;
    await popup.waitForLoadState();
    assert.equal(popup.url(), expected[i]);
    await popup.close();
    await context.unroute(expected[i]);
  }
  check(
    "all six real social URLs open the correct tab with accessible 44px targets",
  );
  await page
    .locator("footer")
    .screenshot({ path: path.join(out, "footer-desktop.png") });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page
    .getByRole("button", { name: "Buka navigasi", exact: true })
    .click();
  assert.equal(
    await page
      .getByRole("button", { name: "Tutup navigasi", exact: true })
      .getAttribute("aria-expanded"),
    "true",
  );
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Buka navigasi", exact: true })
    .waitFor();
  assert.equal(
    await page.evaluate(() =>
      document.activeElement?.getAttribute("aria-label"),
    ),
    "Buka navigasi",
  );
  await page
    .getByRole("button", { name: "Buka navigasi", exact: true })
    .click();
  await page
    .getByRole("navigation", { name: "Navigasi Mobile", exact: true })
    .getByRole("button", { name: /^Freelance/ })
    .click();
  await page
    .getByRole("navigation", { name: "Navigasi Mobile", exact: true })
    .getByRole("link", { name: /Lowongan Remote/ })
    .click();
  await page.waitForURL("**/freelance/jobs");
  check(
    "mobile navigation opens, Escape restores focus, destination link navigates",
  );
  await go("/");
  await page.locator("#featured-work").scrollIntoViewIfNeeded();
  const back = page.getByRole("button", {
    name: "Kembali ke atas",
    exact: true,
  });
  await back.waitFor();
  await back.click();
  await page.waitForFunction(() => scrollY < 10);
  await page.locator("#newsletter").scrollIntoViewIfNeeded();
  assert.equal(await back.count(), 0);
  await page.locator("footer").scrollIntoViewIfNeeded();
  assert.equal(await back.count(), 0);
  await page
    .locator("footer")
    .screenshot({ path: path.join(out, "footer-mobile.png") });
  check(
    "back-to-top works, respects reduced motion and avoids newsletter/footer",
  );
  await page.getByRole("button", { name: "Lihat semua sertifikasi" }).click();
  await page.getByRole("dialog").waitFor();
  assert.equal(
    await page.getByRole("dialog").locator("button:has(img)").count(),
    22,
  );
  await page.keyboard.press("Escape");
  check(
    "22 preserved credentials remain available in keyboard-dismissible gallery",
  );
  await page.locator("#newsletter").scrollIntoViewIfNeeded();
  const form = page.getByRole("form", { name: "Newsletter Khadafi" });
  const email = `home-${Date.now()}@example.invalid`;
  await form.getByLabel("Nama kamu").fill("QA Khadafi");
  await form.getByLabel("Alamat email").fill(email);
  await form.getByRole("checkbox").check();
  await page.route("**/api/freelance/subscribe", (r) =>
    r.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        error: "Penyimpanan tidak tersedia. Silakan coba lagi.",
      }),
    }),
  );
  await form.getByRole("button", { name: "Gabung Gratis" }).click();
  await form.getByRole("alert").waitFor();
  assert.equal(
    await page.getByText("Terima kasih, QA Khadafi!", { exact: false }).count(),
    0,
  );
  check("database failure shows retry and never a false success");
  await page.unroute("**/api/freelance/subscribe");
  await form.getByRole("button", { name: "Coba Lagi" }).click();
  await page
    .getByText(
      "Terima kasih, QA Khadafi! Kamu sudah masuk daftar pembaruan Khadafi.",
      { exact: true },
    )
    .waitFor();
  const manage = await page
    .getByRole("link", { name: "Kelola langganan" })
    .getAttribute("href");
  assert.match(manage, /^\/freelance\/berhenti#[a-f0-9]{64}$/);
  check("newsletter form stores in local PostgreSQL through real server API");
  await go(manage);
  await page.getByRole("button", { name: /berhenti berlangganan/ }).click();
  await page
    .getByRole("heading", { name: "Langganan sudah dihentikan." })
    .waitFor();
  check("personal unsubscribe route updates database");
  const response = await context.request.post(
    base + "/api/freelance/subscribe",
    {
      headers: { Origin: base },
      data: { name: "QA Khadafi", email, consent: true, source: "homepage" },
    },
  );
  assert.equal(response.status(), 200);
  assert.match((await response.json()).message, /tetap nonaktif/);
  check("resubmission after unsubscribe never claims an active subscription");
  await go("/login");
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("reader@example.invalid");
  await page.getByLabel("Password", { exact: true }).fill("fixture-password");
  await page
    .getByRole("form", { name: "Masuk akun" })
    .getByRole("button", { name: "Masuk", exact: true })
    .click();
  await page.waitForURL("**/account");
  await page.getByRole("link", { name: "Produk Saya", exact: true }).waitFor();
  await go("/studio/overview");
  await page.waitForURL("**/account?access=denied");
  await page
    .getByText("Studio hanya tersedia untuk pengelola website.")
    .waitFor();
  const session = await page.evaluate(async () =>
    JSON.parse(localStorage.getItem("sb-127-auth-token") || "null"),
  );
  assert.ok(session?.access_token);
  const denied = await context.request.get(base + "/api/studio/freelance", {
    headers: { Authorization: "Bearer " + session.access_token },
  });
  assert.equal(denied.status(), 403);
  check("member login works; founder page and subscriber API deny member");
  await go("/account/profile");
  await page.getByText("reader@example.invalid", { exact: true }).waitFor();
  await go("/account/library");
  await page
    .getByRole("heading", { name: "QA Fixture · Formula Profitable Blueprint" })
    .waitFor();
  check(
    "member profile and owned product library render from authenticated data",
  );
  await page.waitForFunction(() =>
    [...document.querySelectorAll("button")].some(
      (button) =>
        button.textContent.includes("Keluar") &&
        typeof button.onclick === "function",
    ),
  );
  await page.getByRole("button", { name: "Keluar", exact: false }).click();
  await page.waitForURL("**/login");
  await page.getByRole("radio", { name: /Founder/ }).check();
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("owner@example.invalid");
  await page.getByLabel("Password", { exact: true }).fill("fixture-password");
  await page
    .getByRole("form", { name: "Masuk akun" })
    .getByRole("button", { name: "Masuk", exact: true })
    .click();
  await page.waitForURL("**/studio/overview");
  await page
    .getByRole("heading", { name: "Ruang di balik ekosistem." })
    .waitFor();
  await page
    .getByRole("link", { name: "Subscriber & newsletter", exact: false })
    .click();
  await page.getByRole("cell", { name: email, exact: false }).waitFor();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
    "subscriber dashboard must scroll its table, not the page",
  );
  await page.screenshot({
    path: path.join(out, "founder-subscribers.png"),
    fullPage: true,
  });
  check("verified founder overview and persisted homepage subscriber render");
  await go("/");
  await page
    .getByRole("link", { name: "Dashboard", exact: true })
    .first()
    .waitFor();
  assert.equal(
    await page
      .getByRole("link", { name: "Dashboard", exact: true })
      .first()
      .getAttribute("href"),
    "/studio/overview",
  );
  check("signed-in founder navbar points to authorized dashboard");
  const motion = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "no-preference",
    locale: "id-ID",
  });
  const moving = await motion.newPage();
  await moving.goto(base, { waitUntil: "networkidle" });
  await moving.getByRole("button", { name: "Jeda animasi kata" }).click();
  assert.equal(
    await moving
      .getByRole("button", { name: "Lanjutkan animasi kata" })
      .getAttribute("aria-pressed"),
    "true",
  );
  await motion.close();
  check("dynamic words have a working pause control");
  assert.deepEqual(errors, []);
  check("zero uncaught browser errors");
  fs.writeFileSync(
    path.join(out, "browser-results.json"),
    JSON.stringify({ checks, errors, hosted: false }, null, 2),
  );
  await browser.close();
  console.log(`${checks.length} browser checks passed.`);
}
main().catch(async (e) => {
  console.error(e);
  if (globalThis.homeQaPage) {
    console.log("Failed page:", globalThis.homeQaPage.url());
    console.log(
      "Visible status:",
      await globalThis.homeQaPage
        .locator('[role="alert"], [role="status"], h1')
        .allTextContents(),
    );
    await globalThis.homeQaPage.screenshot({
      path: path.join(out, "browser-failure.png"),
    });
  }
  await browserHandle?.close();
  process.exitCode = 1;
});
