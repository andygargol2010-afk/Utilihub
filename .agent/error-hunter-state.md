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
last_run: 2026-11-01 run 81
runs_total: 81
last_mode: HUNT
last_fix: n/a (docs only; code hotfix for E047 and E049 barrel already in tip 22245b41)
last_prevent: n/a
last_known_focus: E047
deploy: latest listed production ERROR on 918e8c1a (conflicting re-exports); tip 22245b41 has dup removal + early returns in registry.tsx; no deploy listed for tip or post-918e8c1a commits yet
notes: Known smoke E047 still OPEN on live www.utilihub.net (calculadora-iva and calculadora-imc show MathTool "Separa los valores..."). Discovery: home index.tsx clean, no $(cat/PLACEHOLDER in critical paths, new tool calculadora-calorias-porcion 404 expected until tip deploys. Awaiting successful deploy of tip 22245b41 to confirm build green and E047 symptom resolved.
```

<!-- end:error-hunter-state.md -->
