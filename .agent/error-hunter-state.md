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
- mode: known smoke (E001–E023 green: no PLACEHOLDER, home routes clean, registry kind-first + dedicateds, playgrounds full) + discovery (sampled dedicated calculator UIs outside prior set: UnitPriceTool + RiceWaterCalculatorTool exist in index but not wired in pickComponent → MathTool "not implemented")
- deploy: tip before fix 4cfec1415da29b404117a5f7c905e918934232f3 READY (no ERROR on branch tip); previous ERROR was older SHA 386ac087
- known_smoke: green (no open/recurring failures)
- new_findings: E024 — calculadora-precio-unitario and calculadora-agua-arroz dedicated UIs not in registry pickComponent
- fixes: 1 (registry.tsx wire UnitPriceToolUi + RiceWaterCalculatorToolUi)

## Rotation (evitar sesgo)
- last_known_focus: catalog index + registry dedicated wiring (E022/E024 family)
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
