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
- date: 2026-10-26 (run 4)
- mode: known smoke (E031 tip clean: no PLACEHOLDER/$(cat in catalog/registry/index/es.index/summary-es; registry.tsx full dedicated wires + kind-first Media/Document; homes start with import+createFileRoute; ModularPatternComposer full interactive >10kB; summary-es.ts real SUMMARY_ES) + discovery (code search PLACEHOLDER/$(cat/"Tool not available"/not implemented = 0; live /es home 200; sampled registry, homes, playground, production png-a-jpg OK with name SEO; iva not on production yet)
- deploy: tip branch READY (SHA 668b5f4c7e203325ae725b25b2a16b1701ba59ef); no active ERROR on tip
- known_smoke: all fixed green; E031 open as recurring risk but tip clean
- new_findings: none
- fixes: 0 (checks OK)

## Rotation (evitar sesgo)
- last_known_focus: E031 + registry wires + homes + ModularPatternComposer + live ES home + production sample tools
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
