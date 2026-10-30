# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a change ships (code + catalog/state). **No commit if nothing found / nothing to prevent.** No deploys. PRE-PUSH SELF-REVIEW a–d.

**MODE:** each run is **HUNT** (find+fix) or **PREVENT** (capacity/guards so other autos do not break the tree). Target ~50/50. See `error-hunter.md` § MODE.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-29 run 48
last_mode: HUNT
last_fix: none
last_prevent: none
last_known_focus: E031 recurring ($(cat / PLACEHOLDER) — critical files clean: no $(cat in src, homes index/es.index start with import, no PLACEHOLDER in critical paths; remains open for vigilance)
new_findings: sampled www.utilihub.net / (home OK), /es (OK), /tools/calculadora-raiz-cubica (loads, SEO names tool), /games/2048 (OK), /tools/modelador-3d (proper 3D modeler), /es/herramientas/modelador-casas-3d (HouseModeler, guide slightly generic but names tool), /studio/prism-trail-composer (OK), /tools/png-to-jpg (image tool OK, kind-aware steps), /es/juegos/buscaminas (OK), /es/herramientas/calculadora-cuota-prestamo (loads). No deploy ERROR/BUILDING recent. No "Tool not available" as crash, no kind mismatch, no $(cat/PLACEHOLDER in critical. Branch tip 33951355 ahead of production SHA 6ad2ca3.
deploy: latest READY production dpl_4c9bRZHGmDMz1RHieKLyYRDDLiEL on 6ad2ca3. No recent ERROR/BUILDING on branch tip. Branch tip ahead.
notes: Known smoke E031 green. Discovery: no new runtime/routing/SEO/tool bugs on branch tip or live pages sampled. Production lag for newer tools/commits noted but no promote (immutable). No fixes this run — checks OK.
```

<!-- end:error-hunter-state.md -->
