# UtiliHub House Modeler — Rules (1/3)

**Part 1 of 3.** Repo `andygargol2010-afk/Utilihub`, branch `fix/spanish-complete` only.

Load order every run:
1. `.agent/house-modeler-state.md` (runs_done / runs_max / monolito notes) — **required**
2. `.agent/house-modeler.md` (this file — IMMUTABLE + anti-wipe + multi-locale)
3. `.agent/house-modeler-ops.md` (MODE, PRODUCT tasks, FIX-BUILD, META, summary)

**Truncation protocol:** If a read is incomplete (missing end marker, mid-sentence cut, or tool truncation), do **not** invent the tail. Re-fetch; then section-by-section; if still incomplete stop and report in Spanish. Prefer further splits under `.agent/` over one oversized file.

When state changes (especially `runs_done`): edit **house-modeler-state.md** and commit on `fix/spanish-complete` with identity `andygargol2010-afk` / `andygargol2010@gmail.com`.

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
   - Bump `runs_done` by **+1** in house-modeler-state.md
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
| Content | Still has `paintPlaster`, `paintTimber`, `paintClayTiles`, Sky, lock badges, layers, finishes |
| Doors | Exactly **one** occurrence of `{(tool === "door" \|\| selectedKind === "door") && (` |

If any gate fails → **ABORT** the bad write; restore; do not leave preview broken.

### Write rules

A. NEVER replace the file with stub, PLACEHOLDER, shell, “minimal modeler”, or short rewrite.
B. NEVER delete core paint helpers, Sky, lock badges, layer system, or finishes to “simplify”.
C. **Surgical edits only.** The agent `create_or_update_file` channel **truncates** large bodies. Sending a partial body wipes production-preview UI.
   - Prefer: GitHub search_code / get_file_contents to locate a small region, then a careful full-file write **only** if the complete verified source is in the payload.
   - If the only option is a full rewrite of a >300KB file and truncation risk is high → **skip PRODUCT**, run META, document in state.
D. **RESTORE canónico** (bytes <120000, or PLACEHOLDER/shell/stub, or missing `makeCanvasTexture` / `paintPlaster`):
   1. Do **not** hand-rewrite the monolith with create_or_update_file.
   2. Trigger Actions: `github___actions_run_trigger` method=`run_workflow` owner=`andygargol2010-afk` repo=`Utilihub` workflow_id=`375758025` (or workflow file `restore-house-modeler.yml`) ref=`main`.
   3. Poll `get_workflow_run` until completed. On success, verify size ≥120000 on `fix/spanish-complete`.
   4. **POST-RESTORE Vercel:** list deployments for that SHA. If no deploy within ~90s (GITHUB_TOKEN pushes sometimes skip webhook) → `vercel___create_deployment` with forceNew, gitSource github org=`andygargol2010-afk` repo=`Utilihub` ref=`fix/spanish-complete` sha=`<restore SHA>` project/name=`utilihub`. Poll until READY or ERROR.
   5. Known-good reference: commit `a074b7a6c89b530e4c4655bc9711c70053c495d8` (~330KB blob). Update state with current good SHA when you confirm one.
E. POST-PUSH DEPLOY CHECK always: list Vercel `utilihub` on `fix/spanish-complete`. ERROR → FIX-BUILD (max 2). BUILDING → note. READY → URL in Spanish summary.

### Why this exists

One truncated write destroyed the modeler in the past. Volume of hourly runs never justifies risking the monolith. META with an intact file beats PRODUCT that ships a 2KB stub.

---

## QUALITY BAR (implementations)

Every PRODUCT change must be **user-visible and correct**, not a drive-by tweak.

### Before coding

1. **Read a working neighbor:** open an existing similar PartKind / texture / UI block in `HouseModeler3D.tsx` and match its patterns (naming, mesh scale, material setup, label keys).
2. **Name the acceptance test** in one line (e.g. “select wall → new timber finish appears in swatch and applies without pink/missing texture”).
3. **Scope one outcome:** if the change needs more than one conceptual feature, cut scope — ship the highest-value slice only.
4. **Risk check:** if the diff cannot be expressed surgically (high chance of full-file rewrite / truncation) → META, not a low-quality partial write.

### During coding

5. **Match realism:** new materials should look like concrete/timber/clay under current lights (no unlit neon, no pure white plastic unless intentional finish).
6. **No regressions:** do not remove or gut unrelated systems (Sky, locks, layers, other PartKinds) to make the new bit work.
7. **Dispose / leaks:** any new textures, geometries, or materials created at runtime must follow existing dispose patterns when parts are removed or finishes swap.
8. **Labels:** every new user-facing string has EN and ES; no hardcoded single-language UI.
9. **Mobile-aware:** UI changes must remain usable on narrow viewports (touch targets, no critical control only on hover).

### After coding (definition of done)

10. **Monolith gates** (anti-wipe table) still pass.
11. **Acceptance test** from step 2 is described in the Spanish summary as steps a human can run in preview.
12. **Deploy READY** (or FIX-BUILD exhausted honestly) — do not mark success on ERROR.
13. Prefer a **small, correct** diff over a large, half-wired feature.

### Anti-patterns (reject)

- “Polish” that only renames variables or reorders imports with no visual/behavior change.
- New PartKind without swatch, labels, or placement path (dead code).
- Texture that is solid color / broken UV / missing map when neighbors have procedural detail.
- Claiming FPS win after removing Sky/shadows without numbers.
- Shipping under truncation: incomplete file body.

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

<!-- end:house-modeler.md -->
