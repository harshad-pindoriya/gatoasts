// Turns src/styles.css into a TypeScript module exporting the CSS as a string,
// so the engine can auto-inject it at runtime without any bundler CSS loader.
// The CSS is minified first (comments + whitespace stripped) so the inlined
// string doesn't bloat every dist artifact. Run automatically before `build`,
// `dev`, and `test`.
import { readFileSync, writeFileSync } from 'node:fs';
import { transform } from 'esbuild';

const raw = readFileSync('src/styles.css', 'utf8');
const { code: css } = await transform(raw, { loader: 'css', minify: true });

const out = `// AUTO-GENERATED from styles.css by scripts/gen-styles.mjs — do not edit.
export const css = ${JSON.stringify(css.trim())};
`;
writeFileSync('src/styles.generated.ts', out);
console.log(
  `gen-styles: wrote src/styles.generated.ts (${css.length} bytes, from ${raw.length} raw)`,
);
