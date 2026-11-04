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
last_run: 2026-11-04 run 137
runs_total: 137
last_mode: HUNT
last_fix: summaryEs for valor-absoluto (math-extra.ts) + generador-codigos (misc.ts) — SHAs 2d65b871 + fcf9c4b5
last_prevent: n/a
last_known_focus: E031 (PLACEHOLDER/$(cat stubs) — smoke clean, no hits in src)
deploy: production READY on c20a444 (tip fcf9c4b5 not yet deployed); no ERROR; live leaks persist on c20a444 (ley-ohm mixed, wacc about EN, valor-absoluto/generador-codigos mixed) — lag continues
notes: Known smoke E031 clean. Discovery: /es OK, /es/herramientas/modelador-3d OK (not House), /es/juegos/snake OK, /es/finanzas/calculadora-wacc about still EN, /es/herramientas/valor-absoluto mixed, /es/herramientas/generador-codigos mixed, /es/herramientas/calculadora-ley-ohm mixed. Fixed 2 summaryEs. Pending: deploy catch-up for recent summaryEs and FinanceSeoContent generic ES about.
```

<!-- end:error-hunter-state.md -->
