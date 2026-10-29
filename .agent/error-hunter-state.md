# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a change ships (code + catalog/state). **No commit if nothing found / nothing to prevent.** No deploys. PRE-PUSH SELF-REVIEW a–d.

**MODE:** each run is **HUNT** (find+fix) or **PREVENT** (capacity/guards so other autos do not break the tree). Target ~50/50. See `error-hunter.md` § MODE.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-29 run 44
last_mode: HUNT
last_fix: none
last_prevent: none
last_known_focus: E031 recurring ($(cat / PLACEHOLDER) — critical files clean: no $(cat in src, homes index/es.index start with import, registry.tsx thin real content no PLACEHOLDER)
new_findings: no new user-facing breaks. Sampled /es (home loads, 956 tools), /es/juegos/tetris (loads + controls), /tools/3d-modeler (studio UI), /es/herramientas/calculadora-iva (dedicated UI), /es/herramientas/png-a-jpg (file upload, not calc), /tools/modelador-casas-3d (HouseModeler correct), /es/juegos/snake (loads), /es/herramientas/generador-de-contrasenas (SEO + crypto), /es/guias/orbit-pulse-catcher (full guide). No "Tool not available" in live pages, no kind mismatch, no deploy ERROR. Old ERROR (dpl_GPXW... on 027e2060) was AuroraRibbonWeaver export missing; fixed in later commits.
deploy: latest READY 6ad2ca3 (production, dpl_4c9bRZHGmDMz1RHieKLyYRDDLiEL). No ERROR/BUILDING in recent list.
notes: Known smoke E031 green (critical files real). Discovery: home ES, tetris, 3D modeler, IVA calc, PNG-to-JPG, house modeler, snake, password gen, guide all load correctly on prod (utilihub.net). No fixes this run — checks OK.
```

<!-- end:error-hunter-state.md -->
