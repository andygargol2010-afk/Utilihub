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
- mode: known smoke (E001–E017 green: registry, home, playgrounds, catalog index clean) + discovery (deploy ERROR logs → slug duplicado)
- deploy: tip SHA 4107c236 READY (post-fix unique slug); previous ERROR by duplicate calculadora-descuento-porcentaje
- known_smoke: green (no open failures)
- new_findings: E018 — build ERROR slug duplicado calculadora-descuento-porcentaje in two dedicated tool files (validator scans all makeTool)
- fixes: 1 (percentage-discount-calculator-tool.ts slug → calculadora-porcentaje-descuento; SHA 4107c236)

## Rotation (evitar sesgo)
- last_known_focus: catalog validator / duplicate slugs (this run, fixed E018); next rotate to education/dev tools or games/studio sample
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
