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
- date: 2026-10-23 (post HEAD 3f2428b)
- mode: known smoke (E001 registry kind-first/exports no PLACEHOLDER, E005/E006 homes imports no stubs, E010 NBody export present) + discovery (search PLACEHOLDER/$(cat)/"Tool not available" in repo: none; sampled registry/homes/NBody OK)
- deploy: latest listed ERROR (dpl_14dJg9ZBxmN6MkGqdcFq5qMVy17k on e891658d PLACEHOLDER_WILL_REPLACE missing export); no deploy yet for fix SHA dafbf66 or HEAD 3f2428b; prior READY on a254f66
- known_smoke: all checked E### code-ok on HEAD (registry no PLACEHOLDER, kind-first routing; homes start with import + createFileRoute, DeferredHomeReviews/HomeCatalogSlot OK; NBodyGravitySim has export function NBodyGravitySim + long-press; no $(cat))
- new_findings: another transient build ERROR on N-Body polish intermediate commit e891658d (file was literal PLACEHOLDER_WILL_REPLACE, missing named export); resolved in next commit dafbf66 (full component restored with long-press mobile remove) and HEAD. Recurring pattern of intermediate PLACEHOLDER on simulator polish. No new open issues.
- fixes: 0 (no code change; docs only)

## Rotation (evitar sesgo)
- last_known_focus: E001 registry + E005 homes + E010 NBody
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
