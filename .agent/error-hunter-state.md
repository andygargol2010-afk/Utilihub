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
- date: 2026-10-23 (HEAD 689750b3 / prior ERROR on 18a32f28 aurora polish)
- mode: known smoke (E001-E011 rotation on playgrounds) + discovery (playgrounds dir sizes, search PLACEHOLDER/return null/stub comments = 0 after fix)
- deploy: prior ERROR (aurora stub); new fix pushed, deploy pending verification
- known_smoke: E001-E010 green; E011 regressed (stub return null) → fixed by restore
- new_findings: none (other playgrounds real size, no PLACEHOLDER patterns)
- fixes: 1 (AuroraParticlePlayground.tsx full restore)

## Rotation (evitar sesgo)
- last_known_focus: E011 Aurora playground (regression from polish)
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
