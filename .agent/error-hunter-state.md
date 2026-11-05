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
last_run: 2026-11-05 run 147
runs_total: 147
last_mode: HUNT
last_fix: n/a (docs only)
last_prevent: n/a
last_known_focus: E031 (recurring $(cat/PLACEHOLDER) — critical files clean; E051/E053 lag on production c20a444
deploy: production READY on c20a444; tip ff25d48 has E053 summaryEs and prior fixes; no recent ERROR; www.utilihub.net home OK, modelador-3d correct studio, games/2048 OK, generador-codigos English, calculadora-ley-ohm mixed, education quizzes mixed, iva OK
notes: Known smoke E001-E052 clean (registry healthy, no PLACEHOLDER/$(cat). Discovery: sampled home, modelador-3d (correct), games/2048 OK, education quiz (still mixed lag), ley-ohm mixed lag, generador-codigos English, wacc partial English, iva OK. No new broken patterns or PLACEHOLDER. Pending: deploy of tip to clear E051/E053 lag.
```

<!-- end:error-hunter-state.md -->
