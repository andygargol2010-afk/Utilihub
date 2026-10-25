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
- date: 2026-10-25
- mode: known smoke (E001–E021 green: no PLACEHOLDER, registry/index full, home routes clean, playgrounds E010–E012 full canvas) + discovery (sampled unit-price tool after recent FAQ commit; found not imported in index.ts → 404)
- deploy: tip before fix READY (SHA e003779e); this run added catalog wire (SHA 3afd869b…); post-push deploy pending verification
- known_smoke: green (no open/recurring failures on prior set)
- new_findings: E022 — tool definition exists but not wired into GENERAL_TOOLS (fixed this run)
- fixes: 1 (index.ts: import + spread UNIT_PRICE_TOOLS)

## Rotation (evitar sesgo)
- last_known_focus: catalog index wiring for recently touched tools + playgrounds smoke
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
