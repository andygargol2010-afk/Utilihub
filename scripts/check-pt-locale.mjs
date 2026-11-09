#!/usr/bin/env node
/**
 * PT locale guard: every /pt URL in sitemap.xml must render a <header> with a <nav>,
 * every internal <a href> on those pages must return 200,
 * and must not contain common English UI phrases in its visible SSR text,
 * <title>, meta description, og:title/og:description or img alt.
 *
 *   node scripts/check-pt-locale.mjs                 # starts `vite preview`, checks, stops it
 *   node scripts/check-pt-locale.mjs http://host:p   # check an already running server
 *
 *   node scripts/check-locale.mjs --locale=<code>    # same check for any /<code> SEO locale (default pt)
 *
 * Word list is intentionally conservative (phrases that are never valid pt-BR).
 * Brand / technical exceptions (UtiliHub, PNG, 3D, CSV, PDF, WebGL...) are not in the list.
 */
import { spawn } from "node:child_process";

const ENGLISH = [
  "See all", "View all", "Play now", "Play a friend", "Learn more", "Get started", "Try it",
  "Search tools", "Advanced studios", "Advanced tools", "browser games", "no signup", "No signup",
  "Free online", "Open tool", "Open game", "Back to", "Loading", "Classic", "Board", "Strategy", "Reset", "Restart", "New game", "Score", "Settings", "Download",
  "Share", "Copy link", "Home", "Games", "Simulators", "Tools", "Privacy", "Contact", "About",
  "How it works", "What is", "Frequently asked", "Your ", " the ", " and ", " with ", " your ",
  " for ", " you ", " from ", " this ",
];
/** Proper names / API names that are correct inside pt-BR text ("Puzzle" and "Arcade" are also valid pt-BR). */
const EXCEPTIONS = ["Web Share", "Google Ad Settings", "View UtiliHub in English", "Ver UtiliHub en español"];
const LOCALE = (process.argv.find((a) => a.startsWith("--locale="))?.slice(9) || "pt").replace(/[^a-z-]/gi, "");
const PT_PATH = new RegExp(`^\\/${LOCALE}(\\/|$)`);

const argBase = process.argv.slice(2).find((a) => !a.startsWith("--"));
const port = Number(process.env.PT_LOCALE_CHECK_PORT || 4181);
const base = (argBase || `http://localhost:${port}`).replace(/\/$/, "");
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

function decode(s) {
  return s
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;|&#160;/g, " ");
}

function visibleText(html) {
  const head = html.match(/<head[\s\S]*?<\/head>/i)?.[0] ?? "";
  const meta = [
    head.match(/<title>([^<]*)<\/title>/i)?.[1] ?? "",
    ...[...head.matchAll(/<meta[^>]+(?:name="description"|property="og:(?:title|description)")[^>]*content="([^"]*)"/gi)].map((m) => m[1]),
    ...[...head.matchAll(/<meta[^>]+content="([^"]*)"[^>]*(?:name="description"|property="og:(?:title|description)")/gi)].map((m) => m[1]),
  ];
  const body = (html.match(/<body[\s\S]*<\/body>/i)?.[0] ?? html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ");
  const alts = [...body.matchAll(/\salt="([^"]+)"/gi)].map((m) => m[1]);
  const aria = [...body.matchAll(/\saria-label="([^"]+)"/gi)].map((m) => m[1]);
  const text = body.replace(/<[^>]+>/g, "\n");
  return decode([...meta, ...alts, ...aria, text].join("\n")).replace(/[ \t]+/g, " ");
}

function findEnglish(text) {
  const hits = new Set();
  for (const line of text.split("\n")) {
    const l = ` ${EXCEPTIONS.reduce((acc, e) => acc.split(e).join(" "), line.trim())} `;
    if (l.trim().length < 3) continue;
    for (const w of ENGLISH) {
      const re = new RegExp(`(^|[^A-Za-zÀ-ÿ])${w.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^A-Za-zÀ-ÿ]|$)`, w === w.trim() ? "" : "i");
      if (re.test(l)) hits.add(`${w.trim()} ← "${line.trim().slice(0, 90)}"`);
    }
  }
  return [...hits];
}

async function main() {
  if (!argBase) {
    preview = spawn("npx", ["vite", "preview", "--port", String(port), "--strictPort"], { stdio: "ignore" });
    if (!(await waitFor(`${base}/`, 60000))) throw new Error(`vite preview did not start on ${base}`);
  }
  const xml = await (await fetch(`${base}/sitemap.xml`)).text();
  const toPath = (u) => u.replace(/^https?:\/\/[^/]+/, "") || "/";
  const paths = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => toPath(m[1].trim())))].filter((p) =>
    PT_PATH.test(p),
  );
  if (!paths.length) throw new Error(`no /${LOCALE} URLs in sitemap.xml`);
  let failed = 0;
  let total = 0;
  const linkedFrom = new Map();
  for (const p of paths) {
    const r = await fetch(base + p);
    const html = await r.text();
    const problems = [];
    if (r.status !== 200) problems.push(`status ${r.status}`);
    const header = html.match(/<header[\s\S]*?<\/header>/i)?.[0] ?? "";
    if (!/<nav[\s>]/i.test(header)) problems.push("header without <nav>");
    for (const m of html.matchAll(/<a\s[^>]*href="(\/[^"#?]*)/gi)) {
      if (!linkedFrom.has(m[1])) linkedFrom.set(m[1], p);
    }
    const hits = findEnglish(visibleText(html));
    total += hits.length;
    if (hits.length) problems.push(...hits.map((h) => `english: ${h}`));
    if (problems.length) {
      failed++;
      console.log(`FAIL ${p}\n  - ${problems.slice(0, 25).join("\n  - ")}${problems.length > 25 ? `\n  … +${problems.length - 25}` : ""}`);
    }
  }
  let broken = 0;
  for (const [href, from] of linkedFrom) {
    const r = await fetch(base + href, { redirect: "manual" });
    if (r.status !== 200) {
      broken++;
      console.log(`BROKEN LINK ${r.status} ${href} (linked from ${from})`);
    }
  }
  if (broken) failed++;
  console.log(`check-locale[${LOCALE}]: internal links ${linkedFrom.size - broken}/${linkedFrom.size} return 200`);
  console.log(`check-locale[${LOCALE}]: ${paths.length} /${LOCALE} URLs, ${paths.length - failed} OK, ${failed} FAIL, ${total} english hits`);
  if (failed) process.exitCode = 1;
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => {
    if (preview && !preview.killed) preview.kill("SIGTERM");
  });
