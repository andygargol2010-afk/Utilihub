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
- mode: known smoke (E001–E026 fixed, no open/recurring) + discovery (KitchenPrepBoard kit full, patterns PLACEHOLDER/$(cat, truncated JSX, registry wires, runtime logs)
- deploy: tip 5863987097a8f6006666a272662bbdeaa5a5e7fe READY (previous docs a06083c2 READY)
- known_smoke: green — registry no PLACEHOLDER + dedicated wires (incl. E025/E026), home routes clean no $(cat, ToolSearch Button closed, modeler-3d routing correct
- new_findings: none (KitchenPrepBoard.tsx complete multi-recipe selector + canvas share; no truncated tags; runtime preview error logs empty last 30m)
- fixes: 0

## Rotation (evitar sesgo)
- last_known_focus: kits/experiences + registry wires
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
