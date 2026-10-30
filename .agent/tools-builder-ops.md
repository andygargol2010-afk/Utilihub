# UtiliHub Tools Builder — Ops (2/3)

**Part 2 of 3.** MODE, PRODUCT quality bar, procedures. End marker required.

Load after tools-builder.md. Files win over automation bootstrap.

---

## MODE (every run)

0. Load state → rules → ops. Read recent commits on `fix/spanish-complete` (limit ~10).
1. Roll 1–20 (bootstrap): 1=META (~5%); 2=NEW-CATEGORY (~5%, gates in ops, 1 seed); 3–20=PRODUCT. **.md files override bootstrap volume.** Prefer PRODUCT when demand evidence exists.
2. **No deploy step.** No `create_deployment`. Auto-deploy on this branch is disabled.

**Volume (immutable):** Default **ONE tool per PRODUCT run**. Two only if both are small, non-overlapping, fully verified in the same commit, and registry remains safe. Never ship two mediocre tools. Bootstrap's "2 tools" is overridden by this rule.

---

## Demand-first selection (PRODUCT)

1. Prefer **improve existing** tools that rank ~8–30 or have impressions with weak content/CTR (GSC-style evidence in repo/state/notes: e.g. IMC/BMI cluster, hours→decimal, tablespoons→ml, words→minutes, unit converter, roman numerals, sleep cycle).
2. Before adding a **new** slug: search **entire `src/`** for that slug **and** for an equivalent tool (same purpose, other name). If one exists → **improve it** instead.
3. Default **one tool per run**. Two only if both are small, non-overlapping, and fully verified before the single commit.

---

## Definition of done (per tool)

All must hold before the single commit:

1. **Dedicated UI** when it adds value (not only generic Math/General shell).
2. **Real formula** + **2 worked examples** (inputs → expected output).
3. **Input validation** and edge cases (zero, negative, empty, overflow).
4. **EN + ES** title, description, H1 — proper casing, accents, acronyms (e.g. “Calculadora de IMC”, not “Calculadora imc”).
5. **Short FAQ** (0–3 items) only if useful.
6. **Internal links** to **2 related** tools.
7. **Mobile 390px** layout considered (no horizontal breakage).
8. Catalog entry + i18n + SEO strings consistent.
9. `validate:catalog` / `validate:registry` would pass (no duplicate slug; registry append-only).

---

## ONE COMMIT / NO DEPLOYS

- Exactly **one** git commit per PRODUCT run: tool data + component + registry append + i18n + `tools-builder-state.md`.
- **No commit** if nothing user-visible changed (log in Spanish summary only).
- **Forbidden:** state-only commits; sequential pushes that each create a commit; `create_deployment` / deploy hooks.
- Prefer multi-file `push_files` over many single-file commits.

---

## PRE-PUSH SELF-REVIEW (report in Spanish summary)

a. Re-fetch every written file from origin; compare bytes/lines; abort if shrink >10% or `PLACEHOLDER` / `$(cat`.  
b. No full file write >40 KB via API.  
c. Registry append-only to the **smaller** entries file; never rewrite `registry.tsx` / entries; no duplicate slug (search `src/` + index exports).  
d. Every import path exists; every exported symbol used exists.

---

## PRODUCT procedure

1. Pick candidate(s) via demand-first rules; list anti-dupe evidence.
2. Implement DoD for each tool in the run (default 1).
3. PRE-PUSH SELF-REVIEW a–d.
4. Single commit; re-fetch verify.
5. Max 2 build-fix attempts only if validators would fail — still one logical outcome.

Escape: ship **0** tools after honest anti-dupe / demand pass with no good candidate — no empty filler.

---

## META

Prefer improving `.agent/tools-builder*.md` with evidence. One commit only if rules actually change. No-op META → **no push**.

Forbidden: weaken IMMUTABLE; touch other automations; raise volume above 1 (or 2 small) tools.

---

## Spanish summary template

```
Modo: PRODUCT|META|FIX-BUILD
Demanda / improve-vs-new: …
Slug(s): …
Anti-dupe: OK|fallo (evidence)
DoD: UI/fórmula/ejemplos/validación/EN+ES/FAQ/links/390px
PRE-PUSH SELF-REVIEW: a=… b=… c=… d=…
Commits: <un solo SHA>|ninguno
Deploy: no (branch disabled)
validate: catalog/registry expected OK
```

---

## ALWAYS

Quality > quantity; one commit; no deploys; no registry rewrite; no HouseModeler3D; no Adsterra/kill-switch edits; failure hygiene (stop after 2 truncated reads).

<!-- end:tools-builder-ops.md -->

## Split files (2026-10-28) — where to add entries
The big files were split into small modules so API writes never truncate them. Add new entries in the smallest file of the matching folder; never rewrite files wholesale:
- New catalog tool module: import + `...X_TOOLS,` spread in the smallest `src/lib/general/catalog-index/part-NN.ts` (not in `src/lib/general/index.ts`).
- New dedicated UI: `export const XToolUi = lazy(() => import("../XTool")...)` in the smallest `src/components/general/registry-ui/components-NN.ts`, and `"slug": UI.XToolUi,` in the smallest `src/components/general/registry-ui/slugs-NN.ts` (registry.tsx no longer has the `if (slug === ...)` chain).
- New Spanish exact tool name: the smallest `src/lib/i18n/es-names/names-NN.ts` (es.ts must stay > 15 KB because of the restore-es-i18n guard; do not move more out of it).
- New SEO override module: import + spread in the smallest `src/lib/tool-seo-index/part-NN.ts` (not in `src/lib/tool-seo-overrides.ts`); entries of the old big override files live in `src/lib/tool-seo-data/`.
- New Error Hunter catalog entry: the smallest file in `.agent/error-hunter-catalog/` (the root `.agent/error-hunter-catalog.md` is only the header + index).
- If the smallest file passes ~200 lines / 8 KB, create the next `part-NN` / `names-NN` / `components-NN` / `slugs-NN` file and wire it in its parent (index.ts, es.ts, tool-seo-overrides.ts, components.ts or slugs.ts) with a one-line surgical insert.
