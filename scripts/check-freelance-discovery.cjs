/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS verification script. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const loadedModule = { exports: {} };
  cache.set(file, loadedModule);
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  const localRequire = name => name.endsWith(".json") ? JSON.parse(fs.readFileSync(path.resolve(path.dirname(file), name), "utf8")) : name.startsWith(".") ? load(path.resolve(path.dirname(file), `${name}.ts`)) : require(name);
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`, { filename: file })(localRequire, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}
const root = path.resolve(__dirname, "..");
const { FREELANCE_PLATFORMS, platformOutbound, platformAlternatives } = load(path.join(root, "src/content/freelance-directory.ts"));
const { directoryResults } = load(path.join(root, "src/content/freelance-directory-query.ts"));
const { searchFreelance, SEARCH_INDEX } = load(path.join(root, "src/content/freelance-search.ts"));
const { RESOURCES_DATA } = load(path.join(root, "src/content/resources-data.ts"));
assert.equal(FREELANCE_PLATFORMS.length, 23);
assert.equal(new Set(FREELANCE_PLATFORMS.map(p => p.slug)).size, 23);
for (const p of FREELANCE_PLATFORMS) {
  assert.equal(new URL(p.website).protocol, "https:");
  assert.equal(p.personallyTested, false);
  assert.ok(p.sources.length > 0 && p.sources.every(s => new URL(s.url).protocol === "https:"));
  assert.equal(p.workflow.length, 3);
  assert.ok(p.longDescription.length > 100 && p.workingNotes.length > 100);
  assert.equal(platformAlternatives(p).length, 3);
  assert.equal(p.affiliate.status, "none");
  assert.equal(platformOutbound(p).href, p.website);
  if (p.logo) assert.ok(fs.existsSync(path.join(root, 'public', p.logo.path)));
}
const sample = FREELANCE_PLATFORMS[0];
assert.equal(platformOutbound({ ...sample, affiliate: { status: 'pending', affiliateUrl: 'https://example.com/ref', verifiedAt: '2026-10-03', disclosureRequired: true } }).href, sample.website);
assert.equal(platformOutbound({ ...sample, affiliate: { status: 'active', affiliateUrl: 'javascript:alert(1)', verifiedAt: '2026-10-03', disclosureRequired: true } }).href, sample.website);
assert.equal(platformOutbound({ ...sample, affiliate: { status: 'active', affiliateUrl: 'https://example.com/ref', verifiedAt: '2026-10-03', disclosureRequired: true } }).rel, 'sponsored noopener noreferrer');
const query = s => directoryResults(FREELANCE_PLATFORMS, new URLSearchParams(s));
assert.equal(query('q=Worldwide').filtered.length, 23);
assert.ok(query('q=menulis').filtered.some(p => p.slug === 'problogger'));
assert.deepEqual(query('field=Writing&pricing=Gratis').filtered.map(p => p.slug), ['problogger']);
assert.equal(query('q=zzzz-no-match').filtered.length, 0);
assert.equal(query('field=Writing&pricing=Gratis&page=900').page, 1);
assert.equal(query('page=2.5').page, 2);
assert.equal(query('page=Infinity').page, 1);
assert.equal(query('field=bogus').filtered.length, 23);
assert.equal(query('sort=az').rows[0].slug, '99designs');
assert.equal(query('sort=free').rows[0].pricing, 'Gratis');
assert.equal(query('page=3').rows.length, 5);
assert.equal(new Set(SEARCH_INDEX.map(r => r.href)).size, SEARCH_INDEX.length);
for (const r of SEARCH_INDEX) {
  if (r.href.startsWith("/resources/")) assert.ok(RESOURCES_DATA.some(p => r.href === `/resources/${p.slug}`));
  else if (r.href.startsWith("/freelance/direktori/")) assert.ok(FREELANCE_PLATFORMS.some(p => r.href.endsWith(`/${p.slug}`)));
  else assert.equal(r.href, "/freelance/belajar/mulai-freelance");
}
assert.ok(searchFreelance("menulis").some(r => r.title === "ProBlogger"));
assert.ok(searchFreelance("writer").some(r => r.title === "ProBlogger"));
assert.ok(searchFreelance("freelance pemula", "Panduan").some(r => r.title === "Mulai Freelance dari Nol"));
assert.ok(searchFreelance("portfolio", "Panduan").length > 0);
assert.ok(searchFreelance("kerja remote", "Lowongan").length > 0);
assert.ok(searchFreelance("AI tools", "Tools").some(r => r.href.endsWith("high-context-prompts-pack")));
assert.equal(searchFreelance("zzzz-no-match").length, 0);
assert.equal(searchFreelance("  ").length, SEARCH_INDEX.length);
console.log(`Discovery checks passed: ${FREELANCE_PLATFORMS.length} platforms, ${SEARCH_INDEX.length} unique real destinations, search aliases and category intersections.`);
