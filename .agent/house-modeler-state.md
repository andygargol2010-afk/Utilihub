# UtiliHub House Modeler — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:house-modeler-state.md -->`.

If truncated: re-fetch immediately. Keep this file **small** so it always loads complete.

Edit + commit after each counting run (PRODUCT / FIX-BUILD / META with work).  
Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

| | |
| --- | --- |
| task_id | `de5837d5-b00f-44e6-b175-53e118555f9b` |
| Fightersland on cap | `9dc1bead-17e3-47f8-898c-2cc98d13f022` |

---

## RUN LIFETIME

```
runs_done: 173
runs_max: 500
```

- End of counting run → `runs_done += 1` (this file + commit).
- Never raise `runs_max` or reset without user request.
- When `runs_done >= runs_max` → pause this auto + enable Fightersland (see rules). **STOP**.

---

## FORCE FOCUS — MOBILE UI (temporary)

```
status: done
remaining_runs: 0
note: completed after PRODUCT run 163 (larger secondary controls + spacing under 768px)
```

User request 2026-10-16: next 3 executions focus on making the UI more comfortable for phone users; PC unchanged. Completed.

---

## MONOLITH NOTES

```
path: src/components/general/HouseModeler3D.tsx
approx_bytes: 334243
last_known_good_hint: 3aef1d7 (~334243 bytes, verified 2026-10-17 PRODUCT timber cracks)
policy: prefer META when create_or_update_file would full-rewrite >300KB (tool-channel truncation risk)
Actions restore workflow_id: 375758025
```

Update `approx_bytes` / SHA after successful surgical PRODUCT or RESTORE verification.

---

## LAST RUN SNAPSHOT

```
last_mode: PRODUCT
last_date: 2026-10-17
SEO_LOCALES_ACTIVE: none
deploy: READY https://utilihub-2rbp6kmi6-financialproyects.vercel.app (forced)
note: Roll 4 → PRODUCT task 1 POLISH DEFAULT TEXTURES (timber). Local-clone surgical: added fine check cracks to paintTimber. Monolith 334243 bytes intact; paint helpers + door conditional=1.
```

Refresh after each run.

---

## NOTES

```
Bootstrap automation only points here — expand rules in house-modeler.md / ops.
Counter source of truth: this file (not the automation prompt field).
FORCE FOCUS mobile UI: done (remaining_runs 0).
Surgical PRODUCT succeeded via local git clone + edit + push (this run and prior) — credential helper allowed push after rebase. Prefer local-clone surgical when PRODUCT.
Next runs: normal roll (META/PRODUCT); prefer local-clone surgical when PRODUCT if auth available.
Monolith SHA blob updated after timber cracks PRODUCT.
Unrelated catalog ERROR on older deploys does not block this surface.
Monolith SHA blob 06d6c285 verified intact this META.
```

<!-- end:house-modeler-state.md -->
