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
- mode: known smoke (E001–E020 green: no PLACEHOLDER, registry/index full, home routes clean, playgrounds E010–E012 full canvas) + discovery (sampled older dedicated tools still in catalog: calculadora-raiz-cubica, conversor-pulgadas-cm, calculadora-gasto-diario, calculadora-ratio-trabajo-descanso — all had *Tool.tsx + index import but missing registry pickComponent wires)
- deploy: tip before fix was READY for registry E020; this run added wires (SHA 821d39f…); post-push deploy pending verification
- known_smoke: green (no open/recurring failures on prior set)
- new_findings: E021 — four more dedicated UIs not wired (fixed this run)
- fixes: 1 (registry.tsx: lazy + slug checks for the four tools)

## Rotation (evitar sesgo)
- last_known_focus: older catalog dedicated wiring (raiz-cubica family) + playgrounds smoke
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
