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
- date: 2026-10-23 (HEAD f9d6105b, deploy READY dpl_5fzZ48eE on 50e3d456)
- mode: known smoke (E010 NBody export + "use client" + no PLACEHOLDER confirmed; E005 es.index.tsx starts with import/createFileRoute, DeferredHomeReviews/HomeCatalogSlot OK; E001-E009 brief code checks green) + discovery (search PLACEHOLDER in src: 0; PLACEHOLDER_FULL_CONTENT: 0; sampled es.juegos.tsx, n-body-gravity.tsx, es.index.tsx OK; no "Tool not available" or $(cat)
- deploy: READY on SHA 50e3d456 (dpl_5fzZ48eEZpcR83jRFNEwcW1tg3Uv); prior ERROR on intermediate NBody polish resolved
- known_smoke: all fixed/recurring green on current HEAD; E010 stable post-restore
- new_findings: none (sampled routes outside catalog set: games layout, N-Body route, home ES; no broken imports or stubs)
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: E010 NBody + E005 homes + brief E001-E009
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
