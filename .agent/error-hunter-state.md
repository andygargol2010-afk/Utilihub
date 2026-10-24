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
- date: 2026-10-24
- mode: known smoke (E001–E015 green: registry kind-first image/pdf/document, home no $(cat)/DeferredReviews, index full, playgrounds full canvas, no PLACEHOLDER) + discovery (media tools kind=image/pdf route to MediaTool; games registry complete with fallback; NBody full; no stubs; minor soft warning unknown secondary password-strength in category-catalog)
- deploy: READY (latest dpl_C7myqCj8bZN8vCQJdEhX11AFUVMW on bda6eabae39000c37c6d0e0ce0cd72f6f84a08e2)
- known_smoke: green (all fixed/recurring passed checks)
- new_findings: minor catalog integrity soft-warning for unknown secondary category tool "password-strength" (in SECONDARY_CATEGORY_MAP but no makeTool; ignored, no user impact)
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: media/image + games components (this run, green); next rotate to studios/3d or text tools
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
