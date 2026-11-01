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
last_run: 2026-11-01 run 89
runs_total: 89
last_mode: HUNT
last_fix: nudge .vercel-redeploy (E050 deploy lag)
last_prevent: n/a
last_known_focus: E031 + E050
deploy: production was READY on ada44c51 (pre-E050); tip 04cfc13e+ has E050 category utilidades; forced redeploy via .vercel-redeploy
notes: Known smoke E031 clean (no $(cat/PLACEHOLDER in src; homes OK; registry full). E047 live OK (IVA dedicated UI). E050 code fixed since 8b33552c but live 404 until tip deploys. Discovery: /es/pulse-catch OK, /studio/prism-trail-composer OK, /es/finanzas/calculadora-wacc OK (finance path), /tools/beaufort-wind-scale-converter OK, /tools/overtime-pay-calculator OK. No new runtime/routing/registry errors. calculadora-horas-extra 404 expected (renamed to calculadora-pago-horas-extra per E048).
```

<!-- end:error-hunter-state.md -->
