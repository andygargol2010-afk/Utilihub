#!/usr/bin/env node
/**
 * Crawl sitemap.xml and report any URL that does not return HTTP 200.
 *
 *   node scripts/check-sitemap-urls.mjs
 *   node scripts/check-sitemap-urls.mjs https://utilihub-xxx.vercel.app
 *
 * Only lists canonical <loc> entries (not xhtml:link alternates).
 * Also checks that each 200 page declares <link rel="canonical"> pointing at itself.
 *
 * Local build (vite preview): locs use the production origin, so they are rewritten:
 *   node scripts/check-sitemap-urls.mjs http://localhost:4173 --rewrite
 */

const PROD = "https://www.utilihub.net";
const args = process.argv.slice(2);
const rewrite = args.includes("--rewrite");
const base = (args.find((a) => !a.startsWith("--")) || PROD).replace(/\/$/, "");
const sitemapUrl = `${base}/sitemap.xml`;

const concurrency = 12;

async function main() {
  console.log(`Fetching ${sitemapUrl}`);
  const res = await fetch(sitemapUrl, {
    headers: { "user-agent": "UtiliHub-sitemap-check/1.0" },
  });
  if (!res.ok) {
    console.error(`Failed to fetch sitemap: ${res.status}`);
    process.exit(1);
  }
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  // Prefer locs that match this base (preview vs prod)
  const urls = [...new Set(locs)].filter((u) => u.startsWith(base) || u.includes("utilihub"));
  const fetchUrl = (u) => (rewrite ? u.replace(/^https?:\/\/[^/]+/, base) : u);
  console.log(`Found ${urls.length} unique <loc> URLs`);

  const bad = [];
  let i = 0;

  async function worker() {
    while (i < urls.length) {
      const idx = i++;
      const url = urls[idx];
      try {
        const r = await fetch(fetchUrl(url), {
          method: "GET",
          redirect: "manual",
          headers: { "user-agent": "UtiliHub-sitemap-check/1.0" },
        });
        const status = r.status;
        if (status !== 200) {
          const location = r.headers.get("location") || "";
          bad.push({ url, status, location });
          console.log(`  ${status} ${url}${location ? ` → ${location}` : ""}`);
        } else {
          const html = await r.text();
          const tags = html.match(/<link[^>]+rel="canonical"[^>]*>/gi) || [];
          const tag = tags[0] || "";
          if (tags.length > 1) {
            bad.push({ url, status: "multi-canonical", location: String(tags.length) });
            console.log(`  MULTI-CANONICAL ${url} (${tags.length})`);
          }
          const canonical = tag.match(/href="([^"]+)"/i)?.[1] || "";
          if (canonical.replace(/\/$/, "") !== url.replace(/\/$/, "")) {
            bad.push({ url, status: "canonical", location: canonical || "(none)" });
            console.log(`  CANONICAL ${url} → ${canonical || "(none)"}`);
          }
        }
      } catch (err) {
        bad.push({ url, status: 0, location: String(err) });
        console.log(`  ERR ${url} ${err}`);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  console.log("\n--- Summary ---");
  console.log(`Checked: ${urls.length}`);
  console.log(`Non-200: ${bad.length}`);
  const byStatus = {};
  for (const b of bad) {
    byStatus[b.status] = (byStatus[b.status] || 0) + 1;
  }
  console.log("By status:", byStatus);
  if (bad.length) {
    process.exitCode = 2;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
