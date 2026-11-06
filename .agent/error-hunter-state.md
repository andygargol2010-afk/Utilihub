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
last_run: 2026-11-06 run 161
runs_total: 161
last_mode: HUNT
last_fix: n/a
last_prevent: n/a
last_known_focus: E031 (recurring $(cat/PLACEHOLDER) — critical files clean; no $(cat in src; PLACEHOLDER hits are CSS/placeholder text only; registry.tsx and index/es.index real)
deploy: production READY on c20a444 (latest for branch); tip 74d7ee28 / 8ae5983 not yet deployed; old ERROR on 918e8c1 already fixed (E049); www.utilihub.net /es home OK Spanish, modelador-3d correct studio, modelador-casas-3d 200, pixelihub 200, IVA 200 Spanish, generador-codigos Spanish, juegos/snake OK, finanzas/wacc 200 Spanish. calculadora-ley-ohm still mixed English on live (deploy lag; tip has summaryEs).
notes: Known smoke E001-E053 + E031 clean (no stubs, registry healthy, indexes start with import). Discovery: sampled modelador-3d, modelador-casas-3d, pixelihub, calculadora-iva, generador-codigos, juegos/snake, finanzas/calculadora-wacc, calculadora-ley-ohm — all 200 or expected lag. No new code bugs, no deploy ERROR. No fixes needed.
```

<!-- end:error-hunter-state.md -->
