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
- date: 2026-10-26 (run 5)
- mode: known smoke (E031 tip clean: no PLACEHOLDER/$(cat in critical files catalog/registry/index/es.index/summary-es; registry.tsx full with dedicated wires + kind-first Media/Document; homes start with import+createFileRoute no stubs; ModularPatternComposer full canvas/layers/animations >10kB; summary-es.ts real SUMMARY_ES map) + discovery (code search PLACEHOLDER/$(cat/"Tool not available"/not implemented = 0 hits; sampled recent game registration orbit-pulse-catcher commits clean; no broken imports or kind mismatches found in sampled paths)
- deploy: tip branch READY (SHA 3f59ef2772a97d4898af06edc02777c1a022d06b); no active ERROR on tip (previous ERROR deploys are older SHAs)
- known_smoke: all fixed green; E031 open as recurring risk but tip clean
- new_findings: none
- fixes: 0 (checks OK)

## Rotation (evitar sesgo)
- last_known_focus: E031 + registry + homes + ModularPatternComposer + summary-es + recent games registration
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
