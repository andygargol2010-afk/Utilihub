/** Writes brand assets into public/ at build time. */
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public");
mkdirSync(outDir, { recursive: true });
console.log("write-brand-assets: public/ ready (logo SVG in repo; PNG icons follow-up)");
