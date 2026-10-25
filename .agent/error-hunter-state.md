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
- mode: known smoke (E001–E026 fixed, no open/recurring) + discovery (registry wires, home, kits KitchenPrepBoard, playgrounds NBody/Aurora, patterns PLACEHOLDER/$(cat, truncated JSX)
- deploy: tip adc36cff13f4c8228e304abbd78ff0f1c330e417 READY (previous 58639870 READY)
- known_smoke: green — registry no PLACEHOLDER + dedicated wires (incl. E025 arithmetic/median/factorial), home routes clean no $(cat, ToolSearch Button closed, modeler-3d routing correct, index.ts full catalog
- new_findings: none (KitchenPrepBoard.tsx complete multi-recipe selector + share PNG; NBodyGravitySim + AuroraParticlePlayground full canvas loops; no truncated tags; build events clean)
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: playgrounds (NBody/Aurora) + registry + kits
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
