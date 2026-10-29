# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a change ships (code + catalog/state). **No commit if nothing found / nothing to prevent.** No deploys. PRE-PUSH SELF-REVIEW a–d.

**MODE:** each run is **HUNT** (find+fix) or **PREVENT** (capacity/guards so other autos do not break the tree). Target ~50/50. See `error-hunter.md` § MODE.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-29 run 40
last_mode: HUNT
last_fix: none
last_prevent: none
last_known_focus: E031 recurring ($(cat / PLACEHOLDER) — critical files clean: no $(cat in src, homes index/es.index start with import, registry.tsx thin no PLACEHOLDER; E041 calculadora-iva loads with dedicated UI on prod)
new_findings: runtime log on prod shows soft catalog integrity duplicates (calculadora-area-triangulo, calculadora-interes-simple, calculadora-cambio-porcentual, calculadora-regla-de-tres, calculadora-imc, calculadora-porcentaje-de-numero) — first wins, site up; not user-facing break. Sampled: /es home OK, /es/juegos OK, /es/herramientas/modelador-3d description cubes/spheres (not House), calculadora-iva dedicated Sumar/Extraer UI, png-a-jpg, calculadora-imc SEO/guide OK. Hangman routes still not in live deploy (latest READY 6ad2ca3). No "Tool not available" or kind mismatch.
deploy: latest READY 6ad2ca3 (production); newer commits (hangman etc.) not yet in listed deploy. No ERROR/BUILDING.
notes: Known smoke E031 green, E041 verified working on live. Discovery path sampled games/home/image/3d/imc tools + runtime errors — all green where live; duplicate log noted but soft-fail (no fix this run, would require multi-file slug audit). No fixes this run.
```

<!-- end:error-hunter-state.md -->
