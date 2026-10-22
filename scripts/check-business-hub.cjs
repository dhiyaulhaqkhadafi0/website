/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path"),
  crypto = require("node:crypto"),
  ts = require("typescript");
require.extensions[".ts"] = (m, file) =>
  m._compile(
    ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    }).outputText,
    file,
  );
const data = require("../src/content/business-hub/index.ts"),
  calc = require("../src/lib/business-calculations.ts");
const {
  sbs,
  assets,
  monetization,
  parsePathQuery,
  filterPathways,
  pathQueryString,
} = data;
assert.equal(sbs.chapters.length, 6);
assert.equal(sbs.chapters.flatMap((c) => c.components).length, 24);
assert.equal(assets.length, 19);
assert.equal(sbs.readiness.length, 12);
for (const c of sbs.chapters) {
  assert.equal(c.components.length, 4);
  for (const x of c.components) {
    assert.ok(
      x.summary &&
        x.steps.length &&
        x.example.text &&
        x.common_mistake &&
        x.sections.length,
    );
    for (const id of x.downloads) assert.ok(assets.find((a) => a.id === id));
  }
}
assert.equal(monetization.items.length, 80);
assert.equal(new Set(monetization.items.map((i) => i.id)).size, 80);
assert.equal(new Set(monetization.items.map((i) => i.slug)).size, 80);
for (const c of monetization.categories)
  assert.equal(
    monetization.items.filter((i) => i.category_id === c.id).length,
    10,
  );
for (const i of monetization.items) {
  assert.equal(i.first_steps.length, 4);
  assert.equal(i.risks.length, 2);
  assert.equal(
    calc.calculateSimulation(
      String(i.simulation.quantity),
      String(i.simulation.unit_receipt_idr),
      i.simulation.divisor,
      i.simulation.quantity_unit,
    ),
    i.simulation.total_idr,
  );
}
const q = (p) => parsePathQuery(new URLSearchParams(p));
assert.deepEqual(filterPathways(q("q=SOCIAL")), filterPathways(q("q=social")));
const or = filterPathways(q("mechanism=jasa&mechanism=produk"));
assert.ok(
  or.some((i) => i.mechanisms.includes("jasa")) &&
    or.some((i) => i.mechanisms.includes("produk")),
);
assert.ok(
  filterPathways(
    q("category=produk-digital&mechanism=jasa&mechanism=produk"),
  ).every(
    (i) =>
      i.category_id === "produk-digital" &&
      i.mechanisms.some((m) => ["jasa", "produk"].includes(m)),
  ),
);
assert.equal(filterPathways(q("")).slice(72, 84).length, 8);
assert.equal(filterPathways(q("q=zz-no-match")).length, 0);
assert.equal(q("category=invalid&mechanism=invalid&page=-20").category, "");
assert.deepEqual(q("mechanism=invalid").mechanisms, []);
assert.equal(q("page=-20").page, 1);
const sample = q("q=AI&category=software-ai&mechanism=produk&page=2");
assert.deepEqual(q(pathQueryString(sample)), sample);
const project = calc.calculateProject(calc.PROJECT_DEFAULTS);
assert.equal(project.rate, 80000);
assert.equal(project.capacity, 100);
assert.equal(project.price, 3850000);
assert.equal(project.deposit, 1925000);
assert.equal(project.second, 1155000);
assert.equal(project.final, 770000);
for (const patch of [
  { billable: 0 },
  { margin: 100 },
  { direct: -1 },
  { deposit: 80, second: 30 },
  { compensation: NaN },
  { days: 0 },
  { hours: 25 },
])
  assert.throws(() =>
    calc.calculateProject({ ...calc.PROJECT_DEFAULTS, ...patch }),
  );
assert.equal(
  calc.calculateSimulation("100000", "10000", 1000, "views"),
  1000000,
);
assert.equal(calc.calculateSimulation("50000", "5000", 1000, "views"), 250000);
assert.equal(calc.calculateSimulation("0", "100", 1, "pembeli"), 0);
assert.equal(calc.calculateSimulation("1.5", "100", 1, "jam"), 150);
for (const input of [
  ["", "1"],
  ["-1", "1"],
  ["1", "Infinity"],
  ["1.5", "1"],
])
  assert.throws(() => calc.calculateSimulation(...input, 1, "pembeli"));
const files = require("../src/content/business-hub/public-assets.json")
  .map((f) => ({ ...f, public_url: f.url }))
  .concat(
    require("../src/content/business-hub/monetization-assets.json").assets,
  );
for (const f of files) {
  const b = fs.readFileSync(path.join(__dirname, "../public", f.public_url));
  assert.equal(b.length, f.size_bytes);
  assert.equal(crypto.createHash("sha256").update(b).digest("hex"), f.sha256);
  if (f.format === "PDF") assert.equal(b.subarray(0, 5).toString(), "%PDF-");
  if (["DOCX", "XLSX", "ZIP"].includes(f.format))
    assert.equal(b.subarray(0, 2).toString(), "PK");
}
console.log(
  JSON.stringify(
    {
      passed: true,
      chapters: 6,
      components: 24,
      assets: 19,
      pathways: 80,
      categories: 8,
      verifiedFiles: files.length,
      checks: [
        "complete content and relations",
        "80 arithmetic examples",
        "search, OR/AND filters and URL roundtrip",
        "pagination page 7",
        "project price and installment parity",
        "empty, zero, negative, nonfinite and integer validation",
        "original file sizes, SHA-256 and signatures",
      ],
    },
    null,
    2,
  ),
);

for (const [number, total] of [
  [11, 1975000],
  [15, 2235000],
  [16, 1225000],
  [20, 2985000],
  [48, 1225000],
  [79, 1995000],
])
  assert.equal(monetization.items[number - 1].simulation.total_idr, total);
assert.equal(monetization.items[26].simulation.divisor, 1000);
assert.equal(monetization.items[27].simulation.divisor, 1000);
