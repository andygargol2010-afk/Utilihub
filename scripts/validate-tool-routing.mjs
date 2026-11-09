// Guard: tools must reach a UI that implements their operation.
// Added 2026-11-03 after the registry split sent 102 tools to ConfiguredTool
// ("Operation not available."). Runs in `npm run validate:catalog` (build).
import fs from "node:fs";

const reg = fs.readFileSync("src/components/general/registry.tsx", "utf8");
const errors = [];
const fallback = reg.indexOf("return ConfiguredToolUi");
if (fallback < 0) errors.push("registry.tsx: ConfiguredToolUi fallback not found (file wiped?)");
const required = [
  ['mode === "advanced"', "AdvancedCalculatorToolUi"],
  ['mode === "date"', "AdvancedDateToolUi"],
  ['slug === "secuencias"', "SequenceToolUi"],
  ['slug === "potencias-y-raices"', "PowerRootToolUi"],
  ['slug === "distribucion-normal"', "NormalDistributionToolUi"],
  ['slug === "distribucion-poisson"', "PoissonToolUi"],
  ['slug === "propina-y-cuenta-compartida"', "UtilityAdvancedToolUi"],
];
for (const [cond, ui] of required) {
  const i = reg.indexOf(cond);
  if (i < 0) errors.push(`registry.tsx: missing route \`${cond}\` → ${ui}`);
  else if (fallback >= 0 && i > fallback) errors.push(`registry.tsx: \`${cond}\` must come before the ConfiguredToolUi fallback`);
  else if (!reg.slice(i, i + 400).includes(ui)) errors.push(`registry.tsx: \`${cond}\` must return ${ui}`);
}
const comps = fs.readdirSync("src/components/general/registry-ui").filter((f) => f.startsWith("components-")).map((f) => fs.readFileSync(`src/components/general/registry-ui/${f}`, "utf8")).join("\n");
for (const [, ui] of required) if (!comps.includes(`export const ${ui} `)) errors.push(`registry-ui: ${ui} is not exported`);

// Every operation used by ConfiguredTool-routed numeric tools must exist in at least one calculator.
const cases = (f) => new Set([...fs.readFileSync(f, "utf8").matchAll(/case"([^"]+)"/g)].map((m) => m[1]));
const adv = cases("src/components/general/AdvancedCalculatorTool.tsx");
for (const f of fs.readdirSync("src/lib/general").filter((n) => n.endsWith(".ts"))) {
  const txt = fs.readFileSync(`src/lib/general/${f}`, "utf8");
  if (!txt.includes('mode:"advanced"')) continue;
  for (const m of txt.matchAll(/\],"([a-z0-9-]+)"\)/g)) if (!adv.has(m[1])) errors.push(`${f}: advanced operation "${m[1]}" has no case in AdvancedCalculatorTool`);
}

// 3-part split (2026-11-04): part1 must not import part2/main; part2 must not import main (value imports).
const walkDir = (d, out = []) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = `${d}/${e.name}`; if (e.isDirectory()) walkDir(f, out); else if (/\.part[12]\.tsx?$/.test(e.name)) out.push(f); } return out; };
for (const f of walkDir("src")) {
  const m = f.match(/([^/]+)\.part([12])\.tsx?$/); const base = m[1].replace(/^-/, ""); const k = Number(m[2]);
  for (const im of fs.readFileSync(f, "utf8").matchAll(/^import\s+(type\s+)?[^;]*?from\s+["']\.\/([^"']+)["']/gm)) {
    if (im[1]) continue;
    const t = im[2].replace(/^-/, "");
    if (t === base || (k === 1 && t === `${base}.part2`)) errors.push(`${f}: imports later part "./${im[2]}" (import cycle)`);
  }
  const mainTs = f.replace(/\.part[12](\.tsx?)$/, "$1").replace(/\/-([^/]+)$/, "/$1");
  if (!fs.existsSync(mainTs)) errors.push(`${f}: main file ${mainTs} is missing`);
}

// Registry barrels (2026-11-06): duplicate names across components-NN.ts make `export *`
// drop the name silently (UI.X === undefined → tool falls back to a generic UI that throws
// "not implemented"). Also every UI.X used in slugs-NN.ts must exist, and every part must be wired.
{
  const dir = "src/components/general/registry-ui";
  const files = fs.readdirSync(dir);
  const exp = new Map();
  for (const f of files.filter((n) => /^components-\d+\.ts$/.test(n))) {
    for (const m of fs.readFileSync(`${dir}/${f}`, "utf8").matchAll(/^export const (\w+)/gm)) {
      if (exp.has(m[1])) errors.push(`registry-ui: ${m[1]} exported in both ${exp.get(m[1])} and ${f} (export * drops it → undefined)`);
      else exp.set(m[1], f);
    }
    if (!fs.readFileSync(`${dir}/components.ts`, "utf8").includes(`"./${f.replace(/\.ts$/, "")}"`)) errors.push(`registry-ui: ${f} not re-exported from components.ts`);
  }
  const slugsIdx = fs.readFileSync(`${dir}/slugs.ts`, "utf8");
  const seenSlug = new Map();
  for (const f of files.filter((n) => /^slugs-\d+\.ts$/.test(n))) {
    const t = fs.readFileSync(`${dir}/${f}`, "utf8");
    const name = (t.match(/export const (SLUG_UI_\d+)/) || [])[1];
    if (!name || !new RegExp(`\\[[^\\]]*\\b${name}\\b[^\\]]*\\]`).test(slugsIdx)) errors.push(`registry-ui: ${f} is not listed in SLUG_UI_PARTS (slugs.ts)`);
    for (const m of t.matchAll(/^\s*"([^"]+)":\s*UI\.(\w+)/gm)) {
      if (!exp.has(m[2])) errors.push(`registry-ui: ${f} maps "${m[1]}" to UI.${m[2]}, which is not exported`);
    }
  }
}

if (errors.length) { console.error("✖ tool routing guard:\n  " + errors.join("\n  ")); process.exit(1); }
console.log("✓ tool routing guard OK");
