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
- mode: known smoke (E001–E014: registry kind-first OK, index.ts real, home routes no $(cat), NBody/Aurora full) + discovery (sampled NeonLayerComposer → stub abbreviated return <div> placeholder; other playgrounds/patterns clean: no PLACEHOLDER, no $(cat), no "Tool not available")
- deploy: READY on SHA 23a8f505 (pre-fix); post-push pending verify
- known_smoke: green except E012 regressed to stub
- new_findings: E012 recurring — NeonLayerComposer.tsx was abbreviated stub (comment + return <div>Neon Layer Composer with size, bg modes and pause</div>) instead of full canvas implementation. Restored full from history SHA bb38036b (layers, particles, pointer force, continuous emit, symmetry, PNG export).
- fixes: 1 (NeonLayerComposer.tsx restore)

## Rotation (evitar sesgo)
- last_known_focus: E012 NeonLayerComposer (this run, discovery sample of playgrounds); next rotate to other studios/games or new tools
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
