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
- mode: known smoke (E001 registry full no PLACEHOLDER, E005 homes real no $(cat, E031 catalog/state clean, E033 ModularPatternComposer exports + full) + discovery (playgrounds sample, pattern search $(cat/PLACEHOLDER/not implemented, index.ts tools spread, es.index)
- deploy: tip SHA 66368332 READY on dpl_4K1A62mNnxedRDJZ3hFs1wJqm65a; previous ERROR on ModularPatternComposer restore (export missing intermediate) resolved by later commit
- known_smoke: all sampled fixed/passing (registry complete, homes import+createFileRoute, no $(cat); E031 pattern still recurring risk but current files clean)
- new_findings: none (no PLACEHOLDER, no $(cat, no return null stubs in sampled playgrounds, catalog index complete, ModularPatternComposer full export)
- fixes: 0 (checks OK)

## Rotation (evitar sesgo)
- last_known_focus: E001/E005/E031 + playgrounds/ModularPatternComposer
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
