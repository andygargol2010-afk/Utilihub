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
- date: 2026-10-26 (run 6)
- mode: known smoke (E031 tip clean: no PLACEHOLDER/$(cat in critical files; registry full with dedicated wires; homes clean; summary-es real) + discovery (sampled new tools from latest feat(cat): calculadora-porcentaje-asistencia + calculadora-costo-por-km had dedicated components and catalog entries but not wired in registry.tsx pickComponent → generic MathTool)
- deploy: tip READY (previous SHAs); no ERROR on recent deploys
- known_smoke: all fixed green; E031 open as recurring risk but tip clean
- new_findings: E036 dedicated UIs for new calculators not wired (fixed in this run)
- fixes: 1 (registry.tsx wire + catalog E036)

## Rotation (evitar sesgo)
- last_known_focus: E031 + registry + new tools wiring
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
