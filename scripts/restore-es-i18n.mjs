#!/usr/bin/env node
/**
 * Restores src/lib/i18n/es.ts from the base64 backup if missing or truncated.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const TARGET = join(ROOT, "src/lib/i18n/es.ts");
const BACKUP = join(ROOT, ".agent/backups/es.ts.b64");
const MIN_BYTES = 15000;

function currentSize() {
  if (!existsSync(TARGET)) return 0;
  return readFileSync(TARGET).length;
}

function restore() {
  if (!existsSync(BACKUP)) {
    console.error("Missing backup:", BACKUP);
    process.exit(1);
  }
  const raw = readFileSync(BACKUP, "utf8");
  const b64 = raw
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .join("");
  const content = Buffer.from(b64, "base64");
  if (content.length < MIN_BYTES) {
    console.error("Backup decoded too small:", content.length);
    process.exit(1);
  }
  const text = content.toString("utf8");
  for (const sym of [
    "spanishCategoryName",
    "spanishToolName",
    "spanishToolPath",
    "spanishFinancialText",
    "ES_COPY",
  ]) {
    if (!text.includes(sym)) {
      console.error("Backup missing symbol:", sym);
      process.exit(1);
    }
  }
  writeFileSync(TARGET, content);
  const hash = createHash("sha256").update(content).digest("hex");
  console.log("Restored", TARGET, "bytes=", content.length, "sha256=", hash);
}

const size = currentSize();
const force = process.argv.includes("--force");
if (force || size < MIN_BYTES) {
  console.log(`es.ts size=${size} (min=${MIN_BYTES}) → restoring`);
  restore();
} else {
  console.log(`es.ts OK size=${size}`);
}
