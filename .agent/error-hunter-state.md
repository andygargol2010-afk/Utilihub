# Error Hunter — State

Identity: `andygargol2010-afk` / `andygargol2010@gmail.com`.

**Process:** ONE commit per run only when a change ships (code + catalog/state). **No commit if nothing found / nothing to prevent.** No deploys. PRE-PUSH SELF-REVIEW a–d.

**MODE:** each run is **HUNT** (find+fix), **PREVENT** (capacity/guards), or **SEO** (GSC backlog page). Target ~40/40/20. See `error-hunter.md` § MODE.

Load: `error-hunter-state.md` → `error-hunter.md` → `error-hunter-catalog.md`.

---

## Last focus

## SEO backlog pointer (for SEO mode)

- **Source:** `docs/seo-worst-100-gsc.md` + part1/part2 (100 URLs). Pick next by **impressions DESC** among paths not in `seo_done`.
- `seo_done` (paths): `/es/herramientas/imc`, `/tools/coordinate-converter`, `/es/herramientas/calculadora-punto-rocio`, `/tools/temperature-converter`, `/tools/pool-volume-calculator`, `/es/herramientas/consumo-viaje`
- `seo_awaiting_new_list`: false (set **true** when GSC 100 is fully done — then ask user for a fresh Search Console export)
- `seo_next` (hint): `/es/finanzas/calculadora-wacc`, `/tools/overtime-pay-calculator`, `/tools/beaufort-wind-scale-converter`, …
- `runs_total`: increment by 1 every run (~20% SEO when `runs_total % 5 === 0`)

```
last_run: 2026-11-06 run 166
runs_total: 166
last_mode: HUNT
last_fix: E054 (catalog duplicate slugs calculadora-area-rombo + calculadora-area-paralelogramo)
last_prevent: n/a
last_known_focus: E031 (recurring $(cat/PLACEHOLDER) — critical files clean; no $(cat in src; PLACEHOLDER hits are CSS/placeholder text only; registry.tsx real with pickComponent/GENERAL_TOOL_UI, indexes start with import)
deploy: production READY on 781c25f (latest for branch before this run); post-fix commits b394a4e / e46d6dfa / 839c30a on tip. www.utilihub.net /es home OK Spanish, 3d-modeler correct, pixelihub 200, juegos/2048 OK Spanish, calculadora-iva OK Spanish. calculadora-ley-ohm still shows phrase-translate mix on live (summaryEs present in tip ohms-law-tool.ts but not applied — possible cache or serialization). valor-absoluto now correct Spanish. No deploy ERROR.
notes: Known smoke E001-E053 + E031 clean (no stubs). Discovery: runtime logs showed new duplicates calculadora-area-rombo (part-01+08) and calculadora-area-paralelogramo (part-08+10). Fixed by removing later imports. Sampled home, IVA, 3D, 2048, ley-ohm, valor-absoluto — 200 expected except known summary mix. No other new bugs.
```

<!-- end:error-hunter-state.md -->
