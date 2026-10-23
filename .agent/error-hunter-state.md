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
- date: 2026-10-22 (night, post HEAD eedbb68e)
- mode: known smoke (E001–E008 brief: registry kind-first, homes no stubs, dedicated tools implemented, no PLACEHOLDER/$(cat)) + discovery (Vercel ERROR logs on ac5559e4 → duplicate slug)
- deploy: latest was ERROR on ac5559e46708e6b9b6e11615419c203ff34bd663 (catalog validator duplicate slug); fixed in eedbb68e3fae43a9c416c77a3a36040a978d9a39
- known_smoke: all E001–E008 code-ok (registry exports + pickComponent kind-first present; index/es.index start with imports, DeferredHomeReviews/HomeCatalogSlot resolve; no PLACEHOLDER in src)
- new_findings: E009 duplicate slug calculadora-interes-compuesto (compound-interest-tool.ts unused makeTool) → fixed by emptying export
- fixes: 1 (src/lib/general/compound-interest-tool.ts)

## Rotation (evitar sesgo)
- last_known_focus: E001 registry + E005 homes + E009 catalog duplicate
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
