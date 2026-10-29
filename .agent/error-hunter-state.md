# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a change ships (code + catalog/state). **No commit if nothing found / nothing to prevent.** No deploys. PRE-PUSH SELF-REVIEW a–d.

**MODE:** each run is **HUNT** (find+fix) or **PREVENT** (capacity/guards so other autos do not break the tree). Target ~50/50. See `error-hunter.md` § MODE.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-29 run 37
last_mode: HUNT
last_fix: E041 (calculadora-iva 404 — missing from GENERAL_TOOLS index + UI wire)
last_prevent: none
last_known_focus: E031 recurring ($(cat / PLACEHOLDER) — critical files clean: no $(cat in src, homes index/es.index start with import, registry.tsx thin no PLACEHOLDER, games.index OK)
new_findings: E041 regression (tool file + category utilidades present, but not imported in any catalog-index/part-*.ts → 404 on /es/herramientas/calculadora-iva). Sampled games index, 3d-modeler, home EN/ES, porcentaje, markup, interes-simple (latter two OK).
deploy: latest READY 6ad2ca3 (pre-fix); new commits pending deploy
notes: Known smoke E031 green. Discovery found missing index entry for existing tool. Fixed by adding to part-09 + lazy UI + slug map. Next: verify post-deploy that /es/herramientas/calculadora-iva loads with dedicated UI.
```

<!-- end:error-hunter-state.md -->
