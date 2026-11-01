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
last_run: 2026-11-01 run 87
runs_total: 87
last_mode: HUNT
last_fix: E050 category finanzas → utilidades on calculadora-ahorro-para-meta (SHA 8b33552; code OK, live still 404 on ada44c51)
last_prevent: n/a
last_known_focus: E031
deploy: latest production READY on ada44c51 (fix/spanish-complete); tip now 3b7edb9; prior ERROR on 918e8c1a superseded; auto-deploy lag on branch
notes: Known smoke E031 open/recurring — critical files clean (no $(cat/PLACEHOLDER in src via search, homes index.tsx/es.index.tsx proper). E047/E050 code OK but E050 page 404 live due to deploy lag (production on older SHA). Discovery: sampled /es/pulse-catch and /studio/prism-trail-composer load OK; no category finanzas remaining in general tools; no new runtime/routing/SEO/registry errors found. No fixes this run.
```

<!-- end:error-hunter-state.md -->
