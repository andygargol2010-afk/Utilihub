#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { gunzipSync } from "node:zlib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const TARGET = join(ROOT, "src/lib/i18n/es.ts");
const P1 = join(ROOT, ".agent/backups/es.ts.gz.part1.b64");
const P2 = join(ROOT, ".agent/backups/es.ts.gz.part2.b64");
const MIN_BYTES = 15000;

function currentSize() {
  if (!existsSync(TARGET)) return 0;
  return readFileSync(TARGET).length;
}

function restore() {
  if (!existsSync(P1) || !existsSync(P2)) {
    console.error("Missing backup parts");
    process.exit(1);
  }
  const strip = (p) =>
    readFileSync(p, "utf8")
      .split("\n")
      .filter((l) => l && !l.startsWith("#"))
      .join("");
  const b64 = strip(P1) + strip(P2);
  const content = gunzipSync(Buffer.from(b64, "base64"));
  if (content.length < MIN_BYTES) {
    console.error("Backup too small", content.length);
    process.exit(1);
  }
  const text = content.toString("utf8");
  for (const sym of ["spanishCategoryName", "spanishToolName", "spanishToolPath", "spanishFinancialText", "ES_COPY"]) {
    if (!text.includes(sym)) {
      console.error("Missing", sym);
      process.exit(1);
    }
  }
  writeFileSync(TARGET, content);
  console.log("Restored", TARGET, content.length, createHash("sha256").update(content).digest("hex"));
}

const size = currentSize();
if (process.argv.includes("--force") || size < MIN_BYTES) {
  console.log(`es.ts size=${size} -> restoring`);
  restore();
} else {
  console.log(`es.ts OK size=${size}`);
}
