import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd(), "src");
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(full);
  }
}
walk(root);

const sources = files.map((file) => ({ file, text: fs.readFileSync(file, "utf8") }));
const errors = [];
const warnings = [];

// Detect duplicate tool slugs in source definitions. References in routes are ignored.
const slugMap = new Map();
for (const { file, text } of sources.filter(({ file }) => file.includes(`${path.sep}lib${path.sep}`))) {
  for (const match of text.matchAll(/slug\s*:\s*["']([^"']+)["']/g)) {
    const slug = match[1];
    const list = slugMap.get(slug) ?? [];
    list.push(file);
    slugMap.set(slug, list);
  }
}
for (const [slug, locations] of slugMap) {
  const unique = [...new Set(locations)];
  if (unique.length > 1) {
    warnings.push(`slug duplicado en definiciones: ${slug} (${unique.map((p) => path.relative(process.cwd(), p)).join(", ")})`);
  }
}

// Every configured operation must have a corresponding implementation marker.
const configuredOps = new Set();
for (const { text } of sources) {
  for (const match of text.matchAll(/operation\s*:\s*["']([^"']+)["']/g)) configuredOps.add(match[1]);
}
const implementedOps = new Set();
for (const { text } of sources) {
  for (const match of text.matchAll(/case\s*["']([^"']+)["']\s*:/g)) implementedOps.add(match[1]);
  for (const match of text.matchAll(/["']([^"']+)["']\s*:\s*\(/g)) implementedOps.add(match[1]);
}
for (const op of configuredOps) {
  if (!implementedOps.has(op)) errors.push(`operation sin implementación detectada: ${op}`);
}

// Basic catalog contract checks for tool-like objects.
for (const { file, text } of sources.filter(({ file }) => file.includes(`${path.sep}lib${path.sep}`))) {
  if (!text.includes("slug:")) continue;
  if (/slug\s*:\s*["'][^"']+["']/.test(text) && !/name\s*:\s*["'][^"']+["']/.test(text)) {
    errors.push(`archivo de catálogo sin nombres detectables: ${path.relative(process.cwd(), file)}`);
  }
}

if (warnings.length) {
  console.warn(`Catalog validator: ${warnings.length} advertencia(s).`);
  for (const warning of warnings) console.warn(`- ${warning}`);
}
if (errors.length) {
  console.error(`Catalog validator: ${errors.length} error(es).`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Catalog validator OK: ${files.length} archivos inspeccionados, ${configuredOps.size} operations configuradas.`);
