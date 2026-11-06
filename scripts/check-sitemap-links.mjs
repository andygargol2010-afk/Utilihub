#!/usr/bin/env node
/**
 * Post-build guard: every <loc> AND every xhtml:link href in sitemap.xml must return 200.
 *
 *   node scripts/check-sitemap-links.mjs                 # starts `vite preview` on a free port, checks, stops it
 *   node scripts/check-sitemap-links.mjs http://host:p   # check an already running server (or production)
 *
 * Locs/alternates use the production origin, so they are rewritten to the checked base.
 * vite preview does not apply vercel.json redirects: a sitemap URL must point at the final URL, never at a redirect.
 * Runs as `postbuild`. Set SKIP_SITEMAP_LINK_CHECK=1 to skip (e.g. when no port can be opened).
 */
import { spawn } from "node:child_process";

if (process.env.SKIP_SITEMAP_LINK_CHECK === "1") {
  console.log("check-sitemap-links: skipped (SKIP_SITEMAP_LINK_CHECK=1)");
  process.exit(0);
}

const argBase = process.argv.slice(2).find((a) => !a.startsWith("--"));
const port = Number(process.env.SITEMAP_CHECK_PORT || 4179);
let base = (argBase || `http://localhost:${port}`).replace(/\/$/, "");
let preview = null;

async function waitFor(url, ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try {
      const r = await fetch(url);
      if (r.status < 500) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

function stop() {
  if (preview && !preview.killed) preview.kill("SIGTERM");
}

async function main() {
  if (!argBase) {
    preview = spawn("npx", ["vite", "preview", "--port", String(port), "--strictPort"], { stdio: "ignore" });
    if (!(await waitFor(`${base}/`, 60000))) throw new Error(`vite preview did not start on ${base}`);
  }
  const res = await fetch(`${base}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  const alts = [...xml.matchAll(/<xhtml:link[^>]*href="([^"]+)"/g)].map((m) => m[1].trim());
  const toPath = (u) => u.replace(/^https?:\/\/[^/]+/, "") || "/";
  const paths = [...new Set([...locs, ...alts].map(toPath))];
  console.log(`check-sitemap-links: ${locs.length} <loc>, ${alts.length} alternates, ${paths.length} unique paths`);

  const bad = [];
  let i = 0;
  async function worker() {
    while (i < paths.length) {
      const p = paths[i++];
      try {
        const r = await fetch(base + p, { redirect: "manual" });
        if (r.status !== 200) bad.push(`${r.status} ${p}${r.headers.get("location") ? ` → ${r.headers.get("location")}` : ""}`);
        await r.arrayBuffer();
      } catch (err) {
        bad.push(`ERR ${p} ${err}`);
      }
    }
  }
  await Promise.all(Array.from({ length: 12 }, () => worker()));

  if (bad.length) {
    console.error(`check-sitemap-links: FAIL (${bad.length} URLs not 200)`);
    for (const b of bad.slice(0, 60)) console.error(`  - ${b}`);
    process.exitCode = 1;
  } else {
    console.log(`check-sitemap-links PASS: ${paths.length}/${paths.length} return 200`);
  }
}

main()
  .catch((e) => {
    console.error(`check-sitemap-links: ${e.message || e}`);
    process.exitCode = 1;
  })
  .finally(stop);
