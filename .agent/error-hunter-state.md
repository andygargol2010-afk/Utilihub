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
last_run: 2026-11-05 run 141
runs_total: 141
last_mode: HUNT
last_fix: n/a (checks OK, no code change)
last_prevent: n/a
last_known_focus: E031 (PLACEHOLDER/$(cat stubs) — smoke clean, no $(cat in src, registry.tsx real, index.tsx starts with import)
deploy: production READY on c20a444; tip 2f164ada (potencia-electrica SEO) not yet deployed; no ERROR in recent deploys; www.utilihub.net home/n-body/generador-codigos OK
notes: Known smoke E031 clean. Registry healthy (pickComponent/buildLazyRegistry present, no PLACEHOLDER). index.tsx real content. Discovery: sampled n-body-gravity, generador-codigos, boids-flocking-lab, valor-absoluto, calculadora-palabras-unicas (404 as expected — not on live production yet). E051 still mixed on live valor-absoluto ("Calculá absoluto valor de número.") due to deploy lag. No new broken patterns or $(cat. Pending: deploy of tip; continue E051 coverage once deployed.
```

<!-- end:error-hunter-state.md -->
