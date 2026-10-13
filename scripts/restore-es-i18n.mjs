#!/usr/bin/env node
/**
 * Restores src/lib/i18n/es.ts from base64 backup parts if missing or truncated.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const TARGET = join(ROOT, "src/lib/i18n/es.ts");
const BACKUP_PARTS = [
  join(ROOT, ".agent/backups/es.ts.part1.b64"),
  join(ROOT, ".agent/backups/es.ts.part2.b64"),
  // legacy single-file backup
  join(ROOT, ".agent/backups/es.ts.b64"),
];
const MIN_BYTES = 15000;

function currentSize() {
  if (!existsSync(TARGET)) return 0;
  return readFileSync(TARGET).length;
}

function loadBackupB64() {
  const chunks = [];
  for (const p of BACKUP_PARTS) {
    if (!existsSync(p)) continue;
    const raw = readFileSync(p, "utf8");
    const b64 = raw
      .split("\n")
      .filter((l) => l && !l.startsWith("#"))
      .join("");
    if (b64) chunks.push(b64);
  }
  if (!chunks.length) {
    console.error("No backup parts found under .agent/backups/");
    process.exit(1);
  }
  return chunks.join("");
}

function restore() {
  const b64 = loadBackupB64();
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
