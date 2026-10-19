# UtiliHub House Modeler — State (3/3)

**Part 3 of 3 — runtime state only.** End marker: `<!-- end:house-modeler-state.md -->`.

If truncated: re-fetch immediately. Keep this file **small** so it always loads complete.

Edit state in the **same commit** as the counting run’s code/docs change (PRODUCT / FIX-BUILD / META with work). Never a second deploy-only commit for `runs_done`.  
Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

| | |
| --- | --- |
| task_id | `de5837d5-b00f-44e6-b175-53e118555f9b` |
| Fightersland on cap | `9dc1bead-17e3-47f8-898c-2cc98d13f022` |

---

## RUN LIFETIME

```
runs_done: 209
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
approx_bytes: 341643
last_known_good_hint: ce9fcf932254 (~341643 bytes)
policy: prefer META when create_or_update_file would full-rewrite >300KB (tool-channel truncation risk)
Actions restore workflow_id: 375758025
```

Update `approx_bytes` / SHA after successful surgical PRODUCT or RESTORE verification.

---

## LAST RUN SNAPSHOT

```
last_mode: PRODUCT
last_date: 2026-10-19
SEO_LOCALES_ACTIVE: none
deploy: ERROR (unrelated missing pyramid-volume-calculator-tool from other surface; prior READY)
note: PRODUCT run 209 — densify lawn worn-earth patches (9 patches, varied tones) via local clone + push. Monolith ~341643 bytes blob ce9fcf93; gates OK (paint helpers, Sky, door=1). Build ERROR not caused by this change.
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
Monolith SHA e9bd8ec after PRODUCT run 193 (plaster densify). Previous gravel ffe82f8 / catalog 25026e8.
Monolith SHA 33c73a7 after PRODUCT run 194 (timber densify).
Monolith SHA c673fe0 after PRODUCT run 195 (clay densify).
Monolith SHA 2ca3a66 after PRODUCT run 196 (Sky enrich).
Monolith SHA 7410e8a after PRODUCT run 197 (foundation densify).
Unrelated catalog ERROR fixed; surface intact.
MODELADOR-3D plastic preset at 5b2a3af / cb5c0b7.
META run 198: confirmed READY deploys post-7410e8a; monolith size healthy; SEO locales none.
Monolith SHA df0b233 after PRODUCT run 199 (gravel densify).
Monolith SHA 63335a3 after PRODUCT run 200 (ashlar masonry densify).
Monolith SHA 298f51d after PRODUCT run 201 (chimney brick densify).
Monolith SHA fa241f92 after PRODUCT run 202 (door metal densify).
MODELADOR-3D rubber preset at 976dcd0d.
Monolith SHA 484b4d9 after PRODUCT run 204 (window timber sash densify).
META run 205: health check OK; current HEAD b53dd565 (catalog); monolith intact.
PRODUCT run 206: grass densify at 525771d (~341531 bytes).
META run 207: verified monolith ~354964 bytes SHA 26805be0 intact (paint helpers, Sky, finishes present); deploys READY; SEO none.
META run 208: roll 7 → PRODUCT candidate (worn-earth densify prepared locally); deferred to META for safety (no git push auth in sandbox; avoid tool-channel full rewrite of >300KB). Next PRODUCT should use authenticated local clone + push for paintWornEarth densify.
```

<!-- end:house-modeler-state.md -->
