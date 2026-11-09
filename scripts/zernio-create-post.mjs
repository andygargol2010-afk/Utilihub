#!/usr/bin/env node
/**
 * Create a Zernio post (draft by default — does not publish unless --now).
 *
 * Usage:
 *   node scripts/zernio-create-post.mjs --platform instagram --accountId acc_xxx --content "Hello"
 *   node scripts/zernio-create-post.mjs --platform twitter --accountId acc_xxx --content "Hi" --schedule 2026-11-01T15:00:00Z
 *   node scripts/zernio-create-post.mjs --platform instagram --accountId acc_xxx --content "Go" --now
 *   node scripts/zernio-create-post.mjs ... --media https://example.com/image.png
 *
 * Requires ZERNIO_API_KEY and at least one connected account (see zernio-list-accounts).
 */
import { createPost, listAccounts } from "./zernio-client.mjs";

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  return process.argv[i + 1] ?? fallback;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

const platform = arg("platform");
const accountId = arg("accountId") || arg("account-id");
const content = arg("content");
const scheduledFor = arg("schedule");
const mediaUrl = arg("media");
const publishNow = hasFlag("now");

if (!platform || !content) {
  console.error(
    "Required: --platform <twitter|instagram|...> --content \"...\" [--accountId id] [--schedule ISO] [--media url] [--now]",
  );
  process.exit(1);
}

let resolvedAccountId = accountId;
if (!resolvedAccountId) {
  const data = await listAccounts();
  const accounts = data.accounts ?? [];
  const match = accounts.filter(
    (a) => (a.platform || a.network) === platform,
  );
  if (match.length === 1) {
    resolvedAccountId = match[0].id ?? match[0].accountId ?? match[0]._id;
  } else if (match.length === 0) {
    console.error(
      `No connected account for platform "${platform}". Connect at https://zernio.com then run npm run zernio:accounts`,
    );
    process.exit(1);
  } else {
    console.error(
      `Multiple accounts for "${platform}". Pass --accountId explicitly:`,
    );
    for (const a of match) {
      console.error(`  ${a.id ?? a.accountId}  ${a.username ?? a.handle ?? ""}`);
    }
    process.exit(1);
  }
}

const opts = {
  content,
  platforms: [{ platform, accountId: resolvedAccountId }],
};
if (scheduledFor) opts.scheduledFor = scheduledFor;
if (publishNow) opts.publishNow = true;
if (mediaUrl) {
  opts.mediaItems = [{ type: "image", url: mediaUrl }];
}

try {
  const result = await createPost(opts);
  const post = result.post ?? result.data?.post ?? result;
  console.log(JSON.stringify(post, null, 2));
} catch (e) {
  console.error(e.message || e);
  if (e.data) console.error(JSON.stringify(e.data, null, 2));
  process.exitCode = 1;
}
