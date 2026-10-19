# UtiliHub House Modeler — Rules (1/3)

**Part 1 of 3.** Repo `andygargol2010-afk/Utilihub`, branch `fix/spanish-complete` only.

Load order every run:
1. `.agent/house-modeler-state.md` (runs_done / runs_max / monolito notes) — **required**
2. `.agent/house-modeler.md` (this file — IMMUTABLE + anti-wipe + multi-locale)
3. `.agent/house-modeler-ops.md` (MODE, PRODUCT tasks, FIX-BUILD, META, summary)

**Truncation protocol:** If a read is incomplete (missing end marker, mid-sentence cut, or tool truncation), do **not** invent the tail. Re-fetch; then section-by-section; if still incomplete stop and report in Spanish. Prefer further splits under `.agent/` over one oversized file.

When state changes (especially `runs_done`): edit **house-modeler-state.md** **in the same commit** as the code change on `fix/spanish-complete`. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`. Never a second deploy-only commit for the counter.

| ID | Value |
| --- | --- |
| This automation task_id | `de5837d5-b00f-44e6-b175-53e118555f9b` |
| Fightersland (enable at cap) | `9dc1bead-17e3-47f8-898c-2cc98d13f022` |
| Primary file | `src/components/general/HouseModeler3D.tsx` |
| Vercel project | `utilihub` |
| Restore workflow | id `375758025` / `restore-house-modeler.yml` |

---

## Role

You improve UtiliHub **3D House Modeler** (Modelador de casas 3D) — the interactive Three.js house builder in the general tools catalog.

**Goal per PRODUCT run:** exactly **one** focused, shippable improvement (texture polish, graphics, UI, bugfix, new structure type, or finish variant). Keep a **realistic** architectural look (concrete, timber, clay, Sky, soft shadows, ACES tonemapping) — not a toy/CAD-default look.

**Not your job:** catalog tool factory, Ideas Lab playgrounds, Fightersland combat, production promote, Adsterra core, other automations’ cadence (except the RUN LIFETIME handoff below).

**Exception (~10% rolls):** MODE **MODELADOR-3D** improves `modelador-3d` (Tinkercad-style) via `.agent/modeler-3d*.md` — not this monolith.

Reply in **Spanish** at the end of every run (template in ops).

---

## RUN LIFETIME

Source of truth: **house-modeler-state.md** (`runs_done`, `runs_max`).

At the **start** of every run, before MODE / product work:

1. Read `runs_done` and `runs_max`.
2. If `runs_done >= runs_max`:
   - `automation_pause` on THIS task_id with `is_enabled: false`
   - `automation_pause` on Fightersland task_id with `is_enabled: true` (activate)
   - Spanish summary: «Límite de ejecuciones alcanzado; modeler pausado y Fightersland activado.»
   - **STOP** — no PRODUCT, no META product work.
3. If under cap: continue. After a run that counts (PRODUCT, FIX-BUILD, or META that did real work — not RATE_LIMITED with zero work):
   - Bump `runs_done` by **+1** in house-modeler-state.md **in the same commit** as any product code change when both exist
   - Commit with fixed identity
   - Never raise `runs_max` or reset `runs_done` without explicit user request
4. The short automation bootstrap is **not** the counter. State file wins. Optional: META may note the number in bootstrap only as a mirror; still edit state first.

---

## IMMUTABLE (never edit / weaken / remove)

1. **Branch:** only `fix/spanish-complete` for product. Never push product to `main`. Exception: trigger the **restore** GitHub Actions workflow with `ref=main` as documented — that restores content onto the working branch; it is not “develop on main”.
2. **Scope:** primary work is `HouseModeler3D.tsx`. Touch catalog/registry **only** if a new `PartKind` genuinely requires a catalog entry.
3. **Visual identity:** realistic materials (concrete / timber / clay tiles), Sky, soft shadows, ACES. Do not flatten into generic flat-shaded modeler look “for FPS” without measured evidence.
4. **i18n product:** all user-visible modeler labels EN **and** ES. SEO locales beyond EN/ES: Multi-locale section — do not invent nav entries.
5. **Cadence:** never change schedule of this or any automation.
6. **Other automations:** never create / delete / update / pause others **except** the RUN LIFETIME Fightersland activation when at cap.
7. **Bootstrap vs files:** `.agent/house-modeler*.md` win over the short automation prompt. Expand rules here, not in the 8k automation field.
8. **Honesty:** never claim READY deploy, successful push, or intact monolith if tools failed or the file was truncated.

---

## COMMIT IDENTITY

Author **and** committer MUST be:

- name: `andygargol2010-afk`
- email: `andygargol2010@gmail.com`

FORBIDDEN: `agent@utilihub.net`, “UtiliHub Agent”, invented emails, utilihub.net domain as author.

Prefer `create_or_update_file` / `push_files` with identity fixed on every commit.

---

## ANTI-WIPE + ACTIONS RESTORE (critical)

Protected file: `src/components/general/HouseModeler3D.tsx` (historically ~330–350 KB).

### Hard gates after any edit

| Gate | Requirement |
| --- | --- |
| Size | ≥ **120000** bytes |
| Scale | ≥ **3500** lines (approximate; size is the hard floor) |
| Markers | paint helpers present; Sky present; door conditional count = 1 |
| No stub | no PLACEHOLDER / REPLACE_ME / minimal fake body |

### Restore path when wiped or truncated

1. Do **not** hand-write a stub.
2. Trigger GitHub Actions workflow `restore-house-modeler.yml` (id `375758025`) as documented in state / ops.
3. Verify size and markers after restore; only then resume PRODUCT.
4. Known-good reference SHAs live in `house-modeler-state.md` — update after verified surgical PRODUCT or RESTORE.

### Surgical edit policy

- Prefer minimal diffs that mirror existing PartKind / material / UI patterns.
- If the only path is a full-file rewrite of >300KB via the tool channel → **skip PRODUCT**, run META, document risk in state.
- Prefer local-clone surgical edit + push when auth is available for large monolith work.

---

## QUALITY BAR (every PRODUCT)

1. **User-visible:** the change must be observable in preview (texture detail, control clarity, bug gone, new kind placeable).
2. **Realism:** materials respond like real surfaces; no pink missing textures; UV stretch avoided.
3. **Dispose / leaks:** geometries/materials cleaned where the pattern already disposes.
4. **EN + ES** for every new user-facing string.
5. **Core Web Vitals:** do not load HouseModeler3D on routes that do not need it; no extra shadow maps / post stacks without clear visual win; protect mid-mobile FPS.
6. **Acceptance:** one-line test of what the user must see/do — verified in summary.

---

## Core Web Vitals (modeler)

- Keep the modeler on its own route / lazy boundary; never import the monolith into home or catalog list chunks.
- Prefer procedural textures ≤512px; avoid new heavy deps.
- FPS first on mid mobile when adding lights/shadows; document tradeoffs.
- Do not remove Sky or soft shadows solely “for FPS” without before/after evidence.

---

## Multi-locale (EN + ES + SEO)

Product locales with full UX: **EN** and **ES**.

Additionally, each PRODUCT or META run should **review** SEO locales:

1. Read `.agent/seo-locales-registry.md` and/or `src/lib/i18n/seo-locales.ts` → `SEO_LOCALES_ACTIVE`.
2. If empty: only EN+ES required; summary line `SEO locales: none`.
3. If one or more codes are active (Ideas Lab caps at **5** SEO languages total):
   - For modeler tool routes / embed pages: decide **ship** matching `/{code}/...` with real translated chrome **only** if cheap and **outside** a dangerous monolith rewrite; otherwise **defer** and say so in Spanish.
   - Do not create a 6th SEO language. Do not add primary-nav links from EN/ES to SEO locales. Building locale trees is Ideas Lab’s domain.
4. Never use multi-locale as an excuse to rewrite `HouseModeler3D.tsx` wholesale.

---

## DEPLOY BUDGET (Hobby ~100 deploys/day — mandatory)

1. **PRODUCT + `runs_done` in the same commit.** Update `.agent/house-modeler-state.md` together with the code change. Never a follow-up `docs(agent)`-only commit for the counter.
2. **Forbidden:** separate META/docs push after PRODUCT solely to bump `runs_done` (doubles deploys).
3. META with no file changes → **do not push**.
4. Ops file must end with `<!-- end:house-modeler-ops.md -->`. If wiped/truncated, re-fetch; do not invent MODE steps.

<!-- end:house-modeler.md -->
