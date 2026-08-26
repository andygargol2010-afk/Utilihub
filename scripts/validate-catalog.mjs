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

const libSources = sources.filter(({ file }) => file.includes(`${path.sep}lib${path.sep}`));

// Detect duplicate slugs only for tool-like object definitions. Category metadata
// also uses a `slug` property, so a global `slug:` regex would create false positives.
const slugMap = new Map();
for (const { file, text } of libSources) {
  const objectBlocks = text.split(/\{(?=\s*slug\s*:)/g);
  for (const block of objectBlocks.slice(1)) {
    const end = block.search(/\n\s*\},?\s*(?:\{|\]|$)/);
    const objectText = end >= 0 ? block.slice(0, end) : block;
    const slugMatch = objectText.match(/^\s*slug\s*:\s*["']([^"']+)["']/);
    if (!slugMatch) continue;
    const isToolLike = /(fields\s*:|calculate\s*:|operation\s*:|kind\s*:|component\s*:|keywords\s*:|faq\s*:|steps\s*:|about\s*:)/.test(objectText);
    if (!isToolLike) continue;
    const slug = slugMatch[1];
    const list = slugMap.get(slug) ?? [];
    list.push(file);
    slugMap.set(slug, list);
  }
}
for (const [slug, locations] of slugMap) {
  const unique = [...new Set(locations)];
  if (unique.length > 1) {
    errors.push(`slug duplicado en definiciones de herramientas: ${slug} (${unique.map((p) => path.relative(process.cwd(), p)).join(", ")})`);
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

// Support both catalog families used by UtiliHub: general tools with a name and
// financial definitions that expose fields + calculate instead of name.
for (const { file, text } of libSources) {
  if (!text.includes("slug:")) continue;
  const hasSlug = /slug\s*:\s*["'][^"']+["']/.test(text);
  if (!hasSlug) continue;
  const hasToolContract = /name\s*:\s*["'][^"']+["']/.test(text)
    || (/fields\s*:/.test(text) && /calculate\s*:/.test(text));
  if (!hasToolContract) {
    // Files containing only category metadata are intentionally ignored.
    const hasCategoryMetadata = /intro\s*:/.test(text) && /description\s*:/.test(text);
    if (!hasCategoryMetadata) {
      warnings.push(`archivo con slugs sin contrato de herramienta reconocible: ${path.relative(process.cwd(), file)}`);
    }
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
