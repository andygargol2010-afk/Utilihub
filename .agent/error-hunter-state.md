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
last_run: 2026-11-01 run 80
runs_total: 80
last_mode: HUNT
last_fix: n/a (prior commits ebf4a613/0a2e376 removed duplicate lazy UI exports from components-06/07 to fix barrel conflicts that blocked build on 918e8c1a)
last_prevent: n/a
last_known_focus: E047
deploy: latest listed production ERROR on 918e8c1a (conflicting re-exports IvaCalculatorToolUi etc from components barrel); tip a968c545 has the dup removal fix; no new deploy listed yet for post-918e8c1a commits
notes: Known smoke E047 still OPEN (dedicated UI hotfix in registry.tsx present; live on previous READY). Discovery: no PLACEHOLDER/$(cat in routes; home index.tsx clean. Build ERROR root was duplicate exports introduced with E047 hotfix; already cleaned in later commits. Awaiting deploy of current tip to confirm build green and E047 symptom.
```

<!-- end:error-hunter-state.md -->
