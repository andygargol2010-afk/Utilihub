# UtiliHub House Modeler — Ops (2/3)

**Part 2 of 3.** End marker: `<!-- end:house-modeler-ops.md -->`.

If truncated: re-fetch; do not guess MODE.

---

## MODE (every run)

0. Load state → rules → ops. Read RUN LIFETIME; if at cap → pause + activate Fightersland + STOP.
1. Deploy check (Vercel utilihub / fix/spanish-complete). House-modeler ERROR → FIX-BUILD only.
2. Monolith bytes <120000 or PLACEHOLDER → RESTORE only (rules D); no PRODUCT.
3. Else roll 1–10: **1 = META**; **2–10 = PRODUCT** (tasks 1–6).
4. Declare: mode, roll, runs_done/runs_max, MULTI-LOCALE result (codes + shipped/deferred/n-a).

---

## PRODUCT TASKS (one per run)

1. **POLISH DEFAULT TEXTURES** — one PartKind ≤512px procedural.
2. **IMPROVE GRAPHICS** — light / shadow / sky / fog / ground; protect FPS.
3. **IMPROVE UI** — palette, fullscreen, selection, mobile, finish variants (EN+ES; SEO locale copy only if multi-locale review says ship).
4. **FIX BUGS** — ghosts, drag, resize, dispose, snap, clone finishes, TS/JSX.
5. **NEW STRUCTURE TYPE** — one new PartKind + mesh + swatch + ES/EN.
6. **SELECTABLE TEXTURE VARIANT** — one new finish on existing PartKind.

### PRODUCT procedure

- Only if monolith ≥120000 bytes.
- Surgical edit only; never full rewrite under truncation risk.
- One push: `feat(house-modeler): …` or `fix(house-modeler): …`.
- POST-PUSH deploy check. If no deploy in ~90s → force `create_deployment` for the SHA.
- Bump `runs_done` +1 in state file + commit.

---

## FIX-BUILD

Deploy ERROR: logs → minimal fix → push → re-check. Max **2** attempts. No new features.

If wiped/truncated monolith → RESTORE path (rules), not hand rewrite.

---

## META (roll 1)

Prefer editing `.agent/house-modeler*.md` over lengthening the automation bootstrap.

Allowed:

- Reinforce anti-wipe / restore / multi-locale with evidence.
- Bump `runs_done` if a prior run forgot.
- Document truncation risk and last known-good SHA in state.

Forbidden:

- Raise `runs_max` or reset `runs_done` without user request.
- Weaken ANTI-WIPE / Actions restore / identity.
- Touch other automations except documenting Fightersland handoff.

Still bump `runs_done` after a real META that did work (state commit).

---

## Spanish summary template

```
Modo: PRODUCT|META|FIX-BUILD|RESTORE (roll N)
runs_done / runs_max: …
Monolito: bytes / SHA / intacto|restaurado
MULTI-LOCALE: SEO_LOCALES_ACTIVE=… | acción: shipped|deferred|n-a
Qué cambió: …
Deploy: READY|ERROR|BUILDING + URL
Identidad: andygargol2010@gmail.com
Pasos de prueba: …
```

---

## ALWAYS

- Identity fixed. Spanish summary.
- Truncation risk on monolith → META, not blind full rewrite.
- Deploy check first. runs_max reached → pause modeler + enable Fightersland.
- State file is source of truth for runs_done/runs_max.
- `.agent/house-modeler*.md` win over bootstrap.

<!-- end:house-modeler-ops.md -->
