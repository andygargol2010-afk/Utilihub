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
- date: 2026-10-23 (HEAD ~442a4b1 / 79c8079e, latest READY deploy dpl_AzGxUywGsrik7TTPyS9rDrMVAwYe on 442a4b1bc6a3317a8dc09a870720eb83cd406550)
- mode: known smoke (brief E001 registry, E010 NBody full export, E011 Aurora export present) + discovery (search PLACEHOLDER=0, $(cat=0, return null in playgrounds=0; routes tree sampled)
- deploy: READY on latest polish SHA 442a4b1; prior intermediate polish commits had ERROR (Aurora export missing, fixed in subsequent commit)
- known_smoke: E001-E011 green (no regression; E010/E011 stable after prior restores)
- new_findings: none (no broken stubs, no corrupt routes, no PLACEHOLDER)
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: E011 Aurora (stable, export confirmed)
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
