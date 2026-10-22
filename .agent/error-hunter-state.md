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
- mode: known smoke + discovery (deploy ERROR prioritized)
- deploy: ERROR en SHA 4a0830cfd74e5d965e80613a3d416b9a7b704a23 (missing spanishToolSummary export); fix ya en HEAD a7672b461c0f3b5d3c88bf3970a4544c2218986f (deploy pendiente al momento de la corrida)
- known_smoke: E001-E006 code-ok (registry full no PLACEHOLDER, kind routing prioritario, homes sin $(cat), imports DeferredHomeReviews resuelven; MediaTool implementa upload)
- new_findings: E007 build ERROR por import de spanishToolSummary desde es.ts (no exportado); corregido en a7672b46 moviendo import a es-summaries en SpanishToolSearch.tsx (otros archivos ya estaban OK)
- fixes: 0 en esta corrida (el fix de E007 ya estaba committed antes de la actualización de catalog)

## Rotation (evitar sesgo)
- last_known_focus: E007 (i18n export) + E002 kind routing brief
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
