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

Job: expand the **search-intent surface** of the general tools catalog by shipping **two** high-quality new tools per PRODUCT run when possible. Quality per tool must equal the former single-tool standard. Prefer useful calculators/converters/generators/validators that people actually query — not filler pages.

Not your job: HouseModeler3D, Ideas Lab playgrounds/games, Fightersland, production promotes, Adsterra core, other automations' cadence.

Reply in **Spanish** at the end of every run (template in tools-builder-ops.md).

---

## IMMUTABLE (never edit / weaken / remove)

1. ONLY branch `fix/spanish-complete`. Never `main`. Never promote to production (that is another agent).
2. Repo: `andygargol2010-afk/Utilihub`. Prefer `github___create_or_update_file` / `push_files` with fixed identity.
3. COMMIT IDENTITY — author **and** committer MUST be:
   - name: `andygargol2010-afk`
   - email: `andygargol2010@gmail.com`
   FORBIDDEN: `agent@utilihub.net`, "UtiliHub Agent", invented emails, utilihub.net domain.
4. NEVER create / delete / update / pause any other automation. Only `automation_update` THIS task if the short bootstrap must change. Runtime memory → `tools-builder-state.md`.
5. NEVER change cadence / schedule / notification of this or any automation.
6. NEVER touch `src/components/general/HouseModeler3D.tsx` (other auto; large monolith; restore via Actions is not your scope).
7. No heavy runtime deps for new tools; all compute in the browser.
8. Before coding: read real patterns — catalog entries, `registry.tsx`, route-slugs, i18n ES/EN, SEO overrides / `makeTool`.
9. Never invent a successful push, READY deploy, or live page when tools failed or the page shows «Tool not available».
10. Files under `.agent/tools-builder*.md` win over the short automation bootstrap prompt. Expand rules here, not in the 8k automation field.

---

## ANTI-WIPE REGISTRY (immutable — critical)

Protected file: `src/components/general/registry.tsx`

Historical root cause of «Tool not available» / «Herramienta no disponible»: PLACEHOLDER body, stub, truncated write, or missing `pickComponent` branch / lazy import.

### Hard rules

A. NEVER write PLACEHOLDER, REPLACE_ME, «minimal registry», incomplete stub, or a few-line fake registry.
B. BEFORE any edit: read the **full** file and note SHA/size. If the file is short (< ~8 KB) or missing `GENERAL_TOOL_UI` / `GENERAL_TOOL_UI_ES` / `buildLazyRegistry` / `pickComponent` → **RESTORE-ONLY** from last known-good SHA on this branch. Do **not** add new tools in that run.
C. Surgical edit only:
   - Per new tool: **+1** lazy import + **+1** branch in `pickComponent` (and matching map entry if the pattern requires it).
   - Two tools in one run → exactly two imports + two branches.
   - Avoid full-file rewrite unless the payload is the complete verified source.
D. AFTER `create_or_update_file` (or push): verify the body still contains:
   - `export const GENERAL_TOOL_UI` and `GENERAL_TOOL_UI_ES`
   - `function pickComponent` and `function buildLazyRegistry`
   - no PLACEHOLDER / stub language
   - size on the order of the previous full file
   If verification fails → restore good SHA immediately and report in Spanish. Do not leave production-preview broken.
E. If an import points at a missing component: remove only that import/branch or map the slug to an existing generic (`MathTool` / `ConfiguredTool`). Never “fix” by deleting half the registry.
F. Forbidden commit messages implying a wipe: «minimal registry», «stub registry», «temp registry».

### Why this exists

A single truncated registry write wipes the entire catalog UI for every tool. Volume (2 tools/run) never justifies risking the registry. Prefer one safe tool over two if the second write would be a full rewrite under truncation risk.

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
- After ship: verify EN and ES routes do not show «Tool not available».

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

## DEPLOY BUDGET (Hobby ~100 deploys/day — mandatory)

1. **Exactly one git commit per PRODUCT run.** Bundle both tools' data + components + registry + i18n in a single commit (`feat(cat): add <slug-a> + <slug-b>`).
2. **Forbidden:** sequential pushes (data then component then register) — each push burns a Vercel deploy.
3. Prefer `push_files` / multi-file one commit over multiple `create_or_update_file` auto-commits.
4. META / pure `.agent/*` notes: **do not push** if nothing product-relevant changed.
5. Ops file (tools-builder-ops.md) must end with `<!-- end:tools-builder-ops.md -->`. If truncated or wiped, re-fetch or stop; do not invent PRODUCT steps.

<!-- end:tools-builder.md -->
