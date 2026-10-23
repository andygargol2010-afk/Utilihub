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
- date: 2026-10-23 (post HEAD 6460d91b)
- mode: known smoke (E001 registry kind-first/exports no PLACEHOLDER, E005/E006 homes imports no stubs, E010 NBody export present) + discovery (search PLACEHOLDER/$(cat)/"Tool not available" in src: none; sampled home index.tsx OK; N-Body routes OK)
- deploy: latest listed ERROR (dpl_fBnFdVNK4nQg57DjQnm6SBUkSmnu on 53d08838 PLACEHOLDER); no deploy yet for HEAD 6460d91b or fix SHA d0f94984; prior READY on ca7e7118
- known_smoke: all checked E### code-ok on HEAD (registry no PLACEHOLDER, kind-first; homes start with import + createFileRoute, DeferredHomeReviews OK; NBodyGravitySim has export function; no $(cat))
- new_findings: transient build ERROR on N-Body polish intermediate commit 53d08838 (file was literal PLACEHOLDER, missing named export); resolved in next commit d0f94984 (export function present) and HEAD. Pattern of intermediate PLACEHOLDER on simulators. No new open issues.
- fixes: 0 (no code change; docs only)

## Rotation (evitar sesgo)
- last_known_focus: E001 registry + E005 homes + E010 NBody
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
