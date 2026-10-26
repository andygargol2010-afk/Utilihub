#!/usr/bin/env node
/**
 * Crawl sitemap.xml and report any URL that does not return HTTP 200.
 *
 *   node scripts/check-sitemap-urls.mjs
 *   node scripts/check-sitemap-urls.mjs https://utilihub-xxx.vercel.app
 *
 * Only lists canonical <loc> entries (not xhtml:link alternates).
 */

const base = (process.argv[2] || "https://www.utilihub.net").replace(/\/$/, "");
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
  console.log(`Found ${urls.length} unique <loc> URLs`);

  const bad = [];
  let i = 0;

  async function worker() {
    while (i < urls.length) {
      const idx = i++;
      const url = urls[idx];
      try {
        const r = await fetch(url, {
          method: "GET",
          redirect: "manual",
          headers: { "user-agent": "UtiliHub-sitemap-check/1.0" },
        });
        const status = r.status;
        if (status !== 200) {
          const location = r.headers.get("location") || "";
          bad.push({ url, status, location });
          console.log(`  ${status} ${url}${location ? ` → ${location}` : ""}`);
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
