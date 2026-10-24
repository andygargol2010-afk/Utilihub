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
- mode: known smoke (E001–E013 green on HEAD) + discovery (deploy ERROR on 24dddc71 due to PLACEHOLDER_INDEX in general/index.ts; fixed in 98b20ea)
- deploy: ERROR on 24dddc713c4b826618ad8ee5a614b1fd1e62b935 (GENERAL_CATEGORIES not exported); triggered BUILDING on 98b20ea29dd610fd67514aee6cfe8c46b9da4d63 (fix restore); docs commit 01f72663
- known_smoke: registry kind-first OK, home index/es.index no $(cat) + proper imports, no PLACEHOLDER in src, playgrounds no return-null stubs
- new_findings: E014 — catalog index.ts replaced by PLACEHOLDER_INDEX by feat(cat) adding tools, causing rollup missing export (build ERROR). Already fixed by subsequent restore commit; catalog updated.
- fixes: 0 (code already restored in 98b20ea; docs only)

## Rotation (evitar sesgo)
- last_known_focus: E014 general/index.ts PLACEHOLDER (this run)
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
