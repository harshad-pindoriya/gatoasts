import { defineConfig } from 'tsup';
import { copyFileSync } from 'node:fs';

// The CSS is authored in src/styles.css and turned into a TS string module
// (src/styles.generated.ts, via scripts/gen-styles.mjs) that the engine
// auto-injects at runtime. We also copy the raw file to dist/ga-toasts.css so
// consumers can import it explicitly if they'd rather control the cascade.

export default defineConfig([
  // ESM + CJS builds with type declarations.
  {
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: false, // unminified output is readable without maps; keeps the package small
    treeshake: true,
    outExtension({ format }) {
      return { js: format === 'cjs' ? '.cjs' : '.js' };
    },
    async onSuccess() {
      copyFileSync('src/styles.css', 'dist/ga-toasts.css');
    },
  },
  // Minified IIFE build for <script> / CDN usage. Exposes a clean
  // `window.GaToasts` (the footer unwraps the default export).
  {
    entry: { 'ga-toasts': 'src/global.ts' },
    format: ['iife'],
    globalName: 'GaToasts',
    dts: false,
    clean: false,
    minify: true,
    sourcemap: false,
    esbuildOptions(options) {
      options.footer = { js: 'GaToasts=GaToasts.default;' };
    },
  },
]);
