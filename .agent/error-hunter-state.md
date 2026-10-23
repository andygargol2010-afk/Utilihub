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
- date: 2026-10-23 (HEAD after 3584304b)
- mode: known smoke (E001–E012 green / recurring OK) + discovery (sampled small playground files → TextParticlesPlayground stub)
- deploy: prior READY on 457a9ebf; new fix pushed
- known_smoke: E010/E011 full bodies present; registry/home clean; no PLACEHOLDER
- new_findings: E013 — TextParticlesPlayground was return-null stub (breaking /es/firma-visual); restored full text-particle swarm + shares
- fixes: 1 (TextParticlesPlayground.tsx restore, commit 3584304b)

## Rotation (evitar sesgo)
- last_known_focus: E013 TextParticlesPlayground (new discovery fixed)
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
