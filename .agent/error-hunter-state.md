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
last_run: 2026-11-03 run 116
runs_total: 116
last_mode: HUNT
last_fix: n/a (clean)
last_prevent: n/a
last_known_focus: E031 (PLACEHOLDER/$(cat stubs)
deploy: production READY on b66efb99 (tip now 748964ba after ideas-lab ConnectFourClassic restore + depreciation; no recent ERROR; tip not yet deployed)
notes: Known smoke E031 — critical files clean (general/registry.tsx full with pickComponent/kind-first, index.tsx and es.index.tsx start with import/createFileRoute, 0 hits on $(cat/PLACEHOLDER in src). Discovery: sampled games (ConnectFourClassicGame full and wired), FloorPlanStudio full, new tool calculadora-depreciacion-lineal in part-10 (category finanzas but usesFinanceRoute false → herramientas). No broken imports, no Tool/Game not available beyond normal. No deploy ERROR. No new open errors. Pending: none critical.
```

<!-- end:error-hunter-state.md -->
