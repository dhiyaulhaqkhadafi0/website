/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs'), path = require('node:path'), sharp = require('sharp');
const resourceRoot = process.argv[2] || 'public/images/resources';
const out = 'public/images/experience';
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const tasks = [
    ['public/assets/logo AAPE.png', 'brand-v1.webp', 240, 86],
    ['public/assets/my-profile.jpg', 'portrait-v1.webp', 720, 86],
    ['public/products/formula-profitable-blueprint-mockup.png', 'formula-profitable-blueprint-mockup-v1.webp', 720, 82],
    [path.join(resourceRoot, 'free-resources-hero.png'), 'resources-cover-v1-1440.webp', 1440, 84],
    [path.join(resourceRoot, 'free-resources-hero.png'), 'resources-cover-v1-768.webp', 768, 82],
    [path.join(resourceRoot, 'ChatGPT Image Sep 10, 2026, 10_04_02 AM (6).png'), 'chikki-preview-v1.webp', 1200, 84],
    [path.join(resourceRoot, 'ChatGPT Image Sep 10, 2026, 10_04_02 AM (6).png'), 'chikki-detail-v1.webp', 1448, 92],
  ];
  for (const [source, name, width, quality] of tasks) {
    if (!fs.existsSync(source)) { if (fs.existsSync(path.join(out, name))) continue; throw Error('Missing source: '+source); }
    await sharp(source).rotate().resize({ width, withoutEnlargement: true }).webp({ quality, effort: 6 }).toFile(path.join(out, name));
    console.log(JSON.stringify({ asset: name, original: fs.statSync(source).size, optimized: fs.statSync(path.join(out, name)).size }));
  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
