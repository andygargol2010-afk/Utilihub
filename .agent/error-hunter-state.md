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
last_run: 2026-11-03 run 114
runs_total: 114
last_mode: HUNT
last_fix: n/a (clean)
last_prevent: n/a
last_known_focus: E031 (PLACEHOLDER/$(cat stubs)
deploy: production READY on b66efb99 (latest on branch; tip now 0b3da77 after ideas-lab commits; no recent ERROR)
notes: Known smoke E031 — critical files clean (registry.tsx full with pickComponent/kind routes, index.tsx starts with import/createFileRoute, search 0 hits on $(cat, only normal placeholder attrs). Discovery: sampled routes/tools; no new PLACEHOLDER, broken imports, or Tool not available beyond normal fallbacks. No deploy ERROR on recent branch deploys. No new open errors. Pending: none critical.
```

<!-- end:error-hunter-state.md -->
