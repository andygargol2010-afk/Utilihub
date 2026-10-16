# UtiliHub House Modeler — Ops (2/3)

**Part 2 of 3.** End marker: `<!-- end:house-modeler-ops.md -->`.

If truncated: re-fetch; do not invent MODE or PRODUCT steps.

---

## MODE (every run)

0. Load **state → rules → ops**. Honor truncation protocol.
1. **RUN LIFETIME:** if `runs_done >= runs_max` → pause this auto, enable Fightersland, Spanish stop message, **end**.
2. **DEPLOY CHECK** (start): list Vercel project `utilihub`, branch `fix/spanish-complete`.
   - **ERROR** on a deployment caused by this surface → FIX-BUILD only.
   - **BUILDING / QUEUED** → note; avoid risky PRODUCT.
   - **READY** → continue.
3. **Monolith health:** read size (and spot-check for PLACEHOLDER / missing paint helpers). If bytes <120000 or wiped → **RESTORE only** (rules D); no PRODUCT.
4. **FORCE FOCUS** (state file): if `FORCE FOCUS — MOBILE UI` has `status: active` and `remaining_runs > 0`:
   - Skip normal roll. Mode = **PRODUCT** task **3 IMPROVE UI** only.
   - Goal: more comfortable **phone** UI; **desktop must stay the same** (breakpoint-scoped CSS / touch targets; no desktop redesign).
   - On successful mobile-UI PRODUCT: decrement `remaining_runs` in state; at 0 set status `done` and clear the FORCE block.
   - FIX-BUILD / RESTORE / truncation-META do **not** decrement `remaining_runs`.
5. Else roll integer **1–10**:
   - **1** → META (~10%)
   - **2** → **MODELADOR-3D** (~10%): improve the **generic** 3D modeler (`modelador-3d` / Tinkercad-style), **not** the house modeler. Load and follow:
     1. `.agent/modeler-3d-state.md`
     2. `.agent/modeler-3d.md`
     3. `.agent/modeler-3d-ops.md`
     Do **not** edit `HouseModeler3D.tsx` in this mode. Still bump `runs_done` when the run counts.
   - **3–10** → PRODUCT house modeler (tasks 1–6 below)
6. Declare at start: mode, roll or FORCE, `runs_done`/`runs_max`, multi-locale snapshot, FORCE remaining if any. If MODELADOR-3D: state task from modeler-3d-ops.

---

## PRODUCT TASKS (exactly one per PRODUCT run)

### 1) POLISH DEFAULT TEXTURES

- Target **one** `PartKind` (wall, roof, floor, etc.).
- Procedural or canvas texture ≤ **512px** where applicable.
- Keep material response realistic (roughness/metalness consistent with concrete/timber/clay).
- Do not replace the whole texture system.
- **Done when:** in preview, that PartKind shows a clear visual upgrade (detail/variation) without pink textures, UV stretch, or breaking other kinds.

### 2) IMPROVE GRAPHICS

- One focused change: light, shadow, sky, fog, ground, or exposure/tone.
- **Protect FPS:** if a change tanks frame time on mid mobile, dial back or gate quality.
- Never remove Sky or soft shadows “for performance” without before/after evidence noted in summary.
- **Done when:** the scene reads better (depth, contact, sky) and the modeler remains interactive; summary states what improved and any FPS tradeoff.

### 3) IMPROVE UI

- Palette, fullscreen, selection feedback, mobile layout, finish variant picker, lock badges clarity.
- All new strings **EN+ES**.
- SEO locale copy only if multi-locale review says ship **and** the change is outside a monolith-risk write.
- **Done when:** the targeted control is easier to find/use on desktop and a narrow viewport; no dead buttons or clipped panels.
- **When FORCE FOCUS mobile is active:** optimize **only** under mobile breakpoints (~768px and below). Desktop (≥768px) layout and density must remain unchanged. Prefer larger hit areas, less overflow, thumb-friendly stacking. Acceptance test must include a narrow-viewport check and a desktop “unchanged” check.

### 4) FIX BUGS

- Ghosts, drag glitches, resize, dispose leaks, snap, clone finishes, TS/JSX errors, door/window placement bugs.
- Prefer the smallest diff that fixes the bug.
- Re-check door conditional count = 1 before push.
- **Done when:** the reported failure mode no longer reproduces in the test steps; no new placement/selection regression called out in summary.

### 5) NEW STRUCTURE TYPE

- Exactly **one** new `PartKind` + mesh + swatch + ES/EN labels.
- Wire into existing placement/selection patterns; do not invent a second architecture.
- Catalog/registry only if the monorepo requires it for the tool to list the kind.
- **Done when:** user can select the kind, place it, see correct mesh+material, and labels appear in EN and ES — incomplete stubs are not shippable.

### 6) SELECTABLE TEXTURE VARIANT

- One new finish on an **existing** PartKind (e.g. extra plaster or timber variant).
- Swatch + labels EN/ES; selectable in UI.
- **Done when:** choosing the swatch applies the finish to the selected part and persists for that selection path like other finishes.

### PRODUCT procedure (all tasks)

1. Confirm monolith ≥120000 bytes **before** editing.
2. **Pre-read:** locate a similar working block (PartKind / material / UI) and note the pattern you will mirror.
3. Write a one-line **acceptance test** (what the user must see/do in preview).
4. Plan a **surgical** change. If the only path is full-file rewrite of >300KB via tool channel → **abort PRODUCT**, switch to META, document risk in state.
5. Implement against the QUALITY BAR (rules file): realism, dispose, EN+ES, Core Web Vitals boundaries, no unrelated gutting.
6. Self-check before push:
   - paint helpers still present; door conditional exactly once; no PLACEHOLDER
   - new strings EN+ES
   - acceptance test still valid
   - diff is minimal for the stated outcome
7. Commit: `feat(house-modeler): …` or `fix(house-modeler): …` with fixed identity. Message states the user-visible outcome.
8. POST-PUSH: wait ~60–90s; list deploy for SHA. If no deploy → force `create_deployment` for that SHA on fix/spanish-complete.
9. On READY (or after FIX-BUILD success): bump `runs_done` +1 in state + commit.
10. Spanish summary: acceptance steps, what was verified, monolith health, multi-locale line.

### Quality ranking when choosing a task (roll 2–10)

If several tasks are plausible, prefer in order:

1. **FIX BUGS** with a clear user-facing break
2. **IMPROVE UI** that unblocks mobile or selection clarity
3. **POLISH / VARIANT** that raises perceived material quality
4. **GRAPHICS** with FPS-safe, evidence-minded change
5. **NEW STRUCTURE** only when patterns are clear and labels+swatch+placement all fit one run

Skip “busywork” PRODUCT that does not change what the user sees or can do.

---

## FIX-BUILD

When deploy is ERROR or modeler route is broken:

1. Read Vercel build/runtime logs.
2. Minimal fix only (syntax, import, one conditional).
3. Push → re-check. Max **2** attempts per run.
4. No new PartKinds or texture systems while fixing.
5. If root cause is truncated/wiped monolith → RESTORE path (rules), not a hand-written stub.

---

## META (roll = 1)

Prefer improving `.agent/house-modeler*.md` and state notes over lengthening the automation bootstrap.

**Allowed**

- Reinforce anti-wipe, restore steps, multi-locale, or PRODUCT task clarity with evidence from last results.
- Bump `runs_done` if a prior counting run forgot.
- Record last known-good SHA / byte size in state after verification.
- Tiny bootstrap fix only if load-order instructions broke.

**Forbidden**

- Raise `runs_max` or reset `runs_done` without user request.
- Weaken ANTI-WIPE / Actions restore / identity.
- Pause/create other automations except documenting Fightersland handoff.
- Full monolith rewrite “as META”.

After META that did real work (state/docs commit or verified health check worth counting): bump `runs_done` +1.

---

## POST-PUSH / PREVIEW

- Always verify deployment for the pushed SHA.
- GITHUB_TOKEN pushes may not trigger Vercel webhook → use create_deployment when listing shows nothing after ~90s.
- Summary must include READY | ERROR | BUILDING and URL when available.

---

## Spanish summary template

```
Modo: PRODUCT|META|FIX-BUILD|RESTORE|MODELADOR-3D (roll N)
runs_done / runs_max: …
Monolito: ~bytes | SHA | intacto|restaurado|riesgo truncado
MULTI-LOCALE: SEO_LOCALES_ACTIVE=[…] | acción: shipped|deferred|n-a
Cambio: … (user-visible)
Criterio de aceptación: …
Commits: …
Deploy: READY|ERROR|BUILDING + URL
Monolito gates: OK|fallo
Identidad: andygargol2010@gmail.com
Pasos de prueba: abrir modeler → …
FORCE mobile remaining_runs: … (si aplica)
Handoff: (solo si cap) Fightersland activado
```

---

## ALWAYS

- ~10% of non-FORCE rolls are MODELADOR-3D (generic Tinkercad-style modeler); follow `.agent/modeler-3d*.md` and never touch the house monolith in that mode.
- Respect Core Web Vitals boundaries: no eager modeler on home/lists; dispose resources; FPS-safe graphics; mobile CSS without desktop CLS.
- Quality of monolith integrity > shipping a risky feature.
- User-visible correctness > lines changed.
- Deploy ERROR > new PartKind.
- No acceptance test in the summary → treat the run as incomplete.
- State file owns the counter.
- Truncation → re-read files; never invent rules.
- Spanish, honest summary every run.
- At `runs_max`: pause modeler, enable Fightersland, stop.

<!-- end:house-modeler-ops.md -->
