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
last_run: 2026-10-31 run 77
runs_total: 77
last_mode: HUNT
last_fix: registry.tsx explicit early returns for calculadora-iva + calculadora-imc (SHA 8f7ea570)
last_prevent: n/a
last_known_focus: E031/E001/E005/E046/E047
deploy: previous tip aed7df39 READY; new tip 8f7ea570 (awaiting deploy)
notes: Known smoke E031 clean (no $(cat/PLACEHOLDER, homes/registry real). Discovery: live calculadora-iva and calculadora-imc show MathTool generic UI despite slug wires in slugs-01/03 + components. Hotfix: explicit if in pickComponent. New E047 open. Guide about for IVA looks Spanish. No other clear breaks in sampled games/home.
```

<!-- end:error-hunter-state.md -->
