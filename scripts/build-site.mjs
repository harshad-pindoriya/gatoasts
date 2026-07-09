// Assembles the static marketing/demo site (ga-toasts.com) into public/ so
// Vercel has an Output Directory to serve. This repo is dual-purpose: an npm
// library (built into dist/ by tsup) AND its landing page (index.html, which
// loads dist/ga-toasts.global.js). `npm run build` stays library-only because
// it also runs as prepublishOnly; the website is assembled here instead and
// wired to Vercel via vercel.json's buildCommand + outputDirectory.
import { rmSync, mkdirSync, cpSync } from 'node:fs';

const OUT = 'public';

// index.html references assets with relative paths (dist/…, images/…) and one
// root-absolute path (/sitemap.xml), so preserving this layout keeps every URL
// resolving unchanged once these land at the deploy root.
//
// Only the CDN/browser build is shipped to the site — the CJS/ESM/.d.ts library
// artifacts in dist/ are for npm consumers and aren't referenced by index.html.
const ASSETS = [
  'index.html',
  'dist/ga-toasts.global.js', // the <script> index.html loads
  'dist/ga-toasts.css', // paired stylesheet, for consumers linking it explicitly
  'images',
  'robots.txt',
  'sitemap.xml',
];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const asset of ASSETS) {
  cpSync(asset, `${OUT}/${asset}`, { recursive: true });
}

console.log(`build-site: assembled ${OUT}/ (${ASSETS.join(', ')})`);
