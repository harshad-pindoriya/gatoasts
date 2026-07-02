// Turns src/styles.css into a TypeScript module exporting the CSS as a string,
// so the engine can auto-inject it at runtime without any bundler CSS loader.
// Run automatically before `build`, `dev`, and `test`.
import { readFileSync, writeFileSync } from 'node:fs';

const css = readFileSync('src/styles.css', 'utf8');
const out = `// AUTO-GENERATED from styles.css by scripts/gen-styles.mjs — do not edit.
export const css = ${JSON.stringify(css)};
`;
writeFileSync('src/styles.generated.ts', out);
console.log(`gen-styles: wrote src/styles.generated.ts (${css.length} bytes)`);
