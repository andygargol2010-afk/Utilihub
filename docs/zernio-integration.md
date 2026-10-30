# Zernio integration (UtiliHub)

Zernio is the multi-platform social API used to schedule and publish UtiliHub content (Instagram, X, LinkedIn, Threads, TikTok, etc.).

- Base URL: `https://zernio.com/api/v1`
- Auth: `Authorization: Bearer $ZERNIO_API_KEY`
- Quickstart: https://zernio.com/agent-quickstart.md
- Full surface: https://zernio.com/llms.txt

## Setup

1. Create an API key in the [Zernio dashboard](https://zernio.com).
2. Copy `.env.example` → `.env` and set:

```bash
ZERNIO_API_KEY=sk_...
```

`.env` is gitignored. **Never commit the key.**

3. Connect social accounts in the dashboard (required before any post can go live):
   https://zernio.com

4. Optional SDK (scripts work with plain `fetch` without installing):

```bash
npm install @zernio/node
```

## Scripts

```bash
# List connected accounts + accountIds (read-only)
npm run zernio:accounts

# Create a draft (default — does not publish)
npm run zernio:post -- --platform instagram --content "UtiliHub: herramientas gratis" --media https://www.utilihub.net/og-image.png

# Schedule
npm run zernio:post -- --platform twitter --accountId acc_xxx --content "..." --schedule 2026-11-01T15:00:00Z

# Publish immediately (explicit)
npm run zernio:post -- --platform instagram --content "..." --media https://... --now
```

Helpers live under `scripts/zernio-*.mjs`.

## Agent / MCP

Claude and Grok can use the **Zernio MCP connector** (already available when connected in the client). Prefer MCP for interactive publish flows; use these scripts for CI or local automation.

Typical agent flow:

1. `accounts_list` → get `accountId` for Instagram / X
2. `validate_post` (optional dry-run)
3. `posts_create` with `scheduledFor` or `posts_publish_now`

## Security

- Store `ZERNIO_API_KEY` only in env / secret store (Vercel, GitHub Actions secrets).
- If a key was pasted into chat or a ticket, **rotate it** in the Zernio dashboard.
- Do not put the key in client-side Vite code; posting is server/agent-side only.
