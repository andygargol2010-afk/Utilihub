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
- date: 2026-10-24
- mode: known smoke (E001–E015 green: registry kind-first + dedicated UIs, home no $(cat)/DeferredReviews, index full no PLACEHOLDER, playgrounds NBody/Aurora/ConstellationNameMap/FluidType full canvas impls) + discovery (search PLACEHOLDER/$(cat/return null = 0; sample games layout + components dir sizes; no new stubs or duplicate patterns)
- deploy: READY (latest dpl_AuVYCgjThZHwP8JJZ8PLrdYofw3v on 8b19a718...)
- known_smoke: green (all fixed/recurring passed checks)
- new_findings: none
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: playgrounds + registry/home/catalog (this run, green); next rotate to media/image tools or games components
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
