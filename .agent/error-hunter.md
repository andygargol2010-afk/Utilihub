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

Find and fix **real** user-facing or build-breaking defects on UtiliHub — **and prevent** the next ones — and, on ~20% of runs, improve one weak Search Console page (SEO mode). Prefer high-severity regressions from other automations over cosmetic nits.

Not your job: new catalog tools (except wiring required for an SEO page already in catalog), Ideas Lab features, HouseModeler3D feature work, Adsterra monetization changes, cadence/account changes.

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

## MODE (pick once per run)

At the start of every run, choose **exactly one** mode and write it into `error-hunter-state.md` as `mode: HUNT | PREVENT | SEO`.

**How to choose (~40% HUNT / ~40% PREVENT / ~20% SEO):**
- Rotate from `last_mode` in state: after `HUNT` → prefer `PREVENT`; after `PREVENT` → prefer `HUNT`; when `runs_total % 5 === 0` (every 5th run ≈20%), prefer **SEO** instead.
- Simpler coin if `runs_total` is present: if `runs_total % 5 === 0` → **SEO** (unless HUNT override); else alternate HUNT/PREVENT from `last_mode`.
- Override to **PREVENT** when any tracked split target is over soft limit (see PREVENT playbook), even if the coin would say HUNT or SEO.
- Override to **HUNT** when Vercel shows a current ERROR deploy, `validate:catalog` fails, or a user-facing 5xx/build break is known this run. HUNT overrides SEO.
- If the SEO backlog is empty (all rows `done`), treat SEO slot as HUNT.

Target long-run mix: **~40% HUNT / ~40% PREVENT / ~20% SEO**.

---

## HUNT mode (discovery + fix)

**Budget**
- **≤ 20%** of the run on regression smoke of **already fixed** catalog items (rotate which E### you sample).
- **≥ 80%** on discovery + new fixes.

**Mandatory first step (every HUNT run)**
1. Run **`npm run validate:catalog`** (or `node scripts/validate-catalog.mjs && node scripts/validate-catalog-size.mjs`) on a fresh checkout of `fix/spanish-complete`.
2. If it exits non-zero: treat each error (especially **slug duplicado en makeTool/wrappers**) as a **build-breaking defect**. Fix in this run, add/update E### in the error-hunter catalog, commit once. Do **not** skip to capacity or cosmetic work while catalog validation fails.
3. If it passes: note “validate:catalog OK” in the Spanish summary and continue discovery below.

**Discovery order (after catalog OK)**
1. Production / runtime errors if Vercel logs or live symptoms are available (override to HUNT when latest production is ERROR).
2. Risky patterns in **recent commits** from other autos: `PLACEHOLDER`, `$(cat`, duplicate slugs, registry shrink, missing imports, wrong EN/ES casing, missing H1, broken internal links, sitemap URLs that 404.
3. Code sampling of high-traffic routes and shared shells.

**Definition of done (per fix)**
1. **Reproduction** written (steps or URL + expected vs actual).
2. **Fix** applied with minimal blast radius.
3. **Proof check** that demonstrates fixed (command, URL assertion, or validator).
4. Catalog entry updated (`status`, `last_seen` / `fixed_at`) — never delete E### rows.
5. Single commit (or no commit if no fix).

**If nothing found:** **No git commit.** Spanish summary only: mode, what was scanned, smoke sample, conclusion.

---

## SEO mode (GSC backlog — ~20% of runs)

Improve **one** page from the priority backlog below per run. Goal: push worst Search Console URLs (avg position ~76–100) toward top 50. Same branch and one-commit rules as HUNT/PREVENT. **Still NO deploys.**

### Priority backlog (work top unfinished row)

| Priority | URL (prod) | Slug / notes | Status |
|----------|------------|--------------|--------|
| 1 | `/es/herramientas/calculadora-imc` | `calculadora-imc` | **done** (2026-10-31) |
| 2 | `/tools/coordinate-converter` | `conversor-coordenadas` | **done** (2026-10-31) |
| 3 | `/es/herramientas/calculadora-punto-rocio` | `calculadora-punto-rocio` | **done** (2026-10-31) |
| 4 | `/tools/temperature-converter` | `conversor-temperatura` | **done** (2026-10-31) |
| 5 | `/tools/pool-volume-calculator` | `calculadora-piscina` | **done** (2026-10-31) |
| 6 | `/es/herramientas/consumo-viaje` | `consumo-viaje` | **done** (2026-10-31) |
| 7 | `/tools/overtime-pay-calculator` | overtime pay | **todo** |
| 8 | `/es/finanzas/calculadora-wacc` or `/es/herramientas/…` | WACC | **todo** — confirm live slug |
| 9 | Next weak GSC URL from Search Console (pos ~76–100, high impressions) | — | **todo** when 7–8 done |

When finishing a row: set Status to **done (YYYY-MM-DD)** in this table in the same commit, and append the slug to `seo_done` in `error-hunter-state.md`.

### SEO playbook (one page per run)

1. Confirm live URL (200) and current `<title>` / meta description (curl or open_page).
2. Locate catalog entry (`src/lib/general/*`) and SEO override (`src/lib/tool-seo-overrides-*.ts` or add module + wire smallest `tool-seo-index/part-NN.ts`).
3. Strengthen **EN + ES**: `metaTitle`, `metaDescription`, `about`, `steps`, `faq` (query-shaped FAQs: formula, free?, common example).
4. Catalog: keywords + title aligned with the head query; Spanish name in es-names if missing.
5. UI (if dedicated component exists): formula strip, examples table, related internal links — keep changes surgical; no wholesale rewrites of large files.
6. Do **not** invent new tools. Prefer fixing the URL Google already shows.
7. `npm run validate:catalog` before commit if catalog/slug touched.
8. Single commit: code + this table status + state (`mode: SEO`, `seo_focus: <slug>`).

**Definition of done (SEO)**
1. One backlog URL improved (or explicit “blocked: slug not found” with evidence).
2. Table row marked **done** with date when shipped to the branch.
3. State updated: `mode: SEO`, `seo_focus`, `seo_done` list.

## PREVENT mode (stop the next breakage)

Goal: reduce the chance that tools-builder / ideas-lab / other autos create the same class of failures (truncation, oversized writes, missing part files, registry/i18n drift).

**Do one primary prevention outcome per run** (minimal blast radius). Prefer structural capacity over speculative refactors.

**PREVENT playbook (pick the highest-priority item that still needs work)**

0. **Catalog integrity gate (cheap, every PREVENT run)**
   - Run **`npm run validate:catalog`** once at the start (same as HUNT mandatory step).
   - If it fails: **switch this run to HUNT**, fix the catalog errors, update E###, single commit. Capacity splits wait until the tree builds.
   - If it passes: record “validate:catalog OK” in state and continue with capacity work below.
   - Optional extra when catalog OK: quick scan of recent tool modules for two `makeTool("same-slug")` (class E018 / E032) — fix immediately if found.

1. **Split / pre-create capacity for files other autos expand every run**
   - Catalog tools: if the smallest `src/lib/general/catalog-index/part-NN.ts` is **> ~150 lines or > ~6 KB**, create the next empty `part-NN` with the standard header + empty export array, and add a one-line `...PART_NN_TOOLS,` spread + import in `src/lib/general/index.ts` (surgical insert only).
   - Registry UI: same for `src/components/general/registry-ui/components-NN.ts` and `slugs-NN.ts` when smallest exceeds soft limit; wire parent with one-line insert.
   - i18n names: same for `src/lib/i18n/es-names/names-NN.ts` (never shrink `es.ts` below guard).
   - SEO overrides: same for `src/lib/tool-seo-index/part-NN.ts`.
   - Error Hunter catalog: if the smallest `.agent/error-hunter-catalog/E###-E###.md` is **> ~100 lines**, create the next empty range file and list it in `error-hunter-catalog.md`.
   - Agent state/ops files that other autos rewrite: if any `.agent/*-state.md` or large ops file is approaching **> 20 KB**, propose or apply a split of historical notes into `.agent/logs/` or a dated archive — only if safe and reversible.

2. **Guards and baselines**
   - Keep `scripts/validate-catalog-size.mjs` + `scripts/catalog-baseline.json` truthful after intentional growth (update baseline only when a real approved expansion happened, never to hide shrinkage).
   - If a recurring E### is “file wiped / truncated by API write”, add or tighten a check that fails the push when content is lost.

3. **Structural debt that causes recurring HUNT findings**
   - Category routing traps (e.g. `finanzas` on GENERAL_TOOLS → 404): scan for the pattern and fix or document a hard rule for tools-builder.
   - Missing lazy UI / slug map entries for tools that already exist in catalog.

4. **Do not** invent product features, new catalog tools, or HouseModeler work under PREVENT.

**Definition of done (PREVENT)**
1. One concrete capacity or guard change landed (or explicit “nothing over soft limits” with measurements).
2. State updated: `mode: PREVENT`, what was measured, what was created/split.
3. Single commit when a change ships; **no commit** if only measurement and everything is under limits.
4. PRE-PUSH SELF-REVIEW a–d still required when committing.

**Soft limits (triggers for PREVENT override)**
| Target | Soft limit | Action |
|--------|------------|--------|
| catalog-index part-NN | ~150 lines / 6 KB | new part + wire |
| registry-ui components/slugs-NN | ~150 lines / 6 KB | new file + wire |
| es-names names-NN | ~150 lines / 6 KB | new file + wire |
| tool-seo-index part-NN | ~150 lines / 6 KB | new file + wire |
| error-hunter-catalog chunk | ~100 lines | new E### range file |
| any single API-written source file | approaching 40 KB | split or refuse full rewrite |

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
