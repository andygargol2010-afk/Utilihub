#!/usr/bin/env node
/**
 * Build-time registry integrity guard.
 * Fails the build if dedicated UI wiring shrinks or stub-marker leaks in.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = join(root, "src/components/general/registry.tsx");
const entriesAPath = join(root, "src/components/general/registry-entries-a.ts");
const entriesBPath = join(root, "src/components/general/registry-entries-b.ts");
const baselinePath = join(root, "scripts/registry-baseline.json");
const componentsDir = join(root, "src/components/general");

function read(path) {
  if (!existsSync(path)) {
    console.error(`validate-registry: missing file ${path}`);
    process.exit(1);
  }
  return readFileSync(path, "utf8");
}

const registry = read(registryPath);
const entriesA = read(entriesAPath);
const entriesB = read(entriesBPath);
const baseline = JSON.parse(read(baselinePath));

const combined = registry + "\n" + entriesA + "\n" + entriesB;
const lineCount = registry.split(/\r?\n/).length;

if (lineCount < 300) {
  console.error(`validate-registry: registry.tsx is only ${lineCount} lines (min 300)`);
  process.exit(1);
}

for (const forbidden of ["PLACEHOLDER", "$(cat"]) {
  if (combined.includes(forbidden)) {
    console.error(`validate-registry: forbidden token ${JSON.stringify(forbidden)} found`);
    process.exit(1);
  }
}

const lazyCount = (registry.match(/lazy\s*\(\s*\(\s*\)\s*=>/g) || []).length;
const importPaths = [...registry.matchAll(/import\s*\(\s*["']\.\/([^"']+)["']\s*\)/g)].map((m) => m[1]);
const uniqueImports = [...new Set(importPaths)];

const slugEquals = [...registry.matchAll(/if\s*\(\s*slug\s*===\s*["']([^"']+)["']\s*\)/g)].map((m) => m[1]);
const entrySlugs = [...combined.matchAll(/slug:\s*["']([^"']+)["']/g)].map((m) => m[1]);
const opSlugs = [...registry.matchAll(/op === ["']([^"']+)["']/g)].map((m) => m[1]);
const allQuoted = [...new Set([...slugEquals, ...entrySlugs, ...opSlugs])];

const entryObjects = [...(entriesA + entriesB).matchAll(
  /\{\s*slug:\s*["']([^"']+)["']\s*,\s*name:\s*["']([^"']+)["']\s*,\s*path:\s*["']([^"']+)["']\s*,\s*export:\s*["']([^"']+)["']\s*\}/g,
)];
const entryCount = entryObjects.length;

const minComponents = Number(baseline.minComponents) || 0;
const minEntries = Number(baseline.minEntries) || 0;

if (lazyCount < minComponents) {
  console.error(
    `validate-registry: lazy components ${lazyCount} < baseline minComponents ${minComponents}`,
  );
  process.exit(1);
}

if (entryCount < minEntries) {
  console.error(
    `validate-registry: registry entries ${entryCount} < baseline minEntries ${minEntries}`,
  );
  process.exit(1);
}

const missingFiles = [];
for (const imp of uniqueImports) {
  const file = imp.endsWith(".tsx") || imp.endsWith(".ts") ? imp : `${imp}.tsx`;
  const full = join(componentsDir, file);
  if (!existsSync(full)) {
    const alt = join(componentsDir, `${imp}.ts`);
    if (!existsSync(alt)) missingFiles.push(file);
  }
}
for (const m of entryObjects) {
  const p = m[3].replace(/^\.\//, "");
  const file = p.endsWith(".tsx") || p.endsWith(".ts") ? p : `${p}.tsx`;
  const full = join(componentsDir, file);
  if (!existsSync(full)) {
    const alt = join(componentsDir, `${p}.ts`);
    if (!existsSync(alt)) missingFiles.push(`entry:${file}`);
  }
}
if (missingFiles.length) {
  console.error(`validate-registry: missing component files:\n  ${[...new Set(missingFiles)].join("\n  ")}`);
  process.exit(1);
}

const baselineSlugs = Array.isArray(baseline.slugs) ? baseline.slugs : [];
const missingSlugs = baselineSlugs.filter((s) => !allQuoted.includes(s));
if (missingSlugs.length) {
  console.error(
    `validate-registry: baseline slugs missing:\n  ${missingSlugs.join("\n  ")}`,
  );
  process.exit(1);
}

console.log(
  `validate-registry PASS: lazy=${lazyCount} (min ${minComponents}), entries=${entryCount} (min ${minEntries}), uniqueImports=${uniqueImports.length}, quotedSlugs=${allQuoted.length}, registryLines=${lineCount}`,
);
