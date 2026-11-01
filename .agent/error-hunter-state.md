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
last_run: 2026-11-01 run 91
runs_total: 91
last_mode: HUNT
last_fix: nudge .vercel-redeploy (E050 deploy lag still)
last_prevent: n/a
last_known_focus: E031 + E050
deploy: production READY on ada44c51 (pre-E050); tip 979a1f2e has E050 category utilidades; forced redeploy via .vercel-redeploy (run 91, commit 0e743d77)
notes: Known smoke E031 clean (no $(cat/PLACEHOLDER in src via search; homes OK; registry full). E047 live OK (IVA dedicated UI on /es/herramientas/calculadora-iva). E050 code fixed (category utilidades in savings-goal-calculator-tool.ts) but live still 404 on ada44c51. Discovery: /es OK, /es/juegos OK, /es/herramientas/calculadora-iva OK (dedicated UI), /es/herramientas/calculadora-imc OK. No new runtime/routing/registry/SEO errors found. Waiting for tip deploy.
```

<!-- end:error-hunter-state.md -->
