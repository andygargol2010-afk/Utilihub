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
2. **ONE COMMIT PER RUN** when a change ships (code + catalog/state). **NO commit if nothing found** — summary only.
3. **NO DEPLOYS.** Never `create_deployment` / deploy hooks.
4. Never create/delete/pause other automations or change schedules.
5. Do not rewrite `registry.tsx` / `registry-entries-*.ts` wholesale; append-only if a wire is required for a fix.
6. Do not touch Adsterra / ads kill switch except if the bug **is** ads-related breakage.
7. Do not touch `HouseModeler3D.tsx` internals (propose in summary for house-modeler).
8. **PRE-PUSH SELF-REVIEW a–d** (re-fetch/size, no >40KB full write, no registry shrink/dupe slug, imports exist).
9. Files under `.agent/error-hunter*` win over the automation bootstrap.

---

## NO-BREAK GATE (immutable — added 2026-11-03, never edit / weaken / remove)
Lesson: the 2026-10-28 registry split kept the build green but silently sent 102 tools to `ConfiguredTool` → users saw «Operation not available.» for days. A green build is NOT proof that tools work.
1. **Routing is frozen.** Never reorder, remove or move below the `ConfiguredToolUi` fallback any branch of `pickComponent` in `src/components/general/registry.tsx`. Only add new slug wires in `registry-ui/slugs-NN.ts` / `components-NN.ts`.
2. **No refactors/splits/moves of existing code** (registry, catalogs, i18n, shared components) by automations. A split must be proposed in the summary for Andy; never done in a run.
3. **Guards are sacred.** `npm run validate:catalog` (includes `scripts/validate-tool-routing.mjs`) must pass before every push. Never edit, weaken, skip or delete `scripts/validate-*.mjs`, `scripts/*baseline*.json` or the `validate:*`/`build` scripts in `package.json` to make a check pass.
4. **Functional smoke before push** when touching `src/components/**`, `src/lib/**` or `src/routes/**`: open ≥3 affected tools on EN and ES, enter values, press the action button. Fail if the page shows «Operation not available», «Operación no disponible», «Tool not available», «no tiene una operación», HTTP 500 or a console error. If you cannot run this check, do not push — report.
5. **Scope lock.** Touch only files your task needs. Never delete, rename or empty a file you did not create in this run; >5 files outside your own area in one commit → stop and report.
6. **Out-of-scope breakage:** report it in the summary (file + URL + symptom); do not «fix» it by rewriting someone else's code.
7. **If your push breaks build or a guard:** `git revert` your own commit in the next step. Never force-push, never reset shared branches, never restore from an older commit than the previous one.
8. **Summary must list:** files changed, guard output (`✓ tool routing guard OK`), and the smoke URLs tested. Missing evidence = task BLOQUEADA, not HECHA.

## MODE (pick once per run)

At the start of every run, choose **exactly one** mode and write it into `error-hunter-state.md` as `mode: HUNT | PREVENT | SEO`.

**How to choose (~40% HUNT / ~40% PREVENT / ~20% SEO):**
- If `runs_total % 5 === 0` → **SEO** (unless HUNT override).
- Else alternate HUNT/PREVENT from `last_mode` (after HUNT → PREVENT; after PREVENT → HUNT).
- Override to **PREVENT** when any tracked split target is over soft limit.
- Override to **HUNT** when Vercel ERROR deploy, `validate:catalog` fails, or known 5xx/build break. HUNT overrides SEO.
- If every URL from the GSC 100 list is already in `seo_done` (or `seo_awaiting_new_list: true` in state): **do not invent URLs**. Treat the SEO slot as HUNT for code work, but the Spanish end-of-run summary **must** ask the user for a fresh GSC export (see SEO mode § Lista agotada).

Target long-run mix: **~40% HUNT / ~40% PREVENT / ~20% SEO**.

---

## HUNT mode (discovery + fix)

**Budget:** ≤20% regression smoke of fixed E###; ≥80% discovery + fixes.

**Mandatory first step:** `npm run validate:catalog`. On failure, fix slug/catalog errors this run.

**Discovery order:** production errors → risky recent commits → high-traffic routes.

**Definition of done:** reproduction, fix, proof, catalog E### update, single commit (or no commit if nothing).

---

## SEO mode (GSC 100 — ~20% of runs)

**Source of truth (full 100 URLs):**
- Index: `docs/seo-worst-100-gsc.md`
- Rows: `docs/seo-worst-100-gsc-part1.md` + `docs/seo-worst-100-gsc-part2.md` (50 + 50)

**Pick one URL per SEO run:**
1. Load `seo_done` from `.agent/error-hunter-state.md` (pathnames without domain).
2. Parse **all** table rows (`| http`) from **both** part1 and part2.
3. Exclude paths already in `seo_done`.
4. Sort remaining by **impressions DESC**, then position DESC.
5. Improve the **top remaining** URL only.

**Already done (seed):** `/es/herramientas/imc`, `/tools/coordinate-converter`, `/es/herramientas/calculadora-punto-rocio`, `/tools/temperature-converter`, `/tools/pool-volume-calculator`, `/es/herramientas/consumo-viaje`.

**Playbook:** live 200 + title/meta → SEO override EN/ES (title, description, about, steps, faq) → catalog keywords → surgical UI (formulas/examples/related) if component exists → `validate:catalog` if needed → one commit + append path to `seo_done`.

**Still NO deploys.**

**Definition of done (SEO):** one list URL improved (or blocked with evidence); path in `seo_done`; state `mode: SEO`, `seo_focus`.

### Lista agotada → pedir nueva al usuario

When **zero** remaining URLs (all paths from part1+part2 are in `seo_done`), on that SEO run (or the next SEO slot):

1. Set in `error-hunter-state.md`: `seo_awaiting_new_list: true` and `seo_list_exhausted_at: YYYY-MM-DD`.
2. **Do not** invent or scrape a new list.
3. In the **Spanish summary at end of run**, ask the user clearly for an updated list, for example:

   > Terminamos las 100 URLs del snapshot GSC. ¿Me pasás una **lista nueva exportada de Search Console** (páginas principales: URL, clics, impresiones, CTR, posición) con datos actualizados? Con eso actualizo `docs/seo-worst-100-gsc*.md` y sigo en el próximo ciclo SEO.

4. Until the user provides a new list, SEO slots become HUNT (still repeat the ask briefly in the summary if `seo_awaiting_new_list` is true — once per day max, not every run).
5. When the user pastes/updates the list: replace part1/part2 (+ index), clear `seo_awaiting_new_list`, reset or archive `seo_done` as appropriate, and resume SEO picks by impressions.

---

## PREVENT mode (stop the next breakage)

One primary prevention outcome per run. Prefer capacity splits under soft limits.

0. **Catalog gate:** `validate:catalog`; on fail → switch to HUNT.
1. **Capacity:** if smallest catalog-index / registry-ui / es-names / tool-seo-index / error-hunter-catalog chunk over soft limit → new empty part + one-line wire.
2. **Guards:** keep validate-catalog-size baseline honest.
3. **Structural debt** that causes recurring HUNT findings.
4. Do not invent product features under PREVENT.

**Soft limits:** catalog-index / components / slugs / es-names / tool-seo-index ~150 lines / 6 KB; error-hunter-catalog chunk ~100 lines; any API-written file approaching 40 KB.

## Large-file write rule

Never rewrite large files wholesale via the API; surgical inserts only. Restore from previous commit if a write fails.

<!-- end:error-hunter.md -->

## Split files (2026-10-28)
Add new entries in the smallest file of the matching folder; never rewrite wholesale:
- catalog-index part-NN, registry-ui components/slugs-NN, es-names names-NN, tool-seo-index part-NN, error-hunter-catalog E### range.
