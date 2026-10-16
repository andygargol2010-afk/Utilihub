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
runs_done: 158
runs_max: 500
```

- End of counting run → `runs_done += 1` (this file + commit).
- Never raise `runs_max` or reset without user request.
- When `runs_done >= runs_max` → pause this auto + enable Fightersland (see rules). **STOP**.

---

## FORCE FOCUS — MOBILE UI (temporary)

```
status: active
remaining_runs: 3
task: IMPROVE UI — mobile comfort only
desktop: MUST stay visually/behaviorally the same (use CSS max-width / touch breakpoints; no desktop layout redesign)
scope_examples:
  - larger touch targets on tool/part/finish controls under ~768px
  - stack or sheet panels that currently overflow on small screens
  - safer spacing for thumbs; avoid hover-only critical actions on mobile
  - reduce accidental mis-taps (padding, hit area, sticky primary actions)
out_of_scope:
  - changing desktop sidebar/palette layout
  - new PartKinds, textures, graphics, or unrelated bugs (unless blocking mobile UI ship)
  - full monolith rewrite
on_each_success:
  - remaining_runs -= 1
  - if remaining_runs hits 0 → set status: done and remove or clear this FORCE FOCUS block next META/PRODUCT close
  - still bump runs_done as usual
if_FIX-BUILD_or_RESTORE:
  - do not consume remaining_runs (mobile focus waits until PRODUCT mobile UI ships)
if_truncation_risk:
  - META is allowed without consuming remaining_runs; resume FORCE on next safe PRODUCT
```

User request 2026-10-16: next 3 executions focus on making the UI more comfortable for phone users; PC unchanged.

---

## MONOLITH NOTES

```
path: src/components/general/HouseModeler3D.tsx
approx_bytes: 330509
last_known_good_hint: edfe18bbbda25d89e49481a35bc79b7f1b3be1bb (~330509 bytes, 7490 lines)
policy: prefer META when create_or_update_file would full-rewrite >300KB (tool-channel truncation risk)
Actions restore workflow_id: 375758025
```

Update `approx_bytes` / SHA after successful surgical PRODUCT or RESTORE verification.

---

## LAST RUN SNAPSHOT

```
last_mode: META
last_date: 2026-10-16
SEO_LOCALES_ACTIVE: none
deploy: READY
note: FORCE mobile UI active (remaining 3); PRODUCT deferred due to 330509B truncation risk on full rewrite. Monolith verified intact (7490 lines, SHA edfe18bb…). Precise surgical map for next safe PRODUCT:
1) 15 <kbd> tags (lines ~6153-6381): append " max-md:hidden" to each className so shortcuts hide under ~768px.
2) aside palette (line ~6541): change paletteCompact ? "w-[4.75rem]" → "w-[4.75rem] max-md:w-[5.25rem]" (slightly wider thumb room only on mobile).
3) palette finish buttons (min-h-11 at ~6583,6614,6645 etc.): change "min-h-11" → "min-h-11 max-md:min-h-14" for larger hit areas on mobile; desktop unchanged.
No remaining_runs consumed.
```

Refresh after each run.

---

## NOTES

```
Bootstrap automation only points here — expand rules in house-modeler.md / ops.
Counter source of truth: this file (not the automation prompt field).
FORCE FOCUS mobile UI active: remaining_runs 3.
Truncation barrier confirmed; surgical PRODUCT requires non-truncating full-content push or line-level edit. Prefer META until safe channel confirmed.
Next PRODUCT: apply the three max-md: changes above once a verified full-body write is possible without truncation.
```

<!-- end:house-modeler-state.md -->
