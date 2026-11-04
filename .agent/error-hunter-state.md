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
last_run: 2026-11-04 run 125
runs_total: 125
last_mode: HUNT
last_fix: FinanceSeoContent.tsx ES about never falls back to tool.description (English) — SHA 7fc021c8
last_prevent: n/a
last_known_focus: E031 (PLACEHOLDER/$(cat stubs) — smoke clean
deploy: production READY on b66efb99 (no recent ERROR on tip; older ERROR on 918e8c1a ignored); tip 7062307b after fixes
notes: Known smoke E031 — no $(cat or bad PLACEHOLDER in src (search clean); critical files real. Discovery: live /es/finanzas/amortizacion-de-prestamo about showed raw EN description (fixed); /es/herramientas/consumo-por-distancia header mixed "Calculá fuel consumption..." (phrase-translate, SEO overrides in prior tip); calculadora-diferencia-horas 404 (deploy lag on newer tools); /es/juegos/2048 loads (Cargando… expected). No new open/recurring. No deploy ERROR. Pending: wait deploy for tip fixes and newest tools; ongoing SUMMARY_ES coverage for mixed summaries.
```

<!-- end:error-hunter-state.md -->
