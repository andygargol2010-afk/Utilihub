# UtiliHub House Modeler — Rules (1/3)

**Part 1 of 3.** Repo `andygargol2010-afk/Utilihub`, branch `fix/spanish-complete` only.

Load order every run:
1. `.agent/house-modeler-state.md` (runs_done / runs_max / monolito notes) — **required**
2. `.agent/house-modeler.md` (this file — IMMUTABLE + anti-wipe + multi-locale)
3. `.agent/house-modeler-ops.md` (MODE, PRODUCT tasks, FIX-BUILD, META, summary)

**Truncation protocol:** If a read is incomplete (missing end marker, mid-sentence cut, or tool truncation), do **not** invent the tail. Re-fetch; then section-by-section; if still incomplete stop and report in Spanish.

When state changes (especially `runs_done`): edit **house-modeler-state.md** **in the same commit** as the code change. Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

| ID | Value |
| --- | --- |
| This automation task_id | `de5837d5-b00f-44e6-b175-53e118555f9b` |
| Fightersland (enable at cap) | `9dc1bead-17e3-47f8-898c-2cc98d13f022` |
| Primary file | `src/components/general/HouseModeler3D.tsx` |
| Vercel project | `utilihub` |
| Restore workflow | id `375758025` / `restore-house-modeler.yml` |

---

## Role

You improve UtiliHub **3D House Modeler** (Modelador de casas 3D) — the interactive Three.js house builder.

**Goal per PRODUCT run:** exactly **one** focused, shippable improvement. Keep a realistic architectural look.

**Not your job:** catalog tool factory, Ideas Lab, Fightersland, production promote, Adsterra core (except RUN LIFETIME handoff).

**Exception (~10% rolls):** MODE **MODELADOR-3D** via `.agent/modeler-3d*.md` — not this monolith.

Reply in **Spanish** at the end of every run.

---

## IMMUTABLE

1. ONLY branch `fix/spanish-complete`. Never main. Never promote to production.
2. COMMIT IDENTITY: andygargol2010-afk / andygargol2010@gmail.com only.
3. Never create/delete/update other automations except Fightersland enable at runs_max.
4. Never change cadence of this or other autos.
5. Surgical edits only on HouseModeler3D; no full-file rewrite via tool channel if >300KB risk.
6. EN+ES labels for user-visible strings.
7. Honesty on deploy/push/monolith size.

---

## ANTI-WIPE MONOLITH

Protected: `src/components/general/HouseModeler3D.tsx`

- Never PLACEHOLDER / stub / truncated body.
- Before edit: size ≥120000 bytes; paint helpers + Sky present.
- If wiped → RESTORE path (Actions workflow), not hand-written stub.
- Prefer META when only option is dangerous full rewrite.

---

## DEPLOY BUDGET (Hobby ~100 deploys/day — mandatory)

1. **PRODUCT + `runs_done` in the same commit.** Update `.agent/house-modeler-state.md` together with the code change. Never a follow-up `docs(agent)`-only commit for the counter.
2. **Forbidden:** separate META/docs push after PRODUCT solely to bump `runs_done` (doubles deploys).
3. META with no file changes → **do not push**.
4. Ops file must end with `<!-- end:house-modeler-ops.md -->`. If wiped/truncated, re-fetch; do not invent MODE steps.

<!-- end:house-modeler.md -->
