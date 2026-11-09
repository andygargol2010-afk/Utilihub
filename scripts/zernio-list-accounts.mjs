#!/usr/bin/env node
/**
 * Read-only: list connected Zernio social accounts.
 * Usage: ZERNIO_API_KEY=sk_... node scripts/zernio-list-accounts.mjs
 */
import { listAccounts } from "./zernio-client.mjs";

try {
  const data = await listAccounts();
  const accounts = data.accounts ?? data.data ?? data ?? [];
  if (!Array.isArray(accounts) || accounts.length === 0) {
    console.log("No accounts connected. Connect them at https://zernio.com");
    console.log(JSON.stringify(data, null, 2));
    process.exitCode = 0;
  } else {
    for (const a of accounts) {
      const id = a.id ?? a.accountId ?? a._id;
      const platform = a.platform ?? a.network ?? "?";
      const username = a.username ?? a.handle ?? a.name ?? "";
      console.log(`${platform}\t${id}\t${username}`);
    }
  }
} catch (e) {
  console.error(e.message || e);
  process.exitCode = 1;
}
