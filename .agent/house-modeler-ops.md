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
4. Else roll integer **1–10**:
   - **1** → META (~10%)
   - **2–10** → PRODUCT (pick one task 1–6 below)
5. Declare at start: mode, roll, `runs_done`/`runs_max`, multi-locale snapshot (codes + planned action).

---

## PRODUCT TASKS (exactly one per PRODUCT run)

### 1) POLISH DEFAULT TEXTURES

- Target **one** `PartKind` (wall, roof, floor, etc.).
- Procedural or canvas texture ≤ **512px** where applicable.
- Keep material response realistic (roughness/metalness consistent with concrete/timber/clay).
- Do not replace the whole texture system.

### 2) IMPROVE GRAPHICS

- One focused change: light, shadow, sky, fog, ground, or exposure/tone.
- **Protect FPS:** if a change tanks frame time on mid mobile, dial back or gate quality.
- Never remove Sky or soft shadows “for performance” without before/after evidence noted in summary.

### 3) IMPROVE UI

- Palette, fullscreen, selection feedback, mobile layout, finish variant picker, lock badges clarity.
- All new strings **EN+ES**.
- SEO locale copy only if multi-locale review says ship **and** the change is outside a monolith-risk write.

### 4) FIX BUGS

- Ghosts, drag glitches, resize, dispose leaks, snap, clone finishes, TS/JSX errors, door/window placement bugs.
- Prefer the smallest diff that fixes the bug.
- Re-check door conditional count = 1 before push.

### 5) NEW STRUCTURE TYPE

- Exactly **one** new `PartKind` + mesh + swatch + ES/EN labels.
- Wire into existing placement/selection patterns; do not invent a second architecture.
- Catalog/registry only if the monorepo requires it for the tool to list the kind.

### 6) SELECTABLE TEXTURE VARIANT

- One new finish on an **existing** PartKind (e.g. extra plaster or timber variant).
- Swatch + labels EN/ES; selectable in UI.

### PRODUCT procedure (all tasks)

1. Confirm monolith ≥120000 bytes **before** editing.
2. Plan a **surgical** change. If the only path is full-file rewrite of >300KB via tool channel → **abort PRODUCT**, switch to META, document risk in state.
3. Implement; run mental checklist: paint helpers present, door conditional once, no PLACEHOLDER.
4. Commit: `feat(house-modeler): …` or `fix(house-modeler): …` with fixed identity.
5. POST-PUSH: wait ~60–90s; list deploy for SHA. If no deploy → force `create_deployment` for that SHA on fix/spanish-complete.
6. On READY (or after FIX-BUILD success): bump `runs_done` +1 in state + commit.
7. Spanish summary with test steps (open modeler, try the changed PartKind/UI/graphics).

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
Modo: PRODUCT|META|FIX-BUILD|RESTORE (roll N)
runs_done / runs_max: …
Monolito: ~bytes | SHA | intacto|restaurado|riesgo truncado
MULTI-LOCALE: SEO_LOCALES_ACTIVE=[…] | acción: shipped|deferred|n-a
Cambio: …
Commits: …
Deploy: READY|ERROR|BUILDING + URL
Identidad: andygargol2010@gmail.com
Pasos de prueba: abrir modeler → …
Handoff: (solo si cap) Fightersland activado
```

---

## ALWAYS

- Quality of monolith integrity > shipping a risky feature.
- Deploy ERROR > new PartKind.
- State file owns the counter.
- Truncation → re-read files; never invent rules.
- Spanish, honest summary every run.
- At `runs_max`: pause modeler, enable Fightersland, stop.

<!-- end:house-modeler-ops.md -->
