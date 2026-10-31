# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a change ships (code + catalog/state). **No commit if nothing found / nothing to prevent.** No deploys. PRE-PUSH SELF-REVIEW a–d.

**MODE:** each run is **HUNT** (find+fix) or **PREVENT** (capacity/guards so other autos do not break the tree). Target ~50/50. See `error-hunter.md` § MODE.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-30 run 60
last_mode: HUNT
last_fix: fix(seo) ToolSeoContent.tsx never fall back to EN summary on ES pages (E046)
last_prevent: n/a
last_known_focus: E031 recurring ($(cat / PLACEHOLDER) — critical files clean via code search; homes and registry start correctly, no PLACEHOLDER)
new_findings: sampled /es/herramientas/calculadora-media-ponderada, calculadora-iva, calculadora-media-aritmetica, calculadora-media-armonica (all 200 but English sentences in guide about); /games 200; /tools/3d-modeler 200. English leak in Spanish guides for tools without summaryEs. Added E046 and fixed. calculadora-desviacion-absoluta-media still 404 on live (deploy lag, tip has it).
deploy: latest production READY on 684f2714; new commits including this fix will trigger deploy. No ERROR on current tip before fix.
notes: Known smoke E031 green. Discovery found SEO English leak on live Spanish tool pages. Fixed surgically in ToolSeoContent. Catalog and state updated. Tip SHA after fix: 9bc91478 (code) + ac3be9d6 (catalog).
```

<!-- end:error-hunter-state.md -->
