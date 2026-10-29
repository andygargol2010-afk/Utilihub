# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a change ships (code + catalog/state). **No commit if nothing found / nothing to prevent.** No deploys. PRE-PUSH SELF-REVIEW a–d.

**MODE:** each run is **HUNT** (find+fix) or **PREVENT** (capacity/guards so other autos do not break the tree). Target ~50/50. See `error-hunter.md` § MODE.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-29 run 41
last_mode: HUNT
last_fix: none
last_prevent: none
last_known_focus: E031 recurring ($(cat / PLACEHOLDER) — critical files clean: no $(cat in src, homes index/es.index start with import, registry.tsx thin real content no PLACEHOLDER; E041 calculadora-iva dedicated UI live)
new_findings: no new user-facing breaks. Sampled /es, /es/juegos (20 games listed), /es/herramientas/modelador-3d (cubes/spheres, not House), calculadora-iva dedicated Sumar/Extraer, png-a-jpg, calculadora-imc (SEO/guide names tool + formula), 3d-house-modeler (walls/floors/roofs). No "Tool not available" in live pages, no kind mismatch, no deploy ERROR. Runtime logs empty for last 30m (hobby plan limits). Soft catalog duplicates from prior note not re-verified as user break.
deploy: latest READY 6ad2ca3 (production, dpl_4c9bRZHGmDMz1RHieKLyYRDDLiEL). No ERROR/BUILDING in recent list.
notes: Known smoke E031 green (critical files real). Discovery: games, image, 3d studios, imc, house modeler all load correctly on prod. No fixes this run — checks OK.
```

<!-- end:error-hunter-state.md -->
