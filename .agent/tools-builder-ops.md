# UtiliHub Tools Builder — Ops (2/3)

**Part 2 of 3.** End marker: `<!-- end:tools-builder-ops.md -->`.

If truncated: re-fetch; do not guess MODE or PRODUCT steps.

---

## QUALITY BAR (per tool — non-negotiable)

Even when the target is **2 tools**, each tool must pass the same bar as a solo-tool run:

| Area | Required |
| --- | --- |
| Inputs | Clear labels; sensible defaults; EN+ES |
| Result | Correct formula / logic; no silent NaN |
| Examples | **2 real worked examples** on the page |
| Edges | Zero, negative, empty, absurd upper bound handled |
| UI | Design-system cards/inputs; copy + reset; mobile-first |
| i18n | Full EN + ES strings (not half-translated) |
| SEO | Title/H1 with search intent; `makeTool` + override if catalog needs it |
| FAQ | 0–3 only if they answer real questions — **no padding FAQ** |
| Registry | Surgical entry; page does not show «Tool not available» |
| Verify | Open EN + ES routes after deploy |
| **Core Web Vitals** | No new heavy deps; keep tool route lean; lazy-load any canvas/3D/chart; avoid blocking home/catalog chunks; no layout shift from ads/images without size; prefer CSS over large client JS for chrome |

### Core Web Vitals when coding (tools)

- **LCP:** do not import registry/3D/modeler into the tool shell or home. Tool component loads on its route only.
- **INP:** avoid heavy sync work on every keystroke (debounce if needed); keep main thread free on first paint.
- **CLS:** reserve space for result cards; images/icons with width/height or fixed aspect; do not inject late banners that shove content without a reserved slot (Adsterra slots already reserved — do not break them).
- **Bundle:** no new npm packages without strong need; prefer browser-native math. Charts/canvas → dynamic `import()` / existing lazy patterns.
- **JS weight:** one tool file should not pull the whole catalog or HouseModeler3D.

**Escape hatch:** If the 2nd candidate cannot meet this bar, or registry/deploy is unsafe after the first tool → ship **1 excellent tool** and explain why in the Spanish summary. Never ship two mediocre tools. Prefer 1 solid > 2 weak.

---

## MODE (every run)

0. Load state → rules → ops. Read `automation_get_results` (limit 5) + recent commits on fix/spanish-complete.
1. **DEPLOY CHECK** (start): list Vercel project `utilihub`, branch `fix/spanish-complete`.
   - **ERROR** → FIX-BUILD only (see below). No new tools while ERROR.
   - **BUILDING / QUEUED** → note; avoid heavy PRODUCT; re-check next run.
   - **READY** → PRODUCT / META / NEW-CATEGORY allowed.
2. Roll integer **1–20**:
   - **1** → META (~5%)
   - **2** → NEW-CATEGORY (~5%, only if all gates pass)
   - **3–20** → PRODUCT (target 2 tools)
3. Declare mode (and roll) at the start of the run narrative.

---

## FIX-BUILD

When deploy is ERROR or a new tool page is broken:

1. Read build / runtime logs (Vercel).
2. Minimal fix only (typo, missing export, bad import, registry branch).
3. Push → re-check deploy. Max **2** attempts per run.
4. No new product tools while fixing.
5. If root cause is wiped registry → restore known-good SHA first (rules file), then re-add only safe surgical entries.

---

## POST-PUSH DEPLOY CHECK

After every product push:

1. Wait ~60–90s; list deployment for that commit SHA.
2. If ERROR → FIX-BUILD.
3. If READY and tools were added → **page verification for each new slug**:
   - Open EN: `/tools/<slug>` (or monorepo equivalent)
   - Open ES: `/es/herramientas/<slug>` (or equivalent)
   - Must **not** show «Tool not available» / «Herramienta no disponible»
   - Title / H1 must reflect the SEO intent (not a generic fallback)
   - Any failure → FIX-BUILD (registry / route / SEO); do **not** claim success
4. Spanish summary must include: deploy state, preview URL if available, per-slug pass/fail.

---

## NEW-CATEGORY (roll = 2 + all gates)

Ship **one** new category + **one** seed tool (not two tools). Category routes are already dynamic — prefer data/config changes.

Gates (all required):

- **G1** Last ~15 runs did not already add a category.
- **G2** `GENERAL_CATEGORIES` count still **< 22**.
- **G3** Theme does not fit an existing category (name 3 existing candidates you considered).
- **G4** Room for ≥4 future tools in that theme.
- **G5** Category slug: kebab-case, 3–24 ASCII chars.
- **G6** Update `ENGLISH_CATEGORY_SLUGS` (and ES maps if required).

Touch only what the monorepo requires: catalog data, route-slugs, i18n, nav/sitemap if hardcoded. Commit message: `feat(catalog): add <category-slug> + <seed-tool>`.

---

## PRODUCT — TWO TOOLS (roll 3–20)

### Mandatory order

1. **ANTI-DUPE**
   - Grep each candidate slug in repo.
   - Check 3 sister tools (same problem family).
   - Skip if UtiliHub already covers the same user intent under another slug (even with a different name).

2. **CLUSTER diversity** (read state file)
   - Count last ~8 shipped tools by cluster.
   - If a cluster already has ≥3 in that window → **forbid** another from that cluster.
   - The **two tools of this run must be different clusters** from each other.
   - Watched clusters: hogar/construcción, fechas/tiempo, %/math básica, generadores de texto, conversiones genéricas, finanzas simples, salud/BMI-family, ciencia/física one-shot.
   - **Saturation escape:** If *every* watched cluster is marked `recent` / saturated, you may still pick tools from clusters that are *least* represented in RECENT_TOOLS (oldest or lowest count), as long as the two tools of this run remain different clusters. Document the escape in NOTES.

3. **TYPE mix**
   - Types: `calculadora` | `conversor` | `generador` | `validador` | `studio`.
   - Prefer not both the same type if the last 5 catalog tools were numeric calculators.

4. **DEMAND selection + expansion loop (before any code)**

   **Initial batch**
   - Propose **≥4 candidates** (≥2 per slot) with explicit EN query and ES query when relevant.
   - Do **not** invent search volumes or “high demand” without a concrete query phrase.
   - Drop candidates already covered by own catalog.
   - Prefer differentiation: inputs, outputs, or use-cases that justify a dedicated page.
   - Reject “slug is free” as the only reason.

   **If fewer than 2 candidates pass anti-dupe + cluster + type + demand + quality-feasibility → EXPAND (mandatory)**

   - Run up to **3 expansion rounds**. Each round:
     1. Generate **≥4 new ideas** that were *not* in previous batches.
     2. Angles to force variety (pick different ones each round):
        - Niche calculators people actually search (payroll withholdings, overtime premium, split rent, tip + tax combined, paint cans, tile count, concrete volume, sleep cycles, ovulation window, blood alcohol estimate, etc.)
        - Converters with a distinct unit pair or domain not already covered
        - Generators / validators (UUID v4, strong password policy checker, slug from title, CSV column extractor, regex explainer-lite, color contrast ratio)
        - Education / productivity / cooking / travel niches not in RECENT_TOOLS
        - Tools that combine 2 related inputs into one clear output (not a clone of an existing single-input tool)
     3. Re-run the full filter stack (anti-dupe, cluster, type, demand query, implementable quality this run).
     4. Keep any that pass; discard the rest.
   - Stop expansion early once you have **2 passing candidates** (or 1 if the 2nd still fails quality after 3 rounds — then use the 1-tool escape hatch).
   - **Forbidden:** concluding “clusters saturated / high-demand covered → shipped 0” after only the first batch of 4. You must document the expansion rounds and the ideas tried.
   - Only after **3 full expansion rounds** with still <2 passers may you ship 0 — and the Spanish summary + state NOTES must list every candidate attempted and the exact filter that rejected it.

   **Pick**
   - From the final passers, choose the 2 that best combine: clear query, real gap, implementable quality this run, distinct clusters.

5. **Design + SEO per tool**
   - UI on design system; EN+ES; 2 examples; edges.
   - SEO title with intent; optional FAQ 0–3 only if useful.
   - Same quality bar as a single-tool run (including Core Web Vitals).

6. **Pre-push checklist (each tool)**
   - Category + cluster + type
   - Anti-dupe done
   - Candidates + queries recorded (including expansion rounds if any)
   - 2 examples + edges
   - SEO title/H1
   - Registry plan (import + pickComponent branch)
   - Commit identity email
   - Confirmed: not touching HouseModeler3D
   - CWV: no eager home import; no heavy deps; lazy canvas if any
   - **SEO locales review:** read `SEO_LOCALES_ACTIVE`; if non-empty, either ship `/{code}/...` for the new tool(s) or explicitly defer in the Spanish summary (do not ignore)

7. **Implement**
   - Two components + two surgical registry entries.
   - One or two clear commits: `feat(cat): add <slug>` …
   - Max 2 build-fix attempts.
   - Then POST-PUSH verification for **both** slugs.

8. **Safety stop**
   - If after the first tool the deploy or registry looks fragile → stop at 1; document; do not force the second.

---

## META (roll = 1)

Prefer improving `.agent/tools-builder*.md` via commit over lengthening the automation bootstrap.

Allowed:

- Clarify cluster list, quality bar, or NEW-CATEGORY gates with evidence from last results.
- Update bootstrap **only** if load-order instructions broke (rare).
- One evidence-based change.

Forbidden:

- Weaken IMMUTABLE / ANTI-WIPE / identity.
- Touch other automations.
- Raise implicit volume above 2 or remove the “1 excellent tool” escape hatch.

---

## Spanish summary template

```
Modo: PRODUCT|META|NEW-CATEGORY|FIX-BUILD (roll N)
Candidatos iniciales: …
Rondas de expansión (0–3): ideas nuevas + filtro que rechazó / pasó
Elegidas (1 o 2) y por qué: …
Clusters / categorías: …
Slugs EN+ES: …
2 ejemplos por tool: …
SEO: …
CWV: lean route / no home bloat / deps OK
SHA / commits: …
Identidad email: andygargol2010@gmail.com
Deploy: READY|ERROR|BUILDING + URL
Verificación por slug: …
Registry anti-wipe: OK|restaurado
SEO locales active (codes): … | acción: shipped / deferred / n-a
Pasos de prueba manual: …
```

---

## ALWAYS

- Protect Core Web Vitals on every tool ship (lazy heavy UI, no home/catalog bloat, no needless deps).
- Quality > speed. Deploy ERROR > new feature.
- Two solid tools expand the catalog more than two weak ones.
- Never sacrifice a complete registry for volume.
- **Do not stop at the first failed batch of candidates** — expand up to 3 rounds before shipping 0.
- `.agent/` files are the full source of truth; this ops file is part of it.
- Truncation → re-read, never invent.
- End every run with an honest Spanish summary.

<!-- end:tools-builder-ops.md -->
