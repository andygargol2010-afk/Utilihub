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
- mode: known smoke (E001–E026 fixed, no open/recurring) + discovery (patterns PLACEHOLDER/$(cat, truncated JSX, unwired dedicated sample, validator, playgrounds/sims/kits)
- deploy: tip 7eb99cc7ba09621d1b965a37af7317072dd99130 READY (previous ERROR c373982a fixed in 7ea9526; docs bb9dff2)
- known_smoke: green — registry no PLACEHOLDER + dedicated wires (incl. E025), home routes clean no $(cat, ToolSearch Button closed, modeler-3d routing correct, spanishToolSummary from es-summaries
- new_findings: none (validator OK with warnings only; no truncated tags; sampled kits/games/experiences full)
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: registry/dedicated wiring + JSX truncation (E026)
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
