# UtiliHub Tools Builder — Ops (2/3)

**Part 2 of 3.** End marker: `<!-- end:tools-builder-ops.md -->`.

If truncated: re-fetch; do not guess MODE.

---

## QUALITY BAR (per tool — non-negotiable)

Even when shipping **2 tools**, each must pass the same bar as a solo-tool run:

- Clear inputs, correct result, **2 real examples**, edge cases (zero / negative / empty).
- UI: design system, EN+ES, copy/reset, mobile-first.
- SEO: intent title, `makeTool` + override if needed; FAQ 0–3 only if useful (no padding).
- Registry surgical + verified (rules file ANTI-WIPE).
- Page verification EN+ES OK (POST-PUSH).

If the 2nd candidate cannot meet this bar (or registry/deploy is unsafe): ship **1 excellent tool** and explain in Spanish. Never ship two mediocre tools.

---

## MODE

0. Recent commits + `automation_get_results` (limit 5). Load state → rules → ops.
1. DEPLOY CHECK start: list Vercel utilihub on `fix/spanish-complete`.
   - ERROR → FIX-BUILD only (max 2). No new tools while ERROR.
   - BUILDING/QUEUED → note; re-check next run.
   - READY → PRODUCT / META / NEW-CATEGORY.
2. Roll 1–20:
   - 1 → META (~5%)
   - 2 → NEW-CATEGORY (~5%, all gates)
   - 3–20 → PRODUCT (target **2 tools**)
Declare mode at start.

---

## POST-PUSH DEPLOY CHECK

After every push: wait ~60–90s; list deploy for SHA.

- ERROR → FIX-BUILD.
- READY and new tools: **page verification for each new slug**:
  1. Open EN + ES (`/tools/<slug>`, `/es/herramientas/<slug>` or monorepo equivalents).
  2. Must not show «Tool not available» / «Herramienta no disponible».
  3. Title/H1 must match SEO intent (not generic fallback).
  4. Any failure → FIX-BUILD (registry/route/SEO); do not claim success.

Summary must include deploy state + URL + per-slug verification.

---

## NEW-CATEGORY (roll=2 + all gates)

One category + **1 seed tool** (not 2). Routes already dynamic — data only.

- G1: no new category in last 15 runs.
- G2: `GENERAL_CATEGORIES` < 22.
- G3: theme does not fit existing (document 3 candidates).
- G4: ≥4 future tools possible.
- G5: kebab slug 3–24 ASCII.
- G6: `ENGLISH_CATEGORY_SLUGS` updated.

Files: catalog, route-slugs, i18n/es, nav/sitemap if hardcoded. Commit `feat(catalog): add <slug> + <tool>`.

---

## PRODUCT — TWO TOOLS (roll 3–20)

Mandatory order:

1. **ANTI-DUPE:** grep each slug; 3 sisters; do not repeat cluster of last ~8. Skip if UtiliHub already covers the same intent under another slug.
2. **CLUSTER diversity:** count last ~8 tools by cluster. If ≥3 same cluster → forbid another of that cluster. The **two tools this run must be different clusters** from each other. Watch: home/construction, dates/time, %/basic math, text generators, generic unit conversion, simple finance.
3. **TYPE:** calculator | converter | generator | validator | studio. Prefer not both the same type if last 5 were numeric calculators.
4. **DEMAND selection (before code):**
   - Propose ≥4 candidates (≥2 per slot) with clear EN (and ES if useful) queries. Do not invent search volumes.
   - Drop if own catalog already covers the intent.
   - Differentiation: inputs, outputs, use cases that justify a page.
   - Pick 2 maximizing observable demand + gap + utility, distinct clusters. Not “slug free” alone.
5. UI + SEO + FAQ per tool (quality bar).
6. Checklist per tool before push: category/cluster, type, anti-dupe, candidates, queries, 2 examples, edges, SEO, UI, registry, identity email, no HouseModeler3D.
7. Implement: 2 components + 2 registry entries (surgical). One or two clear `feat(cat):` commits. Max 2 build-fix attempts. Then POST-PUSH for **both**.
8. If after the first tool deploy/registry is fragile: stop at 1; document.

---

## META (roll=1)

Only `automation_update` of **this** task_id if bootstrap needs a tiny fix — prefer editing `.agent/tools-builder*.md` via commit.

One evidence-based clause. Do not weaken IMMUTABLE / ANTI-WIPE / identity. May reinforce clusters or quality bar in ops/state.

---

## Spanish summary template

Mode; candidates and why these 2 (or 1); categories/clusters; slugs; 2 examples per tool; SEO; SHA; identity email; test steps; DEPLOY + per-slug verification; registry OK if touched.

---

## ALWAYS

Quality > speed. Deploy ERROR > new feature. Two solid tools beat two weak ones. Never sacrifice full registry for volume. Files under `.agent/` are source of truth. Truncation → re-read, never invent.

<!-- end:tools-builder-ops.md -->
