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
- date: 2026-10-26 (run 2)
- mode: known smoke (E031 tip clean: no PLACEHOLDER/$(cat in catalog/registry/index/es.index/summary-es; registry.tsx full dedicated wires + kind-first Media/Document before config; homes start with import+createFileRoute; ModularPatternComposer full interactive canvas >10kB; summary-es.ts real SUMMARY_ES map) + discovery (code search PLACEHOLDER/$(cat/"Tool not available"/not implemented = 0; sampled registry, homes, index.ts tools list, playground, summary-es)
- deploy: latest branch deploys READY (SHA a40782214ac86e42b276df3a92ffbf814ef6d356 and prior); no ERROR in recent list
- known_smoke: all fixed entries green; E031 open as recurring risk but tip clean (no active corruption)
- new_findings: none — no new runtime/routing/registry/SEO/corrupt/build patterns in sampled paths (games/studios/tools outside typical catalog set)
- fixes: 0 (checks OK)

## Rotation (evitar sesgo)
- last_known_focus: E031/E001/E005/E033 critical + registry wires + homes
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
