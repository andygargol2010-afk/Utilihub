# Error Hunter — state

task_id: 4c84ee49-e001-4531-a0e2-f6261b3ada91
branch: fix/spanish-complete
repo: andygargol2010-afk/Utilihub

## Policy
- Cada corrida: **(1)** smoke de errores del catálogo (regresión) + **(2)** búsqueda de errores **nuevos**.
- No gastar la corrida entera solo en E001–E00N si ya están fixed y el smoke pasa.
- Si un known vuelve a fallar → status `recurring` o `open` en catalog + fix prioritario.
- Si se descubre un error nuevo → añadir entrada E0xx al catalog en el mismo commit o docs(agent) seguido.

## Last run
- date: 2026-10-22 (night, post HEAD 6d657431)
- mode: known smoke (E001–E008 brief: registry kind-first, homes no stubs, dedicated tools implemented, no PLACEHOLDER/$(cat)) + discovery (production homes/games/3d-modeler load; sample LineCounterTool + search for Tool not available / PLACEHOLDER)
- deploy: latest READY on SHA 6d657431e89b9de791490fa09991901677d1af6f (no ERROR on current; prior ERROR deploys on earlier SHAs not present on HEAD)
- known_smoke: all E001–E008 code-ok (registry exports + pickComponent kind-first present; index/es.index start with imports, DeferredHomeReviews/HomeCatalogSlot resolve; dedicated *CalculatorTool and LineCounterTool export real components; modeler path correct)
- new_findings: ninguno. Production www.utilihub.net homes, /games, /es/juegos, /tools/3d-modeler cargan sin 404; no patrones PLACEHOLDER, $(cat, "Tool not available" en búsqueda de código.
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: E001 registry + E005 homes + E008 dedicated + games/3d sample
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
