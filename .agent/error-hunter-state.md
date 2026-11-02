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
last_run: 2026-11-02 run 109
runs_total: 109
last_mode: HUNT
last_fix: n/a (clean; tip has ebe2335d SSR/client fix for partial SEO overrides)
last_prevent: n/a
last_known_focus: E031 (PLACEHOLDER/$(cat stubs)
deploy: production READY on b66efb99 (lag vs tip d8e2e8a1 / ebe2335d which fixes crashes on unit-converter, kinetic-energy-calculator, miles-to-kilometers-converter)
notes: Known smoke E031 — no PLACEHOLDER or $(cat stubs in critical src files (registry, summary-es, routes, playgrounds). Discovery: live production still crashes with "Cannot read properties of undefined (reading 'length')" on /tools/unit-converter, /tools/kinetic-energy-calculator, /tools/miles-to-kilometers-converter (Tool not found page); /es/herramientas/calculadora-tmb now shows full Spanish summary and dedicated fields; /es/herramientas/calculadora-iva 200 with dedicated UI; othello-classic 404. No new open errors in tip code. No recent deploy ERROR. Pending: deploy of tip to clear production crashes.
```

<!-- end:error-hunter-state.md -->
