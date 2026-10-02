/* eslint-disable @typescript-eslint/no-require-imports -- Standalone repository verification. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
const cache = new Map();

function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const loaded = { exports: {} };
  cache.set(file, loaded);
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const localRequire = (name) =>
    name.startsWith("@/")
      ? load(path.join(root, "src", `${name.slice(2)}.ts`))
      : require(name);
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`, {
    filename: file,
  })(localRequire, loaded, loaded.exports);
  return loaded.exports;
}

const { isPublicDestination } = load(
  path.join(root, "src/lib/public-routes.ts"),
);
const { PUBLIC_NAV_CATEGORIES, PUBLIC_FOOTER_GROUPS } = load(
  path.join(root, "src/content/public-navigation.ts"),
);
for (const destination of [
  "/",
  "/about#jasa",
  "/resources?topic=product",
  "/blog/published-article",
  "/freelance/direktori/fiverr",
  "#certifications",
  "#intent",
]) {
  assert.ok(isPublicDestination(destination), destination);
}
for (const destination of [
  "/studio",
  "/studio/article",
  "/admin",
  "/dashboard",
  "/editor",
  "/preview",
  "/draft",
  "/auth/callback",
  "/api/posts",
  "/%73tudio",
  "/about/../studio",
  "//example.com",
  "https://example.com",
  "#studio",
  "/blog/article/preview",
]) {
  assert.equal(isPublicDestination(destination), false, destination);
}
const navigation = [
  ...PUBLIC_NAV_CATEGORIES.flatMap((category) => [
    category,
    ...category.subMenus,
  ]),
  ...PUBLIC_FOOTER_GROUPS.flatMap((group) => group.links),
];
assert.equal(PUBLIC_NAV_CATEGORIES.length, 6);
for (const item of navigation)
  assert.ok(isPublicDestination(item.href), item.href);

const credentials = JSON.parse(
  fs.readFileSync(path.join(root, "src/content/credentials.json"), "utf8"),
);
assert.equal(credentials.certificates.length, 9);
assert.equal(credentials.badges.length, 13);
let pages = 0;
for (const credential of [...credentials.certificates, ...credentials.badges]) {
  assert.ok(credential.title && credential.image);
  for (const image of credential.pages ?? [credential.image]) {
    assert.ok(fs.existsSync(path.join(root, "public", image)), image);
    assert.ok(fs.statSync(path.join(root, "public", image)).size > 0, image);
    pages++;
  }
}
assert.equal(pages, 24, "11 certificate pages and 13 badges remain accessible");

for (const file of [
  "src/components/shared/navbar.tsx",
  "src/components/shared/footer.tsx",
  "src/content/public-navigation.ts",
  "src/content/freelance-data.ts",
  "src/components/home/HomeView.tsx",
  "src/components/home/SelectedWork.tsx",
  "src/components/home/ProductsEcosystem.tsx",
  "src/components/home/CurrentlyBuilding.tsx",
]) {
  assert.doesNotMatch(
    fs.readFileSync(path.join(root, file), "utf8"),
    /["']\/studio(?:[\/"'#?])/,
  );
}
console.log(
  `Editorial checks passed: ${navigation.length} deliberate public navigation entries, private route rejection, 9 certificates, 13 badges, 24 preserved image pages.`,
);
