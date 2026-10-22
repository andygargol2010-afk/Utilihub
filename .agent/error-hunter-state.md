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
- date: 2026-10-22
- mode: known smoke + discovery
- deploy: READY (SHA f221e760cf597af052c6d1849f034a8c1a4cc170, branch preview utilihub-8762pqaez-financialproyects.vercel.app)
- known_smoke: E001-E006 code-ok (rotated focus E005 homes: index.tsx + es.index.tsx start with import/createFileRoute, no $(cat), imports DeferredHomeReviews/HomeCatalogSlot resolve; E002 kind routing in registry prioritizes image/pdf/media → MediaTool; registry full no PLACEHOLDER; patterns PLACEHOLDER/$(cat)/"Tool not available" absent)
- new_findings: none (sampled registry.tsx, MediaTool.tsx, index/es.index, code search for broken patterns and recent tools; live preview protected by Vercel auth but deploy READY, no ERROR logs)
- fixes: 0 (checks OK)

## Rotation (evitar sesgo)
- last_known_focus: E005 (homes verified)
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
