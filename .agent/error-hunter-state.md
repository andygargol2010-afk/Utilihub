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
- mode: known smoke (E001–E024 green: registry kind-first + dedicateds, no PLACEHOLDER, home clean, playgrounds full) + discovery (sampled more dedicated calculator UIs outside prior set: ArithmeticMean/Median/Factorial exist in index but not wired in pickComponent → MathTool "not implemented")
- deploy: tip before fix 64c3a7d551597218d863f7f7360b285c2e1bf614 READY (no ERROR on branch tip); fix commit 10fa54760ffebc3782eedb576d45af616a0a388b
- known_smoke: green (no open/recurring failures)
- new_findings: E025 — calculadora-media-aritmetica, calculadora-mediana, calculadora-factorial dedicated UIs not in registry pickComponent
- fixes: 1 (registry.tsx wire ArithmeticMeanCalculatorToolUi + MedianCalculatorToolUi + FactorialCalculatorToolUi)

## Rotation (evitar sesgo)
- last_known_focus: registry dedicated wiring continued (E025 family)
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
