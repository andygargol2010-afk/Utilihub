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

const lazyRe = /lazy\s*\(\s*\(\s*\)\s*=>/g;
const lazyMatches = registry.match(lazyRe) || [];
const lazyCount = lazyMatches.length;

const importPaths = [...registry.matchAll(/import\s*\(\s*["']\.\/([^"']+)["']\s*\)/g)].map((m) => m[1]);
const uniqueImports = [...new Set(importPaths)];

const slugMatches = [...registry.matchAll(/if\s*\(\s*slug\s*===\s*["']([^"']+)["']\s*\)/g)].map((m) => m[1]);
const uniqueSlugs = [...new Set(slugMatches)];

const minComponents = Number(baseline.minComponents) || 0;
if (lazyCount < minComponents) {
  console.error(
    `validate-registry: lazy components ${lazyCount} < baseline minComponents ${minComponents}`,
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
if (missingFiles.length) {
  console.error(`validate-registry: missing component files:\n  ${missingFiles.join("\n  ")}`);
  process.exit(1);
}

const baselineSlugs = Array.isArray(baseline.slugs) ? baseline.slugs : [];
const missingSlugs = baselineSlugs.filter((s) => !uniqueSlugs.includes(s));
if (missingSlugs.length) {
  console.error(
    `validate-registry: baseline slugs missing from registry.tsx:\n  ${missingSlugs.join("\n  ")}`,
  );
  process.exit(1);
}

console.log(
  `validate-registry PASS: lazy=${lazyCount} (min ${minComponents}), uniqueImports=${uniqueImports.length}, dedicatedSlugs=${uniqueSlugs.length}, registryLines=${lineCount}`,
);
