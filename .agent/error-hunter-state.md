# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a change ships (code + catalog/state). **No commit if nothing found / nothing to prevent.** No deploys. PRE-PUSH SELF-REVIEW a–d.

**MODE:** each run is **HUNT** (find+fix) or **PREVENT** (capacity/guards so other autos do not break the tree). Target ~50/50. See `error-hunter.md` § MODE.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-29 run 38
last_mode: HUNT
last_fix: none
last_prevent: none
last_known_focus: E031 recurring ($(cat / PLACEHOLDER) — critical files clean: no $(cat in src, homes index/es.index start with import, registry.tsx thin no PLACEHOLDER; E041 calculadora-iva loads with dedicated UI on prod)
new_findings: none. Sampled: /es home OK, /es/juegos + snake OK, /es/herramientas/modelador-3d loads Modeler3D (cubes/spheres, not House), calculadora-semilla-cesped, generador-robots-txt, validador-iban all load with proper UI. No "Tool not available" or kind mismatch observed in samples.
deploy: latest READY 6ad2ca3 (production); post-run37 commits exist but not yet in latest listed deploy (or already reflected since iva loads). No ERROR.
notes: Known smoke E031 green, E041 verified working on live. Discovery path sampled games/studio/home/other tools outside catalog focus — all green. No fixes this run.
```

<!-- end:error-hunter-state.md -->
