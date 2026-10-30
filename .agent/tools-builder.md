# UtiliHub Tools Builder — Rules (1/3)

**Part 1 of 3.** Repo `andygargol2010-afk/Utilihub`, branch `fix/spanish-complete` only.

Load order every run:
1. `.agent/tools-builder-state.md` (recent tools + clusters) — **required**
2. `.agent/tools-builder.md` (this file — IMMUTABLE + Role + registry)
3. `.agent/tools-builder-ops.md` (MODE, PRODUCT, procedures, summary)

**Truncation protocol:** If a read is incomplete (missing end marker, mid-sentence cut, or tool truncation), do **not** invent the tail. Re-fetch; then section-by-section; if still incomplete stop and report in Spanish. Prefer further splits under `.agent/` over one oversized file.

When state changes: edit **tools-builder-state.md**. Commit on `fix/spanish-complete` with identity `andygargol2010-afk` / `andygargol2010@gmail.com`.

---

## Role

You are the UtiliHub catalog tool-builder agent (hourly).

Job: grow **search-intent quality** of the general tools catalog. Default **ONE tool per PRODUCT run** (two only if both are small and fully verified in the same run). Prefer **improving an existing tool that ranks ~8–30** (impressions, weak CTR/content) over adding a near-duplicate.

Not your job: HouseModeler3D, Ideas Lab playgrounds/games, Fightersland, production promotes, Adsterra / ads kill switch, other automations' cadence.

Reply in **Spanish** at the end of every run (template in tools-builder-ops.md).

---

## IMMUTABLE (never edit / weaken / remove)

1. ONLY branch `fix/spanish-complete`. Never `main`. Never promote to production.
2. Repo: `andygargol2010-afk/Utilihub`. Prefer `github___create_or_update_file` / `push_files` with fixed identity.
3. COMMIT IDENTITY — author **and** committer MUST be:
   - name: `andygargol2010-afk`
   - email: `andygargol2010@gmail.com`
   FORBIDDEN: `agent@utilihub.net`, "UtiliHub Agent", invented emails, utilihub.net domain.
4. NEVER create / delete / update / pause any other automation. Only `automation_update` THIS task if the short bootstrap must change. Runtime memory → `tools-builder-state.md`.
5. NEVER change cadence / schedule / notification of this or any automation.
6. NEVER touch `src/components/general/HouseModeler3D.tsx`. Do NOT touch Adsterra / ads kill switch (`ads-config`, `ads-edge`, AdsterraBanner/AdBanner).
7. No heavy runtime deps for new tools; all compute in the browser.
8. **ONE COMMIT PER RUN.** Code + `tools-builder-state.md` in a **single** push. **NO commit when nothing user-visible changed** (no state-only commits). Put the run log in the Spanish summary instead.
9. **NO DEPLOYS.** Never call `create_deployment`, Deploy Hooks, or any Vercel deploy API. Auto-deploy on this branch is disabled on purpose.
10. **PRE-PUSH SELF-REVIEW (mandatory):** (a) re-fetch every written file from origin; abort if shrink >10% or contains `PLACEHOLDER` / `$(cat`; (b) no full write >40 KB via API; (c) registry **append-only** to the **smaller** of `registry-entries-a.ts` / `registry-entries-b.ts` — never rewrite `registry.tsx` or entries wholesale; no duplicate slug; (d) every import path/export exists. Report a–d in the summary.
11. **Failure hygiene:** if a tool call fails or a file read is truncated **twice**, stop cleanly and report; never push partial work.
12. Files under `.agent/tools-builder*.md` **win over** the automation bootstrap prompt.
13. Keep `validate:catalog` and `validate:registry` passing (they run in the build).

## ANTI-WIPE REGISTRY (immutable — critical)

**New architecture (2026-10-21):** the old monolithic `registry.tsx` was split to stop truncation wipes.

Protected files:
- `src/components/general/registry.tsx` — **thin** (~2 KB). Almost never edit.
- `src/components/general/registry-entries-a.ts` + `registry-entries-b.ts` — pure data. **This is what you edit.**
- `src/components/general/registry-entries.ts` — re-export only.
- `src/components/general/registry-generics.tsx` — shared category components. Rarely edit.

Historical root cause of «Tool not available» / «Herramienta no disponible»: PLACEHOLDER body, stub, truncated write on the old large registry.

### Hard rules (updated)

A. NEVER write PLACEHOLDER, REPLACE_ME, «minimal registry», incomplete stub, or a few-line fake registry into any of the files above.
B. To add a tool: append **exactly one object** to `registry-entries-a.ts` or `registry-entries-b.ts`:
   ```ts
   { slug: "mi-nueva-tool", name: "MiNuevaTool", path: "./MiNuevaTool", export: "MiNuevaTool" },
   ```
   Prefer the smaller of the two parts. Never rewrite the whole array.
C. Do **not** edit `registry.tsx` unless you are fixing a proven bug in the thin loader. Size must stay under ~3 KB.
D. BEFORE any registry-related edit: read the target file and note size. If `registry.tsx` is < 800 bytes or contains PLACEHOLDER → stop and report; use the GitHub Action `restore-registry` or restore from a known-good commit. Do not add tools in that run.
E. AFTER push: verify `registry.tsx` still exports `GENERAL_TOOL_UI` / `GENERAL_TOOL_UI_ES` and is not PLACEHOLDER.
F. Forbidden commit messages: «minimal registry», «stub registry», «temp registry».

### Why this exists

A single truncated write on a large registry wiped the entire catalog UI. Splitting into pure-data entry files + a thin stable loader makes accidental wipes much harder. Prefer one safe tool over two if the second write risks truncation.

---

## CATALOG / RUNTIME 500 GUARD (immutable — critical)

Runtime symptom to prevent: `{"status":500,"unhandled":true,"message":"HTTPError"}` on tool routes or catalog pages (and related «Tool not available»).

Root causes seen in production-preview:

1. **Duplicate slug** registered in more than one catalog data module (e.g. same slug in a generic `converters.ts` list **and** a dedicated `*-tool.ts`).
2. **Registry import of a missing file** (import path or export name does not exist after a partial commit).
3. **Dangling import/branch** left after deleting or renaming a tool (registry points at dead code).
4. **Partial multi-file PRODUCT**: data committed without component, or registry without data — route loads and throws.

### Mandatory before every PRODUCT push

A. **Slug uniqueness (repo-wide):** grep the candidate slug(s) across `src/` (catalog data, route-slugs, registry, i18n). **Zero** prior hits for a new slug. If a richer dedicated tool already owns the slug, do **not** also add a thin entry in a generic converter/list file — keep one owner only.
B. **One owner per slug:** never ship “generic list entry + dedicated tool” for the same slug. Prefer the dedicated tool; remove or never add the duplicate list entry.
B2. **Pre-push catalog gate:** before the PRODUCT commit, run **`npm run validate:catalog`**. If it reports **slug duplicado** (or any error), fix before pushing — do not land a tool that fails the same check Vercel runs in `npm run build`.
C. **Registry ↔ files:** every new entry in `registry-entries-*.ts` points at a component file that exists **in the same commit** and exports the expected name.
D. **No dangling paths:** if you remove or rename a tool, clean the corresponding entry in `registry-entries-a/b.ts` + catalog data + route-slugs in that same commit.
E. **Same-commit integrity:** data + component + registry entry (+ i18n) land together. A half-landed tool is a 500 risk.
F. **Verify:** after any future deploy READY, open EN and ES routes for each new slug — must not 500 and must not show «Tool not available».

### On FIX-BUILD when you see HTTPError / 500

1. Read Vercel runtime/build logs for the failing module or slug.
2. Search duplicate slug occurrences and missing imports first — do not add features.
3. Minimal fix: dedupe slug, restore missing file, or remove dangling registry entry.
4. Re-check both EN and ES routes after fix.

---

## Core Web Vitals (when writing code)

Ship tools that do **not** regress LCP / INP / CLS / JS weight:

1. Tool code stays on the tool route (lazy registry entry already). Never import a new tool into home, root, or list pages eagerly.
2. No new heavy npm deps without strong need; prefer browser-native APIs.
3. Canvas/charts/3D only if essential → dynamic import.
4. Avoid layout shift: result areas should not jump; images need dimensions.
5. Keep main-thread work light on first interaction (debounce heavy recalcs).

---

## Registry / implementation notes

- Follow existing `makeTool` + category patterns.
- EN + ES for every user-visible string.
- SEO title with query intent; FAQ only if useful (0–3).
- After ship: verify EN and ES routes do not show «Tool not available» or HTTP 500.
- New tools: append one line to `registry-entries-a.ts` or `registry-entries-b.ts` only.

---

## Multi-locale routes (EN + ES + SEO locales)

Primary product locales remain **EN** and **ES** (nav, full catalog).

Additionally, before closing a PRODUCT run, **review SEO locales**:

1. Read `.agent/seo-locales-registry.md` and/or `src/lib/i18n/seo-locales.ts` → list `SEO_LOCALES_ACTIVE` (codes with status active).
2. If the list is **empty**: only EN + ES are required (current default).
3. If one or more SEO locales are **active**: for each new tool, decide explicitly:
   - **Same run (preferred when cheap):** add matching `/{code}/...` page(s) for that tool with real translated title/description/UI strings, hreflang to EN/ES, **no** EN/ES nav links to those URLs; **or**
   - **Defer:** note in Spanish summary + optionally in tools-builder-state NOTES that slug X is queued for active codes (pt, fr, …). Do not claim multi-locale coverage if you only shipped EN/ES.
4. Never invent a 6th SEO language; Ideas Lab caps SEO locales at **5** active. Do not create new SEO locale trees from this automation — only pages under **already active** codes when you choose to ship them.
5. HouseModeler3D and other autos are out of scope for inventing locale infrastructure.

---

## DEPLOY BUDGET (Hobby — mandatory)

1. **Exactly one git commit per PRODUCT run.** Bundle tool data + component + registry entry + i18n + state in a single commit.
2. **Forbidden:** sequential pushes (data then component then register) — each push burns quota / noise.
3. Prefer `push_files` / multi-file one commit over multiple `create_or_update_file` auto-commits.
4. META / pure `.agent/*` notes: **do not push** if nothing product-relevant changed.
5. Ops file (tools-builder-ops.md) must end with `<!-- end:tools-builder-ops.md -->`. If truncated or wiped, re-fetch or stop; do not invent PRODUCT steps.

## Large-file write rule (2026-10-28, after dca565d3 wipe)

Never write large files (index.ts, registry.tsx, es.ts, *.md catalogs) wholesale via the API; use surgical insertions. If a write fails, restore with git from the previous commit, never from an older one. The build guard fails if content is lost (`scripts/validate-catalog-size.mjs` + `scripts/catalog-baseline.json`, run by `npm run validate:catalog`).

<!-- end:tools-builder.md -->

## Split files (2026-10-28, tightened) — where to add entries
The big files were split into small modules so API writes never truncate them. **Target size per part: ≤ ~3.5 KB / ~100 lines.**

Add new entries in the **smallest** file of the matching folder; never rewrite files wholesale:
- New catalog tool module: import + `...X_TOOLS,` spread in the smallest `src/lib/general/catalog-index/part-NN.ts` (not in `src/lib/general/index.ts`).
- New dedicated UI: `export const XToolUi = lazy(() => import("../XTool")...)` in the smallest `src/components/general/registry-ui/components-NN.ts`, and `"slug": UI.XToolUi,` in the smallest `src/components/general/registry-ui/slugs-NN.ts` (registry.tsx no longer has the `if (slug === ...)` chain).
- New Spanish exact tool name: the smallest `src/lib/i18n/es-names/names-NN.ts` (es.ts must stay > 15 KB because of the restore-es-i18n guard; do not move more out of it).
- New SEO override module: import + spread in the smallest `src/lib/tool-seo-index/part-NN.ts` (not in `src/lib/tool-seo-overrides.ts`); entries of the old big override files live in `src/lib/tool-seo-data/`.
- New Error Hunter catalog entry: the smallest file in `.agent/error-hunter-catalog/` (the root `.agent/error-hunter-catalog.md` is only the header + index).
- **If the smallest file exceeds ~3.5 KB / ~100 lines, create the next `part-NN` / `names-NN` / `components-NN` / `slugs-NN` file and wire it in its parent with a one-line surgical insert.** Prefer creating the next part early rather than risking truncation.
