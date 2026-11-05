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
last_run: 2026-11-05 run 149
runs_total: 149
last_mode: HUNT
last_fix: n/a (docs only)
last_prevent: n/a
last_known_focus: E031 (recurring $(cat/PLACEHOLDER) — critical files clean; no $(cat in src, registry.tsx real)
deploy: production READY on c20a444; tip 8550568 has no deploy yet; no recent ERROR; www.utilihub.net home OK, modelador-3d correct studio, games/2048 OK, generador-codigos Spanish, calculadora-ley-ohm still mixed (deploy lag)
notes: Known smoke E001-E053 clean (registry healthy, no PLACEHOLDER/$(cat). Discovery: sampled home, modelador-3d (correct), games/2048 OK, generador-codigos Spanish on live, ley-ohm still mixed (deploy lag on tip), no new broken patterns or PLACEHOLDER. Pending: deploy of tip to clear remaining lag.
```

<!-- end:error-hunter-state.md -->
