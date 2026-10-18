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
runs_done: 189
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
approx_bytes: 337721
last_known_good_hint: 2923d49 (~337721 bytes, plaster densified; ready for deploy check)
policy: prefer META when create_or_update_file would full-rewrite >300KB (tool-channel truncation risk)
Actions restore workflow_id: 375758025
```

Update `approx_bytes` / SHA after successful surgical PRODUCT or RESTORE verification.

---

## LAST RUN SNAPSHOT

```
last_mode: MODELADOR-3D
last_date: 2026-10-18
SEO_LOCALES_ACTIVE: none
deploy: pending (5b2a3af)
note: Roll 2 → MODELADOR-3D MATERIALS: added plastic MatPreset (glossy clearcoat) + EN/ES labels in helpers. No house monolith touch.
```

Refresh after each run.

---

## NOTES

```
Bootstrap automation only points here — expand rules in house-modeler.md / ops.
Counter source of truth: this file (not the automation prompt field).
FORCE FOCUS mobile UI: done (remaining_runs 0).
Surgical PRODUCT succeeded via local git clone + edit + push. Prefer local-clone surgical when PRODUCT if auth available.
Plaster densify now pushed at 2923d49.
Monolith SHA 2923d49 after PRODUCT run 188.
Unrelated catalog ERROR on older deploys does not block this surface.
MODELADOR-3D plastic preset at 5b2a3af / cb5c0b7.
```

<!-- end:house-modeler-state.md -->
