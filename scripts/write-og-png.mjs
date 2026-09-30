/** Writes public/og-image.png (1200×630) from public/og-image.png.b64 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const b64Path = join(root, "public", "og-image.png.b64");
const out = join(root, "public", "og-image.png");
const b64 = readFileSync(b64Path, "utf8").replace(/\s+/g, "");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, Buffer.from(b64, "base64"));
console.log("wrote", out, Buffer.from(b64, "base64").length, "bytes");
