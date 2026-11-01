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
last_run: 2026-11-01 run 86
runs_total: 86
last_mode: HUNT
last_fix: E050 category finanzas → utilidades on calculadora-ahorro-para-meta (SHA 8b33552)
last_prevent: n/a
last_known_focus: E031
deploy: latest production READY on ada44c51 (fix/spanish-complete); tip now 412c85a (after fix); prior ERROR on 918e8c1a superseded; auto-deploy may be disabled for branch
notes: Known smoke E031 open/recurring — critical files clean (no $(cat/PLACEHOLDER in src, registry full with pickComponent, homes proper). E047 confirmed live (dedicated IVA UI). Discovery: new tool calculadora-ahorro-para-meta (added in tip beacb90) had category finanzas in GENERAL_TOOLS → 404 on both /es/herramientas and /es/finanzas (matches E041 pattern); fixed category to utilidades. Sampled /pulse-catch, /studio/prism-trail-composer load OK. No other runtime/routing errors found.
```

<!-- end:error-hunter-state.md -->
