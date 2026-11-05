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
last_run: 2026-11-05 run 140
runs_total: 140
last_mode: HUNT
last_fix: n/a (checks OK, no code change)
last_prevent: n/a
last_known_focus: E031 (PLACEHOLDER/$(cat stubs) — smoke clean, no $(cat in src, no bad PLACEHOLDER in registry/routes)
deploy: production READY on c20a444 (latest listed); tip 23742ba (new unique-words tool) not yet deployed; no ERROR in recent deploys; www.utilihub.net home and tools OK (alias 404 note was outdated)
notes: Known smoke E031 clean. Registry healthy. index/es.index real. Discovery: new tool calculadora-palabras-unicas wired with summaryEs + dedicated UI on tip (not live yet). Sampled games/studio/n-body/iva OK. ES summaries still mixed on live production due to deploy lag (code already has summaryEs for valor-absoluto/ohms/etc). No new broken patterns. Pending: deploy of tip; continue E051 coverage on live once deployed.
```

<!-- end:error-hunter-state.md -->
