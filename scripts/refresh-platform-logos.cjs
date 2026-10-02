// Explicit maintenance command. Never called from the browser or during a build.
// Only uses icon links declared by each official platform page; no logo aggregator.
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const headers = { 'User-Agent': 'Mozilla/5.0 (compatible; DirectoryAssetReview/1.0)' };
async function fetchSafe(url) {
  if (new URL(url).protocol !== 'https:') throw new Error('HTTPS required');
  const r = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r;
}
async function main() {
  const source = await fs.readFile(path.join(root, 'src/content/freelance-directory.ts'), 'utf8');
  const entries = [...source.matchAll(/slug: "([^"]+)", name: "[^"]+", website: "([^"]+)"/g)];
  const dir = path.join(root, 'public/images/platforms');
  await fs.mkdir(dir, { recursive: true });
  const manifest = {};
  for (let i = 0; i < entries.length; i += 5) {
    await Promise.all(entries.slice(i, i + 5).map(async ([, slug, url]) => {
      try {
        const response = await fetchSafe(url);
        const html = await response.text();
        const icons = [...html.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => {
          const attrs = Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*["']([^"']+)["']/g)].map(([, k, v]) => [k.toLowerCase(), v]));
          return attrs;
        }).filter(a => /(?:^|\s)(?:icon|apple-touch-icon)(?:\s|$)/i.test(a.rel ?? '') && a.href);
        if (!icons.length) throw new Error('No declared icon');
        let saved = false;
        for (const icon of icons.sort((a, b) => (a.rel.includes('apple') ? -1 : 0) - (b.rel.includes('apple') ? -1 : 0))) {
          try {
            const iconUrl = new URL(icon.href.replaceAll('&amp;', '&'), response.url).href;
            const r = await fetchSafe(iconUrl);
            const bytes = Buffer.from(await r.arrayBuffer());
            if (bytes.length > 1024 * 1024) throw new Error('Icon too large');
            let output, ext;
            if (bytes[0] === 0 && bytes[1] === 0 && bytes[2] === 1 && bytes[3] === 0) {
              if (bytes.length > 50000) continue;
              output = bytes; ext = 'ico';
            } else { output = await sharp(bytes).resize(64, 64, { fit: 'inside' }).webp({ quality: 85 }).toBuffer(); ext = 'webp'; }
            const file = `${slug}.${ext}`;
            await fs.writeFile(path.join(dir, file), output);
            manifest[slug] = { path: `/images/platforms/${file}`, source: iconUrl };
            console.log(`${slug}: ${output.length} bytes`);
            saved = true; break;
          } catch { /* Try the next declared icon; fallback stays available. */ }
        }
        if (!saved) throw new Error('Declared icons unavailable');
      } catch (e) { console.log(`${slug}: monogram fallback (${e.message})`); }
    }));
  }
  const ordered = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await fs.writeFile(path.join(root, 'src/content/platform-logos.json'), JSON.stringify(ordered, null, 2) + '\n');
  console.log(`${Object.keys(manifest).length}/${entries.length} official icons stored locally.`);
}
main().catch(e => { console.error(e); process.exitCode = 1; });
