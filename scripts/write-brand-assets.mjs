/** Writes brand assets for Google search into public/ at build time. */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public");
const chunkDir = join(root, "scripts", "brand-b64");
mkdirSync(outDir, { recursive: true });

const files = ["favicon-32.png", "favicon-48.png"];
for (const name of files) {
  const b64Path = join(chunkDir, name + ".b64");
  if (!existsSync(b64Path)) {
    console.warn("skip missing", b64Path);
    continue;
  }
  const b64 = readFileSync(b64Path, "utf8").replace(/\s+/g, "");
  const buf = Buffer.from(b64, "base64");
  writeFileSync(join(outDir, name), buf);
  console.log("wrote", name, buf.length, "bytes");
}
