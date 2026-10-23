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
- date: 2026-10-23 (post HEAD ce85f184)
- mode: known smoke (E001 registry kind-first/exports, E005/E006 homes imports no stubs, E008/E009 dedicated + slug) + discovery (N-Body Gravity Sim: export present in HEAD, routes OK; searched PLACEHOLDER/$(cat) none; Vercel latest listed ERROR on 0ae48d1b for missing NBodyGravitySim export, subsequent SHAs 5c032278/ce85f184 have export)
- deploy: latest listed ERROR (dpl_Eo76hmL7AQ4v9bw2eEGZorzcA2Ty on 0ae48d1b); no deploy yet for ce85f184; prior READY
- known_smoke: all checked E### code-ok on HEAD (registry no PLACEHOLDER, kind-first; homes start with import + createFileRoute, DeferredHomeReviews OK; no $(cat))
- new_findings: transient build ERROR on N-Body polish intermediate commit (missing named export NBodyGravitySim); resolved in later commits on branch (export function present). No new open issues.
- fixes: 0 (no code change; docs only)

## Rotation (evitar sesgo)
- last_known_focus: E001 registry + E005 homes + N-Body sim routes/component
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
