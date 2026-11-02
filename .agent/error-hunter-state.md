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
last_run: 2026-11-02 run 106
runs_total: 106
last_mode: HUNT
last_fix: restored NBodyGravitySim.tsx from PLACEHOLDER (E031)
last_prevent: n/a
last_known_focus: E031 (PLACEHOLDER in playground)
deploy: production READY on b66efb99; tip 1fd46d9 (NBody restore pending deploy)
notes: Known smoke E031 caught real regression — NBodyGravitySim.tsx was one-line PLACEHOLDER. Restored full interactive sim from 50e3d456 with PT→ES fallback. Other critical files (registry, homes, summary-es) clean. Discovery: TMB English summary on live due to deploy lag (SUMMARY_ES present in tip); new calculadora-promedio-examenes 404 lag; studios/games/home OK. No other PLACEHOLDER/$(cat.
```

<!-- end:error-hunter-state.md -->
