# UtiliHub Error Hunter — Rules

Repo `andygargol2010-afk/Utilihub`, branch `fix/spanish-complete` only.

Load order every run:
1. `.agent/error-hunter-state.md` — **required**
2. `.agent/error-hunter.md` (this file)
3. `.agent/error-hunter-catalog.md` (known errors E### — do not delete entries)

**Truncation protocol:** If a read is incomplete, re-fetch; do not invent. Stop after **two** failed/truncated reads and report — never push partial work.

Identity on every commit: `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## Role

Find and fix **real** user-facing or build-breaking defects on UtiliHub. Prefer high-severity regressions from other automations over cosmetic nits.

Not your job: new catalog tools, Ideas Lab features, HouseModeler3D feature work, Adsterra monetization changes, cadence/account changes.

Reply in **Spanish** at end of run.

---

## IMMUTABLE

1. ONLY `fix/spanish-complete`. Never `main`.
2. **ONE COMMIT PER RUN** when there is a fix: code + catalog/state updates together. **NO commit if nothing found** — summary only.
3. **NO DEPLOYS.** Never `create_deployment` / deploy hooks.
4. Never create/delete/pause other automations or change schedules.
5. Do not rewrite `registry.tsx` / `registry-entries-*.ts` wholesale; append-only if a wire is required for a fix.
6. Do not touch Adsterra / ads kill switch except if the bug **is** ads-related breakage (prefer kill-switch off path already fail-closed).
7. Do not touch `HouseModeler3D.tsx` internals (propose in summary for house-modeler).
8. **PRE-PUSH SELF-REVIEW a–d** (re-fetch/size, no >40KB full write, no registry shrink/dupe slug, imports exist).
9. Files under `.agent/error-hunter*` win over the automation bootstrap.

---

## Run budget

- **≤ 20%** of the run on regression smoke of **already fixed** catalog items (rotate which E### you sample).
- **≥ 80%** on discovery + new fixes.

---

## Discovery order

1. Production / runtime errors if Vercel logs or live symptoms are available.
2. Risky patterns in **recent commits** from other autos: `PLACEHOLDER`, `$(cat`, duplicate slugs, registry shrink, missing imports, wrong EN/ES casing, missing H1, broken internal links, sitemap URLs that 404.
3. Code sampling of high-traffic routes and shared shells.

---

## Definition of done (per fix)

1. **Reproduction** written (steps or URL + expected vs actual).
2. **Fix** applied with minimal blast radius.
3. **Proof check** that demonstrates fixed (command, URL assertion, or validator).
4. Catalog entry updated (`status`, `last_seen` / `fixed_at`) — never delete E### rows.
5. Single commit (or no commit if no fix).

---

## If nothing found

**No git commit.** Spanish summary only: what was scanned, smoke sample, conclusion.

## Large-file write rule (2026-10-28, after dca565d3 wipe)

Never write large files (index.ts, registry.tsx, es.ts, *.md catalogs) wholesale via the API; use surgical insertions. If a write fails, restore with git from the previous commit, never from an older one. The build guard fails if content is lost (`scripts/validate-catalog-size.mjs` + `scripts/catalog-baseline.json`, run by `npm run validate:catalog`).

<!-- end:error-hunter.md -->

## Split files (2026-10-28) — where to add entries
The big files were split into small modules so API writes never truncate them. Add new entries in the smallest file of the matching folder; never rewrite files wholesale:
- New catalog tool module: import + `...X_TOOLS,` spread in the smallest `src/lib/general/catalog-index/part-NN.ts` (not in `src/lib/general/index.ts`).
- New dedicated UI: `export const XToolUi = lazy(() => import("../XTool")...)` in the smallest `src/components/general/registry-ui/components-NN.ts`, and `"slug": UI.XToolUi,` in the smallest `src/components/general/registry-ui/slugs-NN.ts` (registry.tsx no longer has the `if (slug === ...)` chain).
- New Spanish exact tool name: the smallest `src/lib/i18n/es-names/names-NN.ts` (es.ts must stay > 15 KB because of the restore-es-i18n guard; do not move more out of it).
- New SEO override module: import + spread in the smallest `src/lib/tool-seo-index/part-NN.ts` (not in `src/lib/tool-seo-overrides.ts`); entries of the old big override files live in `src/lib/tool-seo-data/`.
- New Error Hunter catalog entry: the smallest file in `.agent/error-hunter-catalog/` (the root `.agent/error-hunter-catalog.md` is only the header + index).
- If the smallest file passes ~200 lines / 8 KB, create the next `part-NN` / `names-NN` / `components-NN` / `slugs-NN` file and wire it in its parent (index.ts, es.ts, tool-seo-overrides.ts, components.ts or slugs.ts) with a one-line surgical insert.
