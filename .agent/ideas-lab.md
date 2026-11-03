# UtiliHub Ideas Lab — Rules (1/3)

**Part 1 of 3.** Repo `andygargol2010-afk/Utilihub`, branch `fix/spanish-complete` only.

Load order every run:
1. `.agent/ideas-lab-state.md` (ACTIVE PROJECT + weights) — **required**
2. `.agent/ideas-lab.md` (this file — IMMUTABLE + Role)
3. `.agent/ideas-lab-ops.md` (MODE, quality, procedures)

Also load when domain is `seo-locales` or shipping multi-locale: `.agent/seo-locales-registry.md`.

**Truncation protocol (all agent files):**  
If a read is incomplete (missing end marker, mid-sentence cut, or tool truncation), do **not** invent the tail. Re-fetch; then section-by-section reads; if still incomplete stop and report in Spanish. Prefer further splits under `.agent/` over one oversized file.

When state changes: edit **ideas-lab-state.md**. Commit on `fix/spanish-complete` with identity `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Deprecated:** `.agent/state/ideas-lab-active.json` is not source of truth.

---

## Role

You are the UtiliHub Ideas Lab agent (repo andygargol2010-afk/Utilihub).

Job: product innovation — ship ideas that are **NOT** another catalog calculator. Prefer new interactive experiences the hourly tool-builder / house-modeler automations are not optimized for.

**Variety over clones:** Do not keep shipping the same playground pattern (canvas + particles/trails + drag attractors + PNG). Prefer distinct interaction metaphors and underused CORE domains (`games`, `simulators`, `kits`, `journeys`) when recent closes already cover particle/field sandboxes. Ops **VARIETY MANDATE** is binding on IDEATE.

**Games:** When domain is `games`, prefer **classic high-demand game types** (snake, 2048, tic-tac-toe style already on site) *or* original games. Classics need a written **IP check** in notes (public-domain / traditional / generic mechanics only; no branded commercial IP). Ops section **games — classic + original** is binding.

Also runs **traffic-diagnosis**, **adsense-prep**, and **seo-locales** when those GROWTH domains roll (not product playgrounds; follow ops procedures).

Reply in **Spanish** at the end of every run (template in ideas-lab-ops.md).

---

## IMMUTABLE (never edit / weaken / remove)

1. ONLY branch `fix/spanish-complete`. Never `main`.
2. Repo: `andygargol2010-afk/Utilihub`. Prefer github create_or_update_file / push_files.
3. COMMIT IDENTITY: name `andygargol2010-afk`, email `andygargol2010@gmail.com`. FORBIDDEN: agent@utilihub.net etc.
4. NEVER create/delete/update any other automation. Only automation_update THIS task if bootstrap must change. State → ideas-lab-state.md.
5. NEVER change cadence/schedule/notification.
6. Do NOT touch `HouseModeler3D.tsx`. Do NOT touch Adsterra/ads core or the ads kill switch (`ads-config`, `ads-edge`, AdsterraBanner/AdBanner). NEVER remove Adsterra.
7. One primary outcome per run.
8. **ONE COMMIT PER RUN.** Code + state updates go in a **single** `push_files` (or equivalent) commit. Never a separate `docs(agent)` state-only commit after a feat, except on **CLOSE**. No post-ship deploy.
9. **NO DEPLOYS.** Auto-deploys on `fix/spanish-complete` are disabled on purpose. Never call `create_deployment`, Deploy Hooks, or any Vercel deploy API. Andy/Claude review and deploy in batches. Replace any “deploy + smoke” step with **PRE-PUSH SELF-REVIEW** (ops).
10. RATE_LIMITED / Vercel Hobby quota messages are not build errors the agent must “fix” by deploying.
11. `runs_total` / `runs_remaining` integers. Default project size **4 runs**, hard max **6**. Never raise cap mid-project. A project that cannot show a working playable/useful core by **run 2** must be cut down or closed.
12. DOMAIN ROLL (IDEATE only):
    - **CORE** = `kits | journeys | games | simulators | studio-composition | playgrounds | quality-lift`
    - **GROWTH** = two-urn (see ops). `seo-locales` only in FLEX; skip if SEO_LOCALES_ACTIVE ≥ 5.
13. EN + ES for every user-facing surface (routes, copy, meta). Product UI strings stay locale-correct.
14. Files under `.agent/ideas-lab*.md` **win over** the automation prompt if they disagree.
15. Never rewrite `registry.tsx` / `registry-entries-a.ts` / `registry-entries-b.ts` wholesale. Ideas-lab must not append catalog calculator tools via registry unless explicitly a non-catalog surface.
16. Never write files containing the literal tokens `PLACEHOLDER` or `$(cat`.

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

## Out of scope

- Catalog calculators / duplicate `makeTool` wrappers (tools-builder domain).
- House Modeler 3D (`HouseModeler3D.tsx` and house-modeler agent files).
- Changing Adsterra integration or Global Config ads flags.

<!-- end:ideas-lab.md -->

## Split files (2026-10-28) — where to add entries
The big files were split into small modules so API writes never truncate them. Add new entries in the smallest file of the matching folder; never rewrite files wholesale:
- New catalog tool module: import + `...X_TOOLS,` spread in the smallest `src/lib/general/catalog-index/part-NN.ts` (not in `src/lib/general/index.ts`).
- New dedicated UI: `export const XToolUi = lazy(() => import("../XTool")...)` in the smallest `src/components/general/registry-ui/components-NN.ts`, and `"slug": UI.XToolUi,` in the smallest `src/components/general/registry-ui/slugs-NN.ts` (registry.tsx no longer has the `if (slug === ...)` chain).
- New Spanish exact tool name: the smallest `src/lib/i18n/es-names/names-NN.ts` (es.ts must stay > 15 KB because of the restore-es-i18n guard; do not move more out of it).
- New SEO override module: import + spread in the smallest `src/lib/tool-seo-index/part-NN.ts` (not in `src/lib/tool-seo-overrides.ts`); entries of the old big override files live in `src/lib/tool-seo-data/`.
- New Error Hunter catalog entry: the smallest file in `.agent/error-hunter-catalog/` (the root `.agent/error-hunter-catalog.md` is only the header + index).
- If the smallest file passes ~200 lines / 8 KB, create the next `part-NN` / `names-NN` / `components-NN` / `slugs-NN` file and wire it in its parent (index.ts, es.ts, tool-seo-overrides.ts, components.ts or slugs.ts) with a one-line surgical insert.
