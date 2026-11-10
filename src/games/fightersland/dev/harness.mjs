/**
 * Fightersland standalone harness: bundles dev/harness.tsx with esbuild (alias `@` → src,
 * `@/lib/analytics` replaced by a stub that records events in `window.__FL_ANALYTICS__`) and
 * serves it on a static server, so the game runs without the site build.
 *
 *   node src/games/fightersland/dev/harness.mjs [--port 5178] [--out <dir>] [--build-only] [--prod]
 */
import { build } from "esbuild";
import { createServer } from "node:http";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../../../..");
const src = path.join(repo, "src");

const args = process.argv.slice(2);
function arg(name, fallback) {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
}
const port = Number(arg("--port", "5178"));
const out = path.resolve(arg("--out", path.join(tmpdir(), "fightersland-harness")));
const buildOnly = args.includes("--build-only");
const prod = args.includes("--prod");

const ANALYTICS_STUB = `
export function trackEvent(name, properties) {
  const w = window;
  (w.__FL_ANALYTICS__ = w.__FL_ANALYTICS__ || []).push({ name, properties });
}
`;

const analyticsStub = {
  name: "analytics-stub",
  setup(b) {
    b.onResolve({ filter: /^@\/lib\/analytics$/ }, () => ({ path: "analytics-stub", namespace: "fl-stub" }));
    b.onLoad({ filter: /.*/, namespace: "fl-stub" }, () => ({ contents: ANALYTICS_STUB, loader: "js" }));
  },
};

const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Fightersland harness</title>
<style>body{margin:0;background:#f8f9fc;color:#1a1d2e}</style>
</head>
<body>
<div id="root"></div>
<script src="./harness.js"></script>
</body>
</html>
`;

async function bundle() {
  mkdirSync(out, { recursive: true });
  const t0 = Date.now();
  await build({
    entryPoints: [path.join(here, "harness.tsx")],
    bundle: true,
    outfile: path.join(out, "harness.js"),
    format: "iife",
    platform: "browser",
    target: "es2020",
    jsx: "automatic",
    sourcemap: true,
    minify: prod,
    alias: { "@": src },
    plugins: [analyticsStub],
    define: { "process.env.NODE_ENV": JSON.stringify(prod ? "production" : "development") },
    logLevel: "warning",
  });
  writeFileSync(path.join(out, "index.html"), HTML);
  console.log(`[harness] bundled in ${Date.now() - t0} ms → ${out}`);
}

const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".map": "application/json" };

await bundle();
if (!buildOnly) {
  createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    let file = path.normalize(path.join(out, decodeURIComponent(url.pathname)));
    if (!file.startsWith(out)) {
      res.writeHead(403).end();
      return;
    }
    if (url.pathname === "/" || !existsSync(file)) file = path.join(out, "index.html");
    try {
      const body = readFileSync(file);
      res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream", "cache-control": "no-store" });
      res.end(body);
    } catch {
      res.writeHead(404).end();
    }
  }).listen(port, () => console.log(`[harness] http://localhost:${port}/?fldebug=1`));
}
