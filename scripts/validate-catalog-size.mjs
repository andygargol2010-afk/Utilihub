#!/usr/bin/env node
/**
 * Build-time catalog size + integrity guard.
 *
 * Fails the build when an automation loses content:
 *   - ALL_TOOLS (runtime count, bundled with esbuild) < baseline.minTools
 *   - import lines in src/lib/general/index.ts + src/lib/general/catalog-index/*.ts < baseline.minIndexImports
 *   - lines in src/components/general/registry.tsx + registry-ui/*.ts < baseline.minRegistryLines
 *   (both were split into small files on 2026-10-28; counts are summed over the parts)
 *   - any file in src/ has a line starting with "successfully downloaded text file"
 *     or "$(cat", or contains the token PLACEHOLDER_
 *   - any .ts/.tsx in src/ under 200 bytes with no import/export statement (stub left by a
 *     truncated write), or any file containing FULL_CONTENT or _FROM_TMP
 *   - src/lib/i18n/summary-es.ts with fewer than MIN_SUMMARY_ES_LINES lines
 *
 * Baseline: scripts/catalog-baseline.json. Only raise it; never lower it to make a build pass.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "src");
const baseline = JSON.parse(readFileSync(join(root, "scripts/catalog-baseline.json"), "utf8"));
const errors = [];

const TEXT_EXT = /\.(ts|tsx|js|jsx|mjs|cjs|css|json|md|html|svg|txt)$/;
const BAD_LINE_PREFIXES = ["successfully downloaded text file", "$(cat"];
const STUB_MARKERS = /FULL_CONTENT|_FROM_TMP/;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (TEXT_EXT.test(name)) out.push(full);
  }
  return out;
}

for (const file of walk(srcDir)) {
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    const trimmed = line.trimStart();
    const where = `${relative(root, file)}:${i + 1}`;
    if (BAD_LINE_PREFIXES.some((p) => trimmed.startsWith(p))) {
      errors.push(`${where} starts with a corrupted-write marker: ${JSON.stringify(trimmed.slice(0, 60))}`);
    }
    if (line.includes("PLACEHOLDER_")) {
      errors.push(`${where} contains the stub token PLACEHOLDER_`);
    }
    if (STUB_MARKERS.test(line)) {
      errors.push(`${where} contains a truncated-write marker (FULL_CONTENT / _FROM_TMP)`);
    }
  });
  if (/\.tsx?$/.test(file) && statSync(file).size < 200 && !/^\s*(import|export)\b/m.test(lines.join("\n"))) {
    errors.push(`${relative(root, file)} is under 200 bytes and has no import/export (stub left by a truncated write)`);
  }
}

const MIN_SUMMARY_ES_LINES = 550;
const summaryEsLines = readFileSync(join(srcDir, "lib/i18n/summary-es.ts"), "utf8").split(/\r?\n/).length;
if (summaryEsLines < MIN_SUMMARY_ES_LINES) {
  errors.push(`src/lib/i18n/summary-es.ts has ${summaryEsLines} lines (min ${MIN_SUMMARY_ES_LINES})`);
}

function readParts(mainFile, partsDir) {
  const files = [join(srcDir, mainFile)];
  for (const name of readdirSync(join(srcDir, partsDir)).sort()) {
    if (/\.tsx?$/.test(name)) files.push(join(srcDir, partsDir, name));
  }
  return files.map((f) => readFileSync(f, "utf8"));
}

const indexImports = readParts("lib/general/index.ts", "lib/general/catalog-index")
  .reduce((n, src) => n + (src.match(/^import\s/gm) || []).length, 0);
if (indexImports < baseline.minIndexImports) {
  errors.push(`src/lib/general/index.ts + catalog-index/ have ${indexImports} imports (baseline min ${baseline.minIndexImports})`);
}

const registryLines = readParts("components/general/registry.tsx", "components/general/registry-ui")
  .reduce((n, src) => n + (src.match(/\n/g) || []).length, 0);
if (registryLines < baseline.minRegistryLines) {
  errors.push(`src/components/general/registry.tsx + registry-ui/ have ${registryLines} lines (baseline min ${baseline.minRegistryLines})`);
}

let toolCount = null;
try {
  const { build } = createRequire(join(root, "package.json"))("esbuild");
  const result = await build({
    stdin: {
      contents: [
        'import { ALL_TOOLS } from "@/lib/all-tools";',
        "const malformed = ALL_TOOLS.filter((t) => !Array.isArray(t.keywords) || ['name', 'summary', 'description'].some((k) => typeof t[k] !== 'string')).map((t) => t.slug);",
        "console.log(JSON.stringify({ count: ALL_TOOLS.length, malformed }));",
      ].join("\n"),
      resolveDir: root,
      loader: "ts",
    },
    bundle: true,
    platform: "node",
    format: "esm",
    write: false,
    logLevel: "silent",
    alias: { "@": resolve(srcDir) },
    jsx: "automatic",
    loader: { ".svg": "text", ".png": "empty", ".jpg": "empty", ".css": "empty" },
  });
  const code = result.outputFiles[0].text;
  const url = `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
  const logs = [];
  const origLog = console.log;
  const origError = console.error;
  console.log = (...a) => logs.push(a.join(" "));
  console.error = () => {};
  try {
    await import(url);
  } finally {
    console.log = origLog;
    console.error = origError;
  }
  const out = JSON.parse(logs.at(-1) ?? "null");
  toolCount = Number(out?.count);
  if (!Number.isFinite(toolCount)) throw new Error(`unexpected output: ${logs.at(-1)}`);
  if (toolCount < baseline.minTools) {
    errors.push(`ALL_TOOLS has ${toolCount} tools (baseline min ${baseline.minTools})`);
  }
  // Search/home index every tool by name + summary + description + keywords.join():
  // one tool without them crashes /, /es and /tools with a full-page error.
  for (const slug of out.malformed ?? []) {
    errors.push(`tool "${slug}" is missing keywords[] or name/summary/description strings`);
  }
} catch (err) {
  errors.push(`could not evaluate ALL_TOOLS: ${err && err.message ? err.message.split("\n")[0] : err}`);
}

if (errors.length) {
  console.error(`validate-catalog-size: FAIL (${errors.length})`);
  for (const e of errors.slice(0, 40)) console.error(`  - ${e}`);
  console.error(
    "Content was lost or corrupted. Restore with git from the PREVIOUS commit (never an older one), then re-apply new work surgically.",
  );
  process.exit(1);
}

console.log(
  `validate-catalog-size PASS: ALL_TOOLS=${toolCount} (min ${baseline.minTools}), indexImports=${indexImports} (min ${baseline.minIndexImports}), registryLines=${registryLines} (min ${baseline.minRegistryLines}), summary-es.ts=${summaryEsLines} lines (min ${MIN_SUMMARY_ES_LINES}), no corrupted-write markers or stubs in src/`,
);
