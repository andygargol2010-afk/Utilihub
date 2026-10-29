# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a fix ships (code + catalog/state). **No commit if nothing found.** No deploys. PRE-PUSH SELF-REVIEW a–d. Max 20% time on fixed-item regression smoke. Discovery: prod/runtime → recent risky commits → code sampling.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

```
last_run: 2026-10-29 run 35
last_fix: E043 calculadora-interes-simple / descuento-sucesivo / presupuesto-mensual category → utilidades (routing 404)
last_known_focus: E031 recurring ($(cat / PLACEHOLDER) — critical files clean: no $(cat in src, homes index/es.index start with import, registry.tsx thin no PLACEHOLDER)
new_findings: E043 three more GENERAL tools with category finanzas causing dual 404 (same as E041/E042). Fixed to utilidades.
deploy: latest READY bdc1876f (older); HEAD after this commit pending; no current ERROR on recent
notes: Known smoke green (E031 open but files clean). Discovery: sampled recent finance-category tools in catalog-index/part-08, found three with finanzas. 3 fixes.
```

<!-- end:error-hunter-state.md -->
