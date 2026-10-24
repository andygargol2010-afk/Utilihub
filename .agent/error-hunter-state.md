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
- mode: known smoke (E001–E014 green: registry kind-first, index.ts real exports, home no $(cat), no PLACEHOLDER, playgrounds full components) + discovery (sampled geometric-mean / percentage-increase tools, SolarSystemScaleExplorer, NBodyGravitySim, es.index; searched PLACEHOLDER/return null/$(cat) → 0 hits)
- deploy: READY on SHA 3863db12801537274b1b83f6724461d3dcfcc823 (docs after E014 restore); prior ERROR on 24dddc71 fixed by 98b20ea
- known_smoke: all fixed entries still green; no regression detected
- new_findings: none (clean discovery sample across tools, playgrounds, routes, patterns)
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: E014 general/index.ts (prior); this run rotated to broad pattern + sample outside catalog set
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
