#!/usr/bin/env node
/**
 * Build-time catalog size + integrity guard.
 *
 * Fails the build when an automation loses content:
 *   - ALL_TOOLS (runtime count, bundled with esbuild) < baseline.minTools
 *   - import lines in src/lib/general/index.ts < baseline.minIndexImports
 *   - lines in src/components/general/registry.tsx < baseline.minRegistryLines
 *   - any file in src/ has a line starting with "successfully downloaded text file"
 *     or "$(cat", or contains the token PLACEHOLDER_
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
  });
}

const indexSrc = readFileSync(join(srcDir, "lib/general/index.ts"), "utf8");
const indexImports = (indexSrc.match(/^import\s/gm) || []).length;
if (indexImports < baseline.minIndexImports) {
  errors.push(`src/lib/general/index.ts has ${indexImports} imports (baseline min ${baseline.minIndexImports})`);
}

const registrySrc = readFileSync(join(srcDir, "components/general/registry.tsx"), "utf8");
const registryLines = (registrySrc.match(/\n/g) || []).length;
if (registryLines < baseline.minRegistryLines) {
  errors.push(`src/components/general/registry.tsx has ${registryLines} lines (baseline min ${baseline.minRegistryLines})`);
}

let toolCount = null;
try {
  const { build } = createRequire(join(root, "package.json"))("esbuild");
  const result = await build({
    stdin: {
      contents: 'import { ALL_TOOLS } from "@/lib/all-tools"; console.log(ALL_TOOLS.length);',
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
  toolCount = Number(logs.at(-1));
  if (!Number.isFinite(toolCount)) throw new Error(`unexpected output: ${logs.at(-1)}`);
  if (toolCount < baseline.minTools) {
    errors.push(`ALL_TOOLS has ${toolCount} tools (baseline min ${baseline.minTools})`);
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
  `validate-catalog-size PASS: ALL_TOOLS=${toolCount} (min ${baseline.minTools}), indexImports=${indexImports} (min ${baseline.minIndexImports}), registryLines=${registryLines} (min ${baseline.minRegistryLines}), no corrupted-write markers in src/`,
);
