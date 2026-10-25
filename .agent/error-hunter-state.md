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
- date: 2026-10-25
- mode: known smoke (E001 registry full no PLACEHOLDER, E005 homes real no $(cat, E031 catalog/state clean) + discovery (studio ModularPatternComposer route + component, pattern search $(cat/PLACEHOLDER/return null, live home/tools)
- deploy: previous tip READY (no ERROR); new commit 85a635d5 pending deploy verification
- known_smoke: all sampled fixed/passing (registry complete, homes clean, no $(cat); E031 risk remains but files clean)
- new_findings: E033 regression — ModularPatternComposer.tsx was stub (return <div>Modular Pattern Composer (restored)</div>); live /modular-pattern-composer showed controls but source was incomplete for future deploys. Fixed by restoring full canvas implementation.
- fixes: 1 (src/components/playgrounds/ModularPatternComposer.tsx restored full ~16kB from historical SHA; catalog E033 updated)

## Rotation (evitar sesgo)
- last_known_focus: E001/E005/E031 + studio ModularPatternComposer
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
