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
- mode: known smoke (E001–E026 fixed/green) + discovery (new catalog tool calculadora-ingesta-agua-diaria + consumo-agua registry wires, home routes)
- deploy: tip de97af680c8cf9c700b6a644b969441d5a7a2156 READY
- known_smoke: green — registry no PLACEHOLDER, home index.tsx starts with import no $(cat, modeler routing ok, index.ts full
- new_findings: E027 + E028 discovered and fixed (wires added)
- fixes: 2 (E027, E028 — added lazy + slug checks in registry.tsx)

## Rotation (evitar sesgo)
- last_known_focus: registry (dedicated wires) + new catalog tools
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
