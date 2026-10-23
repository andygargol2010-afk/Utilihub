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
- date: 2026-10-23 (HEAD 1754bff7 / deploy READY dpl_CMAZ8AFSbTJBBhTsFmXvKDpQTCt9)
- mode: known smoke (brief rotation on fixed E001-E011 + games/home) + discovery (runtime logs preview last 30m empty of errors; code search PLACEHOLDER/$(cat/"Tool not available" = 0; games registry solid with fallback; home index clean)
- deploy: READY on 1754bff7 (prior ERROR for Aurora fixed earlier)
- known_smoke: all E001-E011 green (no regressions; playgrounds real components, registry no PLACEHOLDER, routes start with import)
- new_findings: none
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: E001-E011 brief + games registry + home routes
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
