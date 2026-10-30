# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a change ships (code + catalog/state). **No commit if nothing found / nothing to prevent.** No deploys. PRE-PUSH SELF-REVIEW a–d.

**MODE:** each run is **HUNT** (find+fix) or **PREVENT** (capacity/guards so other autos do not break the tree). Target ~50/50. See `error-hunter.md` § MODE.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-30 run 52
last_mode: HUNT
last_fix: none
last_prevent: none
last_known_focus: E031 recurring ($(cat / PLACEHOLDER) — critical files clean: no $(cat/PLACEHOLDER in src via code search, homes index/es.index start with import + createFileRoute, registry.tsx full no PLACEHOLDER; remains open for vigilance)
new_findings: sampled www.utilihub.net /es (home OK, 956 tools, no 404), /es/herramientas/calculadora-iva (dedicated UI Sumar/Extraer IVA, result 121, mild mixed ES+EN in about), /tools/modelador-3d (proper 3D modeler not House), /es/herramientas/comprimir-imagen (image-specific steps, not numeric — E002 green), /es/juegos/snake (OK). No "Tool not available" as crash, no kind mismatch, no deploy ERROR on tip. Production READY on 6ad2ca3.
deploy: latest production READY dpl_4c9bRZHGmDMz1RHieKLyYRDDLiEL on 6ad2ca3. No recent ERROR on tip.
notes: Known smoke E031 green. Discovery: no new runtime/routing/registry/critical SEO/tool bugs. Mild mixed-language in some tool descs (IVA about) noted but not broken. No fixes this run — checks OK.
```

<!-- end:error-hunter-state.md -->
