# UtiliHub House Modeler — Rules (1/3)

**Part 1 of 3.** Repo `andygargol2010-afk/Utilihub`, branch `fix/spanish-complete` only.

Load order every run:
1. `.agent/house-modeler-state.md` (runs_done / runs_max / notes) — **required**
2. `.agent/house-modeler.md` (this file — IMMUTABLE + anti-wipe)
3. `.agent/house-modeler-ops.md` (MODE, PRODUCT, procedures)

**Truncation protocol:** If a read is incomplete (missing end marker, mid-sentence cut, or tool truncation), do **not** invent the tail. Re-fetch; section-by-section; if still incomplete stop and report in Spanish.

When state changes (especially `runs_done`): edit **house-modeler-state.md** and commit on `fix/spanish-complete` with identity `andygargol2010-afk` / `andygargol2010@gmail.com`.

task_id of this automation: `de5837d5-b00f-44e6-b175-53e118555f9b`  
Fightersland task_id (activate at runs_max): `9dc1bead-17e3-47f8-898c-2cc98d13f022`

---

## Role

You improve UtiliHub **3D House Modeler** (`HouseModeler3D` — Modelador de casas 3D).

One focused product improvement per normal PRODUCT run: textures, graphics, UI, bugs, new PartKind, or finish variant. Realistic style; EN+ES labels; protect the monolith from truncation/wipe.

Reply in **Spanish** at the end of every run.

---

## RUN LIFETIME

Read `runs_done` and `runs_max` from **house-modeler-state.md** at the start of every run (before MODE).

1. If `runs_done >= runs_max`:
   - `automation_pause` THIS task (`de5837d5-b00f-44e6-b175-53e118555f9b`) with `is_enabled: false`
   - `automation_pause` Fightersland (`9dc1bead-17e3-47f8-898c-2cc98d13f022`) with `is_enabled: true`
   - Spanish summary: «Límite de ejecuciones alcanzado; modeler pausado y Fightersland activado.» **STOP**
2. Otherwise continue. After a real PRODUCT / FIX-BUILD / META run (not RATE_LIMITED with no work): bump `runs_done` by +1 in **house-modeler-state.md**, commit, and do **not** raise `runs_max` or reset `runs_done` without explicit user request.
3. Optionally mirror the new `runs_done` into the short automation bootstrap if META is updating it — source of truth is the state file.

---

## IMMUTABLE (never edit / weaken / remove)

1. ONLY branch `fix/spanish-complete`. Never `main` for product edits (exception: trigger restore workflow on `main` ref only as documented in anti-wipe).
2. Primary file: `src/components/general/HouseModeler3D.tsx`. Catalog/registry only if a new PartKind requires it.
3. Realistic style: concrete / timber / clay, Sky, soft shadows, ACES. Not generic CAD look.
4. Product UI labels always **EN+ES**. SEO locales: see Multi-locale section.
5. Never change cadence/schedule. Never create/delete/update other automations **except** RUN LIFETIME handoff to Fightersland.
6. Meta may only update THIS automation’s bootstrap if load-order broke; prefer editing these `.md` files.
7. Files under `.agent/house-modeler*.md` win over the short automation bootstrap.

---

## COMMIT IDENTITY

Author **and** committer MUST be:
- name: `andygargol2010-afk`
- email: `andygargol2010@gmail.com`

FORBIDDEN: `agent@utilihub.net`, “UtiliHub Agent”, invented emails.

---

## ANTI-WIPE + ACTIONS RESTORE (critical)

Protected file: `src/components/general/HouseModeler3D.tsx` (monolith ~300KB+).

A. NEVER replace with stub / PLACEHOLDER / shell / short rewrite. After any edit: **≥3500 lines AND ≥120000 bytes**, else ABORT.
B. NEVER delete `paintPlaster` / `paintTimber` / `paintClayTiles` / Sky / lock badges / layers / finishes.
C. Surgical edits only. `create_or_update_file` on this file MUST send the **full** source ≥120000 bytes — the tool channel **truncates** large bodies. Prefer search_code + minimal patches. If truncation risk → skip PRODUCT, do META.
D. **RESTORE canónico** (if bytes <120000 or PLACEHOLDER/shell/stub or missing `makeCanvasTexture`/`paintPlaster`):
   1. Do **not** rewrite the monolith via create_or_update_file.
   2. Trigger GitHub Actions: `github___actions_run_trigger` method=run_workflow owner=`andygargol2010-afk` repo=`Utilihub` workflow_id=`375758025` (or `restore-house-modeler.yml`) ref=`main`.
   3. Poll workflow until completed. On success, verify size ≥120000 on fix/spanish-complete.
   4. POST-RESTORE Vercel: list deployments for that SHA. If no deploy in ~90s → `vercel___create_deployment` forceNew with gitSource github org=`andygargol2010-afk` repo=`Utilihub` ref=`fix/spanish-complete` sha=`<restore SHA>` project=`utilihub`. Poll READY/ERROR.
   5. Known-good reference commit: `a074b7a6c89b530e4c4655bc9711c70053c495d8` (~330KB blob).
E. Door conditionals `{(tool === "door" || selectedKind === "door") && (` must appear exactly **1** time before push.
F. POST-PUSH DEPLOY CHECK: list Vercel utilihub on fix/spanish-complete. ERROR → FIX-BUILD max 2. READY → URL in summary.

---

## Multi-locale (EN + ES + SEO)

1. Read `.agent/seo-locales-registry.md` and/or `src/lib/i18n/seo-locales.ts` → `SEO_LOCALES_ACTIVE`.
2. Empty → only EN+ES; note «SEO locales: none» in summary.
3. If active codes exist (max 5 SEO locales): decide explicitly for modeler-related routes — ship `/{code}/...` only if cheap and safe (no monolith rewrite); else defer in Spanish summary.
4. Do not invent a 6th SEO language. Do not add EN/ES nav links to SEO locales. Locale trees are Ideas Lab’s job.

<!-- end:house-modeler.md -->
