/**
 * Minimal Zernio REST client for UtiliHub agent/scripts.
 * Auth: Authorization Bearer from process.env.ZERNIO_API_KEY
 * Docs: https://zernio.com/agent-quickstart.md | https://zernio.com/llms.txt
 */

const BASE = "https://zernio.com/api/v1";

export function requireApiKey() {
  const key = process.env.ZERNIO_API_KEY?.trim();
  if (!key) {
    throw new Error(
      "Missing ZERNIO_API_KEY. Set it in .env (gitignored) or the environment. See .env.example and docs/zernio-integration.md",
    );
  }
  return key;
}

export async function zernioFetch(path, { method = "GET", body, apiKey } = {}) {
  const key = apiKey ?? requireApiKey();
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const msg =
      (data && (data.message || data.error || data.errorMessage)) ||
      text ||
      res.statusText;
    const err = new Error(`Zernio ${method} ${path} → ${res.status}: ${msg}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function listAccounts() {
  return zernioFetch("/accounts");
}

/**
 * Create a post (draft by default).
 * @param {object} opts
 * @param {string} opts.content
 * @param {{ platform: string, accountId: string }[]} opts.platforms
 * @param {string} [opts.scheduledFor] ISO datetime
 * @param {boolean} [opts.publishNow]
 * @param {object[]} [opts.mediaItems]
 */
export async function createPost(opts) {
  const body = {
    content: opts.content,
    platforms: opts.platforms,
  };
  if (opts.scheduledFor) body.scheduledFor = opts.scheduledFor;
  if (opts.publishNow === true) body.publishNow = true;
  if (opts.mediaItems?.length) body.mediaItems = opts.mediaItems;
  return zernioFetch("/posts", { method: "POST", body });
}
