#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const TARGET = join(ROOT, "src/components/general/PixelArtStudio.tsx");
const parts = [1, 2, 3, 4, 5].map((i) =>
  join(ROOT, `.agent/backups/PixelArtStudio.part${i}.tsx.txt`)
);
for (const p of parts) {
  if (!existsSync(p)) {
    console.error("missing", p);
    process.exit(1);
  }
}
const content = parts.map((p) => readFileSync(p, "utf8")).join("");
if (!content.includes("PIXELIHUB") || content.length < 10000) {
  console.error("bad", content.length);
  process.exit(1);
}
writeFileSync(TARGET, content);
console.log("Wrote", TARGET, content.length);
