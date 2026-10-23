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
- date: 2026-10-23 (HEAD 3246a2168c6dcf4dfc4da75b5de2c4846d50d0cd, latest READY deploy dpl_9KFTvGYirHhshDf1qgNvC4rToGWw)
- mode: known smoke (E001 registry kind-first + exports, E010 NBody full named export + sim body, E011 Aurora route import + component present) + discovery (PLACEHOLDER=0, $(cat=0, return null playgrounds=0; sampled NeonLayerComposer full, home index/es.index clean, routes tree present)
- deploy: READY on 3246a216; historical ERROR deploys exist but current HEAD builds clean
- known_smoke: E001-E011 green (no regression)
- new_findings: none
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: E010 NBody + E011 Aurora (stable)
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
