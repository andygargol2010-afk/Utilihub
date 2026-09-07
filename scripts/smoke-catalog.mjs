import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const src = path.join(root, "src");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(filePath);
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(filePath);
  }
}
walk(src);

const bad = [];
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  if (/from\s+["']lucide-react["']/.test(text) && !dependencies["lucide-react"]) {
    bad.push(`${path.relative(root, file)}: lucide-react is imported but not declared in package.json`);
  }
  if (/\b(?:JSON\.parse|parseFloat|parseInt)\s*\(/.test(text) && /catch\s*\{\s*\}/.test(text)) bad.push(`${path.relative(root,file)}: swallowed parse error`);
}
if (bad.length) {
  console.error(bad.join("\n"));
  process.exit(1);
}
console.log(`Smoke checks OK: ${files.length} source files inspected.`);
