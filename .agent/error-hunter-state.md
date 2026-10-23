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
- date: 2026-10-23 (HEAD 04db344b, latest READY deploy on 689750b3)
- mode: known smoke (brief E001 registry, E010 NBody, E011 Aurora) + discovery (playgrounds tree, new tools salary/gas, search PLACEHOLDER/$(cat = 0)
- deploy: READY on Aurora fix SHA; no deploy yet for latest feat commit (no ERROR)
- known_smoke: E001-E011 green (no regression)
- new_findings: TextParticlesPlayground.tsx is stub `return null` but unused (not imported in any route); no runtime/build impact
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: E011 Aurora (stable)
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
