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

**Escape hatch:** If the 2nd candidate cannot meet this bar, or registry/deploy is unsafe after the first tool → ship **1 excellent tool** and explain why in the Spanish summary. Never ship two mediocre tools.

---

## MODE (every run)

0. Load state → rules → ops. Read `automation_get_results` (limit 5) + recent commits on fix/spanish-complete.
1. **DEPLOY CHECK** (start): list Vercel project `utilihub`, branch `fix/spanish-complete`.
   - **ERROR** → FIX-BUILD only. No new tools while ERROR.
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
   - Open EN: `/tools/<slug>`
   - Open ES: `/es/herramientas/<slug>`
   - Must **not** show «Tool not available» / «Herramienta no disponible»
   - Title / H1 must reflect the SEO intent
   - Any failure → FIX-BUILD; do **not** claim success
4. Spanish summary must include: deploy state, preview URL if available, per-slug pass/fail.

---

## NEW-CATEGORY (roll = 2 + all gates)

Ship **one** new category + **one** seed tool (not two tools). Prefer data/config changes.

Gates (all required): G1 last ~15 runs no new category; G2 GENERAL_CATEGORIES < 22; G3 theme does not fit existing; G4 room for ≥4 future tools; G5 kebab-case slug 3–24; G6 update ENGLISH_CATEGORY_SLUGS.

Commit message: `feat(catalog): add <category-slug> + <seed-tool>`.

---

## PRODUCT — TWO TOOLS (roll 3–20)

### Mandatory order

1. **ANTI-DUPE** — grep each slug; check sister tools; skip same user intent.
2. **CLUSTER diversity** — if a cluster has ≥3 in last ~8 shipped → forbid another from that cluster.
3. **Demand** — prefer real search-intent queries; clear gap; implementable quality this run.
4. **Expansion** — if <2 passers after first batch, expand up to 3 rounds; document; only ship 0 after 3 full rounds.
5. **Design + SEO per tool** — UI design system; EN+ES; 2 examples; edges; SEO title; FAQ 0–3 only if useful; same quality bar including CWV.
6. **Pre-push checklist** — category, anti-dupe, examples, SEO, registry plan, identity, not HouseModeler3D, CWV, SEO locales review.
7. **Implement — ONE commit per run (deploy budget)**
   - Two components + two surgical registry entries (or 1 tool if escape hatch).
   - **Exactly one git commit** for the whole PRODUCT run. Batch data + component(s) + registry + i18n in that single commit.
   - Commit message may list both slugs: `feat(cat): add <slug-a> + <slug-b>`.
   - **Forbidden:** separate pushes for “tool data” then “component” then “register” — each push triggers a Vercel deploy and burns Hobby daily quota (~100/day).
   - Prefer `push_files` / multi-file update in one commit over sequential `create_or_update_file` that each auto-commit.
   - Max 2 build-fix attempts (still one logical outcome; fix commits only if build broke).
   - Then POST-PUSH verification for **both** slugs on that single SHA.
8. **Safety stop** — if after the first tool the deploy or registry looks fragile → stop at 1; document; do not force the second.

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
- Extra commits that only touch `.agent/*` docs without a real rule change (burns deploy quota). Prefer zero push on no-op META.

---

## Spanish summary template

```
Modo: PRODUCT|META|NEW-CATEGORY|FIX-BUILD (roll N)
Candidatos iniciales: …
Rondas de expansión (0–3): …
Elegidas (1 o 2) y por qué: …
Commits: un solo SHA de PRODUCT (o escape 1 tool)
Deploy: READY|ERROR|… verificación EN/ES por slug
SEO locales: none|…
```

<!-- end:tools-builder-ops.md -->
