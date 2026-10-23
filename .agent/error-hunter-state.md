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
- date: 2026-10-23 (HEAD ~9fd6c4c / deploy READY on 0023bcb0)
- mode: known smoke (E010 NBody "use client" + named export + no PLACEHOLDER; E005 index/es.index start with import/createFileRoute, DeferredHomeReviews/HomeCatalogSlot OK; E001 registry kind-first pickComponent, no PLACEHOLDER; E002-E009 brief green) + discovery (PLACEHOLDER/$(cat/"Tool not available" search in src/routes: 0; sampled n-body-gravity.tsx, pulse-catch.tsx, modeler3d-app.tsx → Modeler3DStudio OK; no stubs)
- deploy: READY on SHA 0023bcb03702e55ba6fa1d4419ce402926616504 (dpl_CKhsyCsat6KKKxkHf6mwAQvbR6wo); prior NBody ERRORs resolved
- known_smoke: all fixed/recurring green on current branch
- new_findings: none (sampled routes outside catalog set: N-Body, Pulse Catch game, 3D modeler entry; no broken imports or stubs)
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: E010 NBody + E005 homes + E001 registry + brief others
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
