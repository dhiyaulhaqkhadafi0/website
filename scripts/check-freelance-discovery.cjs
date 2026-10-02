const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} };
  cache.set(file, module);
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const localRequire = name => name.startsWith(".") ? load(path.resolve(path.dirname(file), `${name}.ts`)) : require(name);
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`, { filename: file })(localRequire, module, module.exports);
  return module.exports;
}
const root = path.resolve(__dirname, "..");
const { FREELANCE_PLATFORMS } = load(path.join(root, "src/content/freelance-directory.ts"));
const { searchFreelance, SEARCH_INDEX } = load(path.join(root, "src/content/freelance-search.ts"));
const { RESOURCES_DATA } = load(path.join(root, "src/content/resources-data.ts"));
assert.equal(FREELANCE_PLATFORMS.length, 15);
assert.equal(new Set(FREELANCE_PLATFORMS.map(p => p.slug)).size, 15);
for (const p of FREELANCE_PLATFORMS) {
  assert.equal(new URL(p.website).protocol, "https:");
  assert.equal(p.personallyTested, false);
  assert.ok(p.sources.length > 0 && p.sources.every(s => new URL(s.url).protocol === "https:"));
}
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
