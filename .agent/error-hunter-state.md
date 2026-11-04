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
last_run: 2026-11-04 run 133
runs_total: 133
last_mode: HUNT
last_fix: src/lib/general/math-extra.ts (added summaryEs for hipotenusa and cateto-pitagoras so priority-1 override beats phrase-translate; SUMMARY_ES keys already present but live still mixed on production c20a444)
last_prevent: n/a
last_known_focus: E031 (PLACEHOLDER/$(cat stubs) — smoke clean
deploy: production READY on c20a444 (no recent ERROR); live /es/herramientas/hipotenusa still shows crude "Calculá hipotenusa de rectángulo triángulo." and generador-codigos still EN — deploy lag / cache continues
notes: Known smoke E031 — registry.tsx, index.tsx, es.index real, no $(cat/bad PLACEHOLDER in critical paths. Discovery: sampled /es/herramientas/hipotenusa (mixed leak), /es/herramientas/generador-codigos (EN), /es/finanzas/calculadora-wacc (EN about), /es/herramientas/modelador-3d (OK), /es (OK). E051 coverage ongoing; production lag. No deploy ERROR. Pending: production catch-up for E051.
```

<!-- end:error-hunter-state.md -->
