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
last_run: 2026-11-04 run 131
runs_total: 131
last_mode: HUNT
last_fix: n/a (docs only; SUMMARY_ES generators already in tip)
last_prevent: n/a
last_known_focus: E031 (PLACEHOLDER/$(cat stubs) — smoke clean
deploy: production READY on b66efb99 (no recent ERROR); tip bf7038a has SUMMARY_ES for generators + FinanceSeoContent ES about; live /es/finanzas/calculadora-wacc about still EN and generators leak EN — deploy lag continues
notes: Known smoke E031 — src search clean of $(cat/bad PLACEHOLDER; critical routes real (home /es OK, juegos, simuladores, IVA, temp, modelador-3d OK, IMC dedicated). Discovery: sampled /es/herramientas/generador-codigos (still EN leak on live), /es/herramientas/generador-nombres (EN), /es/juegos/snake (OK), /es/herramientas/calculadora-iva (OK), /es (OK). E051 live lag continues on finance about and generators. No new open/recurring. No deploy ERROR. Pending: production catch-up for E051.
```

<!-- end:error-hunter-state.md -->
