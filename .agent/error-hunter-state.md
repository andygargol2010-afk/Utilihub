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
- mode: known smoke (E001–E014 green: registry kind-first + dedicated UIs, index.ts real exports GENERAL_CATEGORIES/GENERAL_TOOLS, home/index + es.index no $(cat), no PLACEHOLDER, playgrounds full components) + discovery (sampled ConstellationNameMap, FluidTypeSignature, ParticleSignaturePlayground, SolarSystemScaleExplorer full; searched PLACEHOLDER/return null/$(cat)/Tool not available → 0 hits; routes/index real; registry pickComponent intact)
- deploy: READY on SHA 3f854fb478240181d2b1249b6b05574282dad7ba (docs/ideas-lab); no ERROR/BUILDING
- known_smoke: all fixed/recurring entries still green; no regression detected
- new_findings: none (clean discovery sample across playgrounds, catalog index, registry, home routes, pattern searches)
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: E014 + registry/home + playground sample (this run); rotated to smaller playgrounds outside prior set
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
