# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a change ships (code + catalog/state). **No commit if nothing found / nothing to prevent.** No deploys. PRE-PUSH SELF-REVIEW a–d.

**MODE:** each run is **HUNT** (find+fix) or **PREVENT** (capacity/guards so other autos do not break the tree). Target ~50/50. See `error-hunter.md` § MODE.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-29 run 39
last_mode: HUNT
last_fix: none
last_prevent: none
last_known_focus: E031 recurring ($(cat / PLACEHOLDER) — critical files clean: no $(cat in src, homes index/es.index start with import, registry.tsx thin no PLACEHOLDER; E041 calculadora-iva loads with dedicated UI on prod)
new_findings: none. Sampled: /es home OK, /es/juegos + snake OK (game UI present), /es/herramientas/modelador-3d description cubes/spheres (not House), calculadora-iva dedicated Sumar/Extraer UI, png-a-jpg has file select. New hangman/ahorcado routes + catalog entry exist but 404 on live (latest READY deploy still 6ad2ca3). No "Tool not available" or kind mismatch.
deploy: latest READY 6ad2ca3 (production); newer commits (hangman etc.) not yet in listed deploy. No ERROR/BUILDING.
notes: Known smoke E031 green, E041 verified working on live. Discovery path sampled games/home/image tools + new hangman code (pending deploy) — all green where live. No fixes this run.
```

<!-- end:error-hunter-state.md -->
