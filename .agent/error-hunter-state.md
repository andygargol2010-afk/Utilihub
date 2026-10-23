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
- date: 2026-10-23 (HEAD after 457a9ebf)
- mode: known smoke (E001-E010 green; E011 regression) + discovery (sampled AuroraParticlePlayground + smaller signature playgrounds)
- deploy: prior READY on ceaac6f9; new fix pushed
- known_smoke: E001-E010 green; E011 recurring (incomplete stub restored)
- new_findings: E011 regression — AuroraParticlePlayground had brevity-comment stub (no animation loop/controls); restored full from 442a4b1
- fixes: 1 (AuroraParticlePlayground.tsx restore, commit 457a9ebf)

## Rotation (evitar sesgo)
- last_known_focus: E011 AuroraParticlePlayground (regression fixed)
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
