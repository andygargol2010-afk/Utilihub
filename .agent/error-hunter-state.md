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
last_run: 2026-11-02 run 94
runs_total: 94
last_mode: HUNT
last_fix: n/a (docs only)
last_prevent: n/a
last_known_focus: E050
deploy: production READY on b66efb99 (includes E050 category fix + prior)
notes: Known smoke E050 now 200 on live www.utilihub.net/es/herramientas/calculadora-ahorro-para-meta with dedicated SavingsGoal UI (Meta de ahorro / Meses). E047 IVA dedicated OK. E031 vigilance: no $(cat/PLACEHOLDER in src. Discovery: /es OK, modelador-3d correct studio, /es/juegos/2048 OK, pixelihub OK, conversor-pies2-m2 200, WACC under /es/finanzas OK (herramientas 404 expected). No new runtime/routing/registry/SEO errors found. Deploy stable.
```

<!-- end:error-hunter-state.md -->
