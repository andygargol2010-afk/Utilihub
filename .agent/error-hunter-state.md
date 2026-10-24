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
- mode: known smoke (E001–E016 green: registry no PLACEHOLDER, home index clean imports, playgrounds full, catalog index full, no $(cat)/PLACEHOLDER) + discovery (text/finance/health dedicated tools: contador-silabas, calculadora-roi, calculadora-imc)
- deploy: tip pre-fix READY; post-fix SHA 39b8d2e5 pending verify
- known_smoke: green (E010–E012 recurring passed brief; fixed smokes ok; no open)
- new_findings: E017 — dedicated *CalculatorTool/*CounterTool not wired in pickComponent → generic TextTool/MathTool throws "not implemented"
- fixes: 1 (registry.tsx: +3 lazy + slug ifs for SyllableCounter, RoiCalculator, BmiCalculator; SHA 39b8d2e5)

## Rotation (evitar sesgo)
- last_known_focus: text/finance/health dedicated routing (this run, fixed partial); next rotate to more unlisted dedicateds or education/dev tools
- Preferir rotar qué E### se profundiza si todos los smokes pasan.
- new_error_budget: al menos 1 path de descubrimiento por corrida (muestra de tools no cubiertas por el catálogo).

<!-- end:state -->
