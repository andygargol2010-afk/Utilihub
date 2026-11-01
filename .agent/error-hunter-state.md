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
last_run: 2026-11-01 run 84
runs_total: 84
last_mode: HUNT
last_fix: n/a (docs only; known smoke clean, no new errors)
last_prevent: n/a
last_known_focus: E031
deploy: latest production READY on ada44c51 (fix/spanish-complete); tip 7c0a1add no auto-deploy (vercel.json git.deploymentEnabled false for branch); prior ERROR on 918e8c1a superseded
notes: Known smoke E031 open/recurring — critical files (registry.tsx, index.tsx, es.index.tsx, catalog) clean, no $(cat/PLACEHOLDER in src. E047 wiring confirmed live (IVA/IMC dedicated UI on client). Discovery: sampled /, /es, /games, /tools/3d-modeler, /es/herramientas/calculadora-area-elipse; all load without 404/crash; ellipse uses generic MathTool (no dedicated component found); no new runtime/routing/SEO/deploy errors found.
```

<!-- end:error-hunter-state.md -->
