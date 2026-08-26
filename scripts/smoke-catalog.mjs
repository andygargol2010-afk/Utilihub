import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const src = path.join(root, "src");
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(p);
  }
}
walk(src);

const bad = [];
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  if (/from\s+["']lucide-react["']/.test(text)) bad.push(`${path.relative(root,file)}: unresolved lucide-react dependency`);
  if (/\b(?:JSON\.parse|parseFloat|parseInt)\s*\(/.test(text) && /catch\s*\{\s*\}/.test(text)) bad.push(`${path.relative(root,file)}: swallowed parse error`);
}
if (bad.length) {
  console.error(bad.join("\n"));
  process.exit(1);
}
console.log(`Smoke checks OK: ${files.length} source files inspected.`);
