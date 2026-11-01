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
last_run: 2026-11-01 run 82
runs_total: 82
last_mode: HUNT
last_fix: n/a (docs only; E047 confirmed fixed on live)
last_prevent: n/a
last_known_focus: E047
deploy: latest production READY on ada44c51 (fix/spanish-complete); prior ERROR on 918e8c1a known and superseded
notes: Known smoke E047 FIXED — live client render of calculadora-iva and calculadora-imc shows dedicated UIs (Tasa IVA / Peso kg). Discovery: sampled porcentaje-de-numero, conversor-kmh-ms, color-contrast, home /es, modelador-3d paths; all load correctly under /es/herramientas/*; no $(cat/PLACEHOLDER in critical paths; no new runtime/routing errors found.
```

<!-- end:error-hunter-state.md -->
