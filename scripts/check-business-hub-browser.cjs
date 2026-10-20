/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE ||
    "C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright",
);
const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path"),
  crypto = require("node:crypto");
const base = process.env.QA_BASE || "http://localhost:3016",
  out = path.resolve(
    "artifacts/business-hub",
    base.startsWith("https") ? "production" : "local",
  );
fs.mkdirSync(out, { recursive: true });
const sbs = require("../src/content/business-hub/sbs.json"),
  m = require("../src/content/business-hub/monetization.json");
const root = "/freelance/tools",
  sp = root + "/service-business-system",
  mp = root + "/monetisasi";
const checks = [],
  errors = [];
const pathways = m.items.map((i) => mp + "/" + i.slug),
  chapters = sbs.chapters.map((c) => sp + "/" + c.slug);
function record(...messages) {
  checks.push(...messages);
  messages.forEach((m) => console.log("PASS: " + m));
}
async function main() {
  const browser = await chromium.launch({ headless: true, channel: "chrome" }),
    context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      locale: "id-ID",
      reducedMotion: "reduce",
    }),
    page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  const go = async (route) => {
    const r = await page.goto(base + route, {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });
    assert.equal(r.status(), 200, route);
    await page.locator("h1").waitFor();
    await page.evaluate(() => document.fonts.ready);
    if (route.startsWith(sp) || route.startsWith(mp))
      await page
        .locator("[data-business-ready=true]")
        .waitFor({ state: "attached" });
  };
  const count = async (p, selector, n) =>
    p.waitForFunction(
      ({ selector, n }) => document.querySelectorAll(selector).length === n,
      { selector, n },
      { timeout: 15000 },
    );
  async function batch(list, fn) {
    for (let i = 0; i < list.length; i += 4)
      await Promise.all(list.slice(i, i + 4).map(fn));
  }
  if (process.env.QA_INTERACTIONS_ONLY !== "1") {
    await batch(pathways.concat(chapters), async (route) => {
      const r = await context.request.get(base + route, { timeout: 120000 });
      assert.equal(r.status(), 200, route);
      const html = await r.text();
      assert.match(html, /<h1[ >]/);
      if (route.startsWith(mp + "/")) {
        const i = m.items.find((x) => route.endsWith("/" + x.slug));
        assert.ok(html.includes(i.definition));
        assert.ok(html.includes(i.first_steps[0]));
        assert.ok(html.includes('id="simulasi"'));
      } else {
        const c = sbs.chapters.find((x) => route.endsWith("/" + x.slug));
        assert.equal(
          (html.match(/data-component="component-/g) || []).length,
          4,
        );
        for (const x of c.components)
          assert.ok(html.includes(`id="${x.anchor}"`));
      }
      await r.dispose();
    });
    record(
      "80 anonymous detail pages and six chapters: full HTML, 24 component anchors",
    );
    const files = [];
    function walk(dir) {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const f = path.join(dir, e.name);
        if (e.isDirectory()) walk(f);
        else files.push(f);
      }
    }
    walk(path.resolve("public/downloads/service-business-system"));
    walk(path.resolve("public/downloads/monetization"));
    await batch(files, async (file) => {
      const url =
        "/" +
        path.relative(path.resolve("public"), file).split(path.sep).join("/");
      const r = await context.request.get(base + url, { timeout: 120000 });
      assert.equal(r.status(), 200, url);
      const body = await r.body(),
        local = fs.readFileSync(file);
      assert.equal(body.length, local.length, url);
      assert.equal(
        crypto.createHash("sha256").update(body).digest("hex"),
        crypto.createHash("sha256").update(local).digest("hex"),
        url,
      );
      const mime = r.headers()["content-type"] || "";
      assert.ok(!mime.includes("text/html"), url);
      if (file.endsWith(".pdf")) {
        assert.equal(body.subarray(0, 5).toString(), "%PDF-");
        assert.match(mime, /application\/pdf/);
      }
      if (/\.(docx|xlsx|zip)$/.test(file)) {
        assert.equal(body.subarray(0, 2).toString(), "PK");
        assert.match(
          mime,
          /application\/(vnd\.openxmlformats-officedocument|zip|x-zip|octet-stream)/,
        );
      }
      await r.dispose();
    });
    record(
      `${files.length} public file GETs: exact byte length, SHA-256, PDF/Office/ZIP MIME and signatures`,
    );
  }
  await go(root);
  await page.locator("[data-resource]").first().waitFor();
  await count(page, "[data-resource]", 11);
  assert.equal(
    await page
      .getByRole("heading", { name: "Dua langkah pertama yang berarti." })
      .count(),
    1,
  );
  await page.screenshot({
    path: path.join(out, "library-desktop.png"),
    fullPage: true,
  });
  record(
    "11 parent resources with original featured pair and two-module spotlight",
  );
  await go(mp);
  await page.locator("[data-pathway]").first().waitFor();
  await count(page, "[data-pathway]", 12);
  await page.getByRole("link", { name: "Halaman 7", exact: true }).click();
  await count(page, "[data-pathway]", 8);
  assert.match(page.url(), /page=7/);
  await page
    .getByRole("button", { name: "Jasa digital 10", exact: true })
    .click();
  await count(page, "[data-pathway]", 10);
  assert.ok(!page.url().includes("page=7"));
  await page.goBack();
  await count(page, "[data-pathway]", 8);
  assert.match(page.url(), /page=7/);
  await page.getByRole("button", { name: "Reset filter", exact: true }).click();
  await page
    .getByRole("searchbox", { name: "Cari jalur, skill, atau model bisnis" })
    .fill("SOCIAL");
  assert.ok((await page.locator("[data-pathway]").count()) > 0);
  const shared = page.url();
  await page.reload({ waitUntil: "domcontentloaded" });
  await page
    .locator("[data-business-ready=true]")
    .waitFor({ state: "attached" });
  await page.locator("[data-pathway]").first().waitFor();
  assert.ok(page.url().includes("q=SOCIAL"));
  assert.ok((await page.locator("[data-pathway]").count()) > 0);
  await page.getByRole("searchbox").fill("zz-no-match");
  await page
    .getByRole("heading", { name: "Belum ada jalur yang cocok." })
    .waitFor();
  await page
    .getByRole("button", { name: "Reset filter", exact: true })
    .first()
    .click();
  await count(page, "[data-pathway]", 12);
  await page.getByLabel("Jasa", { exact: true }).check();
  await page.getByLabel("Produk", { exact: true }).check();
  assert.ok((await page.locator("[data-pathway]").count()) > 0);
  await page
    .getByRole("button", { name: "Produk digital 10", exact: true })
    .click();
  await count(page, "[data-pathway]", 10);
  await page.getByRole("button", { name: "Reset filter", exact: true }).click();
  record(
    "case-insensitive search, OR mechanisms + AND category, page 7 has eight, filter resets page, URL reload, empty and reset: " +
      shared,
  );
  await page.getByRole("searchbox").focus();
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement?.tagName),
    "BUTTON",
  );
  assert.notEqual(
    await page.evaluate(
      () => getComputedStyle(document.activeElement).outlineStyle,
    ),
    "none",
  );
  await go(mp);
  await page
    .getByRole("link", { name: "Software dan AI ↗", exact: true })
    .click();
  await count(page, "[data-pathway]", 10);
  assert.match(page.url(), /category=software-ai/);
  await go(mp);
  record("browser back, server category shortcut and visible keyboard focus");
  await page
    .getByRole("button", {
      name: "Simpan Social Media Management",
      exact: true,
    })
    .click();
  await page.getByLabel("Pilihan tersimpan (1)", { exact: true }).check();
  await count(page, "[data-pathway]", 1);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page
    .locator("[data-business-ready=true]")
    .waitFor({ state: "attached" });
  await page.locator("[data-pathway]").first().waitFor();
  await count(page, "[data-pathway]", 1);
  await page.getByRole("button", { name: "Reset filter", exact: true }).click();
  for (const title of m.items.slice(0, 4).map((i) => i.title))
    await page
      .getByRole("button", { name: "Bandingkan " + title, exact: true })
      .click();
  await page.getByText("Maksimal tiga jalur.", { exact: false }).waitFor();
  await count(page, "#bandingkan thead th", 4);
  await page.setViewportSize({width:390,height:960});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  assert.equal(await page.locator('#bandingkan table').evaluate(t=>t.parentElement.scrollWidth>t.parentElement.clientWidth),true);
  await page.locator('#bandingkan').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(out,'compare-mobile.png'),fullPage:false});
  await page.setViewportSize({width:1440,height:1000});
  await page
    .getByRole("button", {
      name: "Hapus Social Media Management dari perbandingan",
    })
    .click();
  await count(page, "#bandingkan thead th", 3);
  await page
    .getByRole("button", { name: "Kosongkan perbandingan", exact: true })
    .click();
  await count(page, "#bandingkan", 0);
  record(
    "stable-ID bookmarks persist, comparison adds/removes/clears and refuses fourth accessibly",
  );
  await go(sp);
  await page.getByLabel("Layanan inti", { exact: true }).check();
  await page.reload({ waitUntil: "domcontentloaded" });
  await page
    .locator("[data-business-ready=true]")
    .waitFor({ state: "attached" });
  await page.getByLabel("Layanan inti", { exact: true }).waitFor();
  await page.getByLabel("Layanan inti", { exact: true }).waitFor();
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll("label")]
        .find((x) => x.textContent === "Layanan inti")
        ?.querySelector("input")?.checked,
  );
  assert.equal(
    await page.getByLabel("Layanan inti", { exact: true }).isChecked(),
    true,
  );
  await page.getByRole("button", { name: "Reset checklist" }).click();
  assert.equal(
    await page.getByLabel("Layanan inti", { exact: true }).isChecked(),
    false,
  );
  await page.getByLabel("Cari topik atau dokumen").fill("scope");
  assert.ok((await page.locator("[data-document]").count()) > 0);
  await page.getByRole("button", { name: "Reset filter", exact: true }).click();
  await page.getByLabel("PDF", { exact: true }).check();
  await page.getByLabel("XLSX", { exact: true }).check();
  await count(page, "[data-document]", 19);
  await page.getByLabel("Kelengkapan").selectOption("optional");
  await count(page, "[data-document]", 3);
  await page.getByRole("button", { name: "Reset filter", exact: true }).click();
  await count(page, "iframe", 0);
  await page.locator('[data-document="sbs-01"] summary').click();
  await page.locator("iframe").waitFor();
  await count(page, "iframe", 1);
  const download = page.waitForEvent("download");
  await page
    .getByRole("link", { name: "Unduh PDF bila preview tidak tersedia" })
    .click();
  assert.ok((await download).suggestedFilename().endsWith(".pdf"));
  await page.locator('[data-document="sbs-01"] summary').click();
  record(
    "19 logical documents, guide search, format OR and optional filters, lazy PDF preview and fallback download, persistent checklist/reset",
  );
  for (const [n, expected] of [
    [27, "1.000.000"],
    [28, "250.000"],
  ]) {
    await go(mp + "/" + m.items[n - 1].slug);
    assert.ok(
      (await page.getByTestId("simulation-total").innerText()).includes(
        expected,
      ),
    );
    const amount = page.getByRole("spinbutton", { name: /Jumlah/ });
    await amount.fill("0");
    assert.match(
      await page.getByTestId("simulation-total").innerText(),
      /Rp\s*0/,
    );
    await amount.fill("");
    await page.locator("p[role=alert]").waitFor();
    await amount.fill("-1");
    await page.locator("p[role=alert]").waitFor();
    await page.getByRole("button", { name: "Reset asumsi" }).click();
    assert.ok(
      (await page.getByTestId("simulation-total").innerText()).includes(
        expected,
      ),
    );
  }
  record(
    "RPM #27 and #28, zero vs empty, negative rejection and assumption reset",
  );
  await go(root + "/freelance-rate-calculator");
  assert.match(
    await page.getByTestId("suggested-rate").innerText(),
    /200\.000/,
  );
  assert.match(
    await page.getByTestId("project-total").innerText(),
    /3\.850\.000/,
  );
  for (const [name, value] of [
    ["margin", "100"],
    ["billable", "0"],
    ["direct", "-1"],
    ["deposit", "90"],
  ]) {
    await page.locator(`[name="${name}"]`).fill(value);
    await count(page, '[data-testid="project-total"]', 0);
    await page
      .getByRole("button", { name: "Reset ke contoh Kedai Senja" })
      .click();
    await count(page, '[data-testid="project-total"]', 1);
  }
  record(
    "existing hourly calculator, workbook project example, margin/capacity/negative/termin validation",
  );
  const blocked = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await blocked.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("blocked");
      },
    });
  });
  const bp = await blocked.newPage();
  await bp.goto(base + mp, { waitUntil: "domcontentloaded" });
  await bp.locator("[data-business-ready=true]").waitFor({ state: "attached" });
  await bp
    .getByRole("button", {
      name: "Simpan Social Media Management",
      exact: true,
    })
    .click();
  await bp.getByLabel("Pilihan tersimpan (1)", { exact: true }).check();
  await count(bp, "[data-pathway]", 1);
  await bp.goto(base + sp, { waitUntil: "domcontentloaded" });
  await bp.locator("[data-business-ready=true]").waitFor({ state: "attached" });
  await bp.getByLabel("Layanan inti", { exact: true }).check();
  assert.equal(
    await bp.getByLabel("Layanan inti", { exact: true }).isChecked(),
    true,
  );
  await bp.getByRole("button", { name: "Reset checklist" }).click();
  record(
    "blocked localStorage: bookmark and checklist work with temporary status",
  );
  await blocked.close();
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const np = await nojs.newPage();
  await np.goto(base + chapters[0], { waitUntil: "domcontentloaded" });
  assert.equal(await np.locator("[data-component]").count(), 4);
  await np
    .getByRole("link", { name: "Harga dan transaksi", exact: true })
    .click();
  assert.ok(np.url().endsWith("/harga"));
  await np.goto(base + pathways[0], { waitUntil: "domcontentloaded" });
  assert.equal(await np.locator("#mulai li").count(), 4);
  record(
    "JavaScript disabled: chapter reading and navigation, full pathway steps",
  );
  await nojs.close();
  const layouts = [
    root,
    sp,
    chapters[0],
    mp,
    pathways[26],
    root + "/freelance-rate-calculator",
  ];
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    for (const route of layouts) {
      await go(route);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        ),
        false,
        `${width}: ${route}`,
      );
    }
    await go(mp);
    await page.screenshot({
      path: path.join(out, `monetization-${width}.png`),
      fullPage: true,
    });
    await page.screenshot({
      path: path.join(out, `monetization-${width}-viewport.png`),
      fullPage: false,
    });
    if (width === 390) {
      await go(chapters[0]);
      await page.screenshot({
        path: path.join(out, "chapter-mobile.png"),
        fullPage: true,
      });
      assert.equal(
        await page.locator("summary").first().getAttribute("aria-expanded"),
        "false",
      );
      await page.locator("summary").first().click();
      await page.waitForFunction(
        () =>
          document.querySelector("summary")?.getAttribute("aria-expanded") ===
          "true",
      );
      assert.equal(
        await page.locator("summary").first().getAttribute("aria-expanded"),
        "true",
      );
      await go(sp);
      await page.screenshot({
        path: path.join(out, "sbs-mobile.png"),
        fullPage: true,
      });
      await page.screenshot({
        path: path.join(out, "sbs-mobile-viewport.png"),
        fullPage: false,
      });
      await page.locator('[data-document="sbs-01"] summary').click();
      const mobileDownload = page.waitForEvent("download");
      await page
        .getByRole("link", { name: "Unduh PDF bila preview tidak tersedia" })
        .click();
      assert.ok((await mobileDownload).suggestedFilename().endsWith(".pdf"));
    }
    if (width === 1440) {
      await go(sp);
      await page.screenshot({
        path: path.join(out, "sbs-desktop.png"),
        fullPage: true,
      });
    }
  }
  record(
    "24 responsive layouts at 360/390/768/1440 without horizontal page overflow, mobile TOC and reduced motion",
  );
  for (const r of require("../src/content/freelance-resources.json").filter(
    (i) => i.type !== "system",
  ))
    await go(root + "/" + r.slug);
  for (const r of [
    "/freelance",
    "/freelance/jobs",
    "/freelance/direktori",
    "/products",
    "/services",
    "/resources",
  ])
    await go(r);
  const auth = await context.request.get(base + "/account", {
    maxRedirects: 0,
  });
  assert.ok([301, 302, 303, 307, 308].includes(auth.status()));
  await auth.dispose();
  const unknown = await context.request.get(base + mp + "/invalid-slug");
  assert.equal(unknown.status(), 404);
  await unknown.dispose();
  const sitemap = await context.request.get(base + "/sitemap.xml");
  const xml = await sitemap.text();
  for (const route of pathways.concat(chapters))
    assert.ok(xml.includes(route), route);
  await sitemap.dispose();
  record(
    "nine original resources and ecosystem routes, private account redirect, unknown slug 404, 86 detail/chapter sitemap URLs",
  );
  assert.deepEqual(errors, []);
  await browser.close();
  const report = {
    base,
    verifiedAt: new Date().toISOString(),
    passed: true,
    checks,
    uncaughtErrors: errors,
  };
  fs.writeFileSync(
    path.join(out, "verification.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
