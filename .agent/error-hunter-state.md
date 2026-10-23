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
- date: 2026-10-23 (HEAD ce538134 / deploy READY dpl_GoAYEsa19cscaL4QDddVLauTDprY)
- mode: known smoke (E001 registry kind-first + no PLACEHOLDER + exports OK; E005/E006 index+es.index start with import/createFileRoute, DeferredHomeReviews/HomeCatalogSlot resolve; E010 NBody "use client" + named export + full sim no PLACEHOLDER; E002-E009 brief green) + discovery (no PLACEHOLDER/$(cat/"Tool not available" in searches; sampled PulseCatch.tsx real component, pulse-catch.tsx route OK, homes clean)
- deploy: READY on SHA ce538134ede803264fc6808adefab04b91135bcb
- known_smoke: all fixed/recurring green on current branch
- new_findings: none (sampled outside prior focus: Pulse Catch game + route, homes, registry; no stubs or broken patterns)
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: E001 registry + E005/E006 homes + E010 NBody + brief others
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
