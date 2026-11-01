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
last_run: 2026-10-31 run 79
runs_total: 79
last_mode: HUNT
last_fix: E048 (d938ab1d) rename duplicate slug calculadora-horas-extra → calculadora-pago-horas-extra in overtime-pay.ts
last_prevent: n/a
last_known_focus: E047/E048
deploy: triggered production for tip 4e9091a → ERROR (duplicate slug); fix committed d938ab1d; awaiting next deploy of new tip
notes: Known smoke E047 still OPEN on live www (IVA/IMC show MathTool "Separa los valores..."). Hotfix in registry.tsx present in tip. Discovery: games/2048 OK, 3d-modeler OK, no PLACEHOLDER/$(cat in src. New finding E048 blocked deploy of tip. Homes and other sampled tools load.
```

<!-- end:error-hunter-state.md -->
