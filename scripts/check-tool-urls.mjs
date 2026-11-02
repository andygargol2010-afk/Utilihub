#!/usr/bin/env node
// Crawl every EN and ES tool URL of the catalog against a running build and fail on non-200 or missing <h1>.
// Usage: npm run build && npx vite preview --port 4173 & node scripts/check-tool-urls.mjs [baseUrl] [--extra=/a,/b]
// Add new checks at the end of this file; never rewrite files wholesale.
import { createJiti } from "jiti";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src");
const args = process.argv.slice(2);
const base = (args.find((a) => !a.startsWith("--")) ?? "http://localhost:4173").replace(/\/$/, "");
const extra = (args.find((a) => a.startsWith("--extra=")) ?? "--extra=").slice(8).split(",").filter(Boolean);
const concurrency = Number(process.env.CHECK_CONCURRENCY ?? 12);

const jiti = createJiti(import.meta.url, { alias: { "@": root }, jsx: true });
const origWarn = console.warn;
console.warn = () => {};
const { ALL_TOOLS } = await jiti.import(path.join(root, "lib/all-tools.ts"));
const { englishToolPath, spanishToolPath } = await jiti.import(path.join(root, "lib/route-slugs.ts"));
console.warn = origWarn;

const urls = new Set(extra);
for (const tool of ALL_TOOLS) {
  urls.add(englishToolPath(tool));
  urls.add(spanishToolPath(tool));
}

const list = [...urls];
const failures = [];
let next = 0;
async function worker() {
  while (next < list.length) {
    const url = list[next++];
    try {
      const res = await fetch(base + url, { redirect: "manual" });
      const html = await res.text();
      const hasH1 = /<h1[\s>]/i.test(html);
      if (res.status !== 200 || !hasH1) failures.push(`${res.status} ${hasH1 ? "" : "(sin h1) "}${url}`);
    } catch (error) {
      failures.push(`ERR ${url} ${error.message}`);
    }
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));

if (failures.length) {
  console.error(`check-tool-urls FAIL: ${failures.length} de ${list.length} URLs`);
  for (const line of failures.sort()) console.error(`- ${line}`);
  process.exit(1);
}
console.log(`check-tool-urls PASS: ${list.length} URLs (EN+ES) con 200 y <h1>`);
