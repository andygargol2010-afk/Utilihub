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
runs_done: 263
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
approx_bytes: 331826
last_known_good_hint: (post META 261 health 331826 B / 7519 lines, no PLACEHOLDER, SHA de1e458a)
policy: prefer META when create_or_update_file would full-rewrite >300KB (tool-channel truncation risk)
Actions restore workflow_id: 375758025
```

Update `approx_bytes` / SHA after successful surgical PRODUCT or RESTORE verification.

---

## LAST RUN SNAPSHOT

```
last_mode: MODELADOR-3D
last_date: 2026-10-25
SEO_LOCALES_ACTIVE: pt (defer)
deploy: READY (prior tip eb56ea51; recent catalog tip 372efa6c ERROR unrelated to modeler)
note: MODELADOR-3D hemisphere ShapeKind added (helpers only). Monolith untouched (331826 B / 7519 lines, no PLACEHOLDER). runs_done=263. Deploy not verified.
```

Refresh after each run.

---

## NOTES

```
Prefer local-clone surgical PRODUCT when auth available. Prefer META if only path is full rewrite >300KB via tool channel.
PRODUCT run 234: clay tiles densify (flecks 9→12, moss denser) via local clone surgical.
PRODUCT run 235: health check + deferred chimney-crown densify due to no sandbox push auth.
PRODUCT run 236: chimney crown densify (courses 4→5 + soot/flecks/lime) via local clone surgical.
PRODUCT run 237: worn-earth densify (grit/damp/leaf/cracks) via local clone surgical.
RESTORE 2026-10-20: failed PRODUCT push truncated to PLACEHOLDER; restored via Actions (06f436ec).
META run 238: confirmed READY deploy + monolith health; door-metal densify still queued for authenticated local push.
META run 239: reconfirmed monolith health (~351kB, no PLACEHOLDER), deploy READY, door densify deferred.
MODELADOR-3D run 240: concrete MatPreset added surgically in helpers.
RESTORE 2026-10-20: push_files literalized content; monolith restored via Actions (aa9dbdb7). Door densify still deferred.
META run 241: confirmed tip READY, monolith intact (~330kB SHA aa9dbdb7), door densify deferred due to truncation risk.
PRODUCT run 242: door sheet-metal densify (seams 5→7, rivets 6→9 + weathering) via local clone surgical. runs_done=242.
PRODUCT run 243: roof-metal densify (seams 7→9 + fastener dots + denser weathering) via local clone surgical. runs_done=243.
META run 244: confirmed READY deploy + monolith health (331247 B); railing-metal densify deferred (no push auth / truncation risk).
PRODUCT run 245: railing-metal densify (flutes 10→14 + flecks/weathering) via local clone surgical. runs_done=245. Its Vercel deploys ERROR'd on unrelated catalog duplicate slug (generador-lorem-ipsum); subsequent catalog fixes made tip READY.
META run 246: confirmed tip READY (6eb3bb0), monolith intact 331563 B / 7513 lines, no PLACEHOLDER. Grass densify deferred (no sandbox push auth).
META run 247: confirmed monolith intact 331564 B / 7514 lines, no PLACEHOLDER. Tip e34109a has ERROR deploy from other agents (registry restore + playgrounds). Grass densify deferred again (truncation risk). runs_done=247.
META run 248: confirmed monolith intact 331335 B / 7514 lines, no PLACEHOLDER. Grass densify deferred (no sandbox push auth / truncation risk on full rewrite). Recent tip ERROR from playgrounds (unrelated). runs_done=248.
PRODUCT run 249: grass densify (clumps 48→64, blades 30→42, wear 6→8; relief clumps 70→90, blades 46→60) via local clone surgical. runs_done=249.
PRODUCT run 250: gravel densify (pebbles 120→160, larger stones 18→24, moss patches 8→12, rake lines 7→10) via local clone surgical. runs_done=250.
PRODUCT run 251: foundation board-formed densify (boards 4→5 + denser dust/stains) via local clone surgical. runs_done=251.
META run 252: confirmed tip READY + monolith health (331568 B / 7513 lines, no PLACEHOLDER). Wall-masonry densify deferred (no sandbox push auth / truncation risk). runs_done=252.
PRODUCT run 253: wall-masonry densify (cols 4→5, rows 7→8 + denser flecks/weathering) via local clone surgical. runs_done=253.
PRODUCT run 254: plaster densify (flecks/trowel/dirt/micro-pits) via local clone surgical. runs_done=254.
PRODUCT run 255: timber densify (mottling 18→26, grain 7→10, micro-fibers 4→6) via local clone surgical. runs_done=255.
META run 256: confirmed tip READY + monolith health (331827 B / 7520 lines, no PLACEHOLDER). runs_done=256.
META run 257: confirmed tip READY + monolith health (~345kB, SHA de1e458a, no PLACEHOLDER). Next densify deferred (truncation risk). runs_done=257.
MODELADOR-3D run 258: added pyramid ShapeKind (ConeGeometry 4 sides) fully wired in modeler3d-helpers (type/geometry/size/labels/list). Surgical. No HouseModeler3D touch. runs_done=258.
META run 259: confirmed tip READY + monolith health (331826 B, no PLACEHOLDER, SHA de1e458a). Chimney-brick densify deferred due to tool-channel truncation risk. runs_done=259.
META run 260: confirmed tip READY (eb56ea51) + monolith health (~345kB, SHA de1e458a, no PLACEHOLDER). Chimney-brick densify deferred (tool-channel truncation risk on >300kB rewrite). runs_done=260.
META run 261: confirmed monolith health 331826 B / 7519 lines / SHA de1e458a / no PLACEHOLDER. Recent catalog tip ERROR unrelated. Chimney-brick densify deferred (tool-channel truncation risk). runs_done=261.
MODELADOR-3D run 262: pyramid base aligned to axes (rotateY 45deg) + distinct palette icon. Surgical. runs_done=262.
MODELADOR-3D run 263: hemisphere ShapeKind (closed lathe dome) wired in modeler3d-helpers. Surgical, tsc OK. runs_done=263.
```

<!-- end:house-modeler-state.md -->
